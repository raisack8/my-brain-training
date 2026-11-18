import { Badge } from "@/components/ui/badge";
import { getTotalPoints } from "@/lib/queries";

export async function PointsBadge() {
  const total = await getTotalPoints();
  return (
    <Badge variant="secondary" className="h-7 px-3 text-sm tabular-nums">
      {total} pt
    </Badge>
  );
}
