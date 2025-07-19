import React from 'react';
import { Recommendation } from '@/lib/types';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationGridProps {
  recommendations: Recommendation[];
  showFactors?: boolean;
  showAmazonLink?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({
  recommendations,
  showFactors = true,
  showAmazonLink = true,
  variant = 'default',
  className = ''
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
        <p className="text-gray-600">Complete your onboarding to get personalized manga recommendations.</p>
      </div>
    );
  }

  const gridClass = variant === 'compact' 
    ? 'space-y-3'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

  return (
    <div className={`${gridClass} ${className}`}>
      {recommendations.map((recommendation, index) => (
        <RecommendationCard
          key={`${recommendation.manga.id}-${index}`}
          recommendation={recommendation}
          showFactors={showFactors}
          showAmazonLink={showAmazonLink}
          variant={variant}
        />
      ))}
    </div>
  );
};