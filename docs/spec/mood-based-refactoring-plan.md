# MangaCompass 気分ベース推薦システム改修計画書

## 概要

現在の3ステップオンボーディング（漫画選択→ジャンル選択→詳細設定）から、2ステップ（漫画選択→気分選択）の簡略化システムに改修し、複数推薦から単一の最適推薦への変更を実装する。

### 改修の目標
- ユーザー体験の簡略化（3-5分 → 1-2分）
- 選択疲労の軽減（複数推薦 → 単一推薦）
- 直感的な気分ベース推薦の実現
- より強いコンバージョンレートの達成

---

## 改修対象ファイル分析

### 主要変更ファイル
```
src/app/onboarding/page.tsx     # オンボーディングフロー大幅変更
src/app/dashboard/page.tsx      # ダッシュボード完全リニューアル
src/lib/recommendations.ts      # 推薦エンジンの刷新
src/lib/types.ts               # データ型の大幅変更
src/utils/localStorage.ts       # データ管理ロジック更新
src/utils/analytics.ts         # 分析機能の調整
```

### 新規作成ファイル
```
src/components/mood/MoodSelector.tsx           # 気分選択コンポーネント
src/components/recommendation/SingleRecommendation.tsx  # 単一推薦表示
src/lib/moodEngine.ts                         # 気分ベース推薦エンジン
src/utils/moodMapping.ts                      # 気分とジャンルのマッピング
```

### UI/UXコンポーネント更新
```
src/components/ui/Card.tsx        # 気分選択用カード対応
src/components/ui/Button.tsx      # 新しいアクションボタン
src/components/ui/Badge.tsx       # 気分表示用バッジ
```

---

## Phase 1: 基盤準備とデータ構造変更（2日間）

### 1.1 新しいデータ型の定義（0.5日）

**対象ファイル**: `src/lib/types.ts`

#### 新規型定義
```typescript
// 気分カテゴリー
export interface MoodType {
  id: 'adventure' | 'relax' | 'excitement' | 'emotional' | 
      'thoughtful' | 'thrilling' | 'nostalgic' | 'light';
  name: string;
  emoji: string;
  description: string;
  color: string;
  genreWeights: Record<string, number>;
}

// 簡略化されたユーザーデータ
export interface SimplifiedUser {
  id: string;
  readHistory: string[];           // 3-5作品に制限
  selectedMood?: MoodType;         // 現在選択中の気分
  lastRecommendation?: RecommendationRecord;
  recommendationHistory: RecommendationRecord[];
}

// 推薦記録
export interface RecommendationRecord {
  id: string;
  manga: Manga;
  mood: MoodType;
  score: number;
  reason: string;
  matchPercentage: number;
  timestamp: Date;
  userAction?: 'viewed' | 'clicked_amazon' | 'bookmarked' | 'dismissed';
}

// 単一推薦結果
export interface SingleRecommendation {
  manga: Manga;
  mood: MoodType;
  score: number;
  reason: string;
  matchPercentage: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  alternativeCount: number;  // 他の候補数
}
```

#### 既存型の更新
```typescript
// オンボーディングデータの簡略化
export interface SimplifiedOnboardingData {
  selectedManga: string[];     // 3-5作品
  selectedMood: MoodType;      // 単一の気分
}

// 気分定数の追加
export const MOOD_CATEGORIES: MoodType[] = [
  // 8つの気分カテゴリー定義
];
```

**作業項目**:
- [ ] 新しい型定義の実装
- [ ] 既存型との互換性確保
- [ ] 型安全性の検証
- [ ] JSDocコメントの追加

### 1.2 気分マッピングシステムの実装（0.5日）

**新規ファイル**: `src/utils/moodMapping.ts`

