'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Star, 
  Target, 
  ExternalLink, 
  BookOpen, 
  RefreshCw, 
  ArrowLeft, 
  Heart,
  TrendingUp
} from 'lucide-react';
import { SingleRecommendation as SingleRecommendationType } from '@/lib/types';
import { Card, Badge, Button } from '@/components/ui';
import { getAmazonImageUrls } from '@/utils/affiliate';

interface SingleRecommendationProps {
  recommendation: SingleRecommendationType;
  onAmazonClick: () => void;
  onTryAgain: () => void;
  onChangeMood: () => void;
  onStartOver: () => void;
}

interface MatchPercentageBarProps {
  percentage: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  alternativeCount: number;
}

const MatchPercentageBar: React.FC<MatchPercentageBarProps> = ({ 
  percentage, 
  confidenceLevel,
  alternativeCount
}) => {
  const getColorClass = () => {
    if (confidenceLevel === 'high') return 'bg-green-500';
    if (confidenceLevel === 'medium') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Match</span>
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          Confidence: {confidenceLevel === 'high' ? 'High' : confidenceLevel === 'medium' ? 'Medium' : 'Low'}
        </span>
        <span className="text-xs text-gray-500">
          Selected from {alternativeCount} candidates
        </span>
      </div>
    </div>
  );
};

export const SingleRecommendation: React.FC<SingleRecommendationProps> = ({
  recommendation,
  onAmazonClick,
  onTryAgain,
  onChangeMood,
  onStartOver
}) => {
  const { manga, mood, score, reason, matchPercentage, confidenceLevel } = recommendation;
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 画像URLの優先順位: imageUrl > coverImage > Amazon生成URL
  const getImageUrls = () => {
    const urls = [];
    
    if (manga.imageUrl) {
      urls.push(manga.imageUrl);
    }
    
    if (manga.coverImage) {
      urls.push(manga.coverImage);
    }
    
    if (manga.asin) {
      const amazonUrls = getAmazonImageUrls(manga.asin, 'L');
      urls.push(...amazonUrls);
    }
    
    return urls;
  };

  const imageUrls = getImageUrls();
  const currentImageUrl = imageUrls[currentImageIndex];

  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* ヒーロー表示エリア */}
      <div className="relative pt-6 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 気分表示 */}
          <div className="text-center mb-6">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${mood.color}15`, color: mood.color }}
            >
              <span className="text-lg mr-2">{mood.emoji}</span>
              Perfect for {mood.name} mood
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 画像エリア */}
            <div className="flex justify-center">
              <div className="relative w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[480px] bg-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                {currentImageUrl && !imageError ? (
                  <Image
                    src={currentImageUrl}
                    alt={`${manga.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                    onError={handleImageError}
                    loading="eager"
                    unoptimized={true}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500 text-center px-4 line-clamp-3">{manga.title}</p>
                  </div>
                )}
                
                {/* スコア表示 */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-gray-900">{score}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 情報エリア */}
            <div className="space-y-6">
              {/* タイトルと基本情報 */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                  {manga.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{manga.author}</p>
                
                {/* 評価と人気度 */}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{manga.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">/ 10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-semibold">{manga.popularity}%</span>
                    <span className="text-sm text-gray-500">Popular</span>
                  </div>
                </div>

                {/* ジャンル */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {manga.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" size="md">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 推薦理由 */}
              <Card variant="outline" padding="md" className="bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Why is this recommended?</h3>
                    <p className="text-blue-800 leading-relaxed">{reason}</p>
                  </div>
                </div>
              </Card>

              {/* 適合度バー */}
              <MatchPercentageBar 
                percentage={matchPercentage}
                confidenceLevel={confidenceLevel}
                alternativeCount={recommendation.alternativeCount}
              />

              {/* ステータス情報 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <Badge 
                    variant={manga.status === 'completed' ? 'success' : 'primary'} 
                    size="sm" 
                    className="ml-2"
                  >
                    {manga.status === 'completed' ? 'Completed' : 
                     manga.status === 'ongoing' ? 'Ongoing' : manga.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-gray-500">Volumes:</span>
                  <span className="ml-2 font-medium">{manga.volumes} vols</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタンエリア - PC: インライン表示、モバイル: 固定表示 */}
      
      {/* PC用アクションエリア（lg以上で表示） */}
      <div className="hidden lg:block">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How about this title?</h3>
              <p className="text-gray-600">If you like it, you can start reading right away</p>
            </div>
            
            <div className="space-y-4">
              {/* メインCTA - Amazon */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={ExternalLink}
                iconPosition="right"
                onClick={onAmazonClick}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-5 text-lg"
              >
                Buy on Amazon
              </Button>
              
              {/* サブアクション */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={RefreshCw}
                  onClick={onTryAgain}
                  className="py-4"
                >
                  See Other Titles
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={ArrowLeft}
                  onClick={onChangeMood}
                  className="py-4"
                >
                  Change Mood
                </Button>
              </div>
              
              {/* 追加オプション */}
              <div className="text-center pt-4 border-t border-gray-100">
                <button
                  onClick={onStartOver}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* モバイル用固定アクションエリア（lg未満で表示） */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-4">
          <div className="space-y-3">
            {/* メインCTA - Amazon */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={ExternalLink}
              iconPosition="right"
              onClick={onAmazonClick}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4"
            >
              Buy on Amazon
            </Button>
            
            {/* サブアクション */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={RefreshCw}
                onClick={onTryAgain}
                className="py-3"
              >
                Other Titles
              </Button>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                icon={ArrowLeft}
                onClick={onChangeMood}
                className="py-3"
              >
                Change Mood
              </Button>
            </div>
          </div>

          {/* 追加オプション */}
          <div className="text-center mt-3">
            <button
              onClick={onStartOver}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>

      {/* モバイル用底面の余白（固定ボタンのため） */}
      <div className="lg:hidden h-40"></div>
    </div>
  );
};

export default SingleRecommendation;