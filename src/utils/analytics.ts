/**
 * 分析・統計ユーティリティ
 */

import { Manga, User, Recommendation } from '../lib/types';
import { event as gtag } from '@/lib/analytics';

/**
 * ユーザー行動追跡イベント
 */
export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'manga_view' | 'recommendation_click' | 'onboarding_step' | 'search' | 'genre_filter';
  userId?: string;
  timestamp: number;
  data: Record<string, any>;
  sessionId: string;
}

/**
 * セッション情報
 */
export interface SessionInfo {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  userAgent: string;
  referrer?: string;
}

/**
 * ユーザー行動統計
 */
export interface UserBehaviorStats {
  totalSessions: number;
  avgSessionDuration: number;
  totalPageViews: number;
  topPages: Array<{ path: string; views: number }>;
  topGenres: Array<{ genre: string; interactions: number }>;
  conversionFunnel: {
    landing: number;
    onboarding: number;
    dashboard: number;
    affiliate_clicks: number;
  };
}

/**
 * 推薦エンジン性能統計
 */
export interface RecommendationStats {
  totalRecommendations: number;
  avgScore: number;
  clickThroughRate: number;
  topPerformingGenres: Array<{ genre: string; ctr: number }>;
  scoreDistribution: Record<string, number>;
}

class AnalyticsManager {
  private sessionId: string;
  private session: SessionInfo;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.loadStoredEvents();
    