```typescript
export class MoodMapper {
  // 気分からジャンル重み付けを取得
  getGenreWeights(mood: MoodType): Record<string, number>
  
  // 気分に基づく作品フィルタリング
  filterMangaByMood(manga: Manga[], mood: MoodType): Manga[]
  
  // 気分適合度計算
  calculateMoodMatch(manga: Manga, mood: MoodType): number
  
  // 推薦理由生成
  generateMoodReason(manga: Manga, mood: MoodType, score: number): string
}
```

**実装内容**:
- 8つの気分カテゴリーの詳細定義
- ジャンルとの重み付けマトリックス
- 気分説明文とアイコンの定義
- カラーパレットの設定

**作業項目**:
- [ ] 8つの気分カテゴリーの実装
- [ ] ジャンル重み付けマトリックスの作成
- [ ] 気分適合度計算ロジックの実装
- [ ] 推薦理由テンプレートの作成

### 1.3 新しい推薦エンジンの実装（1日）

**新規ファイル**: `src/lib/moodEngine.ts`

```typescript
export class MoodBasedRecommendationEngine {
  // 単一の最適推薦を生成
  generateSingleRecommendation(
    user: SimplifiedUser, 
    mood: MoodType
  ): SingleRecommendation
  
  // 気分ベースのスコアリング
  calculateMoodScore(
    manga: Manga, 
    user: SimplifiedUser, 
    mood: MoodType
  ): number
  
  // 新鮮度計算（重複回避）
  calculateFreshnessBonus(
    manga: Manga, 
    history: RecommendationRecord[]
  ): number
  
  // 信頼度レベル計算
  calculateConfidenceLevel(score: number, alternatives: number): string
}
```

**スコアリングアルゴリズム**:
```
最終スコア = 基本適性(50%) + 気分マッチ(30%) + 評価(15%) + 新鮮度(5%)

基本適性 = 読書履歴との ジャンル一致度 × 0.7 + 作者一致度 × 0.3
気分マッチ = 気分-ジャンル重み付け × ムード適合度
評価 = (manga.rating - 3.0) / 2.0  # 3.0基準で正規化
新鮮度 = 1.0 - (過去推薦回数 × 0.2)  # 重複ペナルティ
```

**作業項目**:
- [ ] 新しいスコアリングアルゴリズムの実装
- [ ] 重複回避ロジックの実装
- [ ] 信頼度計算の実装
- [ ] パフォーマンス最適化
- [ ] 単体テストの作成

---

## Phase 2: UI コンポーネントの実装（2-3日間）

### 2.1 気分選択コンポーネントの作成（1日）

**新規ファイル**: `src/components/mood/MoodSelector.tsx`

```typescript
interface MoodSelectorProps {
  selectedMood?: MoodType;
  onMoodSelect: (mood: MoodType) => void;
  disabled?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onMoodSelect,
  disabled = false
}) => {
  // 2x4グリッドレイアウト
  // アニメーション効果
  // アクセシビリティ対応
};
```

**デザイン仕様**:
- **レイアウト**: 2x4グリッド（モバイル: 2x4縦並び）
- **カードサイズ**: 150x120px（PC）、120x100px（モバイル）
- **視覚階層**: 絵文字 > タイトル > 説明文
- **ホバー効果**: スケール1.05 + シャドウ拡大
- **選択状態**: 境界線ハイライト + 背景色変更

**作業項目**:
- [ ] レスポンシブグリッドレイアウト
- [ ] 気分カードコンポーネント
- [ ] ホバー/選択アニメーション
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応

### 2.2 単一推薦表示コンポーネントの作成（1日）

**新規ファイル**: `src/components/recommendation/SingleRecommendation.tsx`

```typescript
interface SingleRecommendationProps {
  recommendation: SingleRecommendation;
  onAmazonClick: () => void;
  onTryAgain: () => void;
  onChangeMood: () => void;
  onStartOver: () => void;
  loading?: boolean;
}

export const SingleRecommendation: React.FC<SingleRecommendationProps> = ({
  recommendation,
  onAmazonClick,
  onTryAgain,
  onChangeMood,
  onStartOver,
  loading = false
}) => {
  // ヒーロー表示レイアウト
  // アクションボタン群
  // アニメーション効果
};
```

