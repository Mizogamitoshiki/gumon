#!/usr/bin/env bash
# 愚問 HP制作CM — 素材準備 → HyperFrames レンダリング
# 前提: リポジトリ直下で `npx next build && npx next start -p 3100` が起動済み(録画用)
#       Node 22 / ffmpeg / Chromium(PLAYWRIGHT 同梱 or HYPERFRAMES_BROWSER_PATH)
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd ../.. && pwd); P=$ROOT/public; W=${WORK:-./work}; C=$W/comp
mkdir -p $W $C/assets/{hf,site,img,fonts}
( cd $W && [ -d node_modules/hyperframes ] || npm i --no-audit --no-fund hyperframes@0.8.163 playwright-core@1.56.1 @fontsource/noto-serif-jp @fontsource/noto-sans-jp )

# 1) フォント(@font-face をインライン化) / GSAP / 写真
python3 - "$W" "$C" <<'PY'
import re,shutil,sys
W,C=sys.argv[1],sys.argv[2]; out=[]
for fam,pkg,ws in [("Noto Serif JP","noto-serif-jp",[500,700]),("Noto Sans JP","noto-sans-jp",[400,500,700])]:
  for w in ws:
    for m in re.finditer(r'@font-face\s*\{(.*?)\}',open(f'{W}/node_modules/@fontsource/{pkg}/{w}.css').read(),re.S):
      b=m.group(1); f=re.search(r"url\(\./files/([^)]+\.woff2)\)",b).group(1); ur=re.search(r'unicode-range:\s*([^;]+);',b)
      shutil.copy(f'{W}/node_modules/@fontsource/{pkg}/files/{f}',f'{C}/assets/fonts/{f}')
      out.append(f"@font-face{{font-family:'{fam}';font-weight:{w};font-display:block;src:url(assets/fonts/{f}) format('woff2');"+(f"unicode-range:{ur.group(1)};" if ur else "")+"}")
s=open('index.template.html').read().replace('/*FONTFACES*/',"\n".join(out))
open(f'{C}/index.html','w').write(s)
PY
cp $ROOT/node_modules/gsap/dist/gsap.min.js $C/assets/
cp $P/dishes.webp $P/dinner-table.webp $C/assets/img/

# 2) サイト実録画(仮想時計でフレーム単位に撮影 → 1.5倍速)
for f in gumon-cinematic-mobile gumon-cinematic-master gumon-intro-mobile gumon-intro-desktop; do
  [ -f tools/$f.webm ] || ffmpeg -v error -y -i $P/$f.mp4 -c:v libvpx-vp9 -b:v 0 -crf 30 -row-mt 1 -deadline realtime -cpu-used 8 -g 8 -an tools/$f.webm
done
cp tools/rec.mjs $W/rec.mjs; sed -i "s#new URL(\".\", import.meta.url).pathname#\"$(pwd)/tools/\"#" $W/rec.mjs
[ -d $W/rec_m ] || node $W/rec.mjs http://localhost:3100/ $W/rec_m 430 932 2 360 '[[0,0],[12,8],[16,16],[20,24],[24,30]]'
[ -d $W/rec_d ] || node $W/rec.mjs http://localhost:3100/ $W/rec_d 1440 900 1 400 '[[0,0],[12,10],[16,20],[20,30],[24,36]]'
ffmpeg -v error -y -framerate 45 -i $W/rec_m/f%05d.jpg -vf "trim=end_frame=305,setpts=PTS-STARTPTS,fps=30" -c:v libx264 -crf 16 -pix_fmt yuv420p $C/assets/site/mobile.mp4
ffmpeg -v error -y -framerate 45 -i $W/rec_d/f%05d.jpg -vf "trim=end_frame=285,setpts=PTS-STARTPTS,fps=30" -c:v libx264 -crf 16 -pix_fmt yuv420p $C/assets/site/desktop.mp4

# 3) Higgsfield クリップ(hf/*.mp4 があれば使用。無ければ写真から仮素材を作る)
for n in flame wall mapo table; do
  if [ -f hf/$n.mp4 ]; then ffmpeg -v error -y -i hf/$n.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" -an -c:v libx264 -crf 16 -pix_fmt yuv420p $C/assets/hf/$n.mp4; continue; fi
  echo "[warn] hf/$n.mp4 なし → 仮素材"
  case $n in
    flame) ffmpeg -v error -y -ss 0.5 -t 5 -i $P/gumon-cinematic-mobile.mp4 -vf "scale=1080:1920,fps=30" -an -c:v libx264 -crf 18 -pix_fmt yuv420p $C/assets/hf/$n.mp4;;
    wall)  ffmpeg -v error -y -loop 1 -i $P/gumon-wall-mobile.webp -vf "scale=2160:-2,crop=2160:3840,zoompan=z='1+0.08*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30" -frames:v 150 -c:v libx264 -crf 18 -pix_fmt yuv420p $C/assets/hf/$n.mp4;;
    mapo)  ffmpeg -v error -y -loop 1 -i $P/mapo-tofu.webp -vf "scale=-2:3840,crop=2160:3840,zoompan=z='1+0.1*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30" -frames:v 150 -c:v libx264 -crf 18 -pix_fmt yuv420p $C/assets/hf/$n.mp4;;
    table) ffmpeg -v error -y -loop 1 -i $P/dinner-table.webp -vf "scale=-2:3840,crop=2160:3840,zoompan=z='1.1-0.1*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=30" -frames:v 150 -c:v libx264 -crf 18 -pix_fmt yuv420p $C/assets/hf/$n.mp4;;
  esac
done

# 4) BGM(numpy で自作・ライセンスフリー)
BGM_OUT=$C/assets/bgm.wav python3 tools/bgm.py

# 5) レンダリング(社名・アカウントは --variables で差し替え)
cd $C && npx --prefix ../ hyperframes render -q high -o "$(cd - >/dev/null; pwd)/output/gumon-hp-cm.mp4" \
  --variables "${CM_VARS:-{\"studioName\":\"YOUR STUDIO\",\"handle\":\"@your_account\",\"cta\":\"無料相談はDMから\"}}"
