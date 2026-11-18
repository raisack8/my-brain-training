import Link from "next/link";
import { ChevronRight, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTotalPoints, listQuestions } from "@/lib/queries";
import { POINTS } from "@/lib/points";

export const dynamic = "force-dynamic";

const MENUS = [
  {
    href: "/questions",
    title: "疑問を投稿する",
    description: "疑問 → 仮説 → 結果 を積み上げる",
    icon: HelpCircle,
  },
];

export default async function Home() {
  const [total, questions] = await Promise.all([getTotalPoints(), listQuestions()]);
  const done = questions.filter((q) => q.result_count > 0).length;

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-3 gap-2 text-center">
        <Stat label="ポイント" value={total} />
        <Stat label="疑問" value={questions.length} />
        <Stat label="結果まで" value={done} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">メニュー</h2>
        {MENUS.map((m) => (
          <Link key={m.href} href={m.href} className="block">
            <Card className="flex-row items-center gap-4 px-4 py-5 transition-colors hover:bg-muted active:bg-muted">
              <m.icon className="size-7 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.description}</div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </section>

      <p className="text-xs text-muted-foreground">
        疑問を投稿で +{POINTS.question_posted}pt、結果まで書くと +{POINTS.result_reached}pt。
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm" className="gap-1">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
