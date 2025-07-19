/**
 * Amazonアフィリエイトリンク生成ユーティリティ
 */

export const AFFILIATE_TAG = 'mangacompass-20';

/**
 * AmazonのASINからアフィリエイトリンクを生成
 */
export function generateAffiliateLink(asin: string, tag: string = AFFILIATE_TAG): string {
  if (!asin || typeof asin !== 'string') {
    throw new Error('Valid ASIN is required');
  }
  
  return `https://www.amazon.co.jp/dp/${asin}?tag=${tag}`;
}

/**
 * Amazon商品URLからASINを抽出
 */
export function extractASINFromURL(url: string): string | null {
  if (!url) return null;
  
  // 一般的なAmazon URL パターンにマッチ
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,           // /dp/ASIN
    /\/gp\/product\/([A-Z0-9]{10})/i,  // /gp/product/ASIN
    /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/i // /exec/obidos/ASIN/ASIN
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * 既存のAmazonリンクにアフィリエイトタグを追加
 */
export function addAffiliateTag(url: string, tag: string = AFFILIATE_TAG): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Amazon.co.jpドメインの確認
    if (!urlObj.hostname.includes('amazon.co.jp')) {
      return url; // Amazon以外のURLはそのまま返す
    }
    
    // 既存のtagパラメータを上書き
    urlObj.searchParams.set('tag', tag);
    
    // 不要なパラメータを削除（クリーンなURLにする）
    const paramsToKeep = ['tag', 'keywords', 'ie', 'node'];
    const newParams = new URLSearchParams();
    
    paramsToKeep.forEach(param => {
      const value = urlObj.searchParams.get(param);
      if (value) {
        newParams.set(param, value);
      }
    });
    
    urlObj.search = newParams.toString();
    
    return urlObj.toString();
  } catch (error) {
    console.warn('Invalid URL provided to addAffiliateTag:', url);
    return url;
  }
}

/**
 * Amazon商品画像URLを生成（複数パターン対応）
 */
export function generateAmazonImageUrl(asin: string, size: 'S' | 'M' | 'L' = 'M'): string {
  if (!asin || typeof asin !== 'string') {
    throw new Error('Valid ASIN is required for image URL generation');
  }
  
  // サイズ: S=75px, M=160px, L=500px
  const sizeMap = {
    'S': '75',
    'M': '160', 
    'L': '500'
  };
  
  // 主要なパターン（最も一般的）
  return `https://m.media-amazon.com/images/P/${asin}.01._SL${sizeMap[size]}_.jpg`;
}

/**
 * Amazon画像の代替URLパターンを生成
 */
export function getAmazonImageUrls(asin: string, size: 'S' | 'M' | 'L' = 'M'): string[] {
  if (!asin || typeof asin !== 'string') {
    return [];
  }
  
  const sizeMap = {
    'S': '75',
    'M': '160', 
    'L': '500'
  };
  
  const sizeCode = sizeMap[size];
  
  // 複数のAmazon画像URLパターンを試す
  return [
    // パターン1: m.media-amazon.com (最新)
    `https://m.media-amazon.com/images/P/${asin}.01._SL${sizeCode}_.jpg`,
    // パターン2: images-na.ssl-images-amazon.com (従来)
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL${sizeCode}_.jpg`,
    // パターン3: images.amazon.com (基本)
    `https://images.amazon.com/images/P/${asin}.01._SL${sizeCode}_.jpg`,
    // パターン4: 拡張子なし
    `https://m.media-amazon.com/images/P/${asin}.01._SL${sizeCode}_`,
    // パターン5: 異なるサイズコード
    `https://m.media-amazon.com/images/P/${asin}.01.L.jpg`,
    // パターン6: AC形式
    `https://m.media-amazon.com/images/P/${asin}.01._AC_SL${sizeCode}_.jpg`
  ];
}

/**
 * 漫画のタイトルからAmazon検索URLを生成
 */
