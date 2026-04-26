'use client';

import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet/dist/leaflet.css';
import { useState, type FC } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LocationDetailsModal } from './location-details-modal';
import { LocationModal } from './location-modal';
import { MapSearch } from './map-search';

const customIcon = new L.Icon({
  iconUrl: '/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

import { saveLocationAction } from '@/app/actions/location';

import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { type LocationWithUser, type SearchResult } from '@/types/map';
import { Button } from '../ui/button';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  savedLocations?: LocationWithUser[];
}

const Map: FC<MapProps> = ({
  center = [-15, -60],
  zoom = 3,
  savedLocations = []
}) => {
  const { theme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingLocation, setViewingLocation] = useState<LocationWithUser | null>(null);

  const tileLayerUrl = theme === 'dark'
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const handleLocationSelect = (result: SearchResult) => {
    setSelectedLocation(result);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: FormData) => {
    const promise = saveLocationAction(formData);

    toast.promise(promise, {
      loading: 'Salvando localização do estádio...',
      success: (result) => {
        if (result.success) {
          setIsModalOpen(false);
          return result.message;
        } else {
          throw new Error(result.message);
        }
      },
      error: (err) => {
        return err instanceof Error ? err.message : 'Falha ao salvar. Verifique sua conexão.';
      }
    });
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full outline-none"
      >
        <TileLayer
          key={tileLayerUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayerUrl}
        />
        <MapSearch onSelect={handleLocationSelect} />

        {selectedLocation && (
          <Marker
            position={[parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-semibold">{selectedLocation.display_name}</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-xs text-primary underline"
                >
                  Continuar cadastro
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render Saved Database Markers */}
        {savedLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={customIcon}
          >
            <Popup className="min-w-[200px]">
              <div className="flex flex-col gap-2 p-1">
                {loc.coverUrl && (
                  <img
                    src={loc.coverUrl}
                    alt={loc.name}
                    className="h-24 w-full rounded-md object-cover"
                  />
                )}
                <div className="flex items-center gap-2">
                  {loc.shieldUrl && (
                    <img src={loc.shieldUrl} alt="Escudo" className="h-6 w-6 object-contain" />
                  )}
                  <h3 className="font-bold leading-tight">{loc.name}</h3>
                </div>
                {loc.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{loc.description}</p>
                )}
                <Button
                  onClick={() => setViewingLocation(loc)}
                  className="mt-1 w-full py-1.5 rounded-md text-xs font-semibold transition-colors"
                >
                  Ver mais detalhes
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <LocationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        location={selectedLocation}
        onSave={handleSave}
      />

      <LocationDetailsModal
        location={viewingLocation}
        onClose={() => setViewingLocation(null)}
      />
    </>
  );
};

export default Map;
