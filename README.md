# 木木文化網站（mumu-web）

電子賀卡網站。GitHub Pages 預覽，正式上線走 Cloudflare＋自家網域。

## 結構（每張卡自成一包）

```
mumu-web/
├─ index.html            ← 根轉址（導向 home/）
├─ home/                 ← 總站（首頁）：index.html＋css/＋images/（首頁墊圖）
├─ shared/               ← 全站共用：css/card.scss（賀卡版式＋RWD）、js/card.js（引擎）、js/gsap.min.js
└─ cards/                ← 全部作品，一卡一包
    └─ CH2026001/
        ├─ index.html
        ├─ list.jpg      ← 總站列表圖（與 index.html 同階，540×960）
        ├─ css/          ← 這張卡的風格 style.scss/.css
        ├─ js/           ← config.js（文字/日期）＋ anim.js（GSAP 動畫）
        └─ images/       ← 這張卡的圖：bg.png 直式 1080×1920、bg-wide.png 橫式 1920×1080、poster.jpg 分享 1200×630、動畫零件
```

## 命名規則

**節日代號兩位大寫＋年份＋編號三位**：`CH2026001`＝2026 年第 1 張聖誕卡。

| 代號 | 節日 | | 代號 | 節日 |
|------|------|-|------|------|
| CH | 聖誕 | | MO | 母親節 |
| NE | 新年（元旦） | | FA | 父親節 |
| LU | 過年（農曆） | | VA | 情人節 |
| MI | 中秋 | | HA | 萬聖節 |
| DR | 端午 | | BI | 生日 |

## config.js 功能開關（每卡自訂，共用引擎自動跑）

| 欄位 | 效果 |
|------|------|
| `offlineDate: "YYYY-MM-DD"` | 檔期結束日，到期自動處理 |
| `expireMode: "lock"` | 到期整卡收起只留結束畫面；不寫＝照常顯示只加註記 |
| `promoOfflineDate` | 曝光區塊自動下架日 |
| `replyLink`／`videoFile` 留空 | 隱藏對應按鈕 |

**客戶純動態版**：同一張卡網址加 `?min=1`（隱藏按鈕與資訊區）。

## 新增一張卡（SOP）

1. 複製 `cards/` 任一現有卡 → 改名新卡號（例 `cards/LU2026001/`）
2. `js/config.js`：改 id、文字、日期
3. `css/style.scss`：改本卡風格 → 編譯
4. `js/anim.js`：寫 GSAP 動畫
5. `index.html`：改 title 與 OG 三行
6. `images/` 放素材、`list.jpg` 放卡片根層 → 部署

## 琇端的自助範圍

- `cards/<卡號>/js/config.js` 的文字與日期
- `cards/<卡號>/images/` 圖片同名覆蓋（尺寸一致）
- 其他交給製作方

## SCSS 編譯【鐵律：只改 .scss，.css 是產物】

```
npx sass home/css/style.scss home/css/style.css --no-source-map
npx sass shared/css/card.scss shared/css/card.css --no-source-map
npx sass cards/CH2026001/css/style.scss cards/CH2026001/css/style.css --no-source-map
npx sass cards/NE2026001/css/style.scss cards/NE2026001/css/style.css --no-source-map
```

⚠️ `shared/css/card.scss` 是共用版式，動它會影響所有卡片。

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
