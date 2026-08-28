// 営業カレンダー(臨時休業・時間変更)のデータ層。
// 実体は Bloom-lCMS の `calendar` API から scripts/sync-menu.mjs が生成する
// calendar.generated.ts(gitignore対象)。「通常と違う日」だけが入っている。
//
// 2 種類のデータを持つ:
//   - CALENDAR_DAYS … 日付ごとの例外(1日=1件)。「8/8 はランチのみ」など
//   - WEEKLY_RULES  … 毎週の決まり(曜日ルール)。「毎週金曜はディナーのみ」など。
//                     CMS に 1 件登録するだけで、適用開始日以降のその曜日すべてに効く
// 同じ日に両方あるときは **日付ごとの例外が優先**(その金曜だけ休業、など)。
// 例外の state="normal" は「毎週の決まりをこの日だけ解除して通常営業」の印。
//
// 過去日の除外・曜日ルールの展開は **閲覧時にブラウザで** 行う(お知らせと同じ理由)。
// ビルド時に展開すると、日付が過ぎても次のビルドまで古い情報が残るため。
import { CMS_CALENDAR_DAYS, CMS_WEEKLY_RULES } from "./calendar.generated";

export type BizState = "closed" | "lunch" | "dinner" | "custom" | "normal";

export type CalendarDay = {
  /** "YYYY-MM-DD"(タイムゾーン事故を避けるため常にテキスト) */
  date: string;
  state: BizState;
  /** "HH:MM"。state=custom のときのみ */
  open?: string;
  close?: string;
  note?: string;
  /** 毎週の決まりから展開した日なら true(日付指定の例外は undefined) */
  weekly?: boolean;
};

export type WeeklyRule = {
  /** 0=日 … 6=土 */
  weekday: number;
  state: BizState;
  open?: string;
  close?: string;
  note?: string;
  /** 適用開始日 "YYYY-MM-DD" */
  from: string;
  /** 適用終了日(この日を含む)。無ければ無期限 */
  until?: string;
};

export const CALENDAR_DAYS: CalendarDay[] = CMS_CALENDAR_DAYS;
export const WEEKLY_RULES: WeeklyRule[] = CMS_WEEKLY_RULES;

