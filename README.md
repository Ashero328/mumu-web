# 木木文化網站（mumu-web）

**現階段只做「給客戶看的賀卡頁」**；總覽頁與主網站封存在 `_future/`，之後要做再拿回來。
此資料夾就是未來部署到 Cloudflare Pages 的網站根目錄。

## 版式基準（定案）

- **手機 9:16**：素材以 1080×1920 設計，舞台滿版呈現（cover）
- **電腦 16:9**：素材以 1920×1080 設計，舞台置中＋下方資訊區（往下滑）
- 斷點 900px（engine/card.scss 與 engine/card.js 同步此值）
- **動態一律用 GSAP**，寫在各卡的 `anim.js`（引擎呼叫 `window.CARD_ANIMATION(cfg)`）；vendor/gsap.min.js 已內建

## 結構

```
mumu-web/
├─ index.html + style.scss/.css   ← 品牌佔位頁（不連向任何內部頁）
├─ vendor/gsap.min.js
├─ _future/gallery/               ← 封存：總覽頁（節日分類）＋卡片清單，之後要做再啟用
└─ cards/
    ├─ engine/                    ← 共用引擎
    │   ├─ card.scss / card.css   ← 版式（手機滿版／電腦 16:9＋資訊區）【鐵律：只改 .scss】
    │   └─ card.js                ← 版式切換、data-slot 文字帶入、時效、分享、動畫啟動
    ├─ _template/                 ← 新卡模板（複製用）
    │   ├─ index.html / config.js / anim.js / style.scss
    │   └─ assets/素材規則.txt
    └─ 2026/xmas-demo/            ← 聖誕示範卡（樣式版型 demo，直接雙擊 index.html 看）
```

## 客戶網址

每張卡＝一個資料夾＝一個永久網址：`網域/cards/<年份>/<卡名>/`，含專屬 OG 分享預覽。
（總覽頁上線前，卡片只有拿到連結的人看得到。）

## 新增一張賀卡（SOP）

1. 複製 `cards/_template/` → `cards/<年份>/<卡名>/`（英數小寫，例 `2026/ny-brandA`）
2. `config.js`：填文字、節日、時效日
3. `assets/`：放素材（規則見資料夾內說明）
4. `style.scss`：本卡背景與裝飾 → 編譯出 style.css
5. `anim.js`：寫 GSAP 動畫
6. `index.html`：改 title 與 OG 三行
7. 部署後把網址交給琇端

## 琇端的自助範圍

- `config.js` 的文字與日期（純文字修改）
- `assets/` 內圖片**同名覆蓋**（尺寸相同）
- 其他（動畫、版面、程式）→ 交給製作方

## SCSS 工作流【鐵律】

樣式一律改 `.scss`，`.css` 是編譯產物。在 mumu-web 根目錄執行：

```
npx sass style.scss style.css --no-source-map
npx sass cards/engine/card.scss cards/engine/card.css --no-source-map
npx sass cards/2026/xmas-demo/style.scss cards/2026/xmas-demo/style.css --no-source-map
```

開發時可加 `--watch` 自動編譯；新卡照第三行的模式編譯各卡的 style.scss。

## 上線備忘

- Cloudflare Pages：以本資料夾為根目錄部署（git 連動或直接上傳）
- 網域生效後：各卡 `index.html` 的 `og:url`／`og:image` 補正式網域絕對網址（OG 爬蟲不吃相對路徑）
- 影片量大後：影片檔移 R2（綁 `media.網域`），config 的 `videoFile` 換連結即可
- 未來啟用總覽頁：把 `_future/gallery/` 內容搬回 `cards/`，新卡記得在 cards.js 登記
