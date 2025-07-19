import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: '404 - Page Not Found | MangaCompass',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <BookOpen className="h-24 w-24 text-blue-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The manga page you're looking for seems to have disappeared. 
            Let's get you back to discovering great manga!
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={Home}
              iconPosition="left"
            >
              Go to Home
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={Search}
              iconPosition="left"
            >
              Browse Recommendations
            </Button>
          </Link>
          
          <Link href="/onboarding">
            <Button
              variant="ghost"
              size="lg"
              fullWidth
            >
              Start Over
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Lost? Try using the navigation menu above or contact support.</p>
        </div>
      </div>
    </div>
  );
}