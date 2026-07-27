"use client";

import { useMemo, useState } from "react";
import {
  CALENDAR_DAYS,
  localDateStr,
  stateLabel,
  type CalendarDay,
} from "@/lib/calendar";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** 例外の種類ごとの短い記号(色だけに頼らないための文字表示) */
const MARK: Record<CalendarDay["state"], string> = {
  closed: "休",
  lunch: "昼",
  dinner: "夜",
  custom: "時",
};

type Cell =
  | { kind: "blank"; key: string }
  | { kind: "day"; key: string; date: string; day: number; exception?: CalendarDay };

/**
 * 営業カレンダー(月グリッド)。
 *
 * このお店は定休日なし(年中無休)のため、既定は「全日=通常営業」。
 * CMS(`calendar` API)に登録された "通常と違う日" だけを記号で示す。
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
        exception: CALENDAR_DAYS.find((c) => c.date === date),
      });
    }
    // その月に登録されている例外(グリッド下の一覧に使う)
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    const exceptions = CALENDAR_DAYS.filter((c) => c.date.startsWith(prefix)).sort(
      (a, b) => a.date.localeCompare(b.date),
    );
    return { year, month, cells, todayStr, exceptions };
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
                    }${isToday ? " is-today" : ""}`}
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

      {/* 記号だけでは理由が分からないため、その月の例外は文章でも並べる */}
      {view.exceptions.length > 0 && (
        <ul className="gm-cal-notes">
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
