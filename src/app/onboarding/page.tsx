'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { MangaSelector } from '@/components/manga';
import { MOCK_MANGA, MOCK_USER } from '@/lib/mockData';
import { MANGA_GENRES, Manga, OnboardingData } from '@/lib/types';
import { trackPageView, trackOnboardingStep } from '@/utils/analytics';
import { ArrowLeft, ArrowRight, Check, Star, BookOpen } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    id: 'manga-selection',
    title: '読んだことのある漫画を選択してください',
    description: '最低3つ、最大10つまで選択できます。これらの情報を基にあなたの好みを分析します。',
    minSelection: 3,
    maxSelection: 10
  },
  {
    id: 'genre-preferences',
    title: 'お気に入りのジャンルを選択してください',
    description: '興味のあるジャンルを選んでください。推薦の精度が向上します。',
    minSelection: 1,
    maxSelection: 8
  },
  {
    id: 'preferences',
    title: '読書設定を選択してください',
    description: '読書スタイルに関する設定を行います。',
    minSelection: 0,
    maxSelection: 0
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedManga: [],
    favoriteGenres: [],
    preferences: {
      preferredStatus: [],
      minRating: 0,
      excludeGenres: []
    }
  });
  
  // 選択された漫画オブジェクトを取得（表示用）
  const selectedMangaObjects = MOCK_MANGA.filter(manga => 
    onboardingData.selectedManga.includes(manga.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    trackPageView('/onboarding');
    trackOnboardingStep('started');
  }, []);

  const currentStepConfig = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;


  const handleGenreToggle = (genre: string) => {
    setOnboardingData(prev => {
      const newGenres = prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre];
      
      return {
        ...prev,
        favoriteGenres: newGenres
      };
    });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // manga selection
        return selectedMangaObjects.length >= currentStepConfig.minSelection;
      case 1: // genre preferences
        return onboardingData.favoriteGenres.length >= currentStepConfig.minSelection;
      case 2: // preferences
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      trackOnboardingStep(`step-${currentStep}-completed`);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // ユーザーデータをローカルストレージに保存
      const userData = {
        ...MOCK_USER,
        readHistory: onboardingData.selectedManga,
        favoriteGenres: onboardingData.favoriteGenres,
        preferences: onboardingData.preferences,
        onboardingCompleted: true,
        lastUpdated: Date.now()
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('mangacompass_user', JSON.stringify(userData));
      }
      
      trackOnboardingStep('completed', {
        totalManga: onboardingData.selectedManga.length,
        totalGenres: onboardingData.favoriteGenres.length,
        preferences: onboardingData.preferences
      });
      
      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <MangaSelector
            manga={MOCK_MANGA}
            selectedManga={onboardingData.selectedManga}
            onSelectionChange={(selectedIds: string[]) => {
              setOnboardingData(prev => ({
                ...prev,
                selectedManga: selectedIds
              }));
              
              const selectedMangaObjects = MOCK_MANGA.filter(m => selectedIds.includes(m.id));
              trackOnboardingStep('manga-selected', {
                count: selectedMangaObjects.length,
                titles: selectedMangaObjects.map(m => m.title)
              });
            }}
            minSelections={currentStepConfig.minSelection}
            maxSelections={currentStepConfig.maxSelection}
          />
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {MANGA_GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    onboardingData.favoriteGenres.includes(genre)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{genre}</span>
                    {onboardingData.favoriteGenres.includes(genre) && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              選択済み: {onboardingData.favoriteGenres.length} / {currentStepConfig.maxSelection}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* 読書ステータス設定 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">読みたい漫画のステータス</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'ongoing', label: '連載中', description: '最新話が楽しめる' },
                  { value: 'completed', label: '完結済み', description: '最後まで読める' }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => {
                      const current = onboardingData.preferences.preferredStatus || [];
                      const newStatus = current.includes(status.value as any)
                        ? current.filter(s => s !== status.value)
                        : [...current, status.value as any];
                      handlePreferenceChange('preferredStatus', newStatus);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      (onboardingData.preferences.preferredStatus || []).includes(status.value as any)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{status.label}</div>
                        <div className="text-sm text-gray-600">{status.description}</div>
                      </div>
                      {(onboardingData.preferences.preferredStatus || []).includes(status.value as any) && (
                        <Check className="h-5 w-5 text-blue-600 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 最低評価設定 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">最低評価</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">評価:</span>
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handlePreferenceChange('minRating', rating)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded ${
                          onboardingData.preferences.minRating === rating
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Star className="h-4 w-4" />
                        <span>{rating === 0 ? 'すべて' : `${rating}.0+`}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  設定した評価以上の漫画のみが推薦されます
                </p>
              </div>
            </div>

            {/* 除外ジャンル設定 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">除外したいジャンル（オプション）</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {MANGA_GENRES.filter(genre => 
                  !onboardingData.favoriteGenres.includes(genre)
                ).map(genre => (
                  <button
                    key={genre}
                    onClick={() => {
                      const current = onboardingData.preferences.excludeGenres || [];
                      const newExcluded = current.includes(genre)
                        ? current.filter(g => g !== genre)
                        : [...current, genre];
                      handlePreferenceChange('excludeGenres', newExcluded);
                    }}
                    className={`p-2 rounded text-sm border transition-all ${
                      (onboardingData.preferences.excludeGenres || []).includes(genre)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // SSR/hydration issues を防ぐため、マウント後まで待機
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <BookOpen className="inline-block h-8 w-8 mr-2 text-blue-600" />
            MangaCompassへようこそ
          </h1>
          <p className="text-gray-600">
            あなたの好みを教えて、パーソナライズされた漫画推薦を受けましょう
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {ONBOARDING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            ステップ {currentStep + 1} / {ONBOARDING_STEPS.length}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepConfig.title}
            </h2>
            <p className="text-gray-600">
              {currentStepConfig.description}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>

          <div className="flex items-center space-x-4">
            {currentStep === 0 && selectedMangaObjects.length > 0 && (
              <Badge variant="secondary">
                {selectedMangaObjects.length} / {currentStepConfig.maxSelection} 選択済み
              </Badge>
            )}
            
            {currentStep === 1 && onboardingData.favoriteGenres.length > 0 && (
              <Badge variant="secondary">
                {onboardingData.favoriteGenres.length} ジャンル選択済み
              </Badge>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                '保存中...'
              ) : isLastStep ? (
                '完了'
              ) : (
                <>
                  次へ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            設定はいつでもダッシュボードから変更できます • 
            プライベートデータはローカルに保存されます
          </p>
        </div>
      </div>
    </div>
  );
}