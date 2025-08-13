'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to safely handle client-side operations and prevent hydration mismatches
 * @returns boolean indicating if the component has mounted on the client
 */
export function useClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Hook to safely access browser APIs without causing hydration mismatches
 * @param getValue Function that returns the value to store
 * @param defaultValue Default value to use during SSR
 * @returns The value from getValue or defaultValue during SSR
 */
export function useClientValue<T>(getValue: () => T, defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);
  const mounted = useClientOnly();

  useEffect(() => {
    if (mounted) {
      setValue(getValue());
    }
  }, [mounted, getValue]);

  return mounted ? value : defaultValue;
}

/**
 * Hook to safely access localStorage without causing hydration mismatches
 * @param key localStorage key
 * @param defaultValue Default value if key doesn't exist
 * @returns The value from localStorage or defaultValue
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const mounted = useClientOnly();

  useEffect(() => {
    if (mounted) {
      try {
        const item = localStorage.getItem(key);
        if (item !== null) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }
  }, [key, mounted]);

  const setStoredValue = (newValue: T) => {
    if (mounted) {
      try {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  };

  return [mounted ? value : defaultValue, setStoredValue];
} 