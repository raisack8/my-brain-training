"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/app/actions";

/** サーバーアクションの結果をトースト表示する */
export function useActionToast(state: ActionState, onSuccess?: () => void) {
  useEffect(() => {
    if (!state?.at) return;
    if (!state.ok) {
      toast.error(state.message);
      return;
    }
    toast.success(state.earned ? `${state.message}  +${state.earned}pt` : state.message);
    onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.at]);
}
