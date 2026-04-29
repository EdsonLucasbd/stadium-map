'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { type LocationWithUser } from '@/types/map';
import { useEffect, useState, type FC } from 'react';

import { LockPasswordIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { SignIn } from '../auth-components';
import { cn } from '@/lib/utils';
import { ImageUploader } from './image-uploader';

interface EditLocationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: LocationWithUser | null;
  onSave?: (formData: FormData) => Promise<void>;
}

const EditLocationModal: FC<EditLocationModalProps> = ({
  isOpen,
  onOpenChange,
  location,
  onSave
}) => {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [shieldFile, setShieldFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (location && isOpen) {
      setName(location.name);
      setTeamName(location.teamName || '');
      setDescription(location.description || '');
    }
  }, [location, isOpen]);

  if (!location) return null;

  const handleSave = async () => {
    if (!onSave || !location) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('id', location.id.toString());
      formData.append('name', name);
      formData.append('teamName', teamName);
      formData.append('description', description);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());

      if (shieldFile) formData.append('shield', shieldFile);
      if (coverFile) formData.append('cover', coverFile);
      galleryFiles.forEach(file => {
        formData.append('gallery', file);
      });

      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Editar estádio</DialogTitle>
          <DialogDescription className="pt-2">
            Edite as informações sobre o estádio.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 pb-4">
          <div className="relative flex flex-col gap-6 py-4 pb-8">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg text-center p-6">
                <div className="bg-background border shadow-xl p-8 rounded-2xl max-w-sm flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon icon={LockPasswordIcon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Login Necessário</h3>
                    <p className="text-sm text-muted-foreground">
                      Você precisa estar autenticado para registrar novos estádios no mapa.
                    </p>
                  </div>
                  <div className="flex flex-col w-full gap-2 mt-2">
                    <SignIn provider="google" variant="default" className="w-full justify-start gap-3" />
                    <SignIn provider="github" variant="outline" className="w-full justify-start gap-3" />
                  </div>
                </div>
              </div>
            )}

            <div className={cn("space-y-4", !isAuthenticated && "opacity-40 grayscale-[50%] pointer-events-none select-none")}>
              <div className="space-y-2">
                <Label htmlFor="stadium-name">Nome do Estádio</Label>
                <Input
                  id="stadium-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maracanã"
                  disabled={isSaving || !isAuthenticated}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-name">Time da Casa</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nome do time"
                  disabled={isSaving || !isAuthenticated}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stadium-description">Descrição</Label>
                <Textarea
                  id="stadium-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte um pouco sobre este estádio..."
                  className="min-h-[100px]"
                  disabled={isSaving || !isAuthenticated}
                />
              </div>
            </div>

            <div className={cn("grid grid-cols-1 gap-6", !isAuthenticated && "opacity-40 grayscale-[50%] pointer-events-none select-none")}>
              <div className="grid grid-cols-2 gap-4">
                <ImageUploader
                  label="Escudo"
                  maxFiles={1}
                  onFilesChange={(files) => setShieldFile(files[0] || null)}
                />
                <ImageUploader
                  label="Capa"
                  maxFiles={1}
                  onFilesChange={(files) => setCoverFile(files[0] || null)}
                />
              </div>
              <ImageUploader
                label="Galeria"
                maxFiles={6}
                multiple
                onFilesChange={setGalleryFiles}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-muted-foreground">
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider">Latitude</p>
                <p className="text-xs font-mono">{location.latitude}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider">Longitude</p>
                <p className="text-xs font-mono">{location.longitude}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t p-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !isAuthenticated}
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </ScrollArea>


      </DialogContent>
    </Dialog>
  );
};

export { EditLocationModal };
