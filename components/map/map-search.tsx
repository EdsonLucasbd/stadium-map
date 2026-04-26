'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { type SearchResult } from '@/types/map';
import { Loading03Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState, type FC } from 'react';
import { useMap } from 'react-leaflet';

interface MapSearchProps {
  onSelect?: (result: SearchResult) => void;
}

const MapSearch: FC<MapSearchProps> = ({ onSelect }) => {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    try {
      // Adding 'stadium' to the query helps Nominatim prioritize stadium results
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=stadium+${encodeURIComponent(searchTerm)}&limit=10&addressdetails=1`
      );
      const data = await response.json();
      
      // Optional: Filter results that are actually stadiums if needed
      // but usually the 'stadium' prefix in the query is enough for Nominatim.
      setResults(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      handleSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    map.flyTo([lat, lon], 14, {
      animate: true,
      duration: 1.5,
    });

    setQuery(result.display_name);

    setTimeout(() => {
      if (onSelect) onSelect(result);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="absolute left-12 top-4 z-[1000] w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="flex gap-2 rounded-lg bg-background/80 p-2 shadow-lg backdrop-blur-md border border-border"
      >
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estádio..."
            className="pr-10 bg-transparent border-none focus-visible:ring-0"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button size="icon" variant="ghost" type="submit" disabled={isLoading}>
          <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
        </Button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="mt-2 max-h-60 overflow-y-auto rounded-lg bg-background/90 shadow-xl backdrop-blur-md border border-border">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors border-b border-border last:border-0"
            >
              {result.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { MapSearch };
