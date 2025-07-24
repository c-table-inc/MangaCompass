# Google Analytics 4 セットアップガイド

## Vercelでの環境変数設定

1. **Vercelダッシュボードにログイン**
   - https://vercel.com にアクセス
   - MangaCompassプロジェクトを選択

2. **環境変数の追加**
   - Settings → Environment Variables に移動
   - 以下の環境変数を追加:
     ```
     Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
     Value: G-65GP8PTHH9
     Environment: Production, Preview, Development
     ```
   - "Save"をクリック

3. **デプロイの再実行**
   - Deploymentsタブに移動
   - 最新のデプロイの"..."メニューから"Redeploy"を選択
   - "Use existing Build Cache"のチェックを外す
   - "Redeploy"をクリック

## 確認方法

1. **ブラウザのコンソールで確認**
   - デプロイ後のサイトにアクセス
   - 開発者ツールのコンソールを開く
   - 以下のログが表示されることを確認:
     - `GA_MEASUREMENT_ID: G-65GP8PTHH9`
     - `Google Analytics script loaded`
     - `Google Analytics initialized with ID: G-65GP8PTHH9`

2. **Google Analytics リアルタイムで確認**
   - Google Analytics 4 にログイン
   - レポート → リアルタイム に移動
   - サイトにアクセスして、ユーザー数が表示されることを確認

## トラブルシューティング

### GAが反応しない場合

1. **環境変数の確認**
   - Vercelダッシュボードで環境変数が正しく設定されているか確認
   - `NEXT_PUBLIC_`プレフィックスが付いているか確認

2. **広告ブロッカーの無効化**
   - 広告ブロッカーやプライバシー拡張機能を一時的に無効化
   - シークレットモードで確認

3. **GA4プロパティの確認**
   - GA4の管理画面でデータストリームが正しく設定されているか確認
   - 測定IDが正しいか確認

4. **CSPの確認**
   - ブラウザコンソールでCSPエラーが出ていないか確認
   - 必要に応じてCSPヘッダーを調整

## 追跡されるイベント

- **page_view**: ページビュー
- **view_item**: 漫画の詳細表示
- **select_item**: 推薦漫画のクリック
- **tutorial_progress**: オンボーディングの進捗
- **affiliate_click**: アフィリエイトリンクのクリック