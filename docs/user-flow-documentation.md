# MangaCompass ユーザーフロードキュメント

## 概要
MangaCompassは、ユーザーの読書履歴と好みに基づいてパーソナライズされた漫画推薦を提供するWebアプリケーションです。本ドキュメントでは、現在実装されているユーザーフローとその詳細について説明します。

## ユーザーフロー概略図

```
┌─────────────────┐
│ ランディングページ│
│    (/)         │
└────────┬────────┘
         │ Get Started
         ▼
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│ Step 1: 漫画選択│ --> │Step 2: ジャンル│ --> │Step 3: 詳細設定│
│  (3-10作品)    │     │   (1-8個)     │     │   (任意)      │
└─────────────────┘     └───────────────┘     └───────┬───────┘
                                                       │ 完了
                                                       ▼
                                              ┌─────────────────┐
                                              │  ダッシュボード  │
                                              │ (推薦結果表示)   │
                                              └─────────────────┘
```

## 詳細フロー

### 1. ランディングページ (/)

**目的**: サービスの紹介とユーザー獲得

**主要コンテンツ**:
- ヒーローセクション
  - タイトル: "Discover Your Next Favorite Manga"
  - 説明文: AI駆動のパーソナライズ推薦機能の紹介
  - CTAボタン: "Get Started Free"

- 機能紹介セクション
  - パーソナライズ推薦
  - 国際読者向け
  - リアルタイム更新

- サンプル漫画表示
  - トップ評価漫画（6作品）
  - 人気漫画（6作品）

**次のステップ**: `/onboarding`へ遷移

### 2. オンボーディングフロー (/onboarding)

#### Step 1: 漫画選択 (manga-selection)

**目的**: ユーザーの読書履歴を収集

**仕様**:
- 表示作品数: 20作品（全50作品からランダム選択）
- 選択可能数: 最小3作品、最大10作品
- UI: カード形式のグリッド表示
- 選択状態: チェックマーク付きのビジュアルフィードバック

**データ収集**:
```typescript
selectedManga: string[] // 選択された漫画のID配列
```

#### Step 2: ジャンル設定 (genre-preferences)

**目的**: 好みのジャンルを特定

**仕様**:
- 自動抽出: Step 1で選択した漫画からジャンルを自動抽出
- 選択可能数: 最小1ジャンル、最大8ジャンル
- 利用可能ジャンル:
  - Shonen
  - Seinen
  - Shojo
  - Josei
  - Action
  - Adventure
  - Comedy
  - Drama
  - Fantasy
  - Horror
  - Mystery
  - Psychological
  - Romance
  - Sci-Fi
  - Slice of Life
  - Sports
  - Supernatural
  - Thriller

**データ収集**:
```typescript
favoriteGenres: string[] // 選択されたジャンル配列
```

#### Step 3: 詳細設定 (preferences)

**目的**: 読書の好みを詳細に設定（任意）

**設定項目**:

1. **漫画のステータス設定**
   - 選択肢: 連載中(ongoing)、完結(completed)、休載中(hiatus)
   - 複数選択可能
   - デフォルト: ongoing, completed

2. **最低評価設定**
   - 範囲: 1.0〜5.0（0.5刻み）
   - スライダーUI
   - デフォルト: 3.0

3. **除外ジャンル設定**
   - 全ジャンルから除外したいものを選択
   - 複数選択可能
   - デフォルト: なし

**データ収集**:
```typescript
preferences: {
  preferredStatus: ('ongoing' | 'completed' | 'hiatus')[],
  minRating: number,
  excludeGenres: string[]
}
```

### 3. ダッシュボード (/dashboard)

**目的**: パーソナライズされた推薦結果の表示

**前提条件**:
- オンボーディング完了（localStorageにデータ保存済み）
- 未完了の場合は、オンボーディングへの誘導を表示

**表示内容**:

1. **メイン推薦セクション**
   - 最大12作品を表示
   - 推薦アルゴリズムによるスコアリング

2. **ジャンル別推薦**
   - 選択した好みジャンル上位3つ
   - 各ジャンル4作品ずつ表示

3. **統計情報**
   - 読書済み作品数
   - その他のデモ統計

**推薦アルゴリズム**:
```
スコア計算の重み付け:
- ジャンル一致: 40%
- 評価: 30%
- 人気度: 20%
- ステータス一致: 10%
```

### 4. データ永続化

**保存場所**: ブラウザのlocalStorage

**保存データ**:
- キー: `mangacompass_user_data`
- 内容: オンボーディングで収集した全データ
- キー: `mangacompass_onboarding_completed`
- 内容: オンボーディング完了フラグ

## 技術的実装詳細

### コンポーネント構成

1. **ページコンポーネント**
   - `src/app/page.tsx` - ランディングページ
   - `src/app/onboarding/page.tsx` - オンボーディング
   - `src/app/dashboard/page.tsx` - ダッシュボード

2. **推薦エンジン**
   - `src/lib/recommendations.ts` - RecommendationEngineクラス
   - スコアリングアルゴリズムの実装
   - ジャンル別、類似作品別の推薦生成

3. **データ型定義**
   ```typescript
   interface User {
     id: string;
     readHistory: string[];
     favoriteGenres: string[];
     preferences: {
       preferredStatus: string[];
       minRating: number;
       excludeGenres: string[];
     };
   }
   
   interface Recommendation {
     manga: Manga;
     score: number;
     reason: string;
     matchPercentage: number;
   }
   ```

### ユーザー体験の特徴

1. **プログレッシブエンハンスメント**
   - 段階的な情報収集
   - 各ステップでの進捗表示
   - 戻る/進むナビゲーション

2. **即時フィードバック**
   - 選択状態の視覚的表示
   - バリデーションメッセージ
   - 進捗パーセンテージ

3. **パーソナライゼーション**
   - 読書履歴に基づく推薦
   - ジャンル嗜好の反映
   - 除外設定の考慮

## 今後の拡張可能性

1. **推薦精度の向上**
   - 協調フィルタリング
   - 機械学習モデルの導入

2. **ソーシャル機能**
   - レビュー・評価機能
   - 読書リストの共有

3. **詳細な分析**
   - 読書傾向の可視化
   - 推薦理由の詳細説明

## まとめ

MangaCompassは、3つのシンプルなステップでユーザーの好みを収集し、パーソナライズされた漫画推薦を提供します。現在の実装は、プロトタイプとして必要十分な機能を備えており、ユーザーテストとフィードバック収集に適した状態です。