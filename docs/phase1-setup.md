# Phase 1: プロジェクトセットアップ（1日）

## 概要
MangaCompassプロトタイプの基盤となるNext.jsプロジェクトの作成と基本設定を行います。

## 作業内容

### 1. Next.jsプロジェクト作成
```bash
npx create-next-app@14 manga-compass-prototype --typescript --tailwind --eslint --app
cd manga-compass-prototype
```

### 2. 必要なライブラリインストール
```bash
npm install lucide-react@^0.300.0 framer-motion@^10.16.0 next-themes@^0.2.1
```

### 3. Tailwind CSS詳細設定
- `tailwind.config.js`の設定最適化
- カスタムカラーパレット（青色系）の定義
- レスポンシブブレークポイントの設定

### 4. TypeScript設定
- `tsconfig.json`の最適化
- パスエイリアス（@/）の設定確認

### 5. 基本フォルダ構造作成
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── onboarding/
│   └── dashboard/
├── components/
│   ├── layout/
│   ├── manga/
│   ├── recommendation/
│   └── ui/
├── lib/
├── utils/
└── public/
    └── images/
        └── manga-covers/
```

### 6. Next.js設定
- `next.config.js`でVercel最適化
- 画像最適化設定
- 静的ファイル設定

## 完了基準
- [x] Next.js 14プロジェクトの正常起動
- [x] TypeScript、Tailwind CSSの動作確認
- [x] 必要なライブラリの正常インストール
- [x] フォルダ構造の完成
- [x] 開発サーバーでの「Hello World」表示

## 想定作業時間
- プロジェクト作成: 30分
- ライブラリ設定: 1時間
- フォルダ構造作成: 30分
- 設定ファイル調整: 1時間
- 動作確認: 30分

**合計: 3.5時間**

## 次フェーズへの引き継ぎ
- 基本的なプロジェクト構造の完成
- 開発環境の準備完了
- Phase 2での型定義とUIコンポーネント開発の準備