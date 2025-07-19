# MangaCompass フロントエンドプロトタイプ要件書

## プロジェクト概要

### ビジネス背景
海外の漫画市場は急速に成長しており、2025年には180億ドル規模に達する見込みです。しかし、現在の推薦サービスは基本的なジャンル分類に留まり、個人の読書嗜好に基づいた高精度なパーソナライゼーションが不足しています。MangaCompassは、この課題を解決する海外向け日本漫画推薦プラットフォームです。

### システムの目的
1. **市場検証**: 海外読者の漫画推薦ニーズの実証
2. **技術実証**: AI駆動型推薦システムの有効性確認
3. **収益性検証**: アフィリエイトモデルの実現可能性確認
4. **投資家向けデモ**: 具体的なサービス体験の提供

### プロトタイプの目標

#### 主要目標
- **ユーザー体験の実証**: 直感的で魅力的な推薦体験の提供
- **推薦精度の検証**: 既読履歴に基づく意味のある推薦の実現
- **収益モデルの実装**: アフィリエイトリンクによる収益化の実証
- **技術的実現可能性の確認**: フルスタック開発前の技術検証

#### 測定可能な成功指標
- **ユーザーエンゲージメント**: 平均セッション時間 3分以上
- **推薦受入率**: 推薦された漫画への関心表示 30%以上  
- **アフィリエイトCTR**: 推薦からの購入リンククリック 10%以上
- **完了率**: オンボーディング完了率 70%以上

### ターゲットユーザー
1. **主要ターゲット**: 18-35歳の海外在住漫画愛好者
2. **セカンダリー**: 漫画初心者で新しい作品を探している読者
3. **ステークホルダー**: 投資家、パートナー候補、開発チーム

### コアバリュープロポジション
- **パーソナライズ**: 既読履歴に基づく高精度推薦
- **発見性**: 隠れた名作やニッチ作品の発見
- **利便性**: ワンクリックでの購入導線
- **信頼性**: 透明な推薦理由とコミュニティ評価

## 技術概要
本ドキュメントは、Claude Codeで実装するフロントエンドプロトタイプの詳細な技術仕様です。バックエンドなしでも動作するスタンドアローンなプロトタイプとして、モックデータを使用してサービスのコンセプトを実証します。

## 技術仕様

### 技術スタック
```
フレームワーク: Next.js 14 (App Router)
スタイリング: Tailwind CSS 3.4
ランタイム: Node.js 20.x
パッケージマネージャー: npm
デプロイ: Vercel (無料枠)
```

### 必要なライブラリ
```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.0.0",
    "@types/node": "20.0.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "tailwindcss": "3.4.0",
    "lucide-react": "^0.300.0",
    "framer-motion": "^10.16.0",
    "next-themes": "^0.2.1"
  }
}
```

## プロジェクト構造

```
manga-compass-prototype/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ランディングページ
│   │   ├── onboarding/
│   │   │   └── page.tsx        # オンボーディング
│   │   ├── dashboard/
│   │   │   └── page.tsx        # ダッシュボード
│   │   └── globals.css         # グローバルスタイル
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── manga/
│   │   │   ├── MangaCard.tsx
│   │   │   ├── MangaGrid.tsx
│   │   │   └── MangaSelector.tsx
│   │   ├── recommendation/
│   │   │   ├── RecommendationCard.tsx
│   │   │   └── RecommendationGrid.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── mockData.ts         # モックデータ
│   │   ├── types.ts            # TypeScript型定義
│   │   └── recommendations.ts  # 推薦ロジック
│   └── utils/
│       ├── affiliate.ts        # アフィリエイトリンク生成
│       └── analytics.ts        # ダミー分析機能
├── public/
│   ├── images/
│   │   └── manga-covers/       # 漫画カバー画像
│   └── favicon.ico
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

## 詳細仕様

### 1. データ型定義 (src/lib/types.ts)

```typescript
export interface Manga {
  id: number;
  title: string;
  titleEnglish: string;
  author: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  volumes: number;
  description: string;
  coverImage: string;
  amazonLink: string;
  rating: number;
  popularity: number;
}

export interface UserMangaHistory {
  mangaId: number;
  status: 'read' | 'reading' | 'want_to_read';
  rating: number;
}

export interface Recommendation {
  manga: Manga;
  score: number;
  reason: string;
  matchPercentage: number;
}

