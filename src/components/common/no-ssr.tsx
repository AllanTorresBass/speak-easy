'use client';

import { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that prevents hydration mismatches by only rendering on the client
 * Use this for components that depend on browser APIs or have dynamic content
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook that returns whether the component is mounted on the client
 * Use this for conditional rendering that depends on client-side state
 */
export function useNoSSR() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
} 