# Amazon API連携PHPスクリプト要件定義

## 1. 概要

### 1.1 目的
MangaCompassプロジェクトのモックデータ（`src/lib/mockData.ts`）を効率的に管理・更新するため、Amazon Product Advertising API（PA-API）を使用してマンガ情報を取得し、TypeScriptファイルに自動的に追加・更新できるPHPスクリプトを開発する。

### 1.2 背景
- 現在、モックデータは手動で管理されており、データの追加・更新に時間がかかる
- Amazon商品情報（ASIN、画像URL、価格など）の正確性を保つ必要がある
- アフィリエイトリンクの生成を自動化したい

## 2. 機能要件

### 2.1 基本機能
1. **マンガ情報の検索**
   - ISBN、タイトル、著者名での検索
   - Amazon PA-APIを使用した商品検索
   - 検索結果の表示とフィルタリング

2. **データ取得機能**
   - 商品詳細情報の取得
     - タイトル（日本語/英語）
     - 著者名
     - ASIN
     - 商品画像URL（高解像度）
     - 価格情報
     - 出版年
     - 巻数情報
   - 画像URLの有効性確認

3. **データ変換機能**
   - Amazon APIレスポンスをMangaインターフェース形式に変換
   - ジャンルのマッピング（Amazon分類→アプリケーション定義ジャンル）
   - アフィリエイトタグ（mangacompass-20）の自動付与

4. **ファイル操作機能**
   - `mockData.ts`への新規エントリ追加
   - 既存エントリの更新（ASIN、画像URL、リンクなど）
   - TypeScript形式での適切なフォーマット維持
   - 重複チェック機能

### 2.2 管理機能
1. **バッチ処理**
   - 複数のISBN/ASINを一括処理
   - CSVファイルからの読み込み対応

2. **データ検証**
   - 必須フィールドの存在確認
   - URL形式の妥当性検証
   - 画像URLのアクセス可能性確認

3. **ログ機能**
   - API呼び出し履歴
   - エラーログ
   - 更新履歴の記録

## 3. 非機能要件

### 3.1 パフォーマンス
- API呼び出しレート制限の遵守（1秒あたり1リクエスト）
- レスポンスのキャッシュ機能
- バッチ処理時の適切な待機時間

### 3.2 セキュリティ
- API認証情報の安全な管理（環境変数使用）
- 入力値のサニタイズ
- ファイル書き込み権限の適切な設定

### 3.3 保守性
- エラーハンドリングの実装
- 詳細なコメントとドキュメント
- モジュール化された設計

## 4. 技術仕様

### 4.1 使用技術
- **言語**: PHP 8.0以上
- **API**: Amazon Product Advertising API v5
- **ライブラリ**:
  - Amazon PA-API PHP SDK
  - Composer（依存関係管理）
  - Monolog（ログ管理）

### 4.2 ディレクトリ構造
```
MangaCompass/
├── scripts/
│   ├── amazon-api/
│   │   ├── index.php           # メインスクリプト
│   │   ├── config/
│   │   │   └── config.php      # 設定ファイル
│   │   ├── src/
│   │   │   ├── AmazonApiClient.php
│   │   │   ├── DataMapper.php
│   │   │   ├── FileUpdater.php
│   │   │   └── Validator.php
│   │   ├── templates/
│   │   │   └── manga-entry.php
│   │   ├── logs/
│   │   ├── cache/
│   │   └── composer.json
│   └── .env.example            # 環境変数サンプル
```

### 4.3 設定ファイル
```php
// .env ファイル例
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_PARTNER_TAG=mangacompass-20
AMAZON_REGION=com
CACHE_DURATION=86400
```

## 5. 入力仕様

### 5.1 コマンドライン引数
```bash
php scripts/amazon-api/index.php --action=add --asin=1591826039
php scripts/amazon-api/index.php --action=update --file=update-list.csv
php scripts/amazon-api/index.php --action=search --title="Fruits Basket"
```

### 5.2 CSVフォーマット
```csv
action,identifier_type,identifier,genres,status,rating,popularity
add,asin,1591826039,"Romance,Comedy,Supernatural",completed,8.9,86
update,asin,1421526158,"Action,Adventure",completed,9.0,95
```

## 6. 出力仕様

### 6.1 mockData.tsへの追加形式
```typescript
{
  id: 'fruits-basket-1',
  title: 'Fruits Basket, Vol. 1',
  author: 'Natsuki Takaya',
  genres: ['Romance', 'Comedy', 'Supernatural'],
  status: 'completed',
  volumes: 23,
  rating: 8.9,
  description: 'A girl discovers a family cursed to transform into zodiac animals.',
  amazonLink: 'https://amazon.com/dp/1591826039/?tag=mangacompass-20',
  imageUrl: 'https://m.media-amazon.com/images/I/[actual-image-id].jpg',
  asin: '1591826039',
  popularity: 86,
  year: 1998
},
```

## 7. エラーハンドリング

### 7.1 想定されるエラー
- API認証エラー
- レート制限エラー
- 商品が見つからない
- ネットワークエラー
- ファイル書き込みエラー

### 7.2 エラー時の挙動
- 詳細なエラーメッセージの表示
- ログファイルへの記録
- 部分的な成功の場合、処理済みデータの保存

## 8. 制約事項

### 8.1 Amazon PA-API制限
- リクエストレート: 1リクエスト/秒
- 日次クォータの制限
- 取得可能な情報の制限

### 8.2 実装上の制約
- PHPスクリプトはローカル環境での実行を想定
- 本番環境へのデプロイは想定しない
- Node.js環境との直接的な統合は行わない

## 9. 将来的な拡張性

### 9.1 検討事項
- 他のAPI（楽天ブックス、紀伊國屋など）との連携
- Web UIの追加
- 自動更新スケジューラー
- 画像の自動ダウンロードと最適化

## 10. ジャンルマッピング仕様

### 10.1 対応ジャンル一覧
アプリケーションで定義されているジャンル:
- Action
- Adventure
- Comedy
- Drama
- Fantasy
- Horror
- Mystery
- Romance
- Sci-Fi
- Slice of Life
- Sports
- Supernatural
- Thriller
- Historical
- Psychological
- School
- Mecha
- Military
- Music
- Cooking

### 10.2 Amazonカテゴリーとのマッピング例
```php
$genreMapping = [
    'Comics & Graphic Novels > Manga > Action & Adventure' => ['Action', 'Adventure'],
    'Comics & Graphic Novels > Manga > Romance' => ['Romance'],
    'Comics & Graphic Novels > Manga > Fantasy' => ['Fantasy'],
    'Comics & Graphic Novels > Manga > Science Fiction' => ['Sci-Fi'],
    'Comics & Graphic Novels > Manga > Horror' => ['Horror'],
    'Comics & Graphic Novels > Manga > Mystery' => ['Mystery'],
    'Comics & Graphic Novels > Manga > School Life' => ['School', 'Slice of Life'],
    'Comics & Graphic Novels > Manga > Sports' => ['Sports'],
    // その他のマッピングルール
];
```

## 11. 納品物

1. PHPスクリプト一式
2. インストール・使用マニュアル
3. API設定ガイド
4. サンプルデータと実行例
5. ジャンルマッピング設定ファイル