// MangaCompass - TypeScript Type Definitions

export interface Manga {
  id: string;
  title: string;
  author: string;
  genres: string[];
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'incomplete';
  volumes: number;
  rating: number; // 1-10 scale
  description?: string;
  coverImage?: string;
  imageUrl?: string; // Amazon product image URL
  amazonLink: string;
  asin?: string; // Amazon product identifier
  popularity: number; // 1-100 scale
  year?: number;
}

export interface User {
  id: string;
  readHistory: string[]; // Array of Manga IDs
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
  score: number; // 0-100 scale
  reason: string;
  matchPercentage: number; // 0-100 scale
  factors: RecommendationFactors;
}

export interface RecommendationFactors {
  genreMatch: number; // 0-100 scale
  ratingScore: number; // 0-100 scale
  popularityScore: number; // 0-100 scale
  statusMatch: number; // 0-100 scale
}

export interface OnboardingData {
  selectedManga: string[]; // IDs of manga you've read
  favoriteGenres: string[];
  preferences: Partial<UserPreferences>;
}

// Available genre list
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

// Navigation type
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Response type (for future API)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Pagination type
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// === New type definitions for mood-based recommendation system ===

// Mood category
export interface MoodType {
  id: 'adventure' | 'relax' | 'excitement' | 'emotional' | 
      'thoughtful' | 'thrilling' | 'nostalgic' | 'light';
  name: string;
  emoji: string;
  description: string;
  color: string;
  genreWeights: Record<string, number>;
}

// Simplified user data
export interface SimplifiedUser {
  id: string;
  readHistory: string[];           // Limited to 3-5 titles
  selectedMood?: MoodType;         // Currently selected mood
  lastRecommendation?: RecommendationRecord;
  recommendationHistory: RecommendationRecord[];
}

// Recommendation record
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

// Single recommendation result
export interface SingleRecommendation {
  manga: Manga;
  mood: MoodType;
  score: number;
  reason: string;
  matchPercentage: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  alternativeCount: number;  // Number of alternative candidates
}

// Simplified onboarding data
export interface SimplifiedOnboardingData {
  selectedManga: string[];     // 3-5 titles
  selectedMood: MoodType;      // Single mood
}

// Mood category constants
export const MOOD_CATEGORIES: MoodType[] = [
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '🗺️',
    description: 'Want to explore new worlds',
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
    name: 'Relax',
    emoji: '😌',
    description: 'Want to read peacefully',
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
    name: 'Exciting',
    emoji: '⚡',
    description: 'Want thrilling excitement',
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
    name: 'Emotional',
    emoji: '💝',
    description: 'Want to be moved emotionally',
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
    name: 'Thoughtful',
    emoji: '🤔',
    description: 'Want to read while thinking deeply',
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
    name: 'Thrilling',
    emoji: '😰',
    description: 'Want to enjoy suspense',
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
    name: 'Nostalgic',
    emoji: '🌅',
    description: 'Want to feel nostalgic',
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
    name: 'Light',
    emoji: '☀️',
    description: 'Want to read casually and enjoyably',
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