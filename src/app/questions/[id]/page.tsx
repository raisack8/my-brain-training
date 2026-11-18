import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReplyForm } from "@/components/reply-form";
import { getQuestion } from "@/lib/queries";
import { formatDate, questionStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const data = await getQuestion(id);
  if (!data) notFound();

  const { question, replies } = data;
  const hypothesisCount = replies.filter((r) => r.kind === "hypothesis").length;
  const resultCount = replies.length - hypothesisCount;
  const status = questionStatus(hypothesisCount, resultCount);

  return (
    <div className="space-y-5">
      <Link href="/questions" className="inline-flex items-center text-sm text-muted-foreground">
        <ChevronLeft className="size-4" />
        一覧へ
      </Link>

      <Card className="gap-2 px-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">疑問</Badge>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="whitespace-pre-wrap break-words text-base">{question.body}</p>
        <div className="text-xs text-muted-foreground">{formatDate(question.created_at)}</div>
      </Card>

      <ol className="space-y-3 border-l pl-4">
        {replies.map((r) => (
          <li key={r.id}>
            <Card size="sm" className={cn("gap-1.5 px-4", r.kind === "result" && "ring-foreground/40")}>
              <div className="flex items-center justify-between">
                <Badge variant={r.kind === "result" ? "default" : "secondary"}>
                  {r.kind === "result" ? "結果" : "仮説"}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
              </div>
              <p className="whitespace-pre-wrap break-words">{r.body}</p>
            </Card>
          </li>
        ))}
        {replies.length === 0 && <li className="text-sm text-muted-foreground">まずは仮説を立ててみよう</li>}
      </ol>

      <ReplyForm questionId={question.id} hasResult={resultCount > 0} />
    </div>
  );
}
