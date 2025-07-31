'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MOCK_MANGA } from '@/lib/mockData';

interface MangaCoverBackgroundProps {
  count?: number;
  className?: string;
  children: React.ReactNode;
}

interface FloatingCover {
  id: string;
  imageUrl: string;
  title: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  animationDelay: number;
  animationDuration: number;
}

export const MangaCoverBackground: React.FC<MangaCoverBackgroundProps> = ({
  count = 20,
  className = '',
  children
}) => {
  const [floatingCovers, setFloatingCovers] = useState<FloatingCover[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Filter manga with valid image URLs
    const validManga = MOCK_MANGA.filter(manga => manga.imageUrl && manga.imageUrl.trim() !== '');
    
    if (validManga.length === 0) return;

    // Generate random positions and properties for floating covers
    const covers: FloatingCover[] = [];
    for (let i = 0; i < count; i++) {
      const randomManga = validManga[Math.floor(Math.random() * validManga.length)];
      if (!randomManga.imageUrl) continue; // Additional safety check
      
      covers.push({
        id: `${randomManga.id}-${i}`,
        imageUrl: randomManga.imageUrl,
        title: randomManga.title,
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        rotation: Math.random() * 360 - 180, // -180 to 180 degrees
        scale: 0.4 + Math.random() * 0.6, // 0.4 to 1.0
        animationDelay: Math.random() * 10, // 0-10s
        animationDuration: 20 + Math.random() * 20, // 20-40s
      });
    }
    
    setFloatingCovers(covers);
  }, [count]);

  if (!isMounted) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating manga covers background */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingCovers.map((cover) => (
          <div
            key={cover.id}
            className="absolute opacity-25 hover:opacity-35 transition-opacity duration-1000"
            style={{
              left: `${cover.x}%`,
              top: `${cover.y}%`,
              transform: `translate(-50%, -50%) rotate(${cover.rotation}deg) scale(${cover.scale})`,
              animation: `float-manga ${cover.animationDuration}s linear infinite`,
              animationDelay: `${cover.animationDelay}s`,
            }}
          >
            <div className="w-28 h-36 md:w-36 md:h-48 lg:w-44 lg:h-60 relative">
              <Image
                src={cover.imageUrl}
                alt={cover.title}
                fill
                className="object-cover rounded-lg shadow-lg"
                sizes="(max-width: 768px) 112px, (max-width: 1024px) 144px, 176px"
                unoptimized={true}
                loading="lazy"
                onError={(e) => {
                  // Hide the image if it fails to load
                  const target = e.target as HTMLElement;
                  if (target.parentElement) {
                    target.parentElement.style.display = 'none';
                  }
                }}
              />
            </div>
          </div>
        ))}
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-blue-50/40 to-indigo-100/60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Global CSS for floating animation */}
      <style jsx global>{`
        @keyframes float-manga {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translate(-50%, -50%) translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          75% {
            transform: translate(-50%, -50%) translateY(10px) rotate(-2deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
        }
        
        .manga-cover-background {
          position: relative;
        }
        
        .manga-cover-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default MangaCoverBackground;