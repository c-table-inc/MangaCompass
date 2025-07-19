import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, ExternalLink } from 'lucide-react';
import { Manga } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';

interface MangaCardProps {
  manga: Manga;
  showDescription?: boolean;
  showAmazonLink?: boolean;
  onClick?: () => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  showDescription = false,
  showAmazonLink = true,
  onClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'primary';
      case 'hiatus':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'hiatus':
        return 'Hiatus';
      default:
        return status;
    }
  };

  return (
    <Card 
      variant="elevated" 
      padding="none" 
      hover={!!onClick}
      onClick={onClick}
      className="overflow-hidden h-full flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-gray-200">
        {manga.coverImage ? (
          <Image
            src={manga.coverImage}
            alt={`${manga.title} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={getStatusColor(manga.status)} size="sm">
            {getStatusText(manga.status)}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-md px-2 py-1">
          <div className="flex items-center space-x-1 text-white text-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{manga.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Author */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
            {manga.title}
          </h3>
          <p className="text-xs text-gray-600">{manga.author}</p>
        </div>

        {/* Genres */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {manga.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" size="sm" className="text-xs">
                {genre}
              </Badge>
            ))}
            {manga.genres.length > 3 && (
              <Badge variant="secondary" size="sm" className="text-xs">
                +{manga.genres.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Volume Count */}
        <div className="mb-3 text-xs text-gray-600">
          {manga.volumes} volume{manga.volumes !== 1 ? 's' : ''}
        </div>

        {/* Description */}
        {showDescription && manga.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 flex-1">
            {manga.description}
          </p>
        )}

        {/* Amazon Link */}
        {showAmazonLink && (
          <div className="mt-auto">
            <Link 
              href={manga.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth 
                icon={ExternalLink}
                iconPosition="right"
              >
                View on Amazon
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};