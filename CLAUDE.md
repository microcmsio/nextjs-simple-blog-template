# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 必要なコマンド

### 開発
```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # プロダクションビルド
npm start           # プロダクションサーバー起動
npm run lint        # ESLint実行
npm run format      # Prettier実行
```

### 環境設定
プロジェクトルートに`.env`ファイルが必要:
```
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
BASE_URL=xxxxxxxxxx
```

## アーキテクチャ

### Next.js App Router構成
- **app/**: Next.js App Routerによるページルーティング
  - 動的ルーティング: `[slug]`, `[current]`, `[tagId]`
  - ネストされたレイアウト構成
- **components/**: 再利用可能なReactコンポーネント
  - 各コンポーネントはindex.tsxとindex.module.cssのペア
- **libs/**: 外部サービスとの連携とユーティリティ
  - `microcms.ts`: microCMS SDK設定とAPI関数
  - `utils.ts`: 日付フォーマットとリッチテキスト処理

### データフロー
1. **microCMS**: ヘッドレスCMS、ブログ記事とタグを管理
2. **型定義**: `Article`, `Blog`, `Tag`, `Writer`型をmicrocms.tsで定義
3. **SSG/ISR**: 静的生成とIncremental Static Regenerationを使用
4. **キャッシュ制御**: middleware.tsでCDNキャッシュポリシーを設定

### コンポーネント設計
- **Atomic Design**的なアプローチ
- **CSS Modules**によるスタイリング
- **TypeScript**による型安全性
- **Server Components**をデフォルトで使用

### 重要な設定
- Node.js 22以上が必須
- Prettierの設定がpackage.jsonに含まれる
- `@/*`パスエイリアスを設定済み
- シンタックスハイライトにhighlight.jsを使用