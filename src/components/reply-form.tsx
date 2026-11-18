"use client";

import { useActionState, useRef, useState } from "react";
import { createReply } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useActionToast } from "./action-toast";

const KINDS = [
  { value: "hypothesis", label: "仮説", placeholder: "こうなんじゃないか？という仮説" },
  { value: "result", label: "結果", placeholder: "調べた・試した結果わかったこと" },
] as const;

export function ReplyForm({ questionId, hasResult }: { questionId: string; hasResult: boolean }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["value"]>("hypothesis");
  const [state, action, pending] = useActionState(createReply, null);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state, () => formRef.current?.reset());
  const current = KINDS.find((k) => k.value === kind)!;

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="kind" value={kind} />
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {KINDS.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => setKind(k.value)}
            className={cn(
              "h-9 rounded-md text-sm font-medium transition-colors",
              kind === k.value ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>
      <Textarea
        name="body"
        required
        maxLength={2000}
        rows={3}
        placeholder={current.placeholder}
        className="text-base"
      />
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending
          ? "送信中…"
          : kind === "result" && !hasResult
            ? "結果をレス (+5pt)"
            : `${current.label}をレス`}
      </Button>
    </form>
  );
}
