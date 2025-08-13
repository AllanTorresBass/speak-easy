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

  // Handle dashboard routes specially
  if (pathname === '/dashboard') {
    return (
      <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
        <span className="text-foreground font-medium">Dashboard</span>
      </nav>
    );
  }

  // For dashboard sub-routes, show proper breadcrumbs
  if (pathname.startsWith('/dashboard/')) {
    const segments = pathname
      .split('/')
      .filter(segment => segment.length > 0 && segment !== 'dashboard')
      .map(segment => ({
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: `/dashboard/${segment}`,
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

  // Handle Words vocabulary routes specially
  if (pathname.startsWith('/vocabulary/words')) {
    if (pathname === '/vocabulary/words') {
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary"
            className="hover:text-foreground transition-colors"
          >
            Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Words Vocabulary</span>
        </nav>
      );
    }
    
    // Handle individual words list pages
    if (pathname.startsWith('/vocabulary/words-list/')) {
      const listId = pathname.split('/').pop();
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary"
            className="hover:text-foreground transition-colors"
          >
            Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary/words"
            className="hover:text-foreground transition-colors"
          >
            Words Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">List {listId}</span>
        </nav>
      );
    }
  }

  // Handle Grammar routes specially
  if (pathname.startsWith('/grammar')) {
    if (pathname === '/grammar/overview') {
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Grammar Learning Center</span>
        </nav>
      );
    }
    
    // Handle individual grammar guide pages
    if (pathname.startsWith('/grammar/guide/')) {
      const guideId = pathname.split('/').pop();
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/grammar/overview"
            className="hover:text-foreground transition-colors"
          >
            Grammar Learning Center
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{guideId}</span>
        </nav>
      );
    }
  }

  // Handle Promova vocabulary routes specially
  if (pathname.startsWith('/vocabulary/promova')) {
    if (pathname === '/vocabulary/promova') {
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary"
            className="hover:text-foreground transition-colors"
          >
            Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Promova Vocabulary</span>
        </nav>
      );
    }
    
    // Handle individual promova list pages
    if (pathname.startsWith('/vocabulary/')) {
      const listId = pathname.split('/').pop();
      return (
        <nav className="flex items-center space-x-1 px-6 py-2 text-sm text-muted-foreground bg-muted/30 border-b">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary"
            className="hover:text-foreground transition-colors"
          >
            Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/vocabulary/promova"
            className="hover:text-foreground transition-colors"
          >
            Promova Vocabulary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">List {listId}</span>
        </nav>
      );
    }
  }

  // For other routes, show standard breadcrumbs
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
    <nav className="flex items-center space-x-1 px-6 text-sm text-muted-foreground bg-muted/30 border-b">
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
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