// src/lib/split-text.ts
// ============================================================
// テキストを文字 / 単語単位の span に分割するユーティリティ。
// GSAP SplitText(現在は無料)の軽量・依存ゼロ代替。
//
// アクセシビリティを最初から組み込み済み:
// - 元の文章を親要素の aria-label に保持
// - 分割 span はすべて aria-hidden="true"
//   → スクリーンリーダーは「デ」「ザ」「イ」「ン」ではなく
//     元の文章を 1 回だけ読み上げる
//
// 日本語対応:
// - 空白ベースの単語分割は日本語には効かない(文が 1 語扱いになる)
// - Intl.Segmenter が使える環境(全モダンブラウザ)では辞書ベースで語分割する
// - それでも日本語見出しは基本 "chars"(文字分割)を推奨
// - CJK 文字の連なりは単語ラッパーを付けず、日本語組版どおり
//   どの文字間でも行の折返しができるようにしている
//
// 型は strict 前提。tsconfig の lib に ES2022 以降(Next.js 既定の esnext なら
// OK)が必要。
// ============================================================

export type SplitType = "chars" | "words";

export interface SplitTextOptions {
  /** 分割単位。既定は "chars"(日本語見出しに安全) */
  type?: SplitType;
  /** 文字 span に付けるクラス名。既定 "split-char" */
  charClass?: string;
  /** 単語 span に付けるクラス名。既定 "split-word" */
  wordClass?: string;
}

export interface SplitTextResult {
  /** 文字 span の配列(type: "words" のときは空配列) */
  chars: HTMLElement[];
  /** 単語 span の配列 */
  words: HTMLElement[];
  /** 分割を解除して元の DOM に完全復元する */
  revert: () => void;
}

// ひらがな・カタカナ・CJK 統合漢字などをざっくり判定
const CJK_RE = /[　-ヿ㐀-䶿一-鿿豈-﫿]/;

/** 書記素(見た目上の1文字)単位に分割。絵文字や結合文字を壊さない */
function splitGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  // フォールバック: サロゲートペアは保てるが、結合絵文字(家族絵文字など)は分かれる
  return Array.from(text);
}

/** 単語単位に分割(空白も要素として保持)。日本語は Segmenter があれば辞書分割 */
function splitWords(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "word" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  // フォールバック: 空白で区切る(空白トークンも残す)。日本語は 1 語扱いになる
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

function makeSpan(className: string, content?: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = className;
  // transform(x/y/rotate 等)は inline 要素には効かないため inline-block 必須
  span.style.display = "inline-block";
  span.setAttribute("aria-hidden", "true");
  if (content !== undefined) {
    span.textContent = content;
  }
  return span;
}

/**
 * element 直下のテキストを span に分割する。
 *
 * 注意:
 * - element の中身はプレーンテキスト前提(子要素があると innerHTML 復元は
 *   できるが、分割対象は textContent に平坦化される)
 * - Web フォント読み込み前に分割すると幅がズレる。呼び出し側で
 *   document.fonts.ready を待ってから実行すること(references/text-reveal.md 参照)
 */
export function splitText(
  element: HTMLElement,
  options: SplitTextOptions = {},
): SplitTextResult {
  const { type = "chars", charClass = "split-char", wordClass = "split-word" } = options;

  const originalHtml = element.innerHTML;
  const text = element.textContent ?? "";

  // スクリーンリーダーには元の文章を 1 回だけ読ませる
  element.setAttribute("aria-label", text);

  const chars: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  const frag = document.createDocumentFragment();

  for (const token of splitWords(text)) {
    // 空白はテキストノードのまま残す → 単語間の自然な折返し位置を保つ
    if (/^\s+$/.test(token)) {
      frag.appendChild(document.createTextNode(token));
      continue;
    }

    // CJK の文字分割: 単語ラッパー(inline-block)で包むと
    // その塊の途中で行が折り返せなくなる。日本語はどの文字間でも
    // 折返し可能なのが正しい組版なので、文字 span を直接並べる。
    if (type === "chars" && CJK_RE.test(token)) {
      for (const ch of splitGraphemes(token)) {
        const charSpan = makeSpan(charClass, ch);
        frag.appendChild(charSpan);
        chars.push(charSpan);
      }
      continue;
    }

    // 欧文: 単語 span で包み、単語の途中では折り返さないようにする
    const wordSpan = makeSpan(wordClass);
    if (type === "chars") {
      for (const ch of splitGraphemes(token)) {
        const charSpan = makeSpan(charClass, ch);
        wordSpan.appendChild(charSpan);
        chars.push(charSpan);
      }
    } else {
      wordSpan.textContent = token;
    }
    words.push(wordSpan);
    frag.appendChild(wordSpan);
  }

  element.replaceChildren(frag);

  return {
    chars,
    words,
    revert: () => {
      element.innerHTML = originalHtml;
      element.removeAttribute("aria-label");
    },
  };
}
