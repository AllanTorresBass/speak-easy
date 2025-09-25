'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page immediately
    router.push('/auth/signin');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SpeakEasy</h1>
        <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
      </div>
    </div>
  );
}