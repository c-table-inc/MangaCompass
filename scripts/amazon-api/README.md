# MangaCompass Amazon API Data Manager

## 概要
MangaCompassプロジェクトのモックデータを効率的に管理するためのWeb UIです。Amazon Product Advertising APIを活用してマンガ情報を検索し、TypeScriptファイルに自動的に追加・更新できます。

## 主要機能
- 🔍 Amazon商品検索（タイトル、著者、ASIN、ISBN）
- 📝 ブラウザベースのデータ入力・編集
- 🎨 リアルタイムTypeScriptコードプレビュー
- 📋 現在のモックデータ閲覧・管理
- 📝 システムログ表示
- 🔄 自動バックアップ機能

## セットアップ手順

### 1. 依存関係のインストール
```bash
cd scripts/amazon-api
composer install
```

### 2. 環境設定
```bash
# 環境設定ファイルをコピー
cp .env.example .env

# .envファイルを編集して以下を設定:
# - Amazon API認証情報
# - Web UI認証情報
# - ファイルパス設定
```

### 3. ディレクトリ権限設定
```bash
# ログとキャッシュディレクトリに書き込み権限を付与
chmod 755 logs cache backups
chmod 666 logs/*.log
```

### 4. Webサーバー設定
- Apache/Nginxの設定でpublicディレクトリをドキュメントルートに設定
- PHP 8.0以上が必要
- mod_rewriteが有効である必要あり

## 使用方法

### 1. Web UIへのアクセス
```
http://localhost/scripts/amazon-api/public/
```

### 2. 認証
- デフォルト認証情報（.envで変更可能）:
  - ユーザー名: admin
  - パスワード: .envファイルで設定

### 3. マンガの追加
1. 「Search & Add」タブで商品検索
2. 検索結果から対象商品を選択
3. 詳細情報を入力・編集
4. プレビューで確認後、追加実行

### 4. データの管理
- 「Current Data」タブで現在のデータを閲覧
- 「Logs」タブでシステムログを確認
- 「Settings」タブで設定確認

## API エンドポイント

### 検索API
```
POST /api/search.php
Content-Type: application/json

{
  "query": "Naruto",
  "type": "title|author|asin|isbn"
}
```

### 追加API
```
POST /api/add.php
Content-Type: application/json

{
  "manga_data": {
    "id": "naruto-1",
    "title": "Naruto, Vol. 1",
    "author": "Masashi Kishimoto",
    "genres": ["Action", "Adventure"],
    "status": "completed",
    "rating": 8.8,
    ...
  }
}
```

### データ取得API
```
GET /api/list.php
```

### ログ取得API
```
GET /api/logs.php?type=app&lines=100
```

## セキュリティ機能

### 認証
- Basic認証による基本的なアクセス制限
- .htaccessによるディレクトリ保護

### 入力検証
- XSS攻撃対策（HTMLエスケープ）
- CSRF攻撃対策（実装予定）
- 入力値のサニタイズ

### ファイル保護
- 設定ファイルへの直接アクセス禁止
- ログファイルの保護
- バックアップファイルの保護

## ディレクトリ構造
```
scripts/amazon-api/
├── public/              # Web UI（ドキュメントルート）
│   ├── index.php       # メイン画面
│   ├── api/            # API エンドポイント
│   ├── assets/         # CSS/JavaScript
│   └── templates/      # HTML テンプレート
├── src/                # PHPクラス
├── config/             # 設定ファイル
├── logs/               # ログファイル
├── cache/              # キャッシュ
├── backups/            # バックアップ
├── .env                # 環境設定
└── composer.json       # 依存関係
```

## トラブルシューティング

### よくある問題

#### 1. 権限エラー
```bash
# ディレクトリ権限を確認・修正
chmod -R 755 logs cache backups
chown -R www-data:www-data logs cache backups
```

#### 2. Composer依存関係エラー
```bash
# 依存関係を再インストール
rm -rf vendor
composer install
```

#### 3. ファイルパスエラー
- .envファイルのMOCK_DATA_PATHが正しいか確認
- 相対パスが正しく設定されているか確認

#### 4. API呼び出しエラー
- Amazon API認証情報が正しいか確認
- ネットワーク接続を確認
- APIクォータを確認

### ログファイル
- アプリケーションログ: `logs/app.log`
- APIログ: `logs/api.log`
- Webサーバーログも合わせて確認

## 制限事項
- ローカル環境での使用を想定
- 同時アクセスは想定していない
- Amazon API制限に依存
- 大量データの処理には不向き

## 開発者向け情報

### カスタマイズ
- ジャンルマッピング: `src/DataMapper.php`
- UI スタイル: `public/assets/css/style.css`
- JavaScript 機能: `public/assets/js/main.js`

### 拡張機能の追加
1. 新しいAPIエンドポイントを`public/api/`に追加
2. 対応するJavaScript関数を`main.js`に追加
3. UI要素を`index.php`に追加

## ライセンス
このプロジェクトはMITライセンスの下で公開されています。