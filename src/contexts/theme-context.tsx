'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-client-only';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('speakeasy-theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useLocalStorage<'light' | 'dark'>('speakeasy-resolved-theme', 'light');
  const [mounted, setMounted] = useLocalStorage<boolean>('speakeasy-mounted', false);

  // Ensure we only run client-side code after mounting
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    let currentTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      // Use system preference
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        root.classList.add(newTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      currentTheme = theme;
    }
    
    // Apply theme
    setResolvedTheme(currentTheme);
    root.classList.add(currentTheme);
  }, [theme, mounted, setResolvedTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange, resolvedTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme toggle component hook
export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();
  
  const toggleTheme = () => {
    if (!mounted) return;
    
    if (theme === 'system') {
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  
  const cycleTheme = () => {
    if (!mounted) return;
    
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    cycleTheme,
    mounted,
  };
}; 