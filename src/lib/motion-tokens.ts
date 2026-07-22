// src/lib/motion-tokens.ts
// ============================================================
// モーションの「デザイントークン」。
// duration / easing / stagger / 移動量を、手打ちのバラバラな値ではなく
// スケールとして一元定義する。サイト全体の動きに一貫性が生まれ、
// 「なんとなく上質」な体験は 9 割ここで決まる。
//
// ui-ux-pro-max 等のデザインシステムと連携する場合は、
// デザインシステムの style(minimal / elegant / playful / bold ...)を
// MOTION_PRESETS の 1 プリセットへマッピングし、
// 全コンポーネントはプリセット経由で値を参照する(SKILL.md の連携章を参照)。
// ============================================================

/** 秒。UI の距離感に合わせた 5 段階 */
export const DURATION = {
  instant: 0.2, // ホバー・マイクロインタラクション
  fast: 0.45, // 小要素の出現
  base: 0.7, // 標準の出現アニメーション
  slow: 1.1, // 見出し・ヒーローの見せ場
  epic: 1.6, // 一枚絵のリビール・カウンター
} as const;

/** GSAP の ease 文字列。用途名で選べるようにする */
export const EASE = {
  out: "power2.out", // 汎用。迷ったらこれ
  outSoft: "power1.out", // 控えめ・ミニマル
  outHard: "power4.out", // 鋭く飛び込んで静止。ボールドな見出し
  expo: "expo.out", // 高級感のある減速。エレガント系
  inOut: "power2.inOut", // 位置の入れ替え・カラー遷移
  inOutHard: "power4.inOut", // 大胆なワイプ・クリップリビール
  back: "back.out(1.7)", // 少し行き過ぎて戻る。遊び心
  elastic: "elastic.out(1, 0.4)", // バウンス。使いすぎ注意
  linear: "none", // scrub 連動では原則これ(等速でスクロールに従属)
} as const;

/** 兄弟要素の時間差(秒/要素) */
export const STAGGER = {
  tight: 0.05, // 文字分割・多数の小要素
  base: 0.08, // カード 3〜6 枚
  relaxed: 0.12, // 大きなブロックをゆったり
} as const;

/** 出現時の移動距離(px)。視覚的な「重さ」のスケール */
export const DISTANCE = {
  xs: 16,
  sm: 24,
  md: 40,
  lg: 64,
  xl: 120,
} as const;

export type MotionStyle = "minimal" | "elegant" | "playful" | "bold";

export interface MotionPreset {
  /** 出現系の標準 ease */
  ease: string;
  /** 見せ場(ヒーロー・リビール)用の強調 ease */
  easeEmphasis: string;
  /** 標準 duration(秒) */
  duration: number;
  /** 見せ場用の長め duration(秒) */
  durationLong: number;
  /** 標準 stagger(秒) */
  stagger: number;
  /** 出現時の移動距離(px) */
  distance: number;
  /** ScrollTrigger の scrub 推奨値(数値=追従の滑らかさ・秒) */
  scrub: number;
  /** スタイルの意図・使い方メモ */
  note: string;
}

/**
 * デザインシステムの style(雰囲気)→ GSAP 初期値のマッピング。
 * あくまで「初期値」。実装後に実機で見て 1〜2 割の範囲で調整してよい。
 */
export const MOTION_PRESETS: Record<MotionStyle, MotionPreset> = {
  minimal: {
    ease: EASE.out,
    easeEmphasis: EASE.inOut,
    duration: 0.7,
    durationLong: 0.8,
    stagger: STAGGER.base,
    distance: DISTANCE.sm, // 20〜40px。動きは「気配」程度
    scrub: 0.6, // scrub は控えめに追従
    note: "opacity 中心。移動は小さく、回転・バウンスは使わない",
  },
  elegant: {
    ease: "power3.out",
    easeEmphasis: EASE.expo,
    duration: 1.2,
    durationLong: 1.4,
    stagger: STAGGER.relaxed,
    distance: 48, // 40〜60px。ゆったり大きく
    scrub: 1.5, // 余韻のある追従
    note: "expo.out の長い減速で高級感。行マスクの text-reveal と好相性",
  },
  playful: {
    ease: EASE.back,
    easeEmphasis: EASE.elastic,
    duration: 0.6,
    durationLong: 0.7,
    stagger: 0.06,
    distance: DISTANCE.md,
    scrub: 0.4, // キビキビ追従
    note: "rotation ±6deg や scale 0.9→1 を足す。バウンスは1画面1箇所まで",
  },
  bold: {
    ease: EASE.expo,
    easeEmphasis: EASE.inOutHard,
    duration: 1.0,
    durationLong: 1.2,
    stagger: STAGGER.tight,
    distance: 96, // 60〜120px、あるいは 100%(画面外から)
    scrub: 0.8,
    note: "clip-path / マスクのリビールと大きな移動。コントラスト強めの配色と組む",
  },
};

/** style 名からプリセットを取得するヘルパー */
export function preset(style: MotionStyle): MotionPreset {
  return MOTION_PRESETS[style];
}

// ============================================================
// GUMON ブランドマッピング(ui-ux-pro-max デザインシステム連携)
// style: luxury/serif 系 → elegant プリセットに丸める。
// CLAUDE.md のスクロール演出ルール(移動量 8〜40px)が優先のため
// distance のみ上書きする。
// ============================================================
export const GUMON_MOTION: MotionPreset = {
  ...MOTION_PRESETS.elegant,
  distance: 32,
};

// ============================================================
// シネマティック変換(docs/cinematic/experience-plan.md 9章)の追加トークン。
// S4「火の返事」の章句・S5「受け止めの半拍」など、scrub タイムライン内の
// 新規演出はここから値を引く(rise-line / exit-line / fade-quiet)。
// duration はタイムライン単位(スクロール比率)、非 scrub の実時間ではない。
// ============================================================
export const GUMON_SCENE_MOTION = {
  /** 章句の行マスク入場(rise-line) */
  riseLine: { duration: 0.7, ease: "expo.out" },
  /** 章句・休符行の退場(exit-line) */
  exitLine: { duration: 0.5, ease: "power2.in" },
  /** 静けさ区間の弱い出現(fade-quiet)。blur なし・移動 8px */
  fadeQuiet: { duration: 0.8, ease: "power1.out", y: 8 },
} as const;

/** GUMON のテーマ色。コンポーネントに raw hex を直書きしないための唯一の出所 */
export const THEME_COLORS = {
  bg: "#1c1b19", // マットブラック(背景)
  bgDeep: "#161412", // さらに暗い面(フッター・額縁)
  fg: "#f2f0eb", // アイボリー(文字)
  stone: "#b9b2a6", // ストーン(中間アクセント)
  vermilion: "#b23a2e", // 朱(電話予約 CTA のみ。他用途は禁止)
  line: "rgba(242, 240, 235, 0.12)", // 罫線
} as const;
