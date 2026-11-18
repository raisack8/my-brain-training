-- このプロジェクト専用スキーマ。他スキーマには一切触れない。
CREATE TABLE IF NOT EXISTS brain_training.questions (
  id         BIGSERIAL PRIMARY KEY,
  body       TEXT NOT NULL CHECK (length(trim(body)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brain_training.replies (
  id          BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES brain_training.questions(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL CHECK (kind IN ('hypothesis', 'result')),
  body        TEXT NOT NULL CHECK (length(trim(body)) > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS replies_question_id_idx ON brain_training.replies (question_id, created_at);

-- ポイント履歴。同じ疑問に同じ理由で二重付与しないよう一意制約。
CREATE TABLE IF NOT EXISTS brain_training.point_logs (
  id          BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES brain_training.questions(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL CHECK (reason IN ('question_posted', 'result_reached')),
  points      INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_id, reason)
);
