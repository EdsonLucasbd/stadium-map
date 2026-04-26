'use server';

import { locations } from '@/db/schema';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function saveLocationAction(formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { 
        success: false, 
        message: 'Você precisa estar logado para registrar um local.' 
      };
    }
    const name = formData.get('name') as string;
    const teamName = formData.get('teamName') as string;
    const description = formData.get('description') as string;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const category = formData.get('category') as string || 'stadium';

    // Check if location with same coordinates already exists
    const existingLocation = await db.select()
      .from(locations)
      .where(
        and(
          eq(locations.latitude, latitude),
          eq(locations.longitude, longitude)
        )
      )
      .limit(1);

    if (existingLocation.length > 0) {
      return { 
        success: false, 
        message: 'Um estádio ou local já foi registrado exatamente nestas coordenadas.' 
      };
    }

    // Prepare Cloudinary folder path
    // Remove invalid characters for folder names
    const sanitizedName = name.replace(/[^a-zA-Z0-9-_\s]/g, '').trim() || 'Estadio_Sem_Nome';
    const folderPath = `stadium-map/${sanitizedName}`;

    // Helper to upload a single FormData File
    const uploadFile = async (file: File | null) => {
      if (!file || file.size === 0) return null;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return uploadToCloudinary(buffer, folderPath);
    };

    const shieldFile = formData.get('shield') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const galleryFiles = formData.getAll('gallery') as File[];

    // Upload in parallel
    const [shieldUrl, coverUrl, ...galleryUrls] = await Promise.all([
      uploadFile(shieldFile),
      uploadFile(coverFile),
      ...galleryFiles.map(file => uploadFile(file))
    ]);

    // Filter out nulls from gallery
    const validGalleryUrls = galleryUrls.filter(url => url !== null) as string[];

    // Insert the new location
    await db.insert(locations).values({
      name,
      teamName,
      description,
      latitude,
      longitude,
      shieldUrl,
      coverUrl,
      galleryUrls: validGalleryUrls.length > 0 ? validGalleryUrls : null,
      category,
      registeredById: session.user.id,
    });

    // Revalidate the home page to show the new marker
    revalidatePath('/');

    return { 
      success: true, 
      message: 'Local salvo com sucesso!' 
    };

  } catch (error) {
    console.error('Error saving location:', error);
    return { 
      success: false, 
      message: 'Ocorreu um erro ao salvar o local. Tente novamente mais tarde.' 
    };
  }
}