export interface User {
  id: string;
  name: string;
  readHistory: UserMangaHistory[];
  preferences: {
    favoriteGenres: string[];
    preferredStatus: 'ongoing' | 'completed' | 'both';
    preferredLength: 'short' | 'medium' | 'long' | 'any';
  };
}
```

### 2. モックデータ (src/lib/mockData.ts)

```typescript
export const mockMangaDatabase: Manga[] = [
  {
    id: 1,
    title: "進撃の巨人",
    titleEnglish: "Attack on Titan",
    author: "Hajime Isayama",
    genres: ["Action", "Dark Fantasy", "Military"],
    status: "completed",
    volumes: 34,
    description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason...",
    coverImage: "/images/manga-covers/attack-on-titan.jpg",
    amazonLink: "https://www.amazon.com/dp/1612620248",
    rating: 4.8,
    popularity: 95
  },
  {
    id: 2,
    title: "鬼滅の刃",
    titleEnglish: "Demon Slayer",
    author: "Koyoharu Gotouge",
    genres: ["Action", "Historical", "Supernatural"],
    status: "completed",
    volumes: 23,
    description: "Tanjiro Kamado, joined with Inosuke Hashibira, a boy raised by boars who wears a boar's head, and Zenitsu Agatsuma, a scared boy who reveals his true power when he sleeps...",
    coverImage: "/images/manga-covers/demon-slayer.jpg",
    amazonLink: "https://www.amazon.com/dp/1974700208",
    rating: 4.7,
    popularity: 92
  },
  // ... 48作品分のデータ
];

export const mockUser: User = {
  id: "user_001",
  name: "Demo User",
  readHistory: [
    { mangaId: 1, status: "read", rating: 5 },
    { mangaId: 2, status: "read", rating: 4 },
  ],
  preferences: {
    favoriteGenres: ["Action", "Adventure"],
    preferredStatus: "both",
    preferredLength: "any"
  }
};
```

### 3. 推薦ロジック (src/lib/recommendations.ts)

```typescript
import { Manga, User, Recommendation, UserMangaHistory } from './types';
import { mockMangaDatabase } from './mockData';

export class RecommendationEngine {
  static generateRecommendations(user: User, limit: number = 6): Recommendation[] {
    const readMangaIds = user.readHistory.map(h => h.mangaId);
    const unreadManga = mockMangaDatabase.filter(manga => !readMangaIds.includes(manga.id));
    
    const recommendations = unreadManga.map(manga => {
      const score = this.calculateScore(manga, user);
      const reason = this.generateReason(manga, user);
      
      return {
        manga,
        score,
        reason,
        matchPercentage: Math.round(score * 100)
      };
    });
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  private static calculateScore(manga: Manga, user: User): number {
    let score = 0;
    
    // ジャンル一致度 (40%)
    const genreMatch = manga.genres.filter(genre => 
      user.preferences.favoriteGenres.includes(genre)
    ).length / Math.max(manga.genres.length, user.preferences.favoriteGenres.length);
    score += genreMatch * 0.4;
    
    // 評価スコア (30%)
    score += (manga.rating / 5) * 0.3;
    
    // 人気度 (20%)
    score += (manga.popularity / 100) * 0.2;
    
    // ステータス好み (10%)
    if (user.preferences.preferredStatus === 'both' || 
        user.preferences.preferredStatus === manga.status) {
      score += 0.1;
    }
    
    return Math.min(score, 1);
  }
  
  private static generateReason(manga: Manga, user: User): string {
    const reasons = [];
    
    // 読書履歴からの類推
    const readManga = user.readHistory
      .map(h => mockMangaDatabase.find(m => m.id === h.mangaId))
      .filter(Boolean);
    
    const similarGenreManga = readManga.find(read => 
      read?.genres.some(g => manga.genres.includes(g))
    );
    
    if (similarGenreManga) {
      reasons.push(`Since you enjoyed "${similarGenreManga.titleEnglish}"`);
    }
    
    // 高評価作品
    if (manga.rating >= 4.5) {
      reasons.push("Highly rated by readers");
    }
    
    // 完結作品
    if (manga.status === 'completed') {
      reasons.push("Complete series perfect for binge reading");
    }
    
    return reasons.length > 0 ? reasons.join(" • ") : "Popular in your preferred genres";
  }
}
```

### 4. ページコンポーネント仕様

#### 4.1 ランディングページ (src/app/page.tsx)
```typescript
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MangaGrid } from '@/components/manga/MangaGrid';
import { Button } from '@/components/ui/Button';
import { mockMangaDatabase } from '@/lib/mockData';

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const popularManga = mockMangaDatabase
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Next Favorite Manga
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get personalized manga recommendations based on what you've already read. 
          Find hidden gems and popular series tailored to your taste.
        </p>
        
        <div className="space-x-4">
          <Button 
            onClick={() => window.location.href = '/onboarding'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => setShowDemo(true)}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            See Demo
          </Button>
        </div>
      </section>

      {/* Demo Section */}
      {showDemo && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Manga
          </h2>
          <MangaGrid manga={popularManga} />
        </section>
      )}

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why MangaCompass?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-gray-600">Recommendations based on your reading history</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global</h3>
              <p className="text-gray-600">Discover manga from all genres and eras</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant</h3>
              <p className="text-gray-600">Get recommendations in seconds</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

