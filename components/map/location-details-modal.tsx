'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { type LocationWithUser } from '@/types/map';
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSession } from "next-auth/react";
import { type FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from "../ui/button";
import { ImageGallery } from "./image-gallery";

interface LocationDetailsModalProps {
  location: LocationWithUser | null;
  onClose: () => void;
  onEdit?: () => void;
}

const LocationDetailsModal: FC<LocationDetailsModalProps> = ({
  location,
  onClose,
  onEdit
}) => {
  const { data: session } = useSession();

  if (!location) return null;

  const isOwner = session?.user?.id === location.registeredById;

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
          {isOwner && (
            <div className="absolute top-4 right-4">
              <Button onClick={onEdit} variant="secondary" size="sm" className="gap-2 shadow-md">
                <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
                Editar
              </Button>
            </div>
          )}
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

            {location.registeredBy && (
              <div className="flex items-center gap-3 border-t pt-6">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={location.registeredBy.image ?? ""} alt={location.registeredBy.name ?? ""} />
                  <AvatarFallback>{location.registeredBy.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-xs text-muted-foreground">Registrado por</p>
                  <p className="text-sm font-medium">{location.registeredBy.name}</p>
                </div>
              </div>
            )}

            {location.galleryUrls && location.galleryUrls.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Galeria de Imagens</h4>
                <ImageGallery
                  images={location.galleryUrls.map((url, i) => ({
                    src: url,
                    alt: `${location.name} - Imagem ${i + 1}`
                  }))}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { LocationDetailsModal };