export function generateSearchLink(
  title: string, 
  author?: string, 
  tag: string = AFFILIATE_TAG
): string {
  if (!title) {
    throw new Error('Title is required for search link generation');
  }
  
  const searchQuery = author ? `${title} ${author}` : title;
  const encodedQuery = encodeURIComponent(searchQuery);
  
  return `https://www.amazon.co.jp/s?k=${encodedQuery}&i=stripbooks&tag=${tag}`;
}

/**
 * 複数サイズの画像URLを生成
 */
export function generateImageUrls(asin: string): {
  small: string;
  medium: string;
  large: string;
} {
  return {
    small: generateAmazonImageUrl(asin, 'S'),
    medium: generateAmazonImageUrl(asin, 'M'),
    large: generateAmazonImageUrl(asin, 'L')
  };
}

/**
 * アフィリエイトリンククリック追跡用
 */
export interface AffiliateClickEvent {
  asin?: string;
  title: string;
  source: 'recommendation' | 'search' | 'similar' | 'direct';
  timestamp: number;
  userId?: string;
}

/**
 * アフィリエイトリンククリックを追跡
 */
export function trackAffiliateClick(event: Omit<AffiliateClickEvent, 'timestamp'>): void {
  const clickEvent: AffiliateClickEvent = {
    ...event,
    timestamp: Date.now()
  };
  
  // ローカルストレージに保存（分析用）
  try {
    const existingClicks = getAffiliateClickHistory();
    const updatedClicks = [...existingClicks, clickEvent].slice(-100); // 最新100件のみ保持
    
    localStorage.setItem('mangacompass_affiliate_clicks', JSON.stringify(updatedClicks));
  } catch (error) {
    console.warn('Failed to track affiliate click:', error);
  }
  
  // 外部分析サービスに送信（プロダクション環境でのみ）
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Google Analytics、Facebook Pixel等の実装予定地
    console.log('Affiliate click tracked:', clickEvent);
  }
}

/**
 * アフィリエイトクリック履歴を取得
 */
export function getAffiliateClickHistory(): AffiliateClickEvent[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('mangacompass_affiliate_clicks');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to get affiliate click history:', error);
    return [];
  }
}

/**
 * アフィリエイト統計データを生成
 */
export interface AffiliateStats {
  totalClicks: number;
  clicksBySource: Record<string, number>;
  topTitles: Array<{ title: string; clicks: number }>;
  recentClicks: AffiliateClickEvent[];
  conversionRate?: number; // 将来的にトラッキング実装
}

export function generateAffiliateStats(): AffiliateStats {
  const history = getAffiliateClickHistory();
  
  const clicksBySource = history.reduce((acc, click) => {
    acc[click.source] = (acc[click.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const titleCounts = history.reduce((acc, click) => {
    acc[click.title] = (acc[click.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTitles = Object.entries(titleCounts)
    .map(([title, clicks]) => ({ title, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
  
  const recentClicks = history
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);
  
  return {
    totalClicks: history.length,
    clicksBySource,
    topTitles,
    recentClicks
  };
}

/**
 * URLがアフィリエイトリンクかどうかを判定
 */
export function isAffiliateLink(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('amazon') && urlObj.searchParams.has('tag');
  } catch {
    return false;
  }
}

/**
 * アフィリエイトタグをURLから取得
 */
export function getAffiliateTag(url: string): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('tag');
  } catch {
    return null;
  }
}

/**
 * 収益レポート用のダミーデータ生成（デモ用）
 */
export interface RevenueData {
  period: string;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
}

export function generateDemoRevenueData(): RevenueData[] {
  const now = new Date();
  const data: RevenueData[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = date.toISOString().slice(0, 7); // YYYY-MM
    
    // ランダムなデモデータ生成
    const clicks = Math.floor(Math.random() * 1000) + 100;
    const conversionRate = Math.random() * 0.05 + 0.01; // 1-6%
    const orders = Math.floor(clicks * conversionRate);
    const avgOrderValue = Math.random() * 2000 + 1000; // 1000-3000円
    const revenue = Math.floor(orders * avgOrderValue * 0.08); // 8%手数料
    
    data.push({
      period,
      clicks,
      orders,
      revenue,
      conversionRate: Math.round(conversionRate * 10000) / 100 // パーセント表示用
    });
  }
  
  return data;
}