**デザイン仕様**:
- **ヒーロー表示**: 画面の70%を推薦作品が占有
- **画像サイズ**: 300x400px（PC）、200x300px（モバイル）
- **情報階層**: タイトル > 推薦理由 > 適合度 > 詳細情報
- **CTA配置**: 画面下部に大きなアクションボタン群

**作業項目**:
- [ ] ヒーロー表示レイアウト
- [ ] 推薦理由の表示UI
- [ ] 適合度の視覚化（プログレスバー）
- [ ] アクションボタングループ
- [ ] ローディング状態の処理

### 2.3 UI コンポーネントの拡張（0.5日）

**対象ファイル**: `src/components/ui/*.tsx`

#### Card.tsx の拡張
```typescript
// 気分選択用の特別なカード variant
export interface MoodCardProps extends CardProps {
  mood: MoodType;
  selected?: boolean;
  disabled?: boolean;
}
```

#### Button.tsx の拡張
```typescript
// 新しいボタンサイズとバリアント
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'mood';
```

**作業項目**:
- [ ] 気分選択用カードバリアント
- [ ] 大型CTAボタンの実装
- [ ] 新しいカラーパレット適用
- [ ] アニメーション効果の統一

### 2.4 アニメーション・遷移効果の実装（0.5日）

**実装内容**:
- **画面遷移**: 0.3秒のスライドアニメーション
- **推薦表示**: 1秒のフェードイン + スケール
- **ローディング**: 推薦生成中のスピナー
- **フィードバック**: ボタンクリック時の微細な動き

**技術スタック**:
- Framer Motion（既存）
- CSS Transitions
- React Spring（必要に応じて）

**作業項目**:
- [ ] 画面遷移アニメーション
- [ ] 推薦結果の表示アニメーション
- [ ] ローディングスピナー
- [ ] マクロインタラクション

---

## Phase 3: ページレベルの実装（2日間）

### 3.1 オンボーディングページの大幅変更（1日）

**対象ファイル**: `src/app/onboarding/page.tsx`

#### 新しいフロー構造
```typescript
const SIMPLIFIED_ONBOARDING_STEPS = [
  {
    id: 'manga-selection',
    title: '読んだことのある漫画を選択',
    description: '3-5作品を選んで、あなたの好みを教えてください',
    minSelection: 3,
    maxSelection: 5,
    component: MangaSelector
  },
  {
    id: 'mood-selection',
    title: '今の気分を選択',
    description: 'どんな気分で漫画を読みたいですか？',
    minSelection: 1,
    maxSelection: 1,
    component: MoodSelector
  }
];
```

#### 主要変更点
1. **Step 3 の削除**: 詳細設定ステップを完全削除
2. **Step 2 の変更**: ジャンル選択から気分選択に変更
3. **選択数の制限**: 漫画選択を3-5作品に制限
4. **進捗の変更**: 2ステップ構成に更新

**作業項目**:
- [ ] ONBOARDING_STEPS の更新
- [ ] Step 3 関連コードの削除
- [ ] 気分選択ステップの実装
- [ ] バリデーションロジックの更新
- [ ] データ保存形式の変更

### 3.2 ダッシュボードの完全リニューアル（1日）

**対象ファイル**: `src/app/dashboard/page.tsx`

#### 新しいダッシュボード構造
```typescript
export default function SimplifiedDashboardPage() {
  const [recommendation, setRecommendation] = useState<SingleRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<SimplifiedUser | null>(null);

  // 単一推薦の生成
  const generateRecommendation = async (mood: MoodType) => {
    // 新しい推薦エンジンを使用
  };

  // アクションハンドラー
  const handleAmazonClick = () => { /* Amazon遷移 + トラッキング */ };
  const handleTryAgain = () => { /* 同じ気分で再推薦 */ };
  const handleChangeMood = () => { /* 気分選択に戻る */ };
  const handleStartOver = () => { /* オンボーディングに戻る */ };
}
```

