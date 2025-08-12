'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip breadcrumbs for auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  const segments = pathname
    .split('/')
    .filter(segment => segment.length > 0)
    .map(segment => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: `/${segment}`,
      isLast: false
    }));

  // Mark the last segment
  if (segments.length > 0) {
    segments[segments.length - 1].isLast = true;
  }

  return (
    <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Dashboard
      </Link>
      
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {segment.isLast ? (
            <span className="text-foreground font-medium">
              {segment.name}
            </span>
          ) : (
            <Link
              href={segment.href}
              className="hover:text-foreground transition-colors"
            >
              {segment.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 