import { 
  Manga, 
  MoodType, 
  SimplifiedUser, 
  SingleRecommendation, 
  RecommendationRecord 
} from './types';
import { MOCK_MANGA } from './mockData';
import { moodMapper } from '@/utils/moodMapping';

/**
 * 気分ベース推薦エンジン
 * 単一の最適な推薦を生成するシステム
 */
export class MoodBasedRecommendationEngine {
  private readonly WEIGHTS = {
    BASE_COMPATIBILITY: 0.5,    // 基本適性: 50%
    MOOD_MATCH: 0.3,            // 気分マッチ: 30%
    RATING_BONUS: 0.15,         // 評価: 15%
    FRESHNESS_BONUS: 0.05       // 新鮮度: 5%
  };

  private readonly MIN_CONFIDENCE_THRESHOLD = 0.6; // 最低信頼度
  private readonly ALTERNATIVES_SAMPLE_SIZE = 20;   // 代替候補のサンプル数

  /**
   * 単一の最適推薦を生成
   */
  generateSingleRecommendation(
    user: SimplifiedUser, 
    mood: MoodType
  ): SingleRecommendation {
    // 読んだことのない作品で気分にマッチするものを抽出
    const candidates = this.getCandidates(user, mood);
    
    if (candidates.length === 0) {
      throw new Error('推薦可能な作品が見つかりませんでした');
    }

    // 各候補のスコアを計算
    const scoredCandidates = candidates.map(manga => ({
      manga,
      score: this.calculateMoodScore(manga, user, mood)
    }))
    .sort((a, b) => b.score - a.score);

    const bestManga = scoredCandidates[0];
    const confidenceLevel = this.calculateConfidenceLevel(
      bestManga.score, 
      scoredCandidates.length
    );

    // 推薦理由を生成
    const reason = moodMapper.generateMoodReason(
      bestManga.manga, 
      mood, 
      bestManga.score
    );

    return {
      manga: bestManga.manga,
      mood,
      score: Math.round(bestManga.score * 100),
      reason,
      matchPercentage: Math.round(bestManga.score * 100),
      confidenceLevel,
      alternativeCount: Math.max(0, scoredCandidates.length - 1)
    };
  }

  /**
   * 気分ベースのスコアリング
   * 最終スコア = 基本適性(50%) + 気分マッチ(30%) + 評価(15%) + 新鮮度(5%)
   */
  calculateMoodScore(
    manga: Manga, 
    user: SimplifiedUser, 
    mood: MoodType
  ): number {
    const baseCompatibility = this.calculateBaseCompatibility(manga, user);
    const moodMatch = this.calculateMoodMatch(manga, mood, user);
    const ratingBonus = this.calculateRatingBonus(manga);
    const freshnessBonus = this.calculateFreshnessBonus(manga, user.recommendationHistory);

    const finalScore = 
      baseCompatibility * this.WEIGHTS.BASE_COMPATIBILITY +
      moodMatch * this.WEIGHTS.MOOD_MATCH +
      ratingBonus * this.WEIGHTS.RATING_BONUS +
      freshnessBonus * this.WEIGHTS.FRESHNESS_BONUS;

    return Math.min(1.0, Math.max(0.0, finalScore));
  }

  /**
   * 基本適性計算
   * 基本適性 = 読書履歴との ジャンル一致度 × 0.7 + 作者一致度 × 0.3
   */
  private calculateBaseCompatibility(manga: Manga, user: SimplifiedUser): number {
    if (user.readHistory.length === 0) {
      return 0.5; // デフォルト値
    }

    // 読書履歴から漫画オブジェクトを取得
    const readManga = MOCK_MANGA.filter(m => user.readHistory.includes(m.id));
    
    // ジャンル一致度を計算
    const genreCompatibility = this.calculateGenreCompatibility(manga, readManga);
    
    // 作者一致度を計算
    const authorCompatibility = this.calculateAuthorCompatibility(manga, readManga);

    return genreCompatibility * 0.7 + authorCompatibility * 0.3;
  }

  /**
   * ジャンル一致度計算
   */
  private calculateGenreCompatibility(manga: Manga, readManga: Manga[]): number {
    if (readManga.length === 0) return 0.5;

    // 読書履歴のジャンル頻度を計算
    const genreFrequency: Record<string, number> = {};
    let totalGenres = 0;

    readManga.forEach(m => {
      m.genres.forEach(genre => {
        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
        totalGenres++;
      });
    });

    // 候補漫画のジャンルとの適合度を計算
    let compatibilityScore = 0;
    manga.genres.forEach(genre => {
      const frequency = genreFrequency[genre] || 0;
      compatibilityScore += frequency / totalGenres;
    });

    return Math.min(1.0, compatibilityScore / manga.genres.length);
  }

  /**
   * 作者一致度計算
   */
  private calculateAuthorCompatibility(manga: Manga, readManga: Manga[]): number {
    if (readManga.length === 0) return 0;

    const readAuthors = readManga.map(m => m.author);
    return readAuthors.includes(manga.author) ? 1.0 : 0;
  }

  /**
   * 気分マッチ計算
   */
  private calculateMoodMatch(manga: Manga, mood: MoodType, user: SimplifiedUser): number {
    // 読書履歴を考慮した気分マッチング
    const readManga = MOCK_MANGA.filter(m => user.readHistory.includes(m.id));
    return moodMapper.calculateHistoryInfluencedMoodMatch(manga, mood, readManga);
  }

  /**
   * 評価ボーナス計算
   * 評価 = (manga.rating - 3.0) / 2.0 (3.0基準で正規化)
   */
  private calculateRatingBonus(manga: Manga): number {
    const normalizedRating = (manga.rating - 3.0) / 2.0;
    return Math.min(1.0, Math.max(0.0, normalizedRating));
  }

