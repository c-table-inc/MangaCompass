import { Manga, User, Recommendation, RecommendationFactors, MANGA_GENRES } from './types';
import { MOCK_MANGA } from './mockData';

export class RecommendationEngine {
  private readonly WEIGHTS = {
    GENRE_MATCH: 0.4,      // ジャンル一致: 40%
    RATING: 0.3,           // 評価: 30%
    POPULARITY: 0.2,       // 人気度: 20%
    STATUS_MATCH: 0.1      // ステータス一致: 10%
  };

  private readonly MIN_SCORE_THRESHOLD = 30; // 最低推薦スコア

  /**
   * ユーザーに基づいて漫画を推薦する
   */
  generateRecommendations(
    user: User,
    excludeRead: boolean = true,
    maxResults: number = 10
  ): Recommendation[] {
    const candidates = excludeRead 
      ? MOCK_MANGA.filter(manga => !user.readHistory.includes(manga.id))
      : MOCK_MANGA;

    const recommendations = candidates
      .map(manga => this.calculateRecommendationScore(manga, user))
      .filter(rec => rec.score >= this.MIN_SCORE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    return recommendations;
  }

  /**
   * 特定の漫画に対する推薦スコアを計算
   */
  private calculateRecommendationScore(manga: Manga, user: User): Recommendation {
    const factors = this.calculateFactors(manga, user);
    
    const score = Math.round(
      factors.genreMatch * this.WEIGHTS.GENRE_MATCH +
      factors.ratingScore * this.WEIGHTS.RATING +
      factors.popularityScore * this.WEIGHTS.POPULARITY +
      factors.statusMatch * this.WEIGHTS.STATUS_MATCH
    );

    const matchPercentage = Math.round(
      (factors.genreMatch + factors.ratingScore + factors.popularityScore + factors.statusMatch) / 4
    );

    return {
      manga,
      score: Math.min(100, Math.max(0, score)), // 0-100の範囲に制限
      reason: this.generateRecommendationReason(manga, factors, user),
      matchPercentage,
      factors
    };
  }

  /**
   * 推薦要因の詳細スコアを計算
   */
  private calculateFactors(manga: Manga, user: User): RecommendationFactors {
    return {
      genreMatch: this.calculateGenreMatch(manga, user),
      ratingScore: this.calculateRatingScore(manga, user),
      popularityScore: this.calculatePopularityScore(manga),
      statusMatch: this.calculateStatusMatch(manga, user)
    };
  }

  /**
   * ジャンル一致スコア (0-100)
   */
  private calculateGenreMatch(manga: Manga, user: User): number {
    if (user.favoriteGenres.length === 0) return 50; // デフォルトスコア

    const commonGenres = manga.genres.filter(genre => 
      user.favoriteGenres.includes(genre)
    );
    
    if (commonGenres.length === 0) return 10; // 一致するジャンルがない場合

    // 一致したジャンル数に基づくスコア + ユーザーの除外ジャンルペナルティ
    const matchRatio = commonGenres.length / user.favoriteGenres.length;
    const baseScore = Math.min(100, 40 + matchRatio * 60);

    // 除外ジャンルがある場合のペナルティ
    const excludedGenres = manga.genres.filter(genre => 
      user.preferences.excludeGenres?.includes(genre) || false
    );
    const penalty = excludedGenres.length * 20;

    return Math.max(0, Math.round(baseScore - penalty));
  }

  /**
   * 評価スコア (0-100)
   */
  private calculateRatingScore(manga: Manga, user: User): number {
    const minRating = user.preferences.minRating || 0;
    
    if (manga.rating < minRating) return 0; // 最低評価基準を満たさない

    // 評価を0-100スケールに変換 (5.0満点 -> 100点満点)
    const normalizedRating = (manga.rating / 5.0) * 100;
    
    // 高評価作品により高いスコアを付与
    return Math.round(normalizedRating);
  }

  /**
   * 人気度スコア (0-100)
   */
  private calculatePopularityScore(manga: Manga): number {
    // 人気度を0-100スケールに変換
    return Math.round((manga.popularity / 100) * 100);
  }

  /**
   * ステータス一致スコア (0-100)
   */
  private calculateStatusMatch(manga: Manga, user: User): number {
    const preferredStatus = user.preferences.preferredStatus;
    
    if (!preferredStatus || preferredStatus.length === 0) return 50; // デフォルト

    if (preferredStatus.includes(manga.status)) {
      return 100; // 完全一致
    }

    // 部分的な一致ロジック
    if (preferredStatus.includes('ongoing') && manga.status === 'completed') {
      return 70; // 継続中を好むが完結作品も許容
    }
    
    if (preferredStatus.includes('completed') && manga.status === 'ongoing') {
      return 30; // 完結を好むが継続中は低評価
    }

    return 20; // 一致しない場合
  }

  /**
   * 推薦理由のテキストを生成
   */
  private generateRecommendationReason(
    manga: Manga, 
    factors: RecommendationFactors, 
    user: User
  ): string {
    const reasons: string[] = [];

    // ジャンル一致
    if (factors.genreMatch >= 70) {
      const commonGenres = manga.genres.filter(genre => 
        user.favoriteGenres.includes(genre)
      );
      if (commonGenres.length > 0) {
        reasons.push(`好きなジャンル「${commonGenres.slice(0, 2).join('、')}」と一致`);
      }
    }

    // 高評価
    if (factors.ratingScore >= 80) {
      reasons.push(`高評価作品（★${manga.rating.toFixed(1)}）`);
    }

    // 人気作品
    if (factors.popularityScore >= 80) {
      reasons.push('人気の高い作品');
    }

    // ステータス一致
    if (factors.statusMatch >= 90) {
      const statusText = manga.status === 'completed' ? '完結済み' : '連載中';
      reasons.push(`${statusText}作品を希望`);
    }

    // 特別な推薦理由
    if (manga.volumes >= 20) {
      reasons.push('長期シリーズ');
    }

    // 作品が新しい場合（ID番号で判定 - 実際の実装では出版年を使用）
    if (parseInt(manga.id) > 40) {
      reasons.push('最新作品');
    }

    if (reasons.length === 0) {
      reasons.push('あなたの好みに合いそうな作品');
    }

    return reasons.slice(0, 3).join('、'); // 最大3つの理由
  }

  /**
   * ジャンル別おすすめ漫画を取得
   */
  getRecommendationsByGenre(
    genre: string, 
    user?: User, 
    maxResults: number = 5
  ): Recommendation[] {
    const mangaInGenre = MOCK_MANGA.filter(manga => 
      manga.genres.includes(genre)
    );

    if (!user) {
      // ユーザー情報がない場合は評価順
      return mangaInGenre
        .sort((a, b) => b.rating - a.rating)
        .slice(0, maxResults)
        .map(manga => ({
          manga,
          score: Math.round(manga.rating * 20), // 評価ベーススコア
          reason: `${genre}ジャンルの高評価作品`,
          matchPercentage: Math.round(manga.rating * 20),
          factors: {
            genreMatch: 100,
            ratingScore: Math.round(manga.rating * 20),
            popularityScore: manga.popularity,
            statusMatch: 50
          }
        }));
    }

    // ユーザー情報がある場合は通常の推薦ロジック
    return mangaInGenre
      .map(manga => this.calculateRecommendationScore(manga, user))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  /**
   * 類似漫画を検索
   */
  findSimilarManga(
    targetManga: Manga, 
    user?: User, 
    maxResults: number = 5
  ): Recommendation[] {
    const candidates = MOCK_MANGA.filter(manga => manga.id !== targetManga.id);

    const similarities = candidates.map(manga => {
      const genreSimilarity = this.calculateGenreSimilarity(targetManga, manga);
      const ratingSimilarity = this.calculateRatingSimilarity(targetManga, manga);
      const authorSimilarity = manga.author === targetManga.author ? 50 : 0;
      
      const similarityScore = Math.round(
        genreSimilarity * 0.6 + 
        ratingSimilarity * 0.3 + 
        authorSimilarity * 0.1
      );

      return {
        manga,
        score: similarityScore,
        reason: this.generateSimilarityReason(targetManga, manga),
        matchPercentage: similarityScore,
        factors: {
          genreMatch: genreSimilarity,
          ratingScore: ratingSimilarity,
          popularityScore: manga.popularity,
          statusMatch: manga.status === targetManga.status ? 100 : 0
        }
      };
    });

    return similarities
      .filter(sim => sim.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  /**
   * ジャンル類似度を計算
   */
  private calculateGenreSimilarity(manga1: Manga, manga2: Manga): number {
    const commonGenres = manga1.genres.filter(genre => 
      manga2.genres.includes(genre)
    );
    const totalGenres = new Set([...manga1.genres, ...manga2.genres]).size;
    
    return Math.round((commonGenres.length / totalGenres) * 100);
  }

  /**
   * 評価類似度を計算
   */
  private calculateRatingSimilarity(manga1: Manga, manga2: Manga): number {
    const ratingDiff = Math.abs(manga1.rating - manga2.rating);
    return Math.round(Math.max(0, (1 - ratingDiff / 5) * 100));
  }

  /**
   * 類似性の理由を生成
   */
  private generateSimilarityReason(targetManga: Manga, similarManga: Manga): string {
    const reasons: string[] = [];

    const commonGenres = targetManga.genres.filter(genre => 
      similarManga.genres.includes(genre)
    );

    if (commonGenres.length > 0) {
      reasons.push(`同じジャンル（${commonGenres.slice(0, 2).join('、')}）`);
    }

    if (targetManga.author === similarManga.author) {
      reasons.push('同じ作者');
    }

    const ratingDiff = Math.abs(targetManga.rating - similarManga.rating);
    if (ratingDiff <= 0.5) {
      reasons.push('同程度の評価');
    }

    if (reasons.length === 0) {
      reasons.push('類似した作品');
    }

    return `「${targetManga.title}」に似た作品：${reasons.join('、')}`;
  }
}

// シングルトンインスタンス
export const recommendationEngine = new RecommendationEngine();

// ヘルパー関数
export const generateUserRecommendations = (
  user: User, 
  maxResults: number = 10
): Recommendation[] => {
  return recommendationEngine.generateRecommendations(user, true, maxResults);
};

export const getGenreRecommendations = (
  genre: string, 
  user?: User, 
  maxResults: number = 5
): Recommendation[] => {
  return recommendationEngine.getRecommendationsByGenre(genre, user, maxResults);
};

export const getSimilarManga = (
  manga: Manga, 
  user?: User, 
  maxResults: number = 5
): Recommendation[] => {
  return recommendationEngine.findSimilarManga(manga, user, maxResults);
};