#### 主要変更点
1. **複数推薦の削除**: 単一推薦のみ表示
2. **ジャンル別推薦の削除**: 気分ベース推薦のみ
3. **統計セクションの簡略化**: 必要最小限の情報のみ
4. **アクション重視**: 明確な次のステップ提示

**作業項目**:
- [ ] 複数推薦表示ロジックの削除
- [ ] 単一推薦表示の実装
- [ ] アクションボタンの実装
- [ ] エラーハンドリングの更新
- [ ] ローディング状態の改善

---

## Phase 4: データ管理とAPIの更新（1日間）

### 4.1 LocalStorage管理の更新（0.5日）

**対象ファイル**: `src/utils/localStorage.ts`

#### 新しいデータ管理クラス
```typescript
export class SimplifiedUserDataManager {
  // 簡略化されたユーザーデータの保存/取得
  saveUser(user: SimplifiedUser): void
  getUser(): SimplifiedUser | null
  
  // 推薦履歴の管理
  saveRecommendation(recommendation: RecommendationRecord): void
  getRecommendationHistory(limit: number = 10): RecommendationRecord[]
  
  // オンボーディングデータの管理
  saveOnboardingData(data: SimplifiedOnboardingData): void
  getOnboardingData(): SimplifiedOnboardingData | null
  
  // データクリア（デバッグ用）
  clearAllData(): void
}
```

**主要変更点**:
- **データ構造の簡略化**: 不要なフィールドの削除
- **推薦履歴の追加**: 過去の推薦記録の管理
- **データサイズの最適化**: 50KB以内への制限

**作業項目**:
- [ ] 新しいデータマネージャーの実装
- [ ] 既存データからの移行ロジック
- [ ] データサイズ監視機能
- [ ] データ整合性チェック

### 4.2 分析機能の調整（0.5日）

**対象ファイル**: `src/utils/analytics.ts`

#### 新しい分析イベント
```typescript
// 気分選択のトラッキング
export const trackMoodSelection = (mood: MoodType, user?: string) => {
  analytics.track('mood_selected', {
    mood_id: mood.id,
    mood_name: mood.name,
    user_id: user,
    timestamp: new Date().toISOString()
  });
};

// 単一推薦のトラッキング
export const trackSingleRecommendation = (
  recommendation: SingleRecommendation,
  user?: string
) => {
  analytics.track('recommendation_generated', {
    manga_id: recommendation.manga.id,
    mood_id: recommendation.mood.id,
    score: recommendation.score,
    confidence: recommendation.confidenceLevel,
    user_id: user
  });
};

// 推薦アクションのトラッキング
export const trackRecommendationAction = (
  action: string,
  recommendation: RecommendationRecord,
  user?: string
) => {
  analytics.track('recommendation_action', {
    action,
    manga_id: recommendation.manga.id,
    mood_id: recommendation.mood.id,
    user_id: user
  });
};
```

**作業項目**:
- [ ] 新しい分析イベントの実装
- [ ] 既存イベントの更新
- [ ] ダッシュボード統計の調整
- [ ] パフォーマンス指標の追加

---

## Phase 5: 統合・テスト・最適化（1-2日間）

### 5.1 統合テスト（0.5日）

**テスト項目**:
- [ ] オンボーディングフロー全体のテスト
- [ ] 推薦生成ロジックのテスト
- [ ] データ永続化の確認
- [ ] エラーハンドリングの検証
- [ ] パフォーマンステスト

**テスト手法**:
- 手動テスト（主要フロー）
- 自動テスト（ユニットテスト）
- デバイステスト（レスポンシブ）
- アクセシビリティテスト

### 5.2 パフォーマンス最適化（0.5日）

