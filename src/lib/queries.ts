import "server-only";
import { sql } from "./db";

export type ReplyKind = "hypothesis" | "result";

export type QuestionSummary = {
  id: string;
  body: string;
  created_at: string;
  hypothesis_count: number;
  result_count: number;
};

export type Reply = {
  id: string;
  kind: ReplyKind;
  body: string;
  created_at: string;
};

export async function getTotalPoints(): Promise<number> {
  const rows = await sql`SELECT COALESCE(SUM(points), 0)::int AS total FROM brain_training.point_logs`;
  return rows[0].total as number;
}

export async function listQuestions(): Promise<QuestionSummary[]> {
  return (await sql`
    SELECT q.id, q.body, q.created_at,
      COUNT(r.id) FILTER (WHERE r.kind = 'hypothesis')::int AS hypothesis_count,
      COUNT(r.id) FILTER (WHERE r.kind = 'result')::int     AS result_count
    FROM brain_training.questions q
    LEFT JOIN brain_training.replies r ON r.question_id = q.id
    GROUP BY q.id
    ORDER BY q.created_at DESC
  `) as QuestionSummary[];
}

export async function getQuestion(id: string) {
  const qs = await sql`SELECT id, body, created_at FROM brain_training.questions WHERE id = ${id}`;
  if (qs.length === 0) return null;
  const replies = (await sql`
    SELECT id, kind, body, created_at FROM brain_training.replies
    WHERE question_id = ${id} ORDER BY created_at ASC
  `) as Reply[];
  return { question: qs[0] as { id: string; body: string; created_at: string }, replies };
}
