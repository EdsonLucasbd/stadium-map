'use client';

import dynamic from 'next/dynamic';
import { type FC } from 'react';

// Import the Map component dynamically with SSR disabled
const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

import { type LocationWithUser } from '@/types/map';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  savedLocations?: LocationWithUser[];
}

const MapWrapper: FC<MapContainerProps> = (props) => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Map {...props} />
    </div>
  );
};

export { MapWrapper as MapContainer };
