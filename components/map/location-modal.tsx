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
import { type SearchResult } from '@/types/map';
import { useEffect, useState, type FC } from 'react';

import { ImageUploader } from './image-uploader';

interface LocationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: SearchResult | null;
  onSave?: (formData: FormData) => Promise<void>;
}

const LocationModal: FC<LocationModalProps> = ({
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

  useEffect(() => {
    if (location && isOpen) {
      setName(location.display_name);
      setTeamName('');
      setDescription('');
    }
  }, [location, isOpen]);

  if (!location) return null;

  const handleSave = async () => {
    if (!onSave || !location) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('teamName', teamName);
      formData.append('description', description);
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lon);

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
          <DialogTitle>Adicionar novo estádio</DialogTitle>
          <DialogDescription className="pt-2">
            Adicione as informações sobre o estádio para completar o cadastro.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 pb-4">
          <div className="flex flex-col gap-6 py-4 pb-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stadium-name">Nome do Estádio</Label>
                <Input
                  id="stadium-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maracanã"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-name">Time da Casa</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nome do time"
                  disabled={isSaving}
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
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                <p className="text-xs font-mono">{location.lat}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-wider">Longitude</p>
                <p className="text-xs font-mono">{location.lon}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t p-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Local'}
            </Button>
          </div>
        </ScrollArea>


      </DialogContent>
    </Dialog>
  );
};

export { LocationModal };
