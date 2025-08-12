import { redirect } from 'next/navigation';

export default function ProgressRedirectPage() {
  // Use Next.js built-in redirect to avoid hydration issues
  redirect('/dashboard/progress');
} 