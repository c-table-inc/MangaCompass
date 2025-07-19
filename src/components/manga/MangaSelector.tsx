import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Manga } from '@/lib/types';
import { MangaCard } from './MangaCard';
import { Button } from '@/components/ui';

interface MangaSelectorProps {
  manga: Manga[];
  selectedManga: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  maxSelections?: number;
  minSelections?: number;
  title?: string;
  description?: string;
}

export const MangaSelector: React.FC<MangaSelectorProps> = ({
  manga,
  selectedManga,
  onSelectionChange,
  maxSelections,
  minSelections = 0,
  title = "Select Manga",
  description
}) => {

  const handleMangaToggle = (mangaId: string) => {
    const isSelected = selectedManga.includes(mangaId);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedManga.filter(id => id !== mangaId);
    } else {
      if (maxSelections && selectedManga.length >= maxSelections) {
        return; // Don't allow more selections
      }
      newSelection = [...selectedManga, mangaId];
    }

    onSelectionChange(newSelection);
  };

  const isSelectionValid = selectedManga.length >= minSelections && 
    (!maxSelections || selectedManga.length <= maxSelections);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        
        {/* Selection Counter */}
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>
            Selected: {selectedManga.length}
            {maxSelections && ` / ${maxSelections}`}
          </span>
          {minSelections > 0 && (
            <span>
              Minimum: {minSelections}
            </span>
          )}
        </div>
      </div>

      {/* Manga Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {manga.map((item) => {
          const isSelected = selectedManga.includes(item.id);
          const canSelect = !maxSelections || selectedManga.length < maxSelections || isSelected;

          return (
            <div
              key={item.id}
              className={`relative ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() => canSelect && handleMangaToggle(item.id)}
            >
              <MangaCard
                manga={item}
                showAmazonLink={false}
                showGenres={false}
              />
              
              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-600/20 rounded-lg border-2 border-blue-600 flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              
            </div>
          );
        })}
      </div>


      {/* Validation Message */}
      {!isSelectionValid && minSelections > 0 && (
        <div className="text-center">
          <p className="text-red-600 text-sm">
            Please select at least {minSelections} manga to continue.
          </p>
        </div>
      )}
    </div>
  );
};