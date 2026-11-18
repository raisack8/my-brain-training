const fmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | Date) {
  return fmt.format(new Date(value));
}

export function questionStatus(hypothesisCount: number, resultCount: number) {
  if (resultCount > 0) return { label: "結果あり", variant: "default" as const };
  if (hypothesisCount > 0) return { label: "検証中", variant: "secondary" as const };
  return { label: "仮説待ち", variant: "outline" as const };
}
