'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new community route
    router.replace('/dashboard/community');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">
          You are being redirected to the new community page.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          If you are not redirected automatically,{' '}
          <button
            onClick={() => router.push('/dashboard/community')}
            className="text-primary hover:underline"
          >
            click here
          </button>
        </p>
      </div>
    </div>
  );
} 