import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** 初回呼び出し時に接続を作る（ビルド時に環境変数が無くても落ちないように遅延初期化） */
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL が設定されていません");
    client = neon(url);
  }
  return client;
}
