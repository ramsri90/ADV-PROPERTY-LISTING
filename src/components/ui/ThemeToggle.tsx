'use client';

import { Moon } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeProvider';

interface ThemeToggleProps {
  mobile?: boolean;
}

export function ThemeToggle({ mobile = false }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center rounded-lg border border-transparent text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-blue-950 ${
        mobile ? 'w-full gap-3 px-4 py-3 text-base font-medium' : 'h-10 w-10'
      }`}
    >
      <Moon size={18} />
      {mobile ? <span>Theme</span> : null}
    </button>
  );
}
