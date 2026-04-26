import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_CLOUDNARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_CLOUDNARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDNARY_SECRET,
});

export { cloudinary };

/**
 * Uploads a file (Buffer) to Cloudinary
 * @param fileBuffer The file buffer to upload
 * @param folder The folder path (e.g., "stadium-map/Maracanã")
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp', // Convert to WebP for modern compression
        quality: 'auto:good', // Cloudinary's intelligent compression algorithm
        width: 1200, // Reasonable max width for stadium images
        crop: 'limit', // Only shrink if larger than 1200px, don't upscale
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Unknown Cloudinary upload error"));
        }
      }
    );

    // End the stream with the buffer data
    uploadStream.end(fileBuffer);
  });
}
