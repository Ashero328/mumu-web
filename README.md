# 木木文化網站（mumu-web）

電子賀卡網站。GitHub Pages 預覽，正式上線走 Cloudflare＋自家網域。

## 結構（三資料夾，不再更複雜）

```
mumu-web/
├─ index.html      ← 首頁（品牌佔位）；首頁墊圖、作品列表圖未來放這一層（與 index.html 同層）
├─ cards/          ← 全部作品，一卡一資料夾（只放 index.html＋config.js）
│   ├─ CH2026001/
│   └─ NE2026001/
├─ css/            ← 賀卡版式 card.scss、整體風格 style.scss、各卡風格 <卡號>.scss【鐵律：只改 .scss】
├─ js/             ← 引擎 card.js、外掛 gsap.min.js、各卡動態 <卡號>.js
└─ images/         ← 各卡媒體，一卡一資料夾（墊底圖、poster、影片、動畫零件）
```

## 命名規則

**節日代號兩位大寫＋年份＋編號三位**：`CH2026001`＝2026 年第 1 張聖誕卡。
卡片資料夾、css 檔、js 檔、images 資料夾全部同名，一眼對上。

| 代號 | 節日 | | 代號 | 節日 |
|------|------|-|------|------|
| CH | 聖誕 | | MO | 母親節 |
| NE | 新年（元旦） | | FA | 父親節 |
| LU | 過年（農曆） | | VA | 情人節 |
| MI | 中秋 | | HA | 萬聖節 |
| DR | 端午 | | BI | 生日 |

## 圖檔放哪

- `images/<卡號>/`：`bg.png` 直式墊底 1080×1920、`bg-wide.png` 橫式墊底 1920×1080、`poster.jpg` 分享預覽 1200×630、影片與動畫零件
- **首頁墊圖、作品列表圖**（`list-<卡號>.jpg` 540×960）：放根目錄，與 index.html 同層

## config.js 功能開關（每卡自訂，引擎自動跑）

| 欄位 | 效果 |
|------|------|
| `offlineDate: "YYYY-MM-DD"` | 檔期結束日，到期自動處理 |
| `expireMode: "lock"` | 到期整卡收起只留結束畫面；不寫＝照常顯示只加註記 |
| `promoOfflineDate` | 曝光區塊自動下架日 |
| `replyLink` 留空 | 隱藏回覆按鈕 |
| `videoFile` 留空 | 隱藏下載影片鈕 |

**客戶純動態版**：同一張卡網址加 `?min=1`（隱藏按鈕與資訊區），不用複製第二份。

## 新增一張卡（SOP）

1. 複製 `cards/` 任一現有卡 → 改名為新卡號（例 `cards/LU2026001/`）
2. `config.js`：改 id、文字、日期
3. `css/`：複製一份現有卡的 scss → 改名 `<新卡號>.scss` → 改內容 → 編譯
4. `js/`：複製 `<現有卡號>.js` → 改名 → 寫 GSAP 動畫
5. `index.html`：改 title 與 OG 三行＋`<link>` 和 `<script>` 裡的卡號
6. `images/<新卡號>/`：放素材
7. 部署（下方三行）

## 琇端的自助範圍

- `cards/<卡號>/config.js` 的文字與日期
- `images/<卡號>/` 圖片同名覆蓋（尺寸一致）
- 其他交給製作方

## SCSS 編譯【鐵律：只改 .scss，.css 是產物】

```
npx sass css/style.scss css/style.css --no-source-map
npx sass css/card.scss css/card.css --no-source-map
npx sass css/CH2026001.scss css/CH2026001.css --no-source-map
npx sass css/NE2026001.scss css/NE2026001.css --no-source-map
```

## 部署

```
git add -A
git commit -m "說明"
git push
```

GitHub Pages 一兩分鐘自動更新：`https://ashero328.github.io/mumu-web/cards/<卡號>/`

## 上線備忘

- 網域生效後：各卡 og:url／og:image 補正式網域絕對網址
- 影片量大後：檔案移 Cloudflare R2（綁 media.網域），config 換連結
