'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import { MangaSelector } from '@/components/manga';
import { MOCK_MANGA } from '@/lib/mockData';
import { Manga, SimplifiedOnboardingData, SimplifiedUser, MoodType, MOOD_CATEGORIES } from '@/lib/types';
import { MoodSelector } from '@/components/mood';
import { trackPageView, trackOnboardingStep } from '@/utils/analytics';
import { ArrowLeft, ArrowRight, Check, BookOpen } from 'lucide-react';

const SIMPLIFIED_ONBOARDING_STEPS = [
  {
    id: 'manga-selection',
    title: '読んだことのある漫画を選択',
    description: '3-5作品を選んで、あなたの好みを教えてください',
    minSelection: 3,
    maxSelection: 5
  },
  {
    id: 'mood-selection',
    title: '今の気分を選択',
    description: 'どんな気分で漫画を読みたいですか？',
    minSelection: 1,
    maxSelection: 1
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [randomizedManga, setRandomizedManga] = useState<Manga[]>([]);
  const [onboardingData, setOnboardingData] = useState<SimplifiedOnboardingData>({
    selectedManga: [],
    selectedMood: MOOD_CATEGORIES[0] // デフォルトで最初の気分を選択
  });

  useEffect(() => {
    setIsMounted(true);
    trackPageView('/onboarding', 'Onboarding Page');
    
    // Randomize manga order and select only 20 items
    const shuffled = [...MOCK_MANGA].sort(() => Math.random() - 0.5);
    const selectedManga = shuffled.slice(0, 20);
    setRandomizedManga(selectedManga);
  }, []);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < SIMPLIFIED_ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      trackOnboardingStep(nextStep.toString(), { stepId: SIMPLIFIED_ONBOARDING_STEPS[nextStep].id });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      trackOnboardingStep(prevStep.toString(), { stepId: SIMPLIFIED_ONBOARDING_STEPS[prevStep].id });
    }
  };

  // Handle manga selection
  const handleMangaSelection = (selectedIds: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedManga: selectedIds
    }));
  };

  // Handle mood selection
  const handleMoodSelection = (mood: MoodType) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedMood: mood
    }));
  };


  // Finish onboarding
  const finishOnboarding = () => {
    if (typeof window !== 'undefined') {
      // Create SimplifiedUser object
      const simplifiedUser: SimplifiedUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        readHistory: onboardingData.selectedManga,
        selectedMood: onboardingData.selectedMood,
        recommendationHistory: []
      };
      
      localStorage.setItem('mangacompass_simplified_user', JSON.stringify(simplifiedUser));
      localStorage.setItem('mangacompass_onboarding_completed', 'true');
    }
    router.push('/dashboard');
  };

  // Validation functions
  const isCurrentStepValid = () => {
    const step = SIMPLIFIED_ONBOARDING_STEPS[currentStep];
    
    switch (step.id) {
      case 'manga-selection':
        return onboardingData.selectedManga.length >= step.minSelection && 
               onboardingData.selectedManga.length <= step.maxSelection;
      case 'mood-selection':
        return onboardingData.selectedMood !== undefined;
      default:
        return false;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center" role="status" aria-label="Loading">
          <BookOpen className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Setting up your preferences...</p>
        </div>
      </div>
    );
  }

  const currentStepData = SIMPLIFIED_ONBOARDING_STEPS[currentStep];
  const progressPercentage = ((currentStep + 1) / SIMPLIFIED_ONBOARDING_STEPS.length) * 100;

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
                Step {currentStep + 1} of {SIMPLIFIED_ONBOARDING_STEPS.length}
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
                  manga={randomizedManga}
                  selectedManga={onboardingData.selectedManga}
                  onSelectionChange={handleMangaSelection}
                  maxSelections={SIMPLIFIED_ONBOARDING_STEPS[0].maxSelection}
                  minSelections={SIMPLIFIED_ONBOARDING_STEPS[0].minSelection}
                />
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    選択数: {onboardingData.selectedManga.length} / {SIMPLIFIED_ONBOARDING_STEPS[0].maxSelection}
                    {onboardingData.selectedManga.length < SIMPLIFIED_ONBOARDING_STEPS[0].minSelection && 
                      ` (最低: ${SIMPLIFIED_ONBOARDING_STEPS[0].minSelection}作品)`}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <MoodSelector
                  selectedMood={onboardingData.selectedMood}
                  onMoodSelect={handleMoodSelection}
                  className="mb-6"
                />
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
              {SIMPLIFIED_ONBOARDING_STEPS.map((_, index) => (
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

            {currentStep === SIMPLIFIED_ONBOARDING_STEPS.length - 1 ? (
              <Button
                variant="primary"
                onClick={finishOnboarding}
                disabled={!isCurrentStepValid()}
                icon={Check}
                iconPosition="right"
              >
推薦を開始
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

      {/* Floating Next Button */}
      {currentStep === 0 && onboardingData.selectedManga.length >= 3 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            variant="primary"
            size="lg"
            onClick={goToNextStep}
            className="shadow-lg bg-blue-600 hover:bg-blue-700 px-8 py-3"
            icon={ArrowRight}
            iconPosition="right"
          >
            次へ ({onboardingData.selectedManga.length}作品選択済み)
          </Button>
        </div>
      )}
    </div>
  );
}