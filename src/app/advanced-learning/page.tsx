import { redirect } from 'next/navigation';

export default function AdvancedLearningRedirectPage() {
  // Use Next.js built-in redirect to avoid hydration issues
  redirect('/dashboard/advanced-learning');
} 