**最適化項目**:
- [ ] 推薦生成速度の向上（目標: 200ms以内）
- [ ] UI応答時間の改善（目標: 100ms以内）
- [ ] メモリ使用量の最適化
- [ ] バンドルサイズの確認

**技術的改善**:
- React.memo の適用
- useMemo/useCallback の最適化
- 遅延ローディングの実装
- 不要なライブラリの削除

### 5.3 ユーザビリティテスト（0.5日）

**テスト観点**:
- [ ] 直感性：初回ユーザーが迷わず完了できるか
- [ ] 速度：目標時間（1-2分）で完了できるか
- [ ] 満足度：推薦結果に満足できるか
- [ ] 再利用性：複数回使いたくなるか

**改善点の特定と修正**:
- UI/UX の微調整
- エラーメッセージの改善
- ヘルプテキストの追加
- アニメーション速度の調整

---

## Phase 6: デプロイ・監視（1日間）

### 6.1 本番デプロイ（0.5日）

**デプロイ手順**:
1. [ ] コードレビューの完了
2. [ ] テストの全通過確認
3. [ ] ビルドエラーの解決
4. [ ] Vercel デプロイ実行
5. [ ] 本番環境での動作確認

**デプロイ設定**:
- 環境変数の確認
- ビルド最適化の設定
- エラー監視の設定
- パフォーマンス監視の設定

### 6.2 監視・フィードバック収集（0.5日）

**監視項目**:
- [ ] ページロード時間
- [ ] JavaScript エラー率
- [ ] ユーザー行動フロー
- [ ] コンバージョン率

**フィードバック収集**:
- [ ] 推薦満足度の調査設置
- [ ] ユーザー行動分析の開始
- [ ] A/B テスト準備（必要に応じて）
- [ ] 改善点の特定

---

## リスク管理と軽減策

### 技術的リスク

#### リスク 1: 推薦精度の低下
**軽減策**:
- 既存の推薦エンジンとのA/Bテスト実施
- 複数のスコアリングアルゴリズムの並行テスト
- ユーザーフィードバックによる継続的改善

#### リスク 2: パフォーマンス劣化
**軽減策**:
- 推薦生成の非同期処理
- キャッシュ機能の実装
- 段階的ローディングの採用

#### リスク 3: データ移行の問題
**軽減策**:
- 既存データの自動変換ロジック
- フォールバック機能の実装
- 段階的移行の実施

### ユーザー体験リスク

#### リスク 1: 選択肢不足への不満
**軽減策**:
- 「他の推薦も見る」オプションの提供
- 気分の細分化対応
- カスタマイズ機能の段階的追加

#### リスク 2: 推薦外れのインパクト
**軽減策**:
- 信頼度レベルの表示
- 推薦理由の詳細説明
- 簡単な再推薦機能

### ビジネスリスク

#### リスク 1: コンバージョン率の低下
**軽減策**:
- 旧システムとの並行運用期間設定
- KPI の継続監視
- 迅速なロールバック機能

#### リスク 2: ユーザー離脱の増加
**軽減策**:
- 段階的なユーザー移行
- フィードバック収集の強化
- 迅速な改善サイクル

---

## 成功指標とKPI

### 開発効率指標
- **開発期間**: 目標6-10日以内での完成
- **バグ発生率**: クリティカルバグ0件、マイナーバグ3件以内
- **テスト網羅率**: 主要機能80%以上
- **コードレビュー**: 全変更の100%レビュー完了

### 技術パフォーマンス指標
- **ページロード時間**: 2秒以内（目標値）
- **推薦生成時間**: 200ms以内（目標値）
- **JavaScript エラー率**: 0.1%以下
- **モバイル対応**: 全デバイスでの正常動作

### ユーザー体験指標
- **オンボーディング完了率**: 80%以上（目標値）
- **平均完了時間**: 2分以内（目標値）
- **推薦満足度**: 4.0/5.0以上（目標値）
- **リピート率**: 7日以内40%以上（目標値）