    // ページ離脱時のデータ保存
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.saveEvents());
      
      // 5分ごとの自動保存
      setInterval(() => this.saveEvents(), 5 * 60 * 1000);
    }
  }

  /**
   * イベントを追跡
   */
  track(
    type: AnalyticsEvent['type'], 
    data: Record<string, any> = {},
    userId?: string
  ): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      userId,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.updateSession();
    
    // リアルタイム処理（必要に応じて）
    this.processEventRealtime(event);
    
    // 100イベントを超えたら古いものを削除
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  /**
   * ページビューを追跡
   */
  trackPageView(path: string, userId?: string): void {
    this.track('page_view', { path }, userId);
    this.session.pageViews++;
    
    // GA4にも送信
    gtag({
      action: 'page_view',
      category: 'engagement',
      label: path
    });
  }

  /**
   * 漫画表示を追跡
   */
  trackMangaView(manga: Manga, source: string, userId?: string): void {
    this.track('manga_view', {
      mangaId: manga.id,
      title: manga.title,
      genres: manga.genres,
      rating: manga.rating,
      source
    }, userId);
    
    // GA4にも送信
    gtag({
      action: 'view_item',
      category: 'manga',
      label: manga.title,
      value: manga.rating
    });
  }

  /**
   * 推薦クリックを追跡
   */
  trackRecommendationClick(
    recommendation: Recommendation, 
    position: number,
    userId?: string
  ): void {
    this.track('recommendation_click', {
      mangaId: recommendation.manga.id,
      title: recommendation.manga.title,
      score: recommendation.score,
      position,
      reason: recommendation.reason,
      factors: recommendation.factors
    }, userId);
    
    // GA4にも送信
    gtag({
      action: 'select_item',
      category: 'recommendation',
      label: recommendation.manga.title,
      value: position
    });
  }

  /**
   * オンボーディングステップを追跡
   */
  trackOnboardingStep(step: string, data: Record<string, any> = {}, userId?: string): void {
    this.track('onboarding_step', { step, ...data }, userId);
    
    // GA4にも送信
    gtag({
      action: 'tutorial_progress',
      category: 'onboarding',
      label: step,
      value: parseInt(step, 10) || 0
    });
  }

  /**
   * 検索を追跡
   */
  trackSearch(query: string, results: number, userId?: string): void {
    this.track('search', { query, results }, userId);
  }

  /**
   * ジャンルフィルターを追跡
   */
  trackGenreFilter(genre: string, userId?: string): void {
    this.track('genre_filter', { genre }, userId);
  }

  /**
   * ユーザー行動統計を生成
   */
  generateUserBehaviorStats(): UserBehaviorStats {
    const sessions = this.getUniqueSessions();
    const pageViews = this.events.filter(e => e.type === 'page_view');
    const genreInteractions = this.events.filter(e => 
      e.type === 'genre_filter' || e.type === 'manga_view'
    );

    // ページビュー統計
    const pageViewCounts = pageViews.reduce((acc, event) => {
      const path = event.data.path;
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // ジャンル統計
    const genreCounts = genreInteractions.reduce((acc, event) => {
      const genres = event.data.genres || [event.data.genre];
      if (Array.isArray(genres)) {
        genres.forEach(genre => {
          if (genre) acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCounts)
      .map(([genre, interactions]) => ({ genre, interactions }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 10);

    // コンバージョンファネル
    const conversionFunnel = {
      landing: pageViews.filter(e => e.data.path === '/').length,
      onboarding: this.events.filter(e => e.type === 'onboarding_step').length,
      dashboard: pageViews.filter(e => e.data.path === '/dashboard').length,
      affiliate_clicks: this.getAffiliateClicks().length
    };

    // セッション継続時間
    const sessionDurations = sessions.map(session => 
      session.lastActivity - session.startTime
    );
    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;

    return {
      totalSessions: sessions.length,
      avgSessionDuration: Math.round(avgSessionDuration / 1000), // 秒単位
      totalPageViews: pageViews.length,
      topPages,
      topGenres,
      conversionFunnel
    };
  }

  /**
   * 推薦エンジン性能統計を生成
   */
  generateRecommendationStats(): RecommendationStats {
    const recommendationViews = this.events.filter(e => e.type === 'recommendation_click');
    const totalRecommendations = recommendationViews.length;
    
    if (totalRecommendations === 0) {
      return {
        totalRecommendations: 0,
        avgScore: 0,
        clickThroughRate: 0,
        topPerformingGenres: [],
        scoreDistribution: {}
      };
    }

    // 平均スコア
    const scores = recommendationViews.map(e => e.data.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // CTR計算（簡易版）
    const uniqueRecommendations = new Set(recommendationViews.map(e => e.data.mangaId)).size;
    const clickThroughRate = (totalRecommendations / Math.max(uniqueRecommendations, 1)) * 100;

    // ジャンル別パフォーマンス
    const genreClicks = recommendationViews.reduce((acc, event) => {
      // この実装は簡略化されており、実際にはmangaDataから取得する必要がある
      const mangaId = event.data.mangaId;
      const genre = 'unknown'; // 実際の実装では漫画データから取得
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPerformingGenres = Object.entries(genreClicks)
      .map(([genre, clicks]) => ({ genre, ctr: (clicks / totalRecommendations) * 100 }))
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 5);

    // スコア分布
    const scoreRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const scoreDistribution = scores.reduce((acc, score) => {
      const range = scoreRanges[Math.floor(score / 20)] || '81-100';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRecommendations,
      avgScore: Math.round(avgScore * 10) / 10,
      clickThroughRate: Math.round(clickThroughRate * 10) / 10,
      topPerformingGenres,
      scoreDistribution
    };
  }

  /**
   * エクスポート用のデータを生成
   */
  exportData(): {
    events: AnalyticsEvent[];
    sessions: SessionInfo[];
    userStats: UserBehaviorStats;
    recommendationStats: RecommendationStats;
  } {
    return {
      events: this.events,
      sessions: this.getUniqueSessions(),
      userStats: this.generateUserBehaviorStats(),
      recommendationStats: this.generateRecommendationStats()
    };
  }

  /**
   * プライベートメソッド群
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): SessionInfo {
    const now = Date.now();
    return {
      id: this.sessionId,
      startTime: now,
      lastActivity: now,
      pageViews: 0,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined
    };
  }

  private updateSession(): void {
    this.session.lastActivity = Date.now();
  }

  private loadStoredEvents(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('mangacompass_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.events = data.events || [];
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        events: this.events.slice(-1000), // 最新1000件のみ保存
        session: this.session
      };
      localStorage.setItem('mangacompass_analytics', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  private processEventRealtime(event: AnalyticsEvent): void {
    // リアルタイム処理（必要に応じて外部サービスに送信等）
    if (process.env.NODE_ENV === 'production') {
      // Google Analytics、Mixpanel等への送信実装予定地
      console.log('Analytics event:', event);
    }
  }

  private getUniqueSessions(): SessionInfo[] {
    const sessionMap = new Map<string, SessionInfo>();
    
    this.events.forEach(event => {
      if (!sessionMap.has(event.sessionId)) {
        sessionMap.set(event.sessionId, {
          id: event.sessionId,
          startTime: event.timestamp,
          lastActivity: event.timestamp,
          pageViews: 0,
          userAgent: 'unknown'
        });
      }
      
      const session = sessionMap.get(event.sessionId)!;
      session.lastActivity = Math.max(session.lastActivity, event.timestamp);
      
      if (event.type === 'page_view') {
        session.pageViews++;
      }
    });
    
    return Array.from(sessionMap.values());
  }

  private getAffiliateClicks(): AnalyticsEvent[] {
    // アフィリエイトクリックの取得（affiliate.tsと連携）
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('mangacompass_affiliate_clicks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

// シングルトンインスタンス
export const analytics = new AnalyticsManager();

// ヘルパー関数
export const trackPageView = (path: string, userId?: string) => {
  analytics.trackPageView(path, userId);
};

export const trackMangaView = (manga: Manga, source: string, userId?: string) => {
  analytics.trackMangaView(manga, source, userId);
};

export const trackRecommendationClick = (
  recommendation: Recommendation, 
  position: number, 
  userId?: string
) => {
  analytics.trackRecommendationClick(recommendation, position, userId);
};

export const trackOnboardingStep = (step: string, data: Record<string, any> = {}, userId?: string) => {
  analytics.trackOnboardingStep(step, data, userId);
};

export const generateDashboardStats = () => {
  return {
    userBehavior: analytics.generateUserBehaviorStats(),
    recommendations: analytics.generateRecommendationStats()
  };
};