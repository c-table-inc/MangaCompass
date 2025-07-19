// MangaCompass - TypeScript型定義

export interface Manga {
  id: string;
  title: string;
  author: string;
  genres: string[];
  status: 'ongoing' | 'completed' | 'hiatus';
  volumes: number;
  rating: number; // 1-10スケール
  description?: string;
  coverImage?: string;
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
  preferredStatus: ('ongoing' | 'completed' | 'hiatus')[];
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