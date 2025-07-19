# Phase 3: ページ実装（2日）

## 概要
MangaCompassプロトタイプの3つの主要ページと推薦エンジンを実装し、完全なユーザージャーニーを構築します。

## Day 1: 推薦エンジン + ランディングページ

### 1. 推薦エンジンの実装 (src/lib/recommendations.ts)

#### RecommendationEngine クラス
```typescript
// 主要メソッド
- generateRecommendations(): スコア算出とランキング
- calculateScore(): 重み付けスコア計算
- generateReason(): 推薦理由の自動生成
```

#### スコア算出ロジック
- **ジャンル一致度** (40%): ユーザー好みジャンルとの重複率
- **評価スコア** (30%): 作品の全体評価
- **人気度** (20%): プラットフォーム内人気度
- **ステータス好み** (10%): 完結・連載中の好み

#### 推薦理由生成
- 読書履歴からの類似作品参照
- 高評価作品の強調
- 完結作品の一気読み推薦

**作業時間**: 3時間

### 2. ランディングページ実装 (src/app/page.tsx)

#### ヒーローセクション
- 魅力的なキャッチコピー
- 「Get Started」「See Demo」ボタン
- グラデーション背景

#### デモセクション
- 人気漫画の表示
- MangaGridコンポーネント使用
- 「See Demo」クリックで表示

#### 機能紹介セクション
- 3つの特徴（パーソナライズ・グローバル・即時）
- アイコンと説明文
- カード形式のレイアウト

#### フッターエリア
- 連絡先情報
- ソーシャルリンク

**作業時間**: 3時間

### 3. 漫画表示コンポーネント (src/components/manga/)

#### MangaCard
- 表紙画像表示
- タイトル・作者表示
- ジャンルバッジ
- 評価表示

#### MangaGrid
- レスポンシブグリッドレイアウト
- 読み込み状態表示
- 無限スクロール対応準備

**作業時間**: 2時間

**Day 1 合計: 8時間**

## Day 2: オンボーディング + ダッシュボード

### 1. オンボーディングページ (src/app/onboarding/page.tsx)

#### Step 1: 漫画選択
- 人気漫画20作品の表示
- 星評価システム
- 最低3作品選択の制限
- 進捗バー表示

#### Step 2: ジャンル選択
- 全ジャンルの選択可能表示
- 最低2ジャンル選択の制限
- 選択状態の視覚的フィードバック

#### データ保存とルーティング
- localStorageへの設定保存
- ダッシュボードへの自動遷移

**作業時間**: 4時間

### 2. MangaSelector コンポーネント (src/components/manga/MangaSelector.tsx)
- 漫画の選択・評価機能
- 星評価UI
- 選択済み作品の管理

**作業時間**: 1.5時間

### 3. ダッシュボードページ (src/app/dashboard/page.tsx)

#### 推薦表示エリア
- RecommendationGridコンポーネント
- 6作品の推薦表示
- マッチ率の表示

#### 統計表示エリア
- 読書統計の可視化
- 読了作品数
- お気に入りジャンル数
- 平均マッチ率

#### ローディング状態
- 推薦生成中のアニメーション
- framer-motionのスピナー

**作業時間**: 2時間

### 4. 推薦表示コンポーネント (src/components/recommendation/)

#### RecommendationCard
- 漫画カード + 推薦情報
- マッチ率バッジ
- 推薦理由の表示
- アフィリエイトボタン

#### RecommendationGrid
- 6作品のグリッド表示
- レスポンシブレイアウト
- ホバー効果

**作業時間**: 0.5時間

**Day 2 合計: 8時間**

## 完了基準
- [x] 推薦エンジンが論理的で意味のある結果を返す
- [x] 3ページすべてが正常に動作する
- [x] ユーザーフローが完全に機能する
- [x] レスポンシブデザインが全デバイスで動作
- [x] localStorage による状態管理が動作
- [x] TypeScriptエラーがない
- [x] 推薦理由が適切に生成される

## 技術的実装詳細

### 推薦アルゴリズム
```typescript
// スコア計算例
const genreMatchScore = overlappingGenres.length / totalUniqueGenres * 0.4;
const ratingScore = manga.rating / 5 * 0.3;
const popularityScore = manga.popularity / 100 * 0.2;
const statusScore = statusMatch ? 0.1 : 0;
const totalScore = genreMatchScore + ratingScore + popularityScore + statusScore;
```

### 状態管理
```typescript
// localStorage保存形式
interface SavedPreferences {
  readHistory: UserMangaHistory[];
  favoriteGenres: string[];
  onboardingCompleted: boolean;
}
```

### ルーティング
- `/` → ランディングページ
- `/onboarding` → ユーザー設定
- `/dashboard` → 推薦結果

## パフォーマンス要件
- 初回ページロード: 3秒以内
- 推薦生成: 1秒以内
- 画像読み込み: 遅延読み込み対応
- モバイル最適化: Core Web Vitals準拠

## 想定作業時間
**Day 1**: 8時間
- 推薦エンジン: 3時間
- ランディングページ: 3時間
- 漫画コンポーネント: 2時間

**Day 2**: 8時間
- オンボーディング: 4時間
- MangaSelector: 1.5時間
- ダッシュボード: 2時間
- 推薦コンポーネント: 0.5時間

**合計: 16時間（2日）**

## 次フェーズへの引き継ぎ
- 完全なプロトタイプの基本機能完成
- Phase 4での最適化とデプロイ準備
- ユーザーテスト可能な状態の達成