### ビジネス指標
- **コンバージョン率**: 12%以上（目標値）
- **アフィリエイトクリック率**: 維持または向上
- **セッション時間**: 適正レベル（3分程度）
- **ユーザー継続率**: 月次20%増加（目標値）

---

## 実装スケジュール

### 週1（5日間）
```
月: Phase 1.1-1.2 (データ型定義、気分マッピング)
火: Phase 1.3 (推薦エンジン実装)
水: Phase 2.1 (気分選択コンポーネント)
木: Phase 2.2 (単一推薦コンポーネント)
金: Phase 2.3-2.4 (UI拡張、アニメーション)
```

### 週2（5日間）
```
月: Phase 3.1 (オンボーディング改修)
火: Phase 3.2 (ダッシュボード改修)
水: Phase 4 (データ管理、分析更新)
木: Phase 5 (統合テスト、最適化)
金: Phase 6 (デプロイ、監視)
```

**総期間**: 10営業日（2週間）
**バッファ**: 週末を含めた14日間での完成予定

---

## 開発チェックリスト

### Phase 1: 基盤準備
- [ ] 新しいデータ型の定義完了
- [ ] 気分マッピングシステム実装完了
- [ ] 新しい推薦エンジン実装完了
- [ ] 単体テスト作成完了
- [ ] 型安全性の確認完了

### Phase 2: UI実装
- [ ] 気分選択コンポーネント完成
- [ ] 単一推薦表示コンポーネント完成
- [ ] UIコンポーネント拡張完了
- [ ] アニメーション実装完了
- [ ] レスポンシブ対応確認完了

### Phase 3: ページ実装
- [ ] オンボーディングページ改修完了
- [ ] ダッシュボードページ改修完了
- [ ] データフロー整合性確認完了
- [ ] エラーハンドリング実装完了
- [ ] ページ間遷移確認完了

### Phase 4: データ・API
- [ ] LocalStorage管理更新完了
- [ ] 分析機能調整完了
- [ ] データ移行ロジック完了
- [ ] パフォーマンス確認完了

### Phase 5: 統合・テスト
- [ ] 統合テスト完了
- [ ] パフォーマンス最適化完了
- [ ] ユーザビリティテスト完了
- [ ] バグ修正完了
- [ ] 品質保証完了

### Phase 6: デプロイ・監視
- [ ] 本番デプロイ完了
- [ ] 動作確認完了
- [ ] 監視設定完了
- [ ] フィードバック収集開始
- [ ] ドキュメント更新完了

---

## 後続フェーズ（将来的な拡張）

### フェーズ7: 機能拡張（3-6ヶ月後）
- 気分の学習機能
- 時間帯・季節連動
- マルチ推薦オプション
- コミュニティ機能

### フェーズ8: AI強化（6-12ヶ月後）
- 自然言語による気分入力
- 感情分析の導入
- パーソナライゼーション強化
- 予測機能の実装

### フェーズ9: プラットフォーム拡張（1年以上）
- モバイルアプリ化
- クロスメディア対応
- API公開
- パートナーシップ拡大

---

## まとめ

この改修計画は、MangaCompassを現在の複雑なシステムから、ユーザーフレンドリーで直感的な気分ベース推薦システムに変革するための包括的な roadmap です。

**主要な改善点**:
1. **ユーザー体験**: 3ステップから2ステップへの簡略化
2. **推薦精度**: 気分という直感的な要素の導入
3. **決断支援**: 複数選択肢から単一推薦への変更
4. **技術的**: より保守しやすいコードベースの実現

**成功の鍵**:
- 段階的な実装とテスト
- ユーザーフィードバックの継続的収集
- データドリブンな改善サイクル
- 技術的品質の維持

この計画に従って実装することで、MangaCompassは漫画推薦サービスの新しいスタンダードを確立し、ユーザー満足度とビジネス成果の両方を達成できると期待されます。