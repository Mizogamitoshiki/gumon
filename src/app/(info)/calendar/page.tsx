import type { Metadata } from "next";
import MenuHero from "@/components/menu/MenuHero";
import InfoSection from "@/components/info/InfoSection";
import CalendarGrid from "@/components/info/CalendarGrid";
import TelCta from "@/components/info/TelCta";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { HOURS } from "@/lib/site";

export const metadata: Metadata = {
  title: "営業カレンダー — 定休日なし・年中無休",
  description:
    "中国料理 愚問の営業カレンダー。定休日はありません(年中無休)。昼 11:30–15:00(L.O.14:30)／夜 18:00–23:30(L.O.23:00)。臨時休業・営業時間の変更はカレンダーでご確認いただけます。お問い合わせは072-430-6038。",
  alternates: { canonical: "/calendar" },
};

const HERO = {
  titleEn: "CALENDAR",
  titleJp: "営業カレンダー",
  lead: "いつでも、あたたかい一皿を。",
  items: [],
};

export default function Page() {
  return (
    <main className="gm-detail-main">
      <BreadcrumbJsonLd trail={[{ name: "営業カレンダー", path: "/calendar" }]} />
      <MenuHero category={HERO} />

      <InfoSection eyebrow="CALENDAR" title="営業カレンダー">
        {/* 最重要の事実を先に断言する: このお店に定休日はない */}
        <p className="gm-cal-lead" data-info-row>
          愚問に<strong>定休日はありません（年中無休）</strong>。
          お盆・年末年始などで臨時にお休みや時間の変更をいただく日だけ、
          下のカレンダーに記号でお示しします。
        </p>

        <CalendarGrid />

        <dl className="gm-cal-hours" data-info-row>
          <div>
            <dt>昼</dt>
            <dd>
              {HOURS.lunch.opens}–{HOURS.lunch.closes}
              <span className="gm-cal-lo">（L.O. {HOURS.lunch.lo}）</span>
            </dd>
          </div>
          <div>
            <dt>夜</dt>
            <dd>
              {HOURS.dinner.opens}–{HOURS.dinner.closes}
              <span className="gm-cal-lo">（L.O. {HOURS.dinner.lo}）</span>
            </dd>
          </div>
          <div>
            <dt>定休日</dt>
            <dd>{HOURS.closed}</dd>
          </div>
        </dl>

        <p className="gm-menu-note" data-info-row>
          ※
          仕入れや貸切のご予約により、急に営業時間が変わることがあります。お出かけ前にお電話でご確認いただけると確実です。
        </p>
      </InfoSection>

      <TelCta lead="ご予約・ご確認を承っております。" />
    </main>
  );
}
