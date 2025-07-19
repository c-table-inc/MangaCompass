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
  const [showStats, setShowStats] = useState(false);
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
          <p className="text-gray-600">推薦を生成中...</p>
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
            ようこそMangaCompassへ
          </h2>
          <p className="text-gray-600 mb-6">
            パーソナライズされた推薦を受けるには、まず好みを設定しましょう。
          </p>
          <Link href="/onboarding">
            <Button size="lg">
              設定を開始
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                おすすめ漫画
              </h1>
              <p className="text-gray-600">
                {hasReadHistory 
                  ? 'あなたの読書履歴と好みに基づいた推薦です'
                  : '人気・高評価の漫画をご紹介します'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                統計
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshRecommendations}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                更新
              </Button>
              <Link href="/onboarding">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 統計パネル */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">読書履歴</p>
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
                    <p className="text-sm font-medium text-gray-600">好きなジャンル</p>
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
                    <p className="text-sm font-medium text-gray-600">推薦数</p>
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
                    <p className="text-sm font-medium text-gray-600">平均スコア</p>
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

        {/* メインコンテンツ */}
        <div className="space-y-12">
          {/* パーソナライズ推薦 */}
          {hasReadHistory && recommendations.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    あなたへのおすすめ
                  </h2>
                  <p className="text-gray-600">
                    読書履歴に基づくパーソナライズ推薦
                  </p>
                </div>
                <Badge variant="primary">
                  {recommendations.length}件
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
                ジャンル別おすすめ
              </h2>
              
              <div className="space-y-8">
                {Object.entries(genreRecommendations).map(([genre, recs]) => (
                  <div key={genre}>
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{genre}</h3>
                      <Badge variant="secondary" className="ml-3">
                        {recs.length}件
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
                  高評価漫画
                </h2>
                <p className="text-gray-600">
                  読者と評論家から愛される名作
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
                  人気漫画
                </h2>
                <p className="text-gray-600">
                  今話題の作品
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
                  最近追加された漫画
                </h2>
                <p className="text-gray-600">
                  新しく追加された作品
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

        {/* CTA セクション */}
        {!hasReadHistory && (
          <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              もっと良い推薦を受けませんか？
            </h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              あなたの読書履歴と好みを教えることで、より精度の高いパーソナライズ推薦を提供できます。
            </p>
            <Link href="/onboarding">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                好みを設定する
              </Button>
            </Link>
          </div>
        )}

        {/* フッター情報 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            推薦は定期的に更新されます • 
            設定はいつでも変更可能です • 
            データはローカルに保存されています
          </p>
        </div>
      </div>
    </div>
  );
}