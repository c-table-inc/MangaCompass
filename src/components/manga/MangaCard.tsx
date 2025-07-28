import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, ExternalLink } from 'lucide-react';
import { Manga } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';
import { generateAmazonImageUrl, getAmazonImageUrls } from '@/utils/affiliate';

interface MangaCardProps {
  manga: Manga;
  showDescription?: boolean;
  showAmazonLink?: boolean;
  showGenres?: boolean;
  onClick?: () => void;
}

const MangaCardComponent: React.FC<MangaCardProps> = ({
  manga,
  showDescription = false,
  showAmazonLink = true,
  showGenres = true,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 画像URLの優先順位: imageUrl > coverImage > Amazon生成URL
  const getImageUrls = () => {
    const urls = [];
    
    // 最優先: imageUrl (新しく追加された画像URL)
    if (manga.imageUrl) {
      urls.push(manga.imageUrl);
    }
    
    // 次優先: coverImage (既存の表紙画像)
    if (manga.coverImage) {
      urls.push(manga.coverImage);
    }
    
    // 最後の手段: Amazon生成URL
    if (manga.asin) {
      const amazonUrls = getAmazonImageUrls(manga.asin, 'L');
      urls.push(...amazonUrls);
    }
    
    return urls;
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
      <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
        {currentImageUrl && !imageError ? (
          <Image
            src={currentImageUrl}
            alt={`${manga.title} cover`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            onError={handleImageError}
            loading="lazy"
            unoptimized={true}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <BookOpen className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 text-center px-2 line-clamp-2">{manga.title}</p>
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
        {showGenres && (
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
        )}

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

MangaCardComponent.displayName = 'MangaCard';

export const MangaCard = React.memo(MangaCardComponent);