import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, TrendingUp, Target, ExternalLink, BookOpen } from 'lucide-react';
import { Recommendation } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';
import { getAmazonImageUrls } from '@/utils/affiliate';

interface RecommendationCardProps {
  recommendation: Recommendation;
  showFactors?: boolean;
  showAmazonLink?: boolean;
  variant?: 'default' | 'compact';
}

const RecommendationCardComponent: React.FC<RecommendationCardProps> = ({
  recommendation,
  showFactors = true,
  showAmazonLink = true,
  variant = 'default'
}) => {
  const { manga, score, reason, matchPercentage, factors } = recommendation;
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Amazon画像URLの複数パターンを取得
  const getImageUrls = () => {
    if (manga.asin) {
      const amazonUrls = getAmazonImageUrls(manga.asin, 'L');
      return manga.coverImage ? [...amazonUrls, manga.coverImage] : amazonUrls;
    }
    return manga.coverImage ? [manga.coverImage] : [];
  };

  const imageUrls = getImageUrls();
  const currentImageUrl = imageUrls[currentImageIndex];

  // 画像エラー時に次のURLを試す
  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return 'success';
    if (match >= 60) return 'primary';
    if (match >= 40) return 'warning';
    return 'error';
  };

  if (variant === 'compact') {
    return (
      <Card variant="outline" padding="sm" className="flex items-center space-x-3">
        {/* Cover Image */}
        <div className="relative w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
          {currentImageUrl && !imageError ? (
            <Image
              src={currentImageUrl}
              alt={`${manga.title} cover`}
              fill
              className="object-cover rounded"
              sizes="64px"
              onError={handleImageError}
              loading="lazy"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">{manga.title}</h4>
          <p className="text-xs text-gray-600 truncate">{manga.author}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={getMatchColor(matchPercentage)} size="sm">
              {matchPercentage}% match
            </Badge>
            <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score)}`}>
              {score}/100
            </div>
          </div>
        </div>

        {/* Amazon Link */}
        {showAmazonLink && (
          <Link 
            href={manga.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" icon={ExternalLink} />
          </Link>
        )}
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {/* Header with Score */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(score)}`}>
            {score}/100
          </div>
        </div>
        
        {/* Cover Image */}
        <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
          {currentImageUrl && !imageError ? (
            <Image
              src={currentImageUrl}
              alt={`${manga.title} cover`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              loading="lazy"
              unoptimized={true}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 text-center px-2 line-clamp-2">{manga.title}</p>
            </div>
          )}
          
          {/* Match Percentage Overlay */}
          <div className="absolute bottom-3 left-3">
            <Badge variant={getMatchColor(matchPercentage)} size="md">
              <Target className="h-3 w-3 mr-1" />
              {matchPercentage}% match
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Author */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{manga.title}</h3>
          <p className="text-sm text-gray-600">{manga.author}</p>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{manga.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>{manga.popularity}% popularity</span>
          </div>
        </div>

        {/* Genres */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {manga.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" size="sm">
                {genre}
              </Badge>
            ))}
            {manga.genres.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{manga.genres.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Recommendation Reason */}
        <div className="mb-3">
          <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-400">
            <strong>Why recommended:</strong> {reason}
          </p>
        </div>

        {/* Recommendation Factors */}
        {showFactors && (
          <div className="mb-3 space-y-1">
            <h4 className="text-xs font-medium text-gray-900">Match Factors:</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex justify-between">
                <span>Genre Match:</span>
                <span className="font-medium">{factors.genreMatch}%</span>
              </div>
              <div className="flex justify-between">
                <span>Rating Score:</span>
                <span className="font-medium">{factors.ratingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Popularity:</span>
                <span className="font-medium">{factors.popularityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Status Match:</span>
                <span className="font-medium">{factors.statusMatch}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Amazon Link */}
        {showAmazonLink && (
          <Link 
            href={manga.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              variant="primary" 
              size="md" 
              fullWidth 
              icon={ExternalLink}
              iconPosition="right"
            >
              View on Amazon
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

RecommendationCardComponent.displayName = 'RecommendationCard';

export const RecommendationCard = React.memo(RecommendationCardComponent);