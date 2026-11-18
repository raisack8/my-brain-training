"use client";

import { useActionState, useRef } from "react";
import { createQuestion } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "./action-toast";

export function QuestionForm() {
  const [state, action, pending] = useActionState(createQuestion, null);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state, () => formRef.current?.reset());

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <Textarea
        name="body"
        required
        maxLength={2000}
        rows={3}
        placeholder="今日、疑問に思ったことは？"
        className="text-base"
      />
      <Button type="submit" disabled={pending} className="h-10 w-full">
        {pending ? "投稿中…" : "疑問を投稿 (+3pt)"}
      </Button>
    </form>
  );
}
