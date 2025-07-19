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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredManga = manga.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

      {/* Search */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search manga, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Manga Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredManga.map((item) => {
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
              />
              
              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-600/20 rounded-lg border-2 border-blue-600 flex items-center justify-center">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              
              {/* Selection Button */}
              <div className="absolute bottom-2 left-2 right-2">
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  fullWidth
                  disabled={!canSelect}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredManga.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No manga found matching "{searchTerm}"</p>
        </div>
      )}

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