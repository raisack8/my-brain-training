"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { POINTS } from "@/lib/points";

export type ActionState = { ok: boolean; message: string; earned?: number; at?: number } | null;

const MAX_LEN = 2000;

function readBody(formData: FormData): string | null {
  const body = String(formData.get("body") ?? "").trim();
  if (!body || body.length > MAX_LEN) return null;
  return body;
}

export async function createQuestion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const body = readBody(formData);
  if (!body) return { ok: false, message: `1〜${MAX_LEN}文字で入力してください`, at: Date.now() };

  await sql`
    WITH q AS (
      INSERT INTO brain_training.questions (body) VALUES (${body}) RETURNING id
    )
    INSERT INTO brain_training.point_logs (question_id, reason, points)
    SELECT id, 'question_posted', ${POINTS.question_posted} FROM q
  `;

  revalidatePath("/", "layout");
  return { ok: true, message: "疑問を投稿しました", earned: POINTS.question_posted, at: Date.now() };
}

export async function createReply(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const questionId = String(formData.get("questionId") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const body = readBody(formData);
  if (!/^\d+$/.test(questionId)) return { ok: false, message: "不正なリクエストです", at: Date.now() };
  if (kind !== "hypothesis" && kind !== "result") return { ok: false, message: "種別を選んでください", at: Date.now() };
  if (!body) return { ok: false, message: `1〜${MAX_LEN}文字で入力してください`, at: Date.now() };

  const [, awarded] = await sql.transaction([
    sql`INSERT INTO brain_training.replies (question_id, kind, body) VALUES (${questionId}, ${kind}, ${body})`,
    kind === "result"
      ? sql`
          INSERT INTO brain_training.point_logs (question_id, reason, points)
          VALUES (${questionId}, 'result_reached', ${POINTS.result_reached})
          ON CONFLICT (question_id, reason) DO NOTHING
          RETURNING points`
      : sql`SELECT 1 WHERE false`,
  ]);

  const earned = (awarded as { points: number }[])[0]?.points ?? 0;
  revalidatePath("/", "layout");
  return {
    ok: true,
    message: kind === "result" ? "結果を記録しました" : "仮説を記録しました",
    earned,
    at: Date.now(),
  };
}
