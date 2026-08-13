# 木木文化網站（mumu-web）

工作室官網＋電子賀卡。GitHub Pages 預覽，正式上線走 Cloudflare＋自家網域。

## 結構【歸檔鐵律】

**一個獨立網站＝一個資料夾**，裡面自帶 `index.html`＋`css/`＋`scripts/`＋`images/`。
同一個網站底下、由 `index.html` 連出去的其他頁面（`about.html`、`card.html`…）**放在同一層**，
共用該網站那一組 `css/` `scripts/` `images/`，不另外開資料夾。

**外掛一包一個資料夾，用外掛的名字命名，css 與 js 放在一起不分家**，
整包收在 `scripts/` 底下。換版時直接覆蓋整個資料夾。

> 程式檔資料夾**全站統一叫 `scripts/`**，官網、賀卡、客戶站都一樣。

```
mumu-web/                  ← 木木官網本體（一個獨立網站）
├─ index.html              ← 首頁
├─ business-card.html      ← 內頁，與 index.html 同層，共用下面三個資料夾
├─ paper-price.html        ←（尚未製作，示意命名）
├─ e-cards.html
├─ contact.html
├─ css/                    ← 官網 style.scss/.css
├─ scripts/
│   ├─ main.js             ← 自己寫的
│   ├─ jquery/             jquery.min.js
│   ├─ jquery-mousewheel/  jquery.mousewheel.min.js
│   ├─ owl-carousel/       owl-carousel.min.css ＋ owl-carousel.min.js（css 跟 js 同包）
│   └─ gsap/               gsap.min.js ＋ ScrollTrigger.min.js（官方外掛歸母套件）
├─ images/                 ← 官網圖片：logo、icons/、business-card/、e-card/、flow/、hero 影片、山坡圖
│
├─ cards/                  ← 賀卡：一張卡就是一個獨立小網站
│   └─ CH2026001/
│       ├─ index.html
│       ├─ list.jpg        ← 官網列表圖（與 index.html 同層，540×960）
│       ├─ css/            ← card.scss（賀卡通用版式＋RWD）＋ style.scss（這張卡的風格）
│       ├─ scripts/        ← card.js（引擎）＋ anim.js（動畫）＋ gsap/
│       └─ images/         ← bg.png 直式 1080×1920、bg-wide.png 橫式 1920×1080、poster.jpg 分享 1200×630、動畫零件
│
└─ clients/                ← 代管的其他公司網站，一家一包（見 clients/README.md）
    └─ acme/
        ├─ index.html ＋ about.html …
        └─ css/  scripts/  images/
```

**每一包都自足，不引用別包的檔案。** 所以 GSAP 會有好幾份副本（官網一份、每張卡各一份），
這是刻意付的代價——換到的是整包複製、交接、搬家都不會漏帶，也不會改 A 弄壞 B。

## 命名規則

**節日代號兩位大寫＋年份＋編號三位**：`CH2026001`＝2026 年第 1 張聖誕卡。

| 代號 | 節日 | | 代號 | 節日 |
|------|------|-|------|------|
| CH | 聖誕 | | MO | 母親節 |
| NE | 新年（元旦） | | FA | 父親節 |
| LU | 過年（農曆） | | VA | 情人節 |
| MI | 中秋 | | HA | 萬聖節 |
| DR | 端午 | | BI | 生日 |

## 內容與設定都在 index.html（**沒有 config.js**）

2026-08-02 起 `config.js` 移除，**文字一律直接寫在 `index.html`**：打開原始碼就看得到字，
琇端能自己改，搜尋引擎與 LINE 預覽也抓得到（以前是 JS 塞進空標籤，爬蟲抓到的是空的）。
可改的地方都標了 `✏️` 記號。

設定改用 `<head>` 的 `<meta>`：

| meta | 效果 |
|------|------|
| `card-offline` | 檔期結束日 `YYYY-MM-DD`。到期整卡收起，改成一頁「檔期已結束」公告；**網址仍然有效**，舊連結不會變 404。留空＝不下架 |
| `promo-offline` | 客戶曝光 banner 的下架日。到期只有 banner 消失，賀卡照常 |

日期格式打錯時 `new Date()` 會是 Invalid Date，比較結果一律 false，
也就是**打錯字＝不下架**，不會誤收還在檔期的卡。

按鈕（回覆祝福、下載影片）不需要就直接把那行 HTML 刪掉，不再靠設定值隱藏。

**客戶純動態版**：同一張卡網址加 `?min=1`（隱藏按鈕與資訊區）。

## 新增一張卡（SOP）

1. 複製 `cards/` 任一現有卡 → 改名新卡號（例 `cards/LU2026001/`）。整包複製即可，引擎與 GSAP 都在裡面
2. `index.html`：改 `✏️` 標記的文字、title、OG 三行、檔期 meta
3. `css/style.scss`：改本卡風格 → 編譯
4. `scripts/anim.js`：寫 GSAP 動畫
5. `images/` 放素材、`list.jpg` 放卡片根層 → 部署

⚠️ `css/card.scss`（賀卡通用版式）現在**每張卡各有一份**：改某張卡的 card.scss 只影響那張卡，
已交付的舊卡不會被動到。反過來說，要全面套用的修正得逐張改。

## 琇端的自助範圍

完整說明給她看 **`cards/琇端修改說明.md`**（含操作步驟與不要碰的東西）。

- `cards/<卡號>/index.html` 裡標了 `✏️` 的文字與檔期日期
- `cards/<卡號>/images/` 圖片同名覆蓋（`poster.jpg` 1200×630、`list.jpg` 540×960）
- 客戶曝光 banner 的圖與連結
- 其他交給製作方

## SCSS 編譯【鐵律：只改 .scss，.css 是產物】

卡片數量會一直增加，所以用 `--update` 一行掃全部（只重編有改動的）：

```
npx sass --update css:css cards:cards --no-source-map
```

單獨編一支也可以：

```
npx sass css/style.scss css/style.css --no-source-map
npx sass cards/CH2026001/css/style.scss cards/CH2026001/css/style.css --no-source-map
```

⚠️ 編譯務必帶 `--no-source-map`，漏了會產生 `.css.map`（`.gitignore` 已擋，但不要養成習慣）。

## 部署

```
git add -A
git commit -m "說明"
git push
```

GitHub Pages 一兩分鐘自動更新：

- 首頁 `https://ashero328.github.io/mumu-web/`
- 賀卡 `https://ashero328.github.io/mumu-web/cards/<卡號>/`

## 上線備忘

- 網域生效後：各卡 og:url／og:image 補正式網域絕對網址
- 影片量大後：檔案移 Cloudflare R2（綁 media.網域），config 換連結
