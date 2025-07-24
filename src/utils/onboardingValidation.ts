/**
 * Validation utilities for the onboarding process
 */

import { OnboardingData } from '@/lib/types';

export const validateMangaSelection = (selectedManga: string[], minSelection: number, maxSelection: number): {
  isValid: boolean;
  error?: string;
} => {
  if (selectedManga.length < minSelection) {
    return {
      isValid: false,
      error: `Please select at least ${minSelection} manga titles`
    };
  }
  
  if (selectedManga.length > maxSelection) {
    return {
      isValid: false,
      error: `Please select no more than ${maxSelection} manga titles`
    };
  }
  
  return { isValid: true };
};

export const validateGenreSelection = (favoriteGenres: string[], minSelection: number, maxSelection: number): {
  isValid: boolean;
  error?: string;
} => {
  if (favoriteGenres.length < minSelection) {
    return {
      isValid: false,
      error: `Please select at least ${minSelection} genre`
    };
  }
  
  if (favoriteGenres.length > maxSelection) {
    return {
      isValid: false,
      error: `Please select no more than ${maxSelection} genres`
    };
  }
  
  return { isValid: true };
};

export const canProceedToNextStep = (
  currentStep: number,
  onboardingData: OnboardingData,
  stepRequirements: Array<{ minSelection: number; maxSelection: number }>
): boolean => {
  switch (currentStep) {
    case 0: // Manga selection
      const mangaValidation = validateMangaSelection(
        onboardingData.selectedManga,
        stepRequirements[0].minSelection,
        stepRequirements[0].maxSelection
      );
      return mangaValidation.isValid;
      
    case 1: // Genre preferences
      const genreValidation = validateGenreSelection(
        onboardingData.favoriteGenres,
        stepRequirements[1].minSelection,
        stepRequirements[1].maxSelection
      );
      return genreValidation.isValid;
      
    case 2: // Preferences (optional step)
      return true;
      
    default:
      return false;
  }
};