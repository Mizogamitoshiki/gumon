// 営業カレンダー(臨時休業・時間変更)のデータ層。
// 実体は Bloom-lCMS の `calendar` API から scripts/sync-menu.mjs が生成する
// calendar.generated.ts(gitignore対象)。「通常と違う日」だけが入っている。
//
// 過去日の除外は **閲覧時にブラウザで** 行う(お知らせと同じ理由)。
// ビルド時に除外すると、日付が過ぎても次のビルドまで古い情報が残るため。
import { CMS_CALENDAR_DAYS } from "./calendar.generated";

export type CalendarDay = {
  /** "YYYY-MM-DD"(タイムゾーン事故を避けるため常にテキスト) */
  date: string;
  state: "closed" | "lunch" | "dinner" | "custom";
  /** "HH:MM"。state=custom のときのみ */
  open?: string;
  close?: string;
  note?: string;
};

export const CALENDAR_DAYS: CalendarDay[] = CMS_CALENDAR_DAYS;

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** ローカル時刻の "YYYY-MM-DD"(Date#toISOStringはUTCになるので使わない) */
export const localDateStr = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const stateLabel = (d: CalendarDay): string => {
  switch (d.state) {
    case "closed":
      return "休業";
    case "lunch":
      return "ランチのみ営業";
    case "dinner":
      return "ディナーのみ営業";
    case "custom":
      return `${d.open ?? ""}〜${d.close ?? ""}の営業`;
  }
};

/** "2026-08-12" → "8/12(水)" */
export const dateLabel = (ds: string): string => {
  const [y, m, d] = ds.split("-").map(Number);
  return `${m}/${d}(${WEEKDAYS[new Date(y, m - 1, d).getDay()]})`;
};

/** 今日の例外(あれば)。無ければ通常営業 */
export const todayException = (now: Date): CalendarDay | undefined =>
  CALENDAR_DAYS.find((d) => d.date === localDateStr(now));

/** 今日以降の例外日を日付順に(今日を含む) */
export const upcomingExceptions = (now: Date, limit = 6): CalendarDay[] => {
  const today = localDateStr(now);
  return CALENDAR_DAYS.filter((d) => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
};