  /**
   * 新鮮度計算（重複回避）
   * 新鮮度 = 1.0 - (過去推薦回数 × 0.2)
   */
  calculateFreshnessBonus(
    manga: Manga, 
    history: RecommendationRecord[]
  ): number {
    const recommendationCount = history.filter(
      record => record.manga.id === manga.id
    ).length;

    const freshnessScore = 1.0 - (recommendationCount * 0.2);
    return Math.min(1.0, Math.max(0.0, freshnessScore));
  }

  /**
   * 信頼度レベル計算
   */
  calculateConfidenceLevel(score: number, alternatives: number): 'high' | 'medium' | 'low' {
    // スコアと代替候補数に基づいて信頼度を判定
    if (score >= 0.8 && alternatives >= 10) {
      return 'high';
    } else if (score >= 0.6 && alternatives >= 5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * 推薦候補を取得
   */
  private getCandidates(user: SimplifiedUser, mood: MoodType): Manga[] {
    // 読んだことのない作品を抽出
    const unreadManga = MOCK_MANGA.filter(manga => 
      !user.readHistory.includes(manga.id)
    );

    // 気分に基づいてフィルタリング
    const moodFiltered = moodMapper.filterMangaByMood(
      unreadManga, 
      mood, 
      this.ALTERNATIVES_SAMPLE_SIZE
    );

    return moodFiltered;
  }

  /**
   * 同じ気分で再推薦を生成（既に推薦済みの作品を除外）
   */
  generateAlternativeRecommendation(
    user: SimplifiedUser, 
    mood: MoodType,
    excludeMangaIds: string[] = []
  ): SingleRecommendation {
    // 除外する作品IDを読書履歴に追加
    const tempUser: SimplifiedUser = {
      ...user,
      readHistory: [...user.readHistory, ...excludeMangaIds]
    };

    return this.generateSingleRecommendation(tempUser, mood);
  }

  /**
   * 推薦履歴を記録
   */
  recordRecommendation(
    user: SimplifiedUser,
    recommendation: SingleRecommendation,
    action?: 'viewed' | 'clicked_amazon' | 'bookmarked' | 'dismissed'
  ): RecommendationRecord {
    const record: RecommendationRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      manga: recommendation.manga,
      mood: recommendation.mood,
      score: recommendation.score,
      reason: recommendation.reason,
      matchPercentage: recommendation.matchPercentage,
      timestamp: new Date(),
      userAction: action
    };

    // ユーザーの推薦履歴に追加（最新50件まで保持）
    user.recommendationHistory = [record, ...user.recommendationHistory].slice(0, 50);
    user.lastRecommendation = record;

    return record;
  }

  /**
   * 推薦統計を取得（デバッグ・分析用）
   */
  getRecommendationStats(user: SimplifiedUser): {
    totalRecommendations: number;
    moodDistribution: Record<string, number>;
    actionDistribution: Record<string, number>;
    averageScore: number;
  } {
    const history = user.recommendationHistory;
    const moodDistribution: Record<string, number> = {};
    const actionDistribution: Record<string, number> = {};
    let totalScore = 0;

    history.forEach(record => {
      // 気分分布
      moodDistribution[record.mood.id] = (moodDistribution[record.mood.id] || 0) + 1;
      
      // アクション分布
      const action = record.userAction || 'no_action';
      actionDistribution[action] = (actionDistribution[action] || 0) + 1;
      
      // スコア合計
      totalScore += record.score;
    });

    return {
      totalRecommendations: history.length,
      moodDistribution,
      actionDistribution,
      averageScore: history.length > 0 ? totalScore / history.length : 0
    };
  }

  /**
   * 推薦品質の評価（A/Bテスト用）
   */
  evaluateRecommendationQuality(user: SimplifiedUser): {
    clickThroughRate: number;
    avgRatingOfRecommended: number;
    moodSatisfactionRate: number;
  } {
    const history = user.recommendationHistory;
    const clickedRecommendations = history.filter(r => r.userAction === 'clicked_amazon');
    const dismissedRecommendations = history.filter(r => r.userAction === 'dismissed');
    
    const clickThroughRate = history.length > 0 
      ? clickedRecommendations.length / history.length 
      : 0;

    const avgRatingOfRecommended = history.length > 0
      ? history.reduce((sum, r) => sum + r.manga.rating, 0) / history.length
      : 0;

    const moodSatisfactionRate = history.length > 0
      ? 1 - (dismissedRecommendations.length / history.length)
      : 0;

    return {
      clickThroughRate,
      avgRatingOfRecommended,
      moodSatisfactionRate
    };
  }
}

// シングルトンインスタンス
export const moodBasedEngine = new MoodBasedRecommendationEngine();

// ヘルパー関数
export const generateMoodRecommendation = (
  user: SimplifiedUser, 
  mood: MoodType
): SingleRecommendation => {
  return moodBasedEngine.generateSingleRecommendation(user, mood);
};

export const getAlternativeRecommendation = (
  user: SimplifiedUser, 
  mood: MoodType,
  excludeIds: string[] = []
): SingleRecommendation => {
  return moodBasedEngine.generateAlternativeRecommendation(user, mood, excludeIds);
};

export const recordUserRecommendation = (
  user: SimplifiedUser,
  recommendation: SingleRecommendation,
  action?: 'viewed' | 'clicked_amazon' | 'bookmarked' | 'dismissed'
): RecommendationRecord => {
  return moodBasedEngine.recordRecommendation(user, recommendation, action);
};