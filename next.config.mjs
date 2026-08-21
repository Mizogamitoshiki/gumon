/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  // public/ の静的メディア(動画・写真・フォント)はファイル名にハッシュが無く
  // Next の既定では max-age=0 で配られていた(Lighthouse「効率的なキャッシュ」
  // で 2.8MB が毎回再取得扱い・2026-08-21)。差し替えの頻度は低いので 30 日
  // キャッシュ+裏で再検証。_next/static は Next 自身が immutable を付ける。
  // あわせて HSTS と nosniff を全応答に付ける(Amplify は customHeaders 未設定)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:all*(mp4|webm|webp|jpg|jpeg|png|svg|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        // ビルド時生成のサムネイルは URL にハッシュを含む → 長期キャッシュ可
        source: "/menu-thumbs/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