export const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** ローカル時刻の "YYYY-MM-DD"(Date#toISOStringはUTCになるので使わない) */
export const localDateStr = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** "YYYY-MM-DD" → 曜日番号(0=日) */
export const weekdayOf = (ds: string): number => {
  const [y, m, d] = ds.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

export const stateLabel = (d: Pick<CalendarDay, "state" | "open" | "close">): string => {
  switch (d.state) {
    case "closed":
      return "休業";
    case "lunch":
      return "ランチのみ営業";
    case "dinner":
      return "ディナーのみ営業";
    case "custom":
      return `${d.open ?? ""}〜${d.close ?? ""}の営業`;
    case "normal":
      return "通常営業";
  }
};

/** "2026-08-12" → "8/12(水)" */
export const dateLabel = (ds: string): string => {
  const [, m, d] = ds.split("-").map(Number);
  return `${m}/${d}(${WEEKDAYS[weekdayOf(ds)]})`;
};

/** その日に効いている毎週の決まり(あれば)。同じ曜日に複数あれば開始日が新しいものを優先 */
export const ruleFor = (ds: string): WeeklyRule | undefined => {
  const wd = weekdayOf(ds);
  return WEEKLY_RULES.filter(
    (r) => r.weekday === wd && r.from <= ds && (!r.until || ds <= r.until),
  ).sort((a, b) => b.from.localeCompare(a.from))[0];
};

/**
 * その日の例外(あれば)。日付ごとの例外 > 毎週の決まり > 通常営業(undefined)。
 * 例外が state="normal" のときは「決まりを解除して通常営業」なので undefined。
 */
export const exceptionFor = (ds: string): CalendarDay | undefined => {
  const explicit = CALENDAR_DAYS.find((d) => d.date === ds);
  if (explicit) return explicit.state === "normal" ? undefined : explicit;
  const rule = ruleFor(ds);
  if (!rule) return undefined;
  return {
    date: ds,
    state: rule.state,
    ...(rule.open ? { open: rule.open } : {}),
    ...(rule.close ? { close: rule.close } : {}),
    ...(rule.note ? { note: rule.note } : {}),
    weekly: true,
  };
};

/** 今日の例外(あれば)。無ければ通常営業 */
export const todayException = (now: Date): CalendarDay | undefined =>
  exceptionFor(localDateStr(now));

/**
 * 今日以降の「日付ごとの例外」を日付順に(今日を含む)。
 * 毎週の決まりは毎週並んで一覧が埋まってしまうので、ここには展開しない
 * (activeWeeklyRules で別途 1 行にまとめて出す)。
 * state="normal" は、決まりを解除する日だけ意味があるので、決まりの効く日に限って出す。
 */
export const upcomingExceptions = (now: Date, limit = 6): CalendarDay[] => {
  const today = localDateStr(now);
  return CALENDAR_DAYS.filter(
    (d) => d.date >= today && (d.state !== "normal" || ruleFor(d.date)),
  )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
};

/** まだ終わっていない毎週の決まり(これから始まるものも含む)。曜日順 */
export const activeWeeklyRules = (now: Date): WeeklyRule[] => {
  const today = localDateStr(now);
  return WEEKLY_RULES.filter((r) => !r.until || r.until >= today).sort(
    (a, b) => a.weekday - b.weekday || a.from.localeCompare(b.from),
  );
};

/** 毎週の決まりの文言。"毎週金曜はディナーのみ営業" / "10/3(金)から毎週金曜は…" */
export const weeklyRuleLabel = (r: WeeklyRule, now?: Date): string => {
  const today = now ? localDateStr(now) : undefined;
  const head = today && r.from > today ? `${dateLabel(r.from)}から` : "";
  const tail = r.until ? `(${dateLabel(r.until)}まで)` : "";
  return `${head}毎週${WEEKDAYS[r.weekday]}曜は${stateLabel(r)}${tail}`;
};

/**
 * 期限のない毎週の決まりだけを 1 文に要約(店舗情報の「定休日」欄などに添える)。
 * サーバー側(ビルド時)から呼ぶ想定なので、日付に依存する表現は入れない。
 * 例: "毎週金曜はディナーのみ営業"。無ければ ""
 */
export const weeklySummary = (): string =>
  WEEKLY_RULES.filter((r) => !r.until)
    .sort((a, b) => a.weekday - b.weekday)
    .map((r) => weeklyRuleLabel(r))
    .join("・");

const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/**
 * schema.org OpeningHoursSpecification 用に、期限のない毎週の決まりを
 * 「昼を開ける曜日 / 夜を開ける曜日 / 時間指定の曜日」へ分ける。
 * 期限付きの決まりや日付ごとの例外は「通常営業時間」ではないので含めない。
 */
export const regularOpeningDays = (): {
  lunch: string[];
  dinner: string[];
  custom: { day: string; opens: string; closes: string }[];
} => {
  const rules = WEEKLY_RULES.filter((r) => !r.until);
  const lunch: string[] = [];
  const dinner: string[] = [];
  const custom: { day: string; opens: string; closes: string }[] = [];
  SCHEMA_DAYS.forEach((day, i) => {
    const r = rules.filter((x) => x.weekday === i).sort((a, b) => b.from.localeCompare(a.from))[0];
    if (!r || r.state === "normal") {
      lunch.push(day);
      dinner.push(day);
      return;
    }
    if (r.state === "lunch") lunch.push(day);
    if (r.state === "dinner") dinner.push(day);
    if (r.state === "custom" && r.open && r.close)
      custom.push({ day, opens: r.open, closes: r.close });
  });
  return { lunch, dinner, custom };
};
