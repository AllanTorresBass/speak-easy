'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PracticeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new practice route
    router.replace('/dashboard/practice');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">
          You are being redirected to the new practice page.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          If you are not redirected automatically,{' '}
          <button
            onClick={() => router.replace('/dashboard/practice')}
            className="text-primary hover:underline font-medium"
          >
            click here
          </button>
        </p>
      </div>
    </div>
  );
} 