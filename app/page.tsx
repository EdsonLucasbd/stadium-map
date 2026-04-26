import { Header } from "@/components/header";
import { MapContainer } from "@/components/map/map-container";
import { locations, users } from "@/db/schema";
import { db } from "@/lib/db";
import { type LocationWithUser } from "@/types/map";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const savedLocations = await db.select({
    location: locations,
    user: {
      id: users.id,
      name: users.name,
      image: users.image,
    }
  })
    .from(locations)
    .leftJoin(users, eq(locations.registeredById, users.id));

  const transformedLocations: LocationWithUser[] = savedLocations.map(row => ({
    ...row.location,
    registeredBy: row.user
  }));

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Header />
      <MapContainer
        center={[-15, -60]}
        zoom={4}
        savedLocations={transformedLocations}
      />
    </main>
  );
}
