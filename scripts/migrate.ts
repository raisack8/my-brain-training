/**
 * brain_training スキーマ専用のマイグレーションランナー。
 * - db/migrations/*.sql をファイル名順に適用
 * - 適用履歴は brain_training.schema_migrations に記録
 * - brain_training 以外のスキーマを参照する DDL は実行前に拒否する
 */
import { neon } from "@neondatabase/serverless";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SCHEMA = "brain_training";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL が設定されていません (.env.local)");
const sql = neon(url);

const DDL = /\b(CREATE|ALTER|DROP|TRUNCATE)\s+(UNIQUE\s+)?(TABLE|INDEX|VIEW|SEQUENCE|TYPE|FUNCTION|SCHEMA|TRIGGER)\b/i;

function splitStatements(text: string): string[] {
  return text
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n")
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function assertScoped(stmt: string, file: string) {
  if (!DDL.test(stmt)) return;
  const refs = stmt.match(/\b([a-z_][a-z0-9_]*)\.[a-z_][a-z0-9_]*/gi) ?? [];
  const schemas = refs.map((r) => r.split(".")[0].toLowerCase());
  if (schemas.length === 0 || schemas.some((s) => s !== SCHEMA)) {
    throw new Error(`[${file}] ${SCHEMA} 以外(または未修飾)の対象を含むDDLは禁止です:\n${stmt}`);
  }
}

async function main() {
  await sql.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA}`);
  await sql.query(
    `CREATE TABLE IF NOT EXISTS ${SCHEMA}.schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`,
  );
  const applied = new Set(
    ((await sql.query(`SELECT name FROM ${SCHEMA}.schema_migrations`)) as { name: string }[]).map((r) => r.name),
  );

  const dir = join(process.cwd(), "db/migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const stmts = splitStatements(readFileSync(join(dir, file), "utf8"));
    stmts.forEach((s) => assertScoped(s, file));
    await sql.transaction([
      ...stmts.map((s) => sql.query(s)),
      sql.query(`INSERT INTO ${SCHEMA}.schema_migrations (name) VALUES ($1)`, [file]),
    ]);
    console.log(`applied: ${file}`);
  }
  console.log("migrations up to date");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
