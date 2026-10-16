// Deterministic frame-by-frame scroll recording using Playwright's fake clock.
// usage: node rec.mjs <url> <outdir> <w> <h> <dpr> <frames> <pxPerFrameProfile JSON> [probe]
import { chromium } from "playwright-core";
import fs from "node:fs";
const [url, out, W, H, DPR, FRAMES, prof, mode] = process.argv.slice(2);
const profile = JSON.parse(prof); // [[fromFrame, wheelDeltaPerFrame], ...]
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--autoplay-policy=no-user-gesture-required"] });
const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, deviceScaleFactor: +DPR, reducedMotion: "no-preference" });
const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
const T = new URL(".", import.meta.url).pathname;
await page.route(/\.mp4(\?.*)?$/, async (route) => {
  const name = new URL(route.request().url()).pathname.split("/").pop().replace(".mp4", ".webm");
  const body = fs.readFileSync(T + name);
  const range = route.request().headers()["range"];
  if (range) {
    const m = /bytes=(\d+)-(\d*)/.exec(range); const a = +m[1]; const b = m[2] ? +m[2] : body.length - 1;
    return route.fulfill({ status: 206, headers: { "Content-Type": "video/webm", "Accept-Ranges": "bytes", "Content-Range": `bytes ${a}-${b}/${body.length}`, "Content-Length": String(b - a + 1) }, body: body.subarray(a, b + 1) });
  }
  return route.fulfill({ status: 200, headers: { "Content-Type": "video/webm", "Accept-Ranges": "bytes" }, body });
});
await page.addInitScript(() => sessionStorage.setItem("gm-opened", "1"));
await page.clock.install();
await page.goto(url, { waitUntil: "networkidle" });
await page.mouse.move(+W / 2, +H / 2);
await page.mouse.move(+W / 2 + 5, +H / 2); // arm media (pointermove)
for (let i = 0; i < 120; i++) { await page.clock.runFor(1000 / 30); }
await page.waitForTimeout(1500);
const waitVideo = async () => {
  for (let k = 0; k < 40; k++) {
    const busy = await page.evaluate(() => [...document.querySelectorAll("video")].some((v) => v.seeking));
    if (!busy) return;
    await page.waitForTimeout(15);
  }
};
const deltaAt = (f) => { let d = 0; for (const [s, v] of profile) if (f >= s) d = v; return d; };
const n = +FRAMES;
const step = mode === "probe" ? 15 : 1;
for (let f = 0; f < n; f++) {
  const d = deltaAt(f);
  if (d) await page.mouse.wheel(0, d);
  await page.clock.runFor(1000 / 30);
  if (f % step === 0) {
    await waitVideo();
    await page.screenshot({ path: `${out}/f${String(f).padStart(5, "0")}.jpg`, type: "jpeg", quality: 92 });
  }
}
console.log("scrollY", await page.evaluate(() => [scrollY, document.documentElement.scrollHeight]));
console.log("h264", await page.evaluate(() => document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"')));
await browser.close();
