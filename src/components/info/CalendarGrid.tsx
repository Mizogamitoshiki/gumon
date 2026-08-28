"use client";

import { useMemo, useState } from "react";
import {
  CALENDAR_DAYS,
  WEEKDAYS,
  WEEKLY_RULES,
  dateLabel,
  exceptionFor,
  localDateStr,
  ruleFor,
  stateLabel,
  type CalendarDay,
  type WeeklyRule,
} from "@/lib/calendar";

/** 例外の種類ごとの短い記号(色だけに頼らないための文字表示) */
const MARK: Record<CalendarDay["state"], string> = {
  closed: "休",
  lunch: "昼",
  dinner: "夜",
  custom: "時",
  // normal は「決まりを解除して通常営業」= 記号なしで描く(exceptionFor が undefined を返す)
  normal: "",
};

type Cell =
  | { kind: "blank"; key: string }
  | { kind: "day"; key: string; date: string; day: number; exception?: CalendarDay };

/**
 * 営業カレンダー(月グリッド)。
 *
 * このお店は定休日なし(年中無休)のため、既定は「全日=通常営業」。
 * CMS(`calendar` API)に登録された "通常と違う日" だけを記号で示す。
 * 「毎週金曜はディナーのみ」のような毎週の決まりは、その曜日すべてに展開して
 * 同じ記号で描く(日付ごとの例外があればそちらが優先)。
 * 休みを勝手に作らない = 事実だけを描く。
 *
 * 表示月は **閲覧時にブラウザの時刻から** 決める。静的書き出しのサイトで
 * ビルド時に決めると、月が変わっても次のビルドまで先月が出続けるため
 * (BusinessCalendar / お知らせ帯と同じ方針)。
 * 初回描画では月を確定できないので、グリッドはマウント後に出す。
 */
export default function CalendarGrid() {
  // 「今月」を基準に前後へ動かすオフセット(0=今月)
  const [offset, setOffset] = useState(0);
  const [now] = useState(() => new Date());

  const view = useMemo(() => {
    const base = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const year = base.getFullYear();
    const month = base.getMonth(); // 0-11
    const firstWeekday = base.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = localDateStr(now);

    const cells: Cell[] = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ kind: "blank", key: `b${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        kind: "day",
        key: date,
        date,
        day: d,
        exception: exceptionFor(date),
      });
    }
    // その月に登録されている日付ごとの例外(グリッド下の一覧に使う)。
    // 「通常営業」は毎週の決まりを解除する日だけ意味があるので、決まりの効く日に限る
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    const exceptions = CALENDAR_DAYS.filter(
      (c) => c.date.startsWith(prefix) && (c.state !== "normal" || ruleFor(c.date)),
    ).sort((a, b) => a.date.localeCompare(b.date));
    // その月に(一部でも)かかっている毎週の決まり。毎週ぶん並べず 1 行にまとめる
    const monthStart = `${prefix}01`;
    const monthEnd = `${prefix}${String(daysInMonth).padStart(2, "0")}`;
    const rules: WeeklyRule[] = WEEKLY_RULES.filter(
      (r) => r.from <= monthEnd && (!r.until || r.until >= monthStart),
    ).sort((a, b) => a.weekday - b.weekday || a.from.localeCompare(b.from));
    return { year, month, cells, todayStr, exceptions, rules };
  }, [now, offset]);

  return (
    <div className="gm-cal" data-info-row>
      {/* 月の移動。前月へは今月より前に戻れないようにはせず、過去も見られる */}
      <div className="gm-cal-head">
        <button
          type="button"
          className="gm-cal-nav"
          onClick={() => setOffset((o) => o - 1)}
          aria-label="前の月を表示"
        >
          <span aria-hidden="true">←</span>
        </button>
        <p className="gm-cal-month" aria-live="polite">
          {view.year}年 {view.month + 1}月
        </p>
        <button
          type="button"
          className="gm-cal-nav"
          onClick={() => setOffset((o) => o + 1)}
          aria-label="次の月を表示"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <table className="gm-cal-table">
        <caption className="gm-cal-caption">
          {view.year}年{view.month + 1}月の営業カレンダー。記号のない日は通常営業です。
        </caption>
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} scope="col" className="gm-cal-wd">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(view.cells.length / 7) }, (_, row) => (
            <tr key={row}>
              {view.cells.slice(row * 7, row * 7 + 7).map((cell) => {
                if (cell.kind === "blank") return <td key={cell.key} />;
                const ex = cell.exception;
                const isToday = cell.date === view.todayStr;
                return (
                  <td
                    key={cell.key}
                    className={`gm-cal-cell${ex ? " has-ex" : ""}${
                      ex?.state === "closed" ? " is-closed" : ""
                    }${ex?.weekly ? " is-weekly" : ""}${isToday ? " is-today" : ""}`}
                    aria-current={isToday ? "date" : undefined}
                  >
                    <span className="gm-cal-num">{cell.day}</span>
                    {/* 記号は色だけに頼らない情報(WCAG)。読み上げ用に全文も置く */}
                    <span className="gm-cal-mark" aria-hidden="true">
                      {ex ? MARK[ex.state] : ""}
                    </span>
                    {ex && <span className="gm-sr-only">{stateLabel(ex)}</span>}
                    {isToday && <span className="gm-sr-only">（本日）</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="gm-cal-legend">
        <li>
          <span className="gm-cal-legend-mark" aria-hidden="true">
            休
          </span>
          休業
        </li>
        <li>
          <span className="gm-cal-legend-mark" aria-hidden="true">
            昼
          </span>
          昼のみ営業
        </li>
        <li>
          <span className="gm-cal-legend-mark" aria-hidden="true">
            夜
          </span>
          夜のみ営業
        </li>
        <li>
          <span className="gm-cal-legend-mark" aria-hidden="true">
            時
          </span>
          時間変更
        </li>
        <li className="gm-cal-legend-plain">記号なし ＝ 通常営業</li>
      </ul>

      {/* 記号だけでは理由が分からないため、その月の決まり・例外は文章でも並べる */}
      {(view.rules.length > 0 || view.exceptions.length > 0) && (
        <ul className="gm-cal-notes">
          {view.rules.map((r) => (
            <li key={`rule-${r.weekday}-${r.from}`}>
              <span className="gm-cal-notes-date">毎週{WEEKDAYS[r.weekday]}曜</span>
              <span>
                {stateLabel(r)}
                {r.from > view.todayStr && `（${dateLabel(r.from)}から）`}
                {r.until && `（${dateLabel(r.until)}まで）`}
                {r.note && `（${r.note}）`}
              </span>
            </li>
          ))}
          {view.exceptions.map((d) => {
            const day = Number(d.date.slice(-2));
            return (
              <li key={d.date}>
                <span className="gm-cal-notes-date">{view.month + 1}月{day}日</span>
                <span>
                  {stateLabel(d)}
                  {d.note && `（${d.note}）`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
