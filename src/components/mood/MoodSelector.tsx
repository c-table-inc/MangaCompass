'use client';

import React from 'react';
import { MoodType, MOOD_CATEGORIES } from '@/lib/types';
import { Card } from '@/components/ui/Card';

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
  className?: string;
}

interface MoodCardProps {
  mood: MoodType;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const MoodCard: React.FC<MoodCardProps> = ({ 
  mood, 
  selected, 
  onClick, 
  disabled = false 
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      variant="outline"
      padding="sm"
      hover={!disabled}
      className={`
        relative cursor-pointer transition-all duration-300 ease-in-out
        h-24 md:h-28 lg:h-32
        ${selected 
          ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg transform scale-105' 
          : 'hover:scale-105 hover:shadow-md'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${!selected ? 'hover:bg-gray-50' : ''}
      `}
      style={selected ? {
        backgroundColor: `${mood.color}15`,
        borderColor: mood.color
      } : {}}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        {/* 絵文字 */}
        <div 
          className={`
            text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-2 
            transition-transform duration-200
            ${selected ? 'transform scale-110' : ''}
          `}
        >
          {mood.emoji}
        </div>
        
        {/* タイトル */}
        <h3 
          className={`
            text-xs md:text-sm lg:text-base font-semibold mb-1 
            transition-colors duration-200
            ${selected ? 'text-gray-900' : 'text-gray-700'}
          `}
        >
          {mood.name}
        </h3>
        
        {/* 説明文 */}
        <p 
          className={`
            text-xs md:text-xs lg:text-sm leading-tight
            transition-colors duration-200
            ${selected ? 'text-gray-700' : 'text-gray-500'}
          `}
        >
          {mood.description}
        </p>
      </div>

      {/* 選択状態インジケーター */}
      {selected && (
        <div 
          className="absolute top-2 right-2 w-3 h-3 rounded-full"
          style={{ backgroundColor: mood.color }}
        >
          <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* グリッドコンテナ */}
      <div 
        className="
          grid grid-cols-2 gap-3 md:gap-4 lg:gap-6
          sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4
          max-w-4xl mx-auto
        "
        role="radiogroup"
        aria-label="気分を選択してください"
      >
        {MOOD_CATEGORIES.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            selected={selectedMood?.id === mood.id}
            onClick={() => onMoodSelect(mood)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* 選択状態の説明 */}
      {selectedMood && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border-l-4 max-w-4xl mx-auto"
             style={{ borderLeftColor: selectedMood.color }}>
          <div className="flex items-start">
            <div className="text-2xl mr-3">{selectedMood.emoji}</div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedMood.name}
              </h4>
              <p className="text-gray-600 text-sm">
                {selectedMood.description}
              </p>
              
              {/* 関連ジャンル表示 */}
              <div className="mt-2">
                <span className="text-xs text-gray-500">関連ジャンル: </span>
                <span className="text-xs text-gray-700">
                  {Object.entries(selectedMood.genreWeights)
                    .filter(([_, weight]) => weight >= 0.7)
                    .map(([genre, _]) => genre)
                    .join(', ')
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アクセシビリティ用の隠しテキスト */}
      <div className="sr-only" aria-live="polite">
        {selectedMood 
          ? `${selectedMood.name}が選択されています: ${selectedMood.description}`
          : '気分が選択されていません'
        }
      </div>
    </div>
  );
};

// プリセット気分選択用のヘルパーコンポーネント
interface QuickMoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
  limit?: number;
}

export const QuickMoodSelector: React.FC<QuickMoodSelectorProps> = ({
  onMoodSelect,
  disabled = false,
  limit = 4
}) => {
  // 人気の気分を抽出
  const popularMoods = MOOD_CATEGORIES.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {popularMoods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood)}
          disabled={disabled}
          className={`
            px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
            flex items-center space-x-2
            ${disabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' 
              : 'bg-white border border-gray-300 text-gray-700 hover:scale-105 hover:shadow-md'
            }
          `}
          style={!disabled ? {
            borderColor: mood.color,
            color: mood.color
          } : {}}
        >
          <span>{mood.emoji}</span>
          <span>{mood.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;