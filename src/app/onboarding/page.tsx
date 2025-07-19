'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { MangaSelector } from '@/components/manga';
import { MOCK_MANGA } from '@/lib/mockData';
import { MANGA_GENRES, Manga, OnboardingData } from '@/lib/types';
import { trackPageView, trackOnboardingStep } from '@/utils/analytics';
import { ArrowLeft, ArrowRight, Check, BookOpen } from 'lucide-react';

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
  const [isMounted, setIsMounted] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedManga: [],
    favoriteGenres: [],
    preferences: {
      preferredStatus: ['ongoing', 'completed'],
      minRating: 3.0,
      excludeGenres: []
    }
  });

  useEffect(() => {
    setIsMounted(true);
    trackPageView('/onboarding', 'Onboarding Page');
  }, []);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackOnboardingStep(nextStep.toString(), { stepId: ONBOARDING_STEPS[nextStep].id });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      trackOnboardingStep(prevStep.toString(), { stepId: ONBOARDING_STEPS[prevStep].id });
    }
  };

  // Handle manga selection
  const handleMangaSelection = (selectedIds: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedManga: selectedIds
    }));
  };

  // Handle genre selection
  const handleGenreToggle = (genre: string) => {
    setOnboardingData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  // Handle preference updates
  const handlePreferenceUpdate = (key: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  // Handle exclude genre toggle
  const handleExcludeGenreToggle = (genre: string) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        excludeGenres: (prev.preferences.excludeGenres || []).includes(genre)
          ? (prev.preferences.excludeGenres || []).filter(g => g !== genre)
          : [...(prev.preferences.excludeGenres || []), genre]
      }
    }));
  };

  // Finish onboarding
  const finishOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mangacompass_user_data', JSON.stringify(onboardingData));
      localStorage.setItem('mangacompass_onboarding_completed', 'true');
    }
    router.push('/dashboard');
  };

  // Validation functions
  const isCurrentStepValid = () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    switch (step.id) {
      case 'manga-selection':
        return onboardingData.selectedManga.length >= step.minSelection && 
               onboardingData.selectedManga.length <= step.maxSelection;
      case 'genre-preferences':
        return onboardingData.favoriteGenres.length >= step.minSelection && 
               onboardingData.favoriteGenres.length <= step.maxSelection;
      case 'preferences':
        return true; // Optional step
      default:
        return false;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center" role="status" aria-label="Loading">
          <BookOpen className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                MangaCompass Setup
              </h1>
              <Badge variant="primary" size="sm">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8" role="main">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Step Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {currentStepData.description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 0 && (
              <div>
                <MangaSelector
                  manga={MOCK_MANGA}
                  selectedManga={onboardingData.selectedManga}
                  onSelectionChange={handleMangaSelection}
                  maxSelections={ONBOARDING_STEPS[0].maxSelection}
                  minSelections={ONBOARDING_STEPS[0].minSelection}
                />
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Selected: {onboardingData.selectedManga.length} / {ONBOARDING_STEPS[0].maxSelection}
                    {onboardingData.selectedManga.length < ONBOARDING_STEPS[0].minSelection && 
                      ` (minimum: ${ONBOARDING_STEPS[0].minSelection})`}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MANGA_GENRES.map((genre) => (
                    <Button
                      key={genre}
                      variant={onboardingData.favoriteGenres.includes(genre) ? 'primary' : 'outline'}
                      size="sm"
                      fullWidth
                      onClick={() => handleGenreToggle(genre)}
                      className="justify-center"
                      aria-pressed={onboardingData.favoriteGenres.includes(genre)}
                    >
                      {onboardingData.favoriteGenres.includes(genre) && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {genre}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Selected genres: {onboardingData.favoriteGenres.length} / {ONBOARDING_STEPS[1].maxSelection}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Preferred Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred manga status:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['ongoing', 'completed', 'hiatus'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={(onboardingData.preferences.preferredStatus || []).includes(status) ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const current = onboardingData.preferences.preferredStatus || [];
                          const updated = current.includes(status)
                            ? current.filter(s => s !== status)
                            : [...current, status];
                          handlePreferenceUpdate('preferredStatus', updated);
                        }}
                        aria-pressed={(onboardingData.preferences.preferredStatus || []).includes(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum rating: {(onboardingData.preferences.minRating || 3.0).toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={onboardingData.preferences.minRating || 3.0}
                    onChange={(e) => handlePreferenceUpdate('minRating', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    aria-label={`Minimum rating: ${(onboardingData.preferences.minRating || 3.0).toFixed(1)} stars`}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>1.0</span>
                    <span>5.0</span>
                  </div>
                </div>

                {/* Exclude Genres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Genres to exclude (optional):
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {MANGA_GENRES.map((genre) => (
                      <Button
                        key={genre}
                        variant={(onboardingData.preferences.excludeGenres || []).includes(genre) ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => handleExcludeGenreToggle(genre)}
                        className="text-xs justify-center"
                        aria-pressed={(onboardingData.preferences.excludeGenres || []).includes(genre)}
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              icon={ArrowLeft}
              iconPosition="left"
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  role="button"
                  aria-label={`Step ${index + 1}${index < currentStep ? ' completed' : index === currentStep ? ' current' : ''}`}
                />
              ))}
            </div>

            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <Button
                variant="primary"
                onClick={finishOnboarding}
                disabled={!isCurrentStepValid()}
                icon={Check}
                iconPosition="right"
              >
                Complete Setup
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={!isCurrentStepValid()}
                icon={ArrowRight}
                iconPosition="right"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}