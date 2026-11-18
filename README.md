# 疑問ノート

毎日の「疑問 → 仮説 → 結果」を積み上げるスマホ向けノートアプリ。

- 疑問を投稿: +3pt
- 結果までレス: +5pt（1つの疑問につき1回）

## 技術スタック

Next.js (App Router) / shadcn/ui / Tailwind CSS / Neon Postgres (`@neondatabase/serverless`)

## セットアップ

1. `.env.example` を `.env.local` にコピーし、`DATABASE_URL` を設定
2. `npm install`
3. `npm run db:migrate` — `brain_training` スキーマを作成しマイグレーション適用
4. `npm run dev`

## DB

- すべてのテーブルは `brain_training` スキーマに作成されます
- マイグレーション: `db/migrations/*.sql`（適用履歴は `brain_training.schema_migrations`）
- ランナー (`scripts/migrate.ts`) は `brain_training.` 以外を対象にする DDL を拒否します
