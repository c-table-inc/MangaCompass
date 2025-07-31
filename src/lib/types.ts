// MangaCompass - TypeScript型定義

export interface Manga {
  id: string;
  title: string;
  author: string;
  genres: string[];
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'incomplete';
  volumes: number;
  rating: number; // 1-10スケール
  description?: string;
  coverImage?: string;
  imageUrl?: string; // Amazon商品画像URL
  amazonLink: string;
  asin?: string; // Amazon商品識別子
  popularity: number; // 1-100スケール
  year?: number;
}

export interface User {
  id: string;
  readHistory: string[]; // Manga IDsの配列
  favoriteGenres: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  preferredStatus: ('ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'incomplete')[];
  minRating: number;
  maxVolumes?: number;
  excludeGenres?: string[];
}

export interface Recommendation {
  manga: Manga;
  score: number; // 0-100スケール
  reason: string;
  matchPercentage: number; // 0-100スケール
  factors: RecommendationFactors;
}

export interface RecommendationFactors {
  genreMatch: number; // 0-100スケール
  ratingScore: number; // 0-100スケール
  popularityScore: number; // 0-100スケール
  statusMatch: number; // 0-100スケール
}

export interface OnboardingData {
  selectedManga: string[]; // 読んだことのある漫画ID
  favoriteGenres: string[];
  preferences: Partial<UserPreferences>;
}

// 利用可能なジャンル一覧
export const MANGA_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
  'Historical',
  'Psychological',
  'School',
  'Mecha',
  'Military',
  'Music',
  'Cooking'
] as const;

export type MangaGenre = typeof MANGA_GENRES[number];

// ナビゲーション用の型
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// レスポンス型（将来のAPI用）
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// ページネーション型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// === 気分ベース推薦システム用の新しい型定義 ===

// 気分カテゴリー
export interface MoodType {
  id: 'adventure' | 'relax' | 'excitement' | 'emotional' | 
      'thoughtful' | 'thrilling' | 'nostalgic' | 'light';
  name: string;
  emoji: string;
  description: string;
  color: string;
  genreWeights: Record<string, number>;
}

// 簡略化されたユーザーデータ
export interface SimplifiedUser {
  id: string;
  readHistory: string[];           // 3-5作品に制限
  selectedMood?: MoodType;         // 現在選択中の気分
  lastRecommendation?: RecommendationRecord;
  recommendationHistory: RecommendationRecord[];
}

// 推薦記録
export interface RecommendationRecord {
  id: string;
  manga: Manga;
  mood: MoodType;
  score: number;
  reason: string;
  matchPercentage: number;
  timestamp: Date;
  userAction?: 'viewed' | 'clicked_amazon' | 'bookmarked' | 'dismissed';
}

// 単一推薦結果
export interface SingleRecommendation {
  manga: Manga;
  mood: MoodType;
  score: number;
  reason: string;
  matchPercentage: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  alternativeCount: number;  // 他の候補数
}

// 簡略化されたオンボーディングデータ
export interface SimplifiedOnboardingData {
  selectedManga: string[];     // 3-5作品
  selectedMood: MoodType;      // 単一の気分
}

// 気分カテゴリー定数
export const MOOD_CATEGORIES: MoodType[] = [
  {
    id: 'adventure',
    name: '冒険気分',
    emoji: '🗺️',
    description: '新しい世界を探検したい',
    color: '#10B981',
    genreWeights: {
      'Adventure': 1.0,
      'Action': 0.8,
      'Fantasy': 0.7,
      'Sci-Fi': 0.6,
      'Supernatural': 0.5
    }
  },
  {
    id: 'relax',
    name: 'リラックス',
    emoji: '😌',
    description: '心穏やかに読みたい',
    color: '#6366F1',
    genreWeights: {
      'Slice of Life': 1.0,
      'Comedy': 0.8,
      'Romance': 0.6,
      'Cooking': 0.7,
      'Music': 0.5
    }
  },
  {
    id: 'excitement',
    name: 'エキサイティング',
    emoji: '⚡',
    description: 'スリル満点で読みたい',
    color: '#F59E0B',
    genreWeights: {
      'Action': 1.0,
      'Sports': 0.9,
      'Thriller': 0.8,
      'Mecha': 0.7,
      'Military': 0.6
    }
  },
  {
    id: 'emotional',
    name: '感動したい',
    emoji: '💝',
    description: '心を動かされたい',
    color: '#EF4444',
    genreWeights: {
      'Drama': 1.0,
      'Romance': 0.8,
      'Historical': 0.6,
      'Music': 0.7,
      'Slice of Life': 0.5
    }
  },
  {
    id: 'thoughtful',
    name: '考えさせられる',
    emoji: '🤔',
    description: '深く考えながら読みたい',
    color: '#8B5CF6',
    genreWeights: {
      'Psychological': 1.0,
      'Mystery': 0.9,
      'Sci-Fi': 0.7,
      'Drama': 0.6,
      'Historical': 0.5
    }
  },
  {
    id: 'thrilling',
    name: 'ハラハラドキドキ',
    emoji: '😰',
    description: '緊張感を楽しみたい',
    color: '#DC2626',
    genreWeights: {
      'Horror': 1.0,
      'Thriller': 0.9,
      'Mystery': 0.8,
      'Supernatural': 0.7,
      'Psychological': 0.6
    }
  },
  {
    id: 'nostalgic',
    name: 'ノスタルジック',
    emoji: '🌅',
    description: '懐かしい気持ちになりたい',
    color: '#F97316',
    genreWeights: {
      'Historical': 1.0,
      'School': 0.8,
      'Slice of Life': 0.7,
      'Drama': 0.6,
      'Romance': 0.5
    }
  },
  {
    id: 'light',
    name: '軽やかに',
    emoji: '☀️',
    description: '気軽に楽しく読みたい',
    color: '#22D3EE',
    genreWeights: {
      'Comedy': 1.0,
      'School': 0.8,
      'Slice of Life': 0.7,
      'Romance': 0.6,
      'Sports': 0.5
    }
  }
];