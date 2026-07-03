// src/lib/gsap-setup.ts
// ============================================================
// GSAP プラグイン登録を「一箇所に」集約する共通セットアップ。
//
// なぜ必要か:
// - registerPlugin をコンポーネントごとに呼ぶと、呼び忘れ・書き間違いの温床になる
// - バンドラのツリーシェイクで ScrollTrigger が落とされる事故を防ぐ
//   (import して registerPlugin することで「使用済み」だと明示される)
// - どのファイルも gsap を "gsap" から直接 import せず、必ずこのファイルから
//   import する規約にすると、プラグイン未登録のまま使うミスが構造的に消える
//
// 使い方:
//   import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap-setup";
// ============================================================
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Next.js App Router ではクライアントコンポーネントも初回はサーバーで
// レンダリングされ、モジュールのトップレベルはサーバーでも実行される。
// ScrollTrigger は window に依存するため、ブラウザでのみ登録する。
// (registerPlugin は冪等なので、複数モジュールから import されても安全)
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  // モバイルのアドレスバー伸縮による refresh 連発でピンがガタつくのを防ぐ
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, useGSAP, ScrollTrigger };
