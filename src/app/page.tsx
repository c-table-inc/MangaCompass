'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
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
    trackPageView('/');
  }, []);

  // SSR/hydration issues を防ぐため、マウント後まで待機
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            あなたの運命の漫画を
            <span className="block text-blue-600">発見しよう</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI駆動のパーソナライズ推薦で、読書履歴と好みに基づいて
            次に読むべき漫画を見つけます。海外読者のための漫画発見プラットフォーム。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="w-full sm:w-auto">
                無料で始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                デモを見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              なぜMangaCompassを選ぶのか
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              あなたの漫画体験を次のレベルへ
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                パーソナライズ推薦
              </h3>
              <p className="text-gray-600">
                あなたの読書履歴と好みを分析し、最適な漫画を推薦します
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                海外読者対応
              </h3>
              <p className="text-gray-600">
                英語翻訳版の入手可能性と評価を考慮した推薦システム
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                リアルタイム更新
              </h3>
              <p className="text-gray-600">
                最新の漫画情報と評価に基づく常に新鮮な推薦
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
              高評価漫画
            </h2>
            <p className="text-lg text-gray-600">
              評論家と読者から愛される名作たち
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
                あなたの好みに合わせた推薦を受ける
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
              人気漫画
            </h2>
            <p className="text-lg text-gray-600">
              今読まれている話題の作品
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
              MangaCompassの実績
            </h2>
            <p className="text-lg text-blue-200">
              多くの読者に愛用されています
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">厳選漫画</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200">推薦精度</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-blue-200">ユーザー満足度</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">利用可能</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            今すぐあなただけの漫画旅行を始めよう
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            わずか2分のセットアップで、パーソナライズされた推薦が開始されます
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                <Star className="mr-2 h-5 w-5" />
                無料で始める
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600"
              >
                デモを体験
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            無料プロトタイプ • 購入義務なし • いつでも停止可能
          </p>
        </div>
      </section>
    </div>
  );
}