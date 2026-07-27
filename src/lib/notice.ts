// お知らせ(臨時休業・営業時間の変更・イベント告知など)のデータ層。
// 実体は Bloom-lCMS の `notice` API から scripts/sync-menu.mjs が生成する
// notice.generated.ts(gitignore対象)。
//
// 掲載期間(startAt / endAt)の判定は **閲覧時にブラウザ側で** 行う。
// このサイトはビルド時にCMSの内容を焼き込む方式のため、ビルド時に判定すると
// 「8/12まで」の告知が期限を過ぎても次のビルドまで消えない。臨時休業の告知が
// 古いまま残るのは実害が大きいので、表示の可否は必ず閲覧時刻で決める。
import { CMS_NOTICES } from "./notice.generated";

export type Notice = {
  id: string;
  title: string;
  body?: string;
  /** alert = 臨時休業など見落とされたくないもの(赤) / info = 通常 */
  level: "alert" | "info";
  /** ISO8601。未設定なら即時から */
  startAt?: string;
  /** ISO8601。未設定なら手動で下書きに戻すまで */
  endAt?: string;
};

export const NOTICES: Notice[] = CMS_NOTICES;

/** 指定時刻に掲載すべきお知らせだけを返す */
export const activeNotices = (now: Date): Notice[] =>
  NOTICES.filter((n) => {
    const t = now.getTime();
    if (n.startAt) {
      const s = Date.parse(n.startAt);
      if (!Number.isNaN(s) && t < s) return false;
    }
    if (n.endAt) {
      const e = Date.parse(n.endAt);
      if (!Number.isNaN(e) && t >= e) return false;
    }
    return true;
  });
