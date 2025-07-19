'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { RecommendationGrid } from '@/components/recommendation';
import { MangaGrid } from '@/components/manga';
import { generateUserRecommendations, getGenreRecommendations, getSimilarManga } from '@/lib/recommendations';
import { getTopRatedManga, getPopularManga, MOCK_USER } from '@/lib/mockData';
import { User, Recommendation, Manga } from '@/lib/types';
import { trackPageView, trackRecommendationClick, generateDashboardStats } from '@/utils/analytics';
import { generateDemoRevenueData } from '@/utils/affiliate';
import { 
  BookOpen, 
  TrendingUp, 
  Star, 
  Users, 
  Settings, 
  BarChart3, 
  Filter,
  RefreshCw,
  Heart,
  Clock,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<Record<string, Recommendation[]>>({});
  const [similarRecommendations, setSimilarRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [showStats, setShowStats] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    trackPageView('/dashboard');
    loadUserData();
  }, []);

  const loadUserData = () => {
    setIsLoading(true);
    
    try {
      // クライアントサイドでのみローカルストレージにアクセス
      if (typeof window === 'undefined') {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      const savedUser = localStorage.getItem('mangacompass_user');
      const userData = savedUser ? JSON.parse(savedUser) : null;
      
      setUser(userData);
      
      // 推薦を生成（ユーザーデータがある場合のみ）
      if (userData && userData.readHistory && userData.readHistory.length > 0) {
        const userRecs = generateUserRecommendations(userData, 12);
        setRecommendations(userRecs);
        
        // ジャンル別推薦
        const genreRecs: Record<string, Recommendation[]> = {};
        userData.favoriteGenres.slice(0, 3).forEach((genre: string) => {
          genreRecs[genre] = getGenreRecommendations(genre, userData, 4);
        });
        setGenreRecommendations(genreRecs);
        
        // 類似漫画推薦（最近読んだ漫画から）
        if (userData.readHistory.length > 0) {
          const recentManga = userData.readHistory[0]; // 最新の読書
          // TODO: 実際の実装では漫画IDから漫画オブジェクトを取得
          // const manga = getMangaById(recentManga);
          // const similar = getSimilarManga(manga, userData, 4);
          // setSimilarRecommendations(similar);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation, position: number) => {
    trackRecommendationClick(recommendation, position);
  };

  const handleRefreshRecommendations = () => {
    loadUserData();
  };

  // SSR/hydration issues を防ぐため、マウント後まで待機
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to MangaCompass
          </h2>
          <p className="text-gray-600 mb-6">
            To receive personalized recommendations, please set up your preferences first.
          </p>
          <Link href="/onboarding">
            <Button size="lg">
              Start Setup
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasReadHistory = user.readHistory.length > 0;
  const topRatedManga = getTopRatedManga(6);
  const popularManga = getPopularManga(6);
  const stats = generateDashboardStats();
  const revenueData = generateDemoRevenueData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                MangaCompass Dashboard
              </h1>
              <Badge variant="primary" size="sm">
                {hasReadHistory ? `${user.readHistory.length} read` : 'Getting started'}
              </Badge>
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="mt-4">
            <p className="text-gray-600">
              {hasReadHistory 
                ? 'Recommendations based on your reading history and preferences'
                : 'Featuring popular and highly-rated manga titles'
              }
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Stats Panel */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reading History</p>
                    <p className="text-2xl font-bold">{user.readHistory.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Favorite Genres</p>
                    <p className="text-2xl font-bold">{user.favoriteGenres.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recommendations</p>
                    <p className="text-2xl font-bold">{recommendations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">
                      {recommendations.length > 0 
                        ? Math.round(recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-12">
          {/* パーソナライズ推薦 */}
          {hasReadHistory && recommendations.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Recommended for You
                  </h2>
                  <p className="text-gray-600">
                    Personalized recommendations based on your reading history
                  </p>
                </div>
                <Badge variant="primary">
                  {recommendations.length} items
                </Badge>
              </div>
              
              <RecommendationGrid
                recommendations={recommendations}
                variant="default"
                showFactors={true}
              />
            </section>
          )}

          {/* ジャンル別推薦 */}
          {Object.keys(genreRecommendations).length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recommendations by Genre
              </h2>
              
              <div className="space-y-8">
                {Object.entries(genreRecommendations).map(([genre, recs]) => (
                  <div key={genre}>
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{genre}</h3>
                      <Badge variant="secondary" className="ml-3">
                        {recs.length} items
                      </Badge>
                    </div>
                    <RecommendationGrid
                      recommendations={recs}
                      variant="compact"
                      showFactors={false}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 高評価漫画 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Top Rated Manga
                </h2>
                <p className="text-gray-600">
                  Masterpieces loved by readers and critics
                </p>
              </div>
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            
            <MangaGrid manga={topRatedManga} showAmazonLink={true} />
          </section>

          {/* 人気漫画 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Popular Manga
                </h2>
                <p className="text-gray-600">
                  Currently trending titles
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            
            <MangaGrid manga={popularManga} showAmazonLink={true} />
          </section>

          {/* 最近追加 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Recently Added Manga
                </h2>
                <p className="text-gray-600">
                  Newly added titles to our collection
                </p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            
            <MangaGrid 
              manga={topRatedManga.slice(0, 4)} 
              showAmazonLink={true}
            />
          </section>
        </div>

        {/* CTA Section */}
        {!hasReadHistory && (
          <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Want better recommendations?
            </h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              By sharing your reading history and preferences, we can provide more accurate personalized recommendations.
            </p>
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Set Preferences
              </Button>
            </Link>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Recommendations are updated regularly • 
            Settings can be changed anytime • 
            Your data is stored locally
          </p>
        </div>
      </div>
    </div>
  );
}