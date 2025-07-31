'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  SimplifiedUser, 
  MoodType, 
  SingleRecommendation as SingleRecommendationType,
  RecommendationRecord 
} from '@/lib/types';
import { SingleRecommendation } from '@/components/recommendation';
import { MoodSelector, QuickMoodSelector } from '@/components/mood';
import { Button } from '@/components/ui';
import { moodBasedEngine, generateMoodRecommendation, recordUserRecommendation } from '@/lib/moodEngine';
import { trackPageView, trackRecommendationAction, trackMoodSelection } from '@/utils/analytics';
import { BookOpen, RefreshCw, ArrowLeft, Settings } from 'lucide-react';

type DashboardState = 'loading' | 'no-user' | 'mood-selection' | 'recommendation' | 'error';

export default function SimplifiedDashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>('loading');
  const [user, setUser] = useState<SimplifiedUser | null>(null);
  const [currentMood, setCurrentMood] = useState<MoodType | undefined>(undefined);
  const [recommendation, setRecommendation] = useState<SingleRecommendationType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadUserData();
  }, []); // loadUserDataは初回のみ実行する想定なので、依存関係に追加しない

  useEffect(() => {
    if (isMounted && user) {
      trackPageView('/dashboard', user.id);
    }
  }, [isMounted, user]);

  const loadUserData = async () => {
    setState('loading');
    
    try {
      if (typeof window === 'undefined') {
        setState('no-user');
        return;
      }
      
      const savedUserData = localStorage.getItem('mangacompass_simplified_user');
      const onboardingCompleted = localStorage.getItem('mangacompass_onboarding_completed');
      
      if (!savedUserData || !onboardingCompleted) {
        setState('no-user');
        return;
      }
      
      const userData: SimplifiedUser = JSON.parse(savedUserData);
      setUser(userData);
      
      // 既に気分が選択されている場合は推薦を生成
      if (userData.selectedMood && userData.selectedMood) {
        setCurrentMood(userData.selectedMood);
        await generateRecommendation(userData, userData.selectedMood);
      } else {
        setState('mood-selection');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data.');
      setState('error');
    }
  };

  const generateRecommendation = async (userData: SimplifiedUser, mood: MoodType) => {
    setIsGenerating(true);
    setState('loading');
    
    try {
      // 短い遅延で推薦生成の体験を向上
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRecommendation = generateMoodRecommendation(userData, mood);
      setRecommendation(newRecommendation);
      
      // 推薦を記録
      const record = recordUserRecommendation(userData, newRecommendation, 'viewed');
      
      // ユーザーデータを更新して保存
      const updatedUser = { ...userData, selectedMood: mood };
      setUser(updatedUser);
      localStorage.setItem('mangacompass_simplified_user', JSON.stringify(updatedUser));
      
      setState('recommendation');
      trackMoodSelection(mood, userData.id);
    } catch (error) {
      console.error('Failed to generate recommendation:', error);
      setError('Failed to generate recommendation. Please try again.');
      setState('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMoodSelect = async (mood: MoodType) => {
    if (!user) return;
    
    setCurrentMood(mood);
    await generateRecommendation(user, mood);
  };

  const handleAmazonClick = () => {
    if (!user || !recommendation) return;
    
    // Amazon遷移をトラッキング
    recordUserRecommendation(user, recommendation, 'clicked_amazon');
    trackRecommendationAction('amazon_click', {
      manga_id: recommendation.manga.id,
      mood_id: recommendation.mood.id,
      user_id: user.id
    });
    
    // Amazon リンクを開く
    window.open(recommendation.manga.amazonLink, '_blank', 'noopener,noreferrer');
  };

  const handleTryAgain = async () => {
    if (!user || !currentMood) return;
    
    try {
      // 既に推薦済みの作品を除外して再推薦
      const excludeIds = recommendation ? [recommendation.manga.id] : [];
      const newRecommendation = moodBasedEngine.generateAlternativeRecommendation(
        user, 
        currentMood, 
        excludeIds
      );
      
      setRecommendation(newRecommendation);
      recordUserRecommendation(user, newRecommendation, 'viewed');
      
      trackRecommendationAction('try_again', {
        manga_id: newRecommendation.manga.id,
        mood_id: currentMood.id,
        user_id: user.id
      });
    } catch (error) {
      console.error('Failed to generate alternative recommendation:', error);
      setError('Failed to generate alternative recommendation.');
    }
  };

  const handleChangeMood = () => {
    setState('mood-selection');
    setRecommendation(null);
  };

  const handleStartOver = () => {
    router.push('/onboarding');
  };

  const handleRetry = () => {
    setError(null);
    loadUserData();
  };

  // SSR/hydration issues を防ぐため、マウント後まで待機
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            An Error Occurred
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'An unexpected error occurred.'}
          </p>
          <div className="space-y-3">
            <Button onClick={handleRetry} size="lg" className="w-full">
              Retry
            </Button>
            <Link href="/onboarding">
              <Button variant="outline" size="lg" className="w-full">
                Reset Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ユーザーデータなし
  if (state === 'no-user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to MangaCompass
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            To find the perfect manga for you, let's start with a simple setup.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 気分選択状態
  if (state === 'mood-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tell us your current mood
                </h1>
                <p className="text-gray-600 mt-2">
                  We'll recommend the perfect manga based on your mood
                </p>
              </div>
              <Link href="/onboarding">
                <Button variant="ghost" icon={Settings}>
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Quick Mood Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Choose from popular moods
              </h3>
              <QuickMoodSelector onMoodSelect={handleMoodSelect} />
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Full Mood Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Choose from all moods
              </h3>
              <MoodSelector
                selectedMood={currentMood}
                onMoodSelect={handleMoodSelect}
              />
            </div>
          </div>

          {/* User Stats */}
          {user && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Your Reading Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{user.readHistory.length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{user.recommendationHistory.length}</div>
                  <div className="text-sm text-gray-600">Recommendations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {user.lastRecommendation ? user.lastRecommendation.mood.name : '-'}
                  </div>
                  <div className="text-sm text-gray-600">Last Mood</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 推薦表示状態
  if (state === 'recommendation' && recommendation) {
    return (
      <SingleRecommendation
        recommendation={recommendation}
        onAmazonClick={handleAmazonClick}
        onTryAgain={handleTryAgain}
        onChangeMood={handleChangeMood}
        onStartOver={handleStartOver}
      />
    );
  }
  
  // ローディング状態（推薦生成中）
  if (state === 'loading' || isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Finding the perfect manga for you...
          </h2>
          {currentMood && (
            <p className="text-lg text-gray-600">
              {currentMood.emoji} Based on your {currentMood.name} mood
            </p>
          )}
        </div>
      </div>
    );
  }

  // フォールバック
  return null;
}