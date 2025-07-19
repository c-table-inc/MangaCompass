# MangaCompass - フロントエンドプロトタイプ

## プロジェクト概要
MangaCompassは海外読者向けのパーソナライズ漫画推薦プラットフォームのプロトタイプです。ビジネスコンセプトの検証とAI駆動型推薦機能のデモンストレーションを目的とした、Next.jsで構築されたスタンドアローンのフロントエンドデモです。

## ビジネス背景
- **ターゲット市場**: 海外在住の漫画愛好者（18-35歳）
- **コアバリュー**: 読書履歴に基づくパーソナライズ漫画推薦
- **収益モデル**: Amazonアフィリエイトリンク
- **目標**: 本格開発前の市場ニーズと技術的実現可能性の検証

## 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS 3.4
- **ランタイム**: Node.js 20.x
- **パッケージマネージャー**: npm
- **デプロイ**: Vercel（無料枠）
- **データ**: モックデータ（バックエンド不要）

## 主要依存関係
```json
{
  "next": "14.0.0",
  "react": "18.2.0",
  "typescript": "5.0.0",
  "tailwindcss": "3.4.0",
  "lucide-react": "^0.300.0",
  "framer-motion": "^10.16.0",
  "next-themes": "^0.2.1"
}
```

## プロジェクト構造
```
src/
├── app/
│   ├── page.tsx              # ランディングページ
│   ├── onboarding/page.tsx   # ユーザー設定フロー
│   └── dashboard/page.tsx    # 推薦ダッシュボード
├── components/
│   ├── layout/               # Header, Footer, MobileNav
│   ├── manga/                # MangaCard, MangaGrid, MangaSelector
│   ├── recommendation/       # RecommendationCard, RecommendationGrid
│   └── ui/                   # Button, Card, Badge
├── lib/
│   ├── mockData.ts          # 50作品以上のモックデータ
│   ├── types.ts             # TypeScript型定義
│   └── recommendations.ts    # 推薦エンジン
└── utils/
    ├── affiliate.ts         # Amazonアフィリエイトリンク生成
    └── analytics.ts         # デモ用分析機能
```

## 主要機能
1. **ランディングページ**: ヒーローセクション、デモ、機能紹介
2. **オンボーディング**: 2段階プロセス（漫画選択 + ジャンル設定）
3. **ダッシュボード**: パーソナライズ推薦とアフィリエイトリンク
4. **推薦エンジン**: ジャンルマッチング + 評価ベーススコアリング

## 主要データ型
- **Manga**: id, title, author, genres, status, volumes, rating, amazonLink
- **User**: readHistory, favoriteGenres, preferences
- **Recommendation**: manga, score, reason, matchPercentage

## 重要な実装ノート
- セッション間でユーザー設定を保持するためにlocalStorageを使用
- 推薦エンジンの重み: ジャンル一致40%、評価30%、人気度20%、ステータス10%
- 全Amazonリンクにアフィリエイトタグ追加: `mangacompass-20`
- モバイルファーストのレスポンシブデザインが必要
- 実際のバックエンドなし - 全てクライアントサイドでモックデータを使用

## 成功基準
- 3ページの正常動作（ランディング、オンボーディング、ダッシュボード）
- モバイル + デスクトップ対応
- 論理的な推薦結果
- アフィリエイトリンクの正常生成
- Vercelへのデプロイ可能
- ページロード時間3秒以内

## コマンド
フロントエンド専用プロトタイプのため、標準的なNext.jsコマンドを使用:
- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番用ビルド
- `npm run start` - 本番サーバー起動
- `npm run lint` - ESLint実行

## デザインガイドライン
- 青色系カラースキームのクリーンでモダンなインターface
- 漫画表示用のカードベースレイアウト
- オンボーディング用進捗インジケーター
- アフィリエイトリンク用の明確なCTAボタン
- 画像のローディング状態とエラーハンドリング

## デモデータ
プロトタイプには50作品以上の人気漫画タイトルと表紙画像、評価、Amazonアフィリエイトリンクが含まれます。推薦エンジンはユーザーの読書履歴とジャンル設定に基づいて現実的な提案を提供します。

## 開発計画とログ

### フェーズ別開発計画
プロジェクトは5日間・4フェーズで構成されています。詳細な作業手順は`docs/`フォルダに格納されています：

- **[プロジェクト全体概要](docs/project-overview.md)** - 5日間の開発計画全体
- **[Phase 1: プロジェクトセットアップ](docs/phase1-setup.md)** - Next.js基盤構築（1日）
- **[Phase 2: 基本コンポーネント](docs/phase2-components.md)** - UIライブラリ作成（1日）  
- **[Phase 3: ページ実装](docs/phase3-pages.md)** - 推薦エンジンとページ開発（2日）
- **[Phase 4: 最適化・デプロイ](docs/phase4-optimization.md)** - 品質向上と本番デプロイ（1日）

### 作業ログ
各フェーズの実作業ログは`docs/log/`フォルダに記録されています：

- **[Phase 1作業ログ](docs/log/phase1-setup-log.md)** - プロジェクトセットアップの詳細記録
- 今後のフェーズログも順次追加予定

各ログには以下の情報が含まれます：
- 実行したタスクの詳細
- 発生した問題と解決方法
- 完成した成果物
- 技術的評価とパフォーマンス指標
- 次フェーズへの引き継ぎ事項