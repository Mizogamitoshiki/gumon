// GA4 の gtag。Analytics.tsx から window 経由で呼ぶためだけの最小宣言。
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      targetOrName: string | Date,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export {};
