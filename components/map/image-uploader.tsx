'use client';

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Image01Icon, 
  Upload01Icon, 
  Cancel01Icon, 
  Alert01Icon 
} from "@hugeicons/core-free-icons";
import { useEffect, type FC } from "react";

interface ImageUploaderProps {
  label: string;
  maxFiles?: number;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({ 
  label, 
  maxFiles = 1, 
  multiple = false,
  onFilesChange
}) => {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp",
    maxFiles,
    maxSize,
    multiple,
  });

  useEffect(() => {
    if (onFilesChange) {
      const actualFiles = files
        .map(f => f.file)
        .filter((file): file is File => file instanceof File);
      onFilesChange(actualFiles);
    }
  }, [files, onFilesChange]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      
      <div
        className="relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-input border-dashed p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label={`Upload ${label}`}
          className="sr-only"
        />
        
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-xs">
                {label} ({files.length})
              </h3>
              <Button
                disabled={files.length >= maxFiles}
                onClick={openFileDialog}
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
              >
                <HugeiconsIcon
                  icon={Upload01Icon}
                  className="-ms-0.5 size-3 opacity-60"
                />
                Adicionar
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {files.map((file) => (
                <div
                  className="relative aspect-square rounded-md bg-accent"
                  key={file.id}
                >
                  <img
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                    src={file.preview}
                  />
                  <Button
                    aria-label="Remover imagem"
                    className="-top-1 -right-1 absolute size-5 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    onClick={() => removeFile(file.id)}
                    size="icon"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
            <div
              aria-hidden="true"
              className="mb-2 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background"
            >
              <HugeiconsIcon icon={Image01Icon} className="size-3.5 opacity-60" />
            </div>
            <p className="text-xs text-muted-foreground">Clique ou arraste o {label.toLowerCase()}</p>
            <Button className="mt-2 h-8 px-3 text-xs" onClick={openFileDialog} variant="outline">
              <HugeiconsIcon icon={Upload01Icon} className="-ms-1 size-3 opacity-60" />
              Selecionar
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-[10px]"
          role="alert"
        >
          <HugeiconsIcon icon={Alert01Icon} className="size-2.5 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};

export { ImageUploader };
