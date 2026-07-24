// 採用募集のデータ層。実体は Bloom-lCMS の `recruit` API から
// ビルド時に scripts/sync-menu.mjs が生成する recruit.generated.ts(gitignore対象)。
// 公開中の職種が0件=「現在募集していない」。その場合サイトは
// 採用ページを404にし、全ナビ・フッター・サイトマップから「採用」リンクを外す。
import { CMS_RECRUIT_POSITIONS } from "./recruit.generated";

export type RecruitPosition = {
  title: string;
  text: string;
};

export const RECRUIT_POSITIONS: RecruitPosition[] = CMS_RECRUIT_POSITIONS;

/** 募集中かどうか(公開中の職種が1件以上あるか)。ナビ・ページ表示の分岐に使う */
export const IS_RECRUITING = RECRUIT_POSITIONS.length > 0;
