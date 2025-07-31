'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, MangaCoverBackground } from '@/components/ui';
import { MangaGrid } from '@/components/manga';
import { getTopRatedManga, getPopularManga } from '@/lib/mockData';
import { trackPageView } from '@/utils/analytics';
import { ArrowRight, BookOpen, Users, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const topRatedManga = getTopRatedManga(6);
  const popularManga = getPopularManga(6);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    trackPageView('/', undefined);
  }, []);

  // SSR/hydration issues を防ぐため、マウント後まで待機
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Manga Cover Background */}
      <MangaCoverBackground count={25} className="min-h-screen">
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="block text-blue-600">Next Favorite Manga</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered personalized recommendations based on your reading history and preferences.
              The ultimate manga discovery platform designed for international readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Floating call-to-action hint */}
            <div className="mt-12 animate-bounce">
              <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                Choose from 50+ curated manga titles
              </div>
            </div>
          </div>
        </section>
      </MangaCoverBackground>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MangaCompass
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take your manga experience to the next level
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-gray-600">
                Analyze your reading history and preferences to recommend the perfect manga for you
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                International Reader Focused
              </h3>
              <p className="text-gray-600">
                Recommendations consider English translation availability and international ratings
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Fresh recommendations based on the latest manga releases and community ratings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Manga Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Rated Manga
            </h2>
            <p className="text-lg text-gray-600">
              Masterpieces loved by critics and readers alike
            </p>
          </div>
          
          <MangaGrid 
            manga={topRatedManga} 
            className="mb-8"
            showAmazonLink={false}
          />
          
          <div className="text-center">
            <Link href="/onboarding">
              <Button variant="outline">
                Get Personalized Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Manga Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Manga
            </h2>
            <p className="text-lg text-gray-600">
              Trending titles everyone is talking about
            </p>
          </div>
          
          <MangaGrid 
            manga={popularManga} 
            className="mb-8"
            showAmazonLink={false}
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              MangaCompass by the Numbers
            </h2>
            <p className="text-lg text-blue-200">
              Trusted by manga enthusiasts worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Curated Titles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-blue-200">User Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Your Personalized Manga Journey Today
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Get personalized recommendations in just 2 minutes of setup
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 border-white"
              >
                <Star className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            Free Prototype • No Purchase Required • Cancel Anytime
          </p>
        </div>
      </section>
    </div>
  );
}