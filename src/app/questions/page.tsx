import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { QuestionForm } from "@/components/question-form";
import { listQuestions } from "@/lib/queries";
import { formatDate, questionStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const questions = await listQuestions();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-lg font-semibold">疑問を投稿する</h1>
        <QuestionForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">これまでの疑問 ({questions.length})</h2>
        {questions.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">まだ疑問がありません</p>
        )}
        {questions.map((q) => {
          const status = questionStatus(q.hypothesis_count, q.result_count);
          return (
            <Link key={q.id} href={`/questions/${q.id}`} className="block">
              <Card size="sm" className="gap-2 px-4 transition-colors hover:bg-muted active:bg-muted">
                <p className="line-clamp-3 whitespace-pre-wrap break-words">{q.body}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(q.created_at)}</span>
                  <span className="flex items-center gap-2">
                    仮説 {q.hypothesis_count}
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
