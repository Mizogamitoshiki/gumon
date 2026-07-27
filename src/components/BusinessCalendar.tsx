"use client";

import { useEffect, useState } from "react";
import {
  dateLabel,
  stateLabel,
  todayException,
  upcomingExceptions,
  type CalendarDay,
} from "@/lib/calendar";

/**
 * 営業のご案内(本日の営業状態 + 直近の休業・時間変更の予定)。
 * 過去日の除外を閲覧時に行うため、マウント後にブラウザの時刻で判定する
 * (ビルド時判定だと過ぎた予定が次のビルドまで残る)。初回描画では出さない。
 */
export default function BusinessCalendar() {
  const [today, setToday] = useState<CalendarDay | null>(null);
  const [upcoming, setUpcoming] = useState<CalendarDay[] | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(todayException(now) ?? null);
    setUpcoming(upcomingExceptions(now));
  }, []);

  // 判定前(SSR/初回描画)は何も出さない
  if (upcoming === null) return null;

  return (
    <div className="gm-bizcal" data-info-row>
      <p className={`gm-bizcal-today ${today?.state === "closed" ? "closed" : ""}`}>
        {today
          ? `本日は${stateLabel(today)}です${today.note ? `(${today.note})` : ""}`
          : "本日は通常営業です(昼 11:30–15:00 ／ 夜 18:00–23:30)"}
      </p>
      {upcoming.length > 0 && (
        <ul className="gm-bizcal-list">
          {upcoming.map((d) => (
            <li key={d.date}>
              <span className="gm-bizcal-date">{dateLabel(d.date)}</span>
              <span>
                {stateLabel(d)}
                {d.note && <span className="gm-bizcal-note">({d.note})</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