#### 4.2 オンボーディングページ (src/app/onboarding/page.tsx)
```typescript
"use client";

import { useState } from 'react';
import { MangaSelector } from '@/components/manga/MangaSelector';
import { Button } from '@/components/ui/Button';
import { mockMangaDatabase } from '@/lib/mockData';
import { UserMangaHistory } from '@/lib/types';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedManga, setSelectedManga] = useState<UserMangaHistory[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  const popularManga = mockMangaDatabase
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  const allGenres = Array.from(
    new Set(mockMangaDatabase.flatMap(manga => manga.genres))
  );

  const handleMangaSelect = (mangaId: number, rating: number) => {
    setSelectedManga(prev => {
      const existing = prev.find(item => item.mangaId === mangaId);
      if (existing) {
        return prev.map(item => 
          item.mangaId === mangaId 
            ? { ...item, rating }
            : item
        );
      }
      return [...prev, { mangaId, status: 'read' as const, rating }];
    });
  };

  const handleGenreToggle = (genre: string) => {
    setFavoriteGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleComplete = () => {
    // Save to localStorage and redirect
    localStorage.setItem('userPreferences', JSON.stringify({
      readHistory: selectedManga,
      favoriteGenres,
      onboardingCompleted: true
    }));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 2</span>
            <span>{Math.round((step / 2) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              What manga have you read?
            </h1>
            <p className="text-gray-600 mb-8">
              Select manga you've read and rate them. This helps us understand your taste.
            </p>
            
            <MangaSelector 
              manga={popularManga}
              selectedManga={selectedManga}
              onMangaSelect={handleMangaSelect}
            />
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={selectedManga.length < 3}
                className="px-8 py-3"
              >
                Next: Choose Genres ({selectedManga.length}/3+ selected)
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              What genres do you enjoy?
            </h1>
            <p className="text-gray-600 mb-8">
              Select your favorite genres to help us recommend similar manga.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    favoriteGenres.includes(genre)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={favoriteGenres.length < 2}
                className="px-8 py-3"
              >
                Complete Setup ({favoriteGenres.length}/2+ genres)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4.3 ダッシュボードページ (src/app/dashboard/page.tsx)
```typescript
"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { RecommendationGrid } from '@/components/recommendation/RecommendationGrid';
import { RecommendationEngine } from '@/lib/recommendations';
import { User, Recommendation } from '@/lib/types';
import { mockUser } from '@/lib/mockData';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      const userWithPreferences = {
        ...mockUser,
        readHistory: preferences.readHistory || [],
        preferences: {
          ...mockUser.preferences,
          favoriteGenres: preferences.favoriteGenres || []
        }
      };
      setUser(userWithPreferences);
      
      // Generate recommendations
      const recs = RecommendationEngine.generateRecommendations(userWithPreferences);
      setRecommendations(recs);
    } else {
      // Redirect to onboarding if no preferences
      window.location.href = '/onboarding';
    }
    setLoading(false);
  }, []);

  const handleAffiliateClick = (mangaId: number) => {
    // Track click and open affiliate link
    console.log(`Clicked affiliate link for manga ${mangaId}`);
    // In real implementation, this would track the click and open the link
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Generating your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Your Recommendations
          </h1>
          <p className="text-gray-600">
            Based on your reading history and preferences
          </p>
        </div>

        <RecommendationGrid 
          recommendations={recommendations}
          onAffiliateClick={handleAffiliateClick}
        />

        {/* Reading Statistics */}
        <div className="mt-16 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Reading Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user?.readHistory.length || 0}
              </div>
              <div className="text-sm text-gray-600">Manga Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {user?.preferences.favoriteGenres.length || 0}
              </div>
              <div className="text-sm text-gray-600">Favorite Genres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {recommendations.length}
              </div>
              <div className="text-sm text-gray-600">New Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(recommendations.reduce((acc, rec) => acc + rec.score, 0) / recommendations.length * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Match</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. 主要コンポーネント

#### 5.1 RecommendationCard (src/components/recommendation/RecommendationCard.tsx)
```typescript
import { Recommendation } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAffiliateClick: (mangaId: number) => void;
}

export function RecommendationCard({ recommendation, onAffiliateClick }: RecommendationCardProps) {
  const { manga, reason, matchPercentage } = recommendation;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img 
          src={manga.coverImage} 
          alt={manga.titleEnglish}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-manga.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="success">
            {matchPercentage}% Match
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {manga.titleEnglish}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          by {manga.author}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {manga.genres.slice(0, 2).map(genre => (
            <Badge key={genre} variant="secondary" size="sm">
              {genre}
            </Badge>
          ))}
          {manga.genres.length > 2 && (
            <Badge variant="secondary" size="sm">
              +{manga.genres.length - 2}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {reason}
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onAffiliateClick(manga.id)}
            className="flex-1"
            size="sm"
          >
            Buy on Amazon
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {/* Add to reading list */}}
          >
            ❤️
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

### 6. ユーティリティ関数

#### 6.1 アフィリエイトリンク生成 (src/utils/affiliate.ts)
```typescript
export function generateAffiliateLink(originalUrl: string): string {
  const associateId = 'mangacompass-20';
  
  try {
    const url = new URL(originalUrl);
    
    if (url.hostname.includes('amazon')) {
      url.searchParams.set('tag', associateId);
      return url.toString();
    }
    
    return originalUrl;
  } catch {
    return originalUrl;
  }
}

export function trackAffiliateClick(mangaId: number): void {
  // In a real app, this would send to analytics
  console.log(`Affiliate click tracked for manga ${mangaId}`);
  
  // Store in localStorage for demo purposes
  const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
  clicks.push({
    mangaId,
    timestamp: Date.now()
  });
  localStorage.setItem('affiliateClicks', JSON.stringify(clicks));
}
```

## 実装手順

### Phase 1: プロジェクトセットアップ（1日）
1. Next.js プロジェクト作成
2. 必要なライブラリインストール
3. Tailwind CSS 設定
4. 基本的なフォルダ構造作成

### Phase 2: 基本コンポーネント（1日）
1. 型定義の作成
2. UIコンポーネント（Button, Card, Badge）
3. レイアウトコンポーネント（Header, Footer）
4. モックデータの準備

### Phase 3: ページ実装（2日）
1. ランディングページ
2. オンボーディングページ
3. ダッシュボードページ
4. 推薦ロジックの実装

### Phase 4: 仕上げとデプロイ（1日）
1. レスポンシブ対応確認
2. パフォーマンス最適化
3. Vercelデプロイ
4. 動作確認とバグ修正

## 成功基準とKPI

### 技術的成功基準
- [ ] 3つのページ（ランディング、オンボーディング、ダッシュボード）が正常に動作
- [ ] モバイル・デスクトップ対応が完了
- [ ] 推薦機能が論理的で意味のある結果を返す
- [ ] アフィリエイトリンクが正しく生成される
- [ ] Vercelで公開され、他者がアクセス可能
- [ ] ページロード時間が3秒以内

### ビジネス検証基準
- [ ] 10人以上のテストユーザーによる実際の使用
- [ ] ユーザーフィードバックで推薦精度が「有用」と評価される
- [ ] オンボーディング完了率が70%以上
- [ ] 平均セッション時間が3分以上
- [ ] アフィリエイトリンククリック率が10%以上

### ステークホルダー評価基準
- [ ] 投資家プレゼンテーションでのポジティブな反応
- [ ] サービスコンセプトの理解度90%以上
- [ ] 技術的実現可能性への確信獲得
- [ ] 収益モデルの明確な実証

## 次フェーズへの移行条件

### MVP開発へのGo/No-Go判定基準
1. **市場適合性**: テストユーザーの80%が「このサービスを使いたい」と回答
2. **技術的実現性**: プロトタイプで特定された技術課題が解決可能
3. **収益性**: アフィリエイトCTRが目標値(10%)を達成
4. **チーム準備**: フルスタック開発チームの確保

### プロトタイプから学ぶべき項目
- ユーザーが最も価値を感じる機能の特定
- 推薦アルゴリズムの改善ポイント
- UI/UXの課題と改善案
- 技術スタックの最終決定要素

## プロジェクト完了後の活用

### デモ・プレゼンテーション用途
- **投資家ピッチ**: 実際のサービス体験を提供
- **パートナー交渉**: 出版社・小売業者への具体的提案
- **チーム採用**: 開発者への参加動機付け
- **市場調査**: ユーザーインタビューの基盤

### 継続的な価値創出
- **マーケティング素材**: サービス紹介動画・スクリーンショット作成
- **ユーザー獲得**: 事前登録フォームとしての活用
- **競合分析**: 他社サービスとの比較検証
- **技術アセット**: 本開発での再利用可能コンポーネント

このプロトタイプは単なる技術デモではなく、MangaCompassの事業成功に向けた重要なマイルストーンです。完成により、確実なビジネス戦略と技術戦略の基盤を確立し、次フェーズでの成功確率を大幅に向上させることができます。