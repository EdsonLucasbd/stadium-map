import { MapContainer } from "@/components/map/map-container";
import { locations } from "@/db/schema";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const savedLocations = await db.select().from(locations);

  return (
    <main className="h-screen w-screen">
      <MapContainer
        center={[-15, -60]}
        zoom={4}
        savedLocations={savedLocations}
      />
    </main>
  );
}
