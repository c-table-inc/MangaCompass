/**
 * ローカルストレージ管理ユーティリティ
 */

import { User, Manga } from '../lib/types';

const STORAGE_KEYS = {
  USER: 'mangacompass_user',
  ANALYTICS: 'mangacompass_analytics',
  AFFILIATE_CLICKS: 'mangacompass_affiliate_clicks',
  PREFERENCES: 'mangacompass_preferences',
  CACHE: 'mangacompass_cache'
} as const;

/**
 * ローカルストレージ操作のベースクラス
 */
class LocalStorageManager {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * データを安全に保存
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isClient) return false;
    
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * データを安全に取得
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isClient) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to parse localStorage item (${key}):`, error);
      return defaultValue || null;
    }
  }

  /**
   * データを削除
   */
  removeItem(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove localStorage item (${key}):`, error);
      return false;
    }
  }

  /**
   * ストレージサイズを確認
   */
  getStorageSize(): number {
    if (!this.isClient) return 0;
    
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * ストレージをクリア
   */
  clear(): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * 古いデータを削除（クリーンアップ）
   */
  cleanup(maxAgeMs: number = 30 * 24 * 60 * 60 * 1000): void { // デフォルト30日
    if (!this.isClient) return;
    
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('mangacompass_')) {
        try {
          const data = JSON.parse(localStorage[key]);
          if (data.timestamp && (now - data.timestamp) > maxAgeMs) {
            keysToRemove.push(key);
          }
        } catch {
          // パースできないデータは古いデータとして削除対象
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => this.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} old localStorage items`);
    }
  }
}

// シングルトンインスタンス
const storageManager = new LocalStorageManager();

/**
 * ユーザーデータ管理
 */
export class UserDataManager {
  /**
   * ユーザーデータを保存
   */
  static saveUser(user: User): boolean {
    const userData = {
      ...user,
      lastUpdated: Date.now(),
      timestamp: Date.now()
    };
    
    return storageManager.setItem(STORAGE_KEYS.USER, userData);
  }

  /**
   * ユーザーデータを取得
   */
  static getUser(): User | null {
    const userData = storageManager.getItem<User & { lastUpdated?: number; timestamp?: number }>(
      STORAGE_KEYS.USER
    );
    
    if (!userData) return null;
    
    // タイムスタンプを除いてUserオブジェクトとして返す
    const { lastUpdated, timestamp, ...user } = userData;
    return user as User;
  }

  /**
   * ユーザーデータの存在確認
   */
  static hasUser(): boolean {
    return this.getUser() !== null;
  }

  /**
   * ユーザーデータを削除
   */
  static clearUser(): boolean {
    return storageManager.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * ユーザーの読書履歴を更新
   */
  static addToReadHistory(mangaId: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      readHistory: Array.from(new Set([mangaId, ...user.readHistory]))
    };
    
    return this.saveUser(updatedUser);
  }

  /**
   * ユーザーの好みジャンルを更新
   */
  static updateFavoriteGenres(genres: string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      favoriteGenres: genres
    };
    
    return this.saveUser(updatedUser);
  }

  /**
   * ユーザー設定を更新
   */
  static updatePreferences(preferences: Partial<User['preferences']>): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };
    
    return this.saveUser(updatedUser);
  }
}

/**
 * アプリケーション設定の型定義
 */
export interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  notifications: boolean;
  autoRefresh: boolean;
  compactMode: boolean;
}

/**
 * アプリケーション設定管理
 */
export class AppPreferencesManager {
  private static defaultPreferences: AppPreferences = {
    theme: 'light',
    language: 'ja',
    notifications: true,
    autoRefresh: true,
    compactMode: false
  };

  /**
   * アプリケーション設定を保存
   */
  static savePreferences(preferences: Partial<AppPreferences>): boolean {
    const current = this.getPreferences();
    const updated = {
      ...current,
      ...preferences,
      timestamp: Date.now()
    };
    
    return storageManager.setItem(STORAGE_KEYS.PREFERENCES, updated);
  }

  /**
   * アプリケーション設定を取得
   */
  static getPreferences(): AppPreferences {
    const preferences = storageManager.getItem<AppPreferences & { timestamp?: number }>(
      STORAGE_KEYS.PREFERENCES,
      this.defaultPreferences
    );
    
    if (!preferences) return this.defaultPreferences;
    
    const { timestamp, ...prefs } = preferences;
    return { ...this.defaultPreferences, ...prefs };
  }

  /**
   * 特定の設定値を更新
   */
  static updatePreference<K extends keyof AppPreferences>(
    key: K, 
    value: AppPreferences[K]
  ): boolean {
    const current = this.getPreferences();
    return this.savePreferences({ ...current, [key]: value });
  }

  /**
   * 設定をリセット
   */
  static resetPreferences(): boolean {
    return this.savePreferences(this.defaultPreferences);
  }
}

/**
 * キャッシュアイテムの型定義
 */
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

/**
 * キャッシュ管理
 */
export class CacheManager {

  /**
   * データをキャッシュに保存
   */
  static set<T>(key: string, data: T, ttlMs: number = 60 * 60 * 1000): boolean { // デフォルト1時間
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttlMs
    };
    
    const cache = storageManager.getItem<Record<string, CacheItem<any>>>(
      STORAGE_KEYS.CACHE,
      {}
    );
    
    if (!cache) return false;
    
    cache[key] = cacheItem;
    return storageManager.setItem(STORAGE_KEYS.CACHE, cache);
  }

  /**
   * キャッシュからデータを取得
   */
  static get<T>(key: string): T | null {
    const cache = storageManager.getItem<Record<string, CacheItem<T>>>(
      STORAGE_KEYS.CACHE,
      {}
    );
    
    if (!cache || !cache[key]) return null;
    
    const item = cache[key];
    
    // 期限切れチェック
    if (Date.now() > item.expiry) {
      this.remove(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * キャッシュエントリを削除
   */
  static remove(key: string): boolean {
    const cache = storageManager.getItem<Record<string, CacheItem<any>>>(
      STORAGE_KEYS.CACHE,
      {}
    );
    
    if (!cache) return false;
    
    delete cache[key];
    return storageManager.setItem(STORAGE_KEYS.CACHE, cache);
  }

  /**
   * 期限切れのキャッシュをクリア
   */
  static clearExpired(): number {
    const cache = storageManager.getItem<Record<string, CacheItem<any>>>(
      STORAGE_KEYS.CACHE,
      {}
    );
    
    if (!cache) return 0;
    
    const now = Date.now();
    let clearedCount = 0;
    
    Object.keys(cache).forEach(key => {
      if (cache[key].expiry < now) {
        delete cache[key];
        clearedCount++;
      }
    });
    
    if (clearedCount > 0) {
      storageManager.setItem(STORAGE_KEYS.CACHE, cache);
    }
    
    return clearedCount;
  }

  /**
   * 全キャッシュをクリア
   */
  static clearAll(): boolean {
    return storageManager.setItem(STORAGE_KEYS.CACHE, {});
  }
}


/**
 * データエクスポート・インポート
 */
export class DataManager {
  /**
   * 全データをエクスポート
   */
  static exportAllData(): string {
    const data = {
      user: UserDataManager.getUser(),
      preferences: AppPreferencesManager.getPreferences(),
      analytics: storageManager.getItem(STORAGE_KEYS.ANALYTICS),
      affiliateClicks: storageManager.getItem(STORAGE_KEYS.AFFILIATE_CLICKS),
      exportDate: Date.now(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * データをインポート
   */
  static importData(jsonData: string): { success: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const data = JSON.parse(jsonData);
      
      // ユーザーデータのインポート
      if (data.user) {
        if (!UserDataManager.saveUser(data.user)) {
          errors.push('ユーザーデータの保存に失敗しました');
        }
      }
      
      // 設定のインポート
      if (data.preferences) {
        if (!AppPreferencesManager.savePreferences(data.preferences)) {
          errors.push('設定の保存に失敗しました');
        }
      }
      
      // アナリティクスデータのインポート
      if (data.analytics) {
        if (!storageManager.setItem(STORAGE_KEYS.ANALYTICS, data.analytics)) {
          errors.push('アナリティクスデータの保存に失敗しました');
        }
      }
      
      // アフィリエイトクリックデータのインポート
      if (data.affiliateClicks) {
        if (!storageManager.setItem(STORAGE_KEYS.AFFILIATE_CLICKS, data.affiliateClicks)) {
          errors.push('アフィリエイトデータの保存に失敗しました');
        }
      }
      
      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        success: false,
        errors: ['データの解析に失敗しました: ' + (error as Error).message]
      };
    }
  }

  /**
   * 全データを削除（リセット）
   */
  static resetAllData(): boolean {
    try {
      UserDataManager.clearUser();
      AppPreferencesManager.resetPreferences();
      CacheManager.clearAll();
      storageManager.removeItem(STORAGE_KEYS.ANALYTICS);
      storageManager.removeItem(STORAGE_KEYS.AFFILIATE_CLICKS);
      return true;
    } catch (error) {
      console.error('Failed to reset all data:', error);
      return false;
    }
  }

  /**
   * ストレージ使用量の取得
   */
  static getStorageUsage(): {
    total: number;
    breakdown: Record<string, number>;
    percentage: number;
  } {
    const breakdown: Record<string, number> = {};
    let total = 0;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      const size = item ? new Blob([item]).size : 0;
      breakdown[key] = size;
      total += size;
    });
    
    const maxStorage = 5 * 1024 * 1024; // 5MB (ブラウザの一般的な制限)
    const percentage = (total / maxStorage) * 100;
    
    return {
      total,
      breakdown,
      percentage
    };
  }
}

// 初期化時のクリーンアップ
if (typeof window !== 'undefined') {
  // ページロード時に古いデータをクリーンアップ
  storageManager.cleanup();
  CacheManager.clearExpired();
}

// 定期的なクリーンアップ（5分ごと）
if (typeof window !== 'undefined') {
  setInterval(() => {
    CacheManager.clearExpired();
  }, 5 * 60 * 1000);
}

// デフォルトエクスポート
export default storageManager;

// 名前付きエクスポート
export { STORAGE_KEYS };