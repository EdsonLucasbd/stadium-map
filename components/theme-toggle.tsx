'use client';

import { Button } from '@/components/ui/button';
import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border-border shadow-sm hover:bg-accent transition-all duration-300"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Alternar tema"
    >
      {theme === 'dark' ? (
        <HugeiconsIcon icon={Sun02Icon} className="h-5 w-5 text-yellow-500 transition-all" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} className="h-5 w-5 text-slate-700 transition-all" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
