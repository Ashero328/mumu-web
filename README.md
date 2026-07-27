# 木木文化網站（mumu-web）

**現階段只做「給客戶看的賀卡頁」**；總覽頁封存在 `_future/`。
此資料夾＝未來部署到 Cloudflare Pages 的網站根目錄。

## 設計基調（定案）

- **白金・文青優雅**：紙白 `#fdfcfa`／墨 `#35302a`／金 `#a8862e`（大字與線飾）／深金 `#8a6d1f`（小字，對比達標）
- 字體：Cormorant Garamond（西文襯線）＋ Noto Serif TC（中文襯線），各卡 head 以 Google Fonts 載入
- 版式：**手機 9:16 滿版／電腦 16:9 置中＋下滑資訊區**，斷點 900px
- **動態一律 GSAP**（scripts/gsap.min.js），寫在各卡 `anim.js`；一律附 prefers-reduced-motion 保護

## 結構

```
mumu-web/
├─ index.html                 ← 品牌佔位頁（不連向任何內部頁）
├─ css/
│   ├─ style.scss/.css        ← 佔位頁樣式
│   └─ card.scss/.css         ← 賀卡引擎版式【鐵律：只改 .scss】
├─ scripts/
│   ├─ gsap.min.js
│   └─ card.js                ← 引擎：版式切換、data-slot、時效、分享、動畫啟動
├─ images/                    ← 全站共用圖（各卡素材放各卡 assets/）
├─ cards/
│   ├─ _template/             ← 新卡模板（複製用，不直接開啟）
│   ├─ clients/               ← 客戶卡：cards/clients/<公司名或案號>/<年份-代號編號>/
│   └─ showcase/              ← 展示卡：cards/showcase/<年份>/<代號編號>/
│       └─ 2026/
│           ├─ CH01/          ← 聖誕（金環花圈・飄雪金點）
│           └─ NE01/          ← 新年（金日日昇・年份底紋）
└─ _future/gallery/           ← 封存：節日分類總覽頁
```

## 節日代號（英文前兩位大寫＋兩位編號）

| 代號 | 節日 | 英文 |
|------|------|------|
| CH | 聖誕 | CHristmas |
| NE | 新年（元旦） | NEw Year |
| LU | 過年（農曆） | LUnar New Year |
| MI | 中秋 | MId-Autumn |
| DR | 端午 | DRagon Boat |
| MO | 母親節 | MOther's Day |
| FA | 父親節 | FAther's Day |
| VA | 情人節 | VAlentine's |
| HA | 萬聖節 | HAlloween |
| BI | 生日 | BIrthday |

例：`showcase/2026/CH01`＝2026 年第 1 張聖誕展示卡；客戶卡 `clients/haoyu/2026-CH01`。

## 每張卡的圖檔分區（assets/）

| 資料夾 | 用途 | 檔名與尺寸 |
|--------|------|-----------|
| `assets/bg/` | 墊底圖（賀卡背景） | `bg.png` 直式 1080×1920／`bg-wide.png` 橫式 1920×1080 |
| `assets/list/` | 總站列表圖（作品集縮圖） | `list.jpg` 540×960（9:16） |
| `assets/share/` | 分享預覽圖（OG） | `poster.jpg` 1200×630 |
| `assets/parts/` | 動畫零件 | 製作方命名後告知，同名覆蓋 |

墊底圖接法已寫在 `_template/style.scss` 的註解裡（素材進場拿掉註解即生效）；
列表圖是未來總覽頁的縮圖來源（`_future/gallery/cards.js` 的 poster 欄位固定指向 `assets/list/list.jpg`）。

## 新增一張賀卡（SOP）

1. 複製 `cards/_template/` → `cards/clients/<公司或案號>/<年份-代號編號>/`（展示卡放 showcase）
2. `config.js`：填文字（title/subtitle/greeting…）、節日、時效日
3. `assets/`：放素材（規則見資料夾內說明）
4. `style.scss`：本卡背景與裝飾 → 編譯出 style.css
5. `anim.js`：寫 GSAP 動畫（記得 reduced-motion 保護）
6. `index.html`：改 title 與 OG 三行
7. 部署後把網址交給琇端

## 琇端的自助範圍

- `config.js` 的文字與日期（純文字修改）
- `assets/` 內圖片**同名覆蓋**（尺寸相同）
- 其他（動畫、版面、程式）→ 交給製作方

## SCSS 工作流【鐵律】

樣式一律改 `.scss`，`.css` 是編譯產物。在 mumu-web 根目錄執行：

```
npx sass css/style.scss css/style.css --no-source-map
npx sass css/card.scss css/card.css --no-source-map
npx sass cards/showcase/2026/CH01/style.scss cards/showcase/2026/CH01/style.css --no-source-map
npx sass cards/showcase/2026/NE01/style.scss cards/showcase/2026/NE01/style.css --no-source-map
```

新卡照同樣模式編譯各卡 style.scss；開發時可加 `--watch`。

## 上線備忘

- Cloudflare Pages 以本資料夾為根目錄部署；GitHub 倉庫維持 Private
- 網域生效後：各卡 `index.html` 的 `og:url`／`og:image` 補正式網域絕對網址
- 影片量大後：檔案移 R2（綁 `media.網域`），config 的 `videoFile` 換連結
- 未來啟用總覽頁：把 `_future/gallery/` 搬回 `cards/`，並改讀 showcase 清單
