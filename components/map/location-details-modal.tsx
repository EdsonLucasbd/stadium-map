'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Location } from '@/db/schema';
import { type FC } from 'react';

interface LocationDetailsModalProps {
  location: Location | null;
  onClose: () => void;
}

const LocationDetailsModal: FC<LocationDetailsModalProps> = ({
  location,
  onClose
}) => {
  if (!location) return null;

  return (
    <Dialog open={!!location} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        {location.coverUrl ? (
          <div className="relative h-48 sm:h-64 w-full">
            <img
              src={location.coverUrl}
              alt={`Capa do estádio ${location.name}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-24 w-full bg-muted" />
        )}

        <DialogHeader className="p-6 pb-2 -mt-16 sm:-mt-20 relative z-10 text-foreground">
          <div className="flex items-end gap-4">
            {location.shieldUrl && (
              <div className="h-16 w-16 sm:h-28 sm:w-28 shrink-0">
                <img
                  src={location.shieldUrl}
                  alt="Escudo"
                  className="h-full w-full rounded-full pointer-events-none object-contain drop-shadow-md"
                />
              </div>
            )}
            <div className="pb-1 sm:pb-2">
              <DialogTitle className="text-2xl  sm:text-3xl font-bold drop-shadow-md">
                {location.name}
              </DialogTitle>

              <DialogDescription className="text-muted-foreground drop-shadow-md flex items-center gap-2 mt-1">
                {location.teamName && (
                  <p className="text-sm sm:text-lg font-medium text-zinc-600 drop-shadow-md -mt-1">
                    Casa do {location.teamName}
                  </p>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] px-6">
          <div className="py-4 space-y-6">
            {location.description && (
              <div>
                <h4 className="font-semibold text-lg mb-2">Sobre</h4>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                  {location.description}
                </p>
              </div>
            )}

            {location.galleryUrls && location.galleryUrls.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Galeria de Imagens</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {location.galleryUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-video overflow-hidden rounded-md bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Galeria ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { LocationDetailsModal };
