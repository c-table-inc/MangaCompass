import React from 'react';
import { Manga } from '@/lib/types';
import { MangaCard } from './MangaCard';

interface MangaGridProps {
  manga: Manga[];
  showDescription?: boolean;
  showAmazonLink?: boolean;
  onMangaClick?: (manga: Manga) => void;
  className?: string;
}

export const MangaGrid: React.FC<MangaGridProps> = ({
  manga,
  showDescription = false,
  showAmazonLink = true,
  onMangaClick,
  className = ''
}) => {
  if (manga.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No manga found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or preferences.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}>
      {manga.map((item) => (
        <MangaCard
          key={item.id}
          manga={item}
          showDescription={showDescription}
          showAmazonLink={showAmazonLink}
          onClick={onMangaClick ? () => onMangaClick(item) : undefined}
        />
      ))}
    </div>
  );
};