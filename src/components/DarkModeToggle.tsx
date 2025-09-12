'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DarkModeToggle = () => {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="hover:bg-transparent"
    >
      <Sun className="h-5 w-5 text-foreground hidden dark:block" />
      <Moon className="h-5 w-5 text-foreground block dark:hidden" />
    </Button>
  );
};

export default DarkModeToggle;
