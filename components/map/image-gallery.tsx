import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Close } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-3",
          className
        )}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted ring-offset-background transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Abrir imagem: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in"
          onClick={close}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute right-4 top-4 rounded-full bg-secondary/80 p-2 text-secondary-foreground transition hover:bg-secondary"
            aria-label="Fechar"
          >
            <HugeiconsIcon icon={Close} className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-secondary/80 p-2 text-secondary-foreground transition hover:bg-secondary"
                aria-label="Imagem anterior"
              >
                <HugeiconsIcon icon={ChevronLeft} className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-secondary/80 p-2 text-secondary-foreground transition hover:bg-secondary"
                aria-label="Próxima imagem"
              >
                <HugeiconsIcon icon={ChevronRight} className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={active.src}
            alt={active.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl animate-in zoom-in-95"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary/80 px-3 py-1 text-sm text-secondary-foreground">
            {(activeIndex ?? 0) + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
