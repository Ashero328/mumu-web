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
├─ e-cards.html            ← 電子賀卡公版目錄（198 款）
├─ custom-cards.html       ← 客製案例（三件，與上一頁用頁籤互連）
├─ business-card.html      ← 內頁，與 index.html 同層，共用下面三個資料夾
├─ paper-price.html        ←（尚未製作，示意命名）
├─ contact.html
├─ _partials/              ← 導覽與頁尾的來源（只改這裡，頁面裡的是產物）
│   ├─ nav.html
│   ├─ pagenav.html
│   └─ foot.html
├─ css/
│   ├─ _tokens.scss        ← 顏色與版面變數，style 與 e-cards 都 @use 它
│   ├─ style.scss/.css     ← 官網共用（導覽、按鈕、頁尾…）
│   └─ e-cards.scss/.css   ← 公版目錄專用
├─ scripts/
│   ├─ main.js             ← 自己寫的（導覽、首頁動態）
│   ├─ e-cards-data.js     ← 公版目錄的資料，✏️ 琇端要改的就這一支
│   ├─ e-cards.js          ← 篩選、載入更多、挑款清單
│   ├─ jquery/             jquery.min.js
│   ├─ jquery-mousewheel/  jquery.mousewheel.min.js
│   ├─ owl-carousel/       owl-carousel.min.css ＋ owl-carousel.min.js（css 跟 js 同包）
│   ├─ gsap/               gsap.min.js ＋ ScrollTrigger.min.js（官方外掛歸母套件）
│   └─ lenis/              lenis.min.js ＋ lenis.css（滾輪捲動緩衝，css 跟 js 同包）
├─ images/                 ← 官網圖片：logo、icons/、business-card/、e-card/、flow/、hero 影片、山坡圖
│   └─ e-cards/            ← 公版賀卡 thumb/（格線用）＋ full/（動畫預覽用）
│                             ＋ poster.jpg／poster-custom.jpg（兩頁各自的 OG 圖）
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

## 電子賀卡公版目錄（`e-cards.html`）

198 款靜態公版供客戶挑款，跟 `cards/` 那些「會動的網頁卡」是兩件事：
公版是印刷用的設計稿，挑好之後才加價做成動態版（標題下方那一句 ＋ 頁面下方的「客製案例」在講這條路徑）。

**款號是業主原本就在用的**，不要跟 `CH2026001` 那套混在一起：

| | 用途 |
|---|---|
| `EY8012` | **公版款號**，靜態設計，客戶挑款用（`EYC`＝聖誕、`EY8`＝羊年、`ENY`＝西元新年、`EY0`＝通用農曆年，中間插 `H` 是直式） |
| `NE2027001` | **動態卡的網址代號**，做成網頁的那一張 |

### 圖是轉出來的，不要手工放

原始素材在專案資料夾的 `蒐集資料\木木網頁資料-琇端\公版賀卡JPG\`（不進 git）。
跑 `_驗證工具\build_ecards.py` 會產出 `images/e-cards/`：

- `thumb/<款號>.jpg` 長邊 720，不加浮水印 ← 公版格線縮圖
- `full/<款號>.jpg` 長邊 1280，不加浮水印 ← 動畫預覽大圖

> ⚠️ **`full/` 目前網頁上沒有任何地方引用**（2026-08-23 拿掉燈箱之後）。
> 留著是因為 OG 分享圖是拿它拼出來的，而且日後要放大圖時不用重跑。
> 覺得 8 MB 佔位的話，把 `images/e-cards/full/` 加進 `.gitignore` 就好，
> 需要時再跑一次 `build_ecards.py`。

腳本同時會印出「解析度不足要跟琇端補原檔」的款號清單，直接貼到 `e-cards-data.js` 的 `補件中`。
琇端補了新圖之後重跑一次就換掉，不用手動改任何檔案。

#### 載入效能：字體樣式表不要擋渲染（2026-09-13）

**中文字體的樣式表非常大。** Google 把每個中文字重切成上百個 unicode-range 子集，
這個站要 7 個中文字面，整份是 **757 條 `@font-face`、未壓縮 863 KB、gzip 後 239 KB**。
而 `<link rel="stylesheet">` 是**擋渲染**的 —— 拿不到它，畫面一個像素都不畫。

Fast 3G（1.6 Mbps／150 ms）實測 `e-cards.html` 的首次內容繪製：

| | FCP | LCP |
|---|---|---|
| 改之前（字體 link 擋著） | **3500 ms** | 8896 ms |
| 改之後（非同步掛上） | **1312 ms** | 2920 ms |

逐一擋掉資源比對過，**就是那一行 `<link>` 佔掉 2.4 秒**（fancybox.css 只佔 150 ms）。

現在的寫法：`<head>` 放

```html
<script src="scripts/fonts.js" data-fonts="https://fonts.googleapis.com/css2?…" defer></script>
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?…"></noscript>
```

網址寫在 HTML 上（各頁要的字重不完全一樣），`scripts/fonts.js` 只負責把它掛上去。

> ⚠️ **不要改回 `<link>`，也不要用 `media="print" onload="this.media='all'"`** ——
> 後者是 inline script，違反全站「JS 歸 `.js`」的規則。
>
> 代價是字體晚一步到，會先看到系統字再換成 Noto（FOUT）。這是刻意的取捨：
> 字體跳一下還讀得到內容，白畫面什麼都讀不到。網址本來就帶 `display=swap`。

### 格線的載入骨架

`e-cards.html` 的格線是 `e-cards.js` 建的，在那之前 `<ul>` 是空的
（Fast 3G 首屏要 14 秒才全部到齊）。所以 HTML 裡先擺 **12 個 `.card--skel`** 佔位，
尺寸對齊真卡（4:3 圖框 ＋ 一行款號高），換成真卡時版面不會跳。

- 骨架是**純 HTML＋CSS**，CSS 一到就看得到，不必等 JS
- `e-cards.js` 的「初始格線」會先 `grid.querySelectorAll(".card--skel").forEach(remove)`
  —— 那裡是 `appendChild` 不是覆寫，**不清的話骨架會留在最前面**
- ⚠️ **骨架的呼吸動畫刻意用 CSS，不用 GSAP。** 全站規則是動態一律 GSAP，
  但骨架的存在意義就是「JS 還沒到」，用 GSAP 等於永遠不會動。
  這是唯一的例外，`prefers-reduced-motion` 的保護照樣有做。

### 全站數字只有一套規則

`body` 給 `font-variant-numeric: lining-nums`，需要對齊的地方再 `@include 數字對齊`
（`_tokens.scss`，會再加上 `tabular-nums`）。

> **為什麼要這條**：Cormorant Garamond 預設是**舊體數字**（old-style figures）——
> `0` 只有小寫 o 的高度、`1` 是沒有頭的豎線，款號 `EYC001` 在畫面上讀起來是 **`EYCoo1`**，
> 客戶會抄錯款號。同一個 `01` 在大標看起來正常、在縮圖小字卻變成 `o I`。
> 不是字體不同，是**同一支字體的數字樣式不同**。
>
> 這條只換數字樣式、不換字體，襯線體的調性完全保留。
> ⚠️ `tabular-nums` 不要加在內文段落上 —— 等寬數字塞在中文句子裡會顯得鬆散。

## 琇端要改的只有 `scripts/e-cards-data.js`

**同一個節日出了新款** → 把圖放進 `thumb/` 與 `full/` → 把該節日的數字加上去，就上架了。
另外兩個清單是「暫時不顯示」與「原檔補件中」，都是填款號。

> ⚠️ **但「新增一個節日」不只改資料檔。**
> `e-cards.html` 的篩選列按鈕是**寫死的**，不是從 `公版賀卡` 生出來的。
> 只加資料檔的話，格線上會出現那一類、篩選列卻選不到它，
> 首頁的 `?f=` 深連結也會找不到按鈕而靜靜失效（`e-cards.js` 是拿 `data-value` 去找按鈕的）。
> **兩邊都要改，而且順序要一致。**
> 要讓這句話重新成立的話，就是把那排按鈕改成依 `公版賀卡` 生成 —— 還沒做。

### 缺號怎麼處理

`展開款號()` 是用「前綴 ＋ 補零 ＋ 1..N」推檔名的，**只能連續**。
原始素材有缺號時（例如聖誕直式編到 045、但沒有 `EYCH040`），
數量要填**最大編號**，再把缺的那個款號寫進 `不顯示` 挖掉 ——
填 44 的話不但 `EYCH045` 不會出現，`EYCH040` 還是會被展開成一張破圖。

### 導覽子選單：**已經移除**（2026-08-25）

做過一版下拉子選單（電子賀卡 ▾ → 公版款式／客製案例），用戶最後決定整個拿掉。
現在導覽的「電子賀卡」就是一般連結：首頁指向 `#promo`，內頁指向 `e-cards.html`。

要切換公版／客製走兩個地方：**內頁標題區那條第二層導覽**，以及**首頁「賀卡最新消息」那兩個入口**。

> 想做回去之前先看這幾條 —— 那一版被推翻過四次（不要號碼、不要第二條外框線、
> 字體要黑體、要置中），而且它跟第二層導覽是同樣那兩個連結、上下只差 30px，
> 讀起來就是同一個元件出現兩次。
>
> ⚠️ 真的要做的話，`.nav__has-sub > a` 與 `.nav__sub a` **都必須 `display: block`**。
> `<a>` 原本是 `.nav__links` 的直接 flex 項目會被 blockify，`width: 80px` 才生效；
> 包進 `<div>` / `<li>` 之後退回 inline，inline 元素吃不到 width ——
> 桌機整列縮 14px、右對齊的導覽整組左移。這個坑踩了兩次。

### 第二層導覽 `.pagenav`：不是第二條列，是標題區那一行的索引

**2026-08-25 從導覽底下搬進標題區。** 原本它是主導覽下面一條滿版的列
（明體 17px、有底色、有滿版底線、靠 `main.js` 量出來的 `--x` 對齊「電子賀卡」）。
用戶回報：「按鈕很突兀，子選單比上面選單更大字，請優化要放的位置」「底下的線不要了」。

三個原因，改回去之前先讀：

1. 它跟導覽的下拉子選單是**同樣那兩個連結**，上下只差 30px，讀起來是同一個元件出現兩次
2. 原本 17px 明體，比主導覽的 13.76px 黑體還大一號 —— **階層是反的**，次級導覽不該比主導覽重
3. 底下那條滿版線讓它看起來像第二個 header

**現在的樣子**：排在 `.cat-lead__row` 的右端，跟導引小字（`.section-label`）同一行，
右緣貼齊 1440 內容欄的右緣（實測誤差 0px）。黑體 `.8rem`，跟導覽子選單同一階。

- **`align-items: baseline` 是關鍵**：兩邊字級不同（14.7 / 12.8），
  用 `center` 對齊會看得出來差半個字，對基線才是印刷上正確的做法
- **兩項之間的分隔線用偽元素固定 13px，不要用 `border-left`** ——
  border 會撐到整個行框高（22px），比 12.8px 的字高出一截，看起來像欄位分隔而不是字距分隔
- **目前這一頁的底線用 `text-decoration` 不用 `border-bottom`**：
  相鄰的分隔線是絕對定位的偽元素，兩種盒模型的線疊在同一個元素上會互相干擾
- 窄畫面自然換行、索引落到第二行靠左，**不需要另外寫斷點**

> `main.js` 原本的 `pagenavAlign()`（量主導覽那一項的左緣寫進 `--x`）**已經移除**。
> 位置改由內容欄決定，純 CSS 就做得到，不需要 JS 量。

### `.cat-lead__row` 為什麼要包一層

`.sec` 的內容欄寬度是用 `>` 子選擇器給的（`.sec > .section-label`、`.sec > .sec__body`）。
把導引小字包進 `<div>` 之後它就不再是 `.sec` 的直接子項，收不到那條寬度 ——
所以 `.cat-lead__row` 自己要再寫一次 `width: min(100%, var(--inner)); margin-inline: auto`。
z-index 也一起搬到這一層（原本在 `.cat-lead > .section-label` 上），不然索引會被裝飾葉子壓住。

### 索引式切換 `@mixin index-switch`：全站一套

就是「公版款式 │ 客製案例」那個樣子 —— 黑體 12.8px、髮絲線分隔、目前那一項深綠加細底線。
**三個地方共用同一個 mixin**（2026-08-25 用戶指定統一，實測三處的字級／字距／字體／
顏色／分隔線／高度完全相同）：

| 選擇器 | 在哪 |
|---|---|
| `.pagenav` | 內頁標題區的第二層導覽（公版款式／客製案例） |
| `.tabs` | 首頁「名片設計作品」的 範本／客製 |
| `.promo__go` | 首頁「賀卡最新消息」的 公版款式／客製案例 |

> `$item` 傳的是實際的子選擇器（`"a"` 或 `".tabs__btn"`），不要改成 `*`。
> 2026-08-26 之前 `e-cards.html` 的篩選列借用 `.tabs__btn` 拿樣式，
> `.tabs > *` 與 `.tabs__btn` 權重相同會互相蓋 —— 那個獨立的 `.tabs__btn` 樣式
> 現在已經刪掉（篩選列改用自己的 `.filter__btn`），但把子選擇器寫明確仍然比較安全。

### 按鈕系統（`.btn`，全站兩款）

| | 用在哪 |
|---|---|
| **`.btn--solid` 實心綠** | 全站唯一的「成交」動作：加 LINE 詢價、用 LINE 詢問 |
| **`.btn--ghost` 空心白底綠線** | 動作類的次要按鈕：載入更多、複製款號、電話聯絡 |

**導覽性質的切換不要用 `.btn`，用 index-switch。**
首頁賀卡區那兩個入口走過「一實一虛的按鈕」與「兩顆空心按鈕」，兩版都被推翻了
（一實一虛會被讀成「你現在就在公版款式」），現在是索引樣式。

### 綠色分兩支，用途不能混

寫在 `css/_tokens.scss` 的檔頭，**全站規則**：

| token | 用途 | 對宣紙白的對比 |
|---|---|---|
| `--green` `#6f8544` | 填色、線條、圖形（門檻 3:1） | 4.00:1 |
| `--green-deep` `#4a5a34` | **所有綠色的「字」**，含字底下那條底線（門檻 4.5:1） | 7.49:1 |

以前只有 `e-cards.scss` 在自己那一頁覆寫，首頁的 `.link-more`、`.tabs__btn.is-on`、
`.deck__enter`、`.nav__cta`、`.btn--ghost` 全都停在 4.00，`.btn--solid` 的白字是 4.11。
2026-08-25 升級成全站規則，`e-cards.scss` 那段覆寫一併刪掉了。

> ⚠️ **`.filter .tabs__btn.is-on` 的綠字要在 `e-cards.scss` 再寫一次，不能只靠全站規則。**
> `.filter .tabs__btn` 與 `.tabs__btn.is-on` **都是兩個 class、權重相同**，
> 而 `e-cards.css` 排在 `style.css` 後面 → 前者會贏，**選到與沒選到會長得一模一樣**。
> （踩過一次：把它當成多餘的覆寫刪掉，篩選器就沒有「目前選哪個」了。）

### 篩選列：方塊，不是底線文字（2026-08-26 改）

用戶回饋：「用點選的，看不清楚，是否有更好的選擇方式，讓人一目了然」。

原本是一排底線文字（借用首頁的 `.tabs__btn`）—— **每一顆都有底線**，
選到與沒選到只差在綠的深淺，掃過去分不出來。現在是方塊 `.filter__btn`：

| | 底 | 字 | 框 |
|---|---|---|---|
| 沒選 | 宣紙白 | `rgba(ink,.72)` 5.66:1 | 髮絲線 |
| **選到** | **`--green-deep` 實心** | **白 7.49:1** | `--green-deep` |

差別是「有沒有整顆填色」而不是「綠得深不深」，一眼就看得出來。
中間試過「薄荷底＋深綠字」（5.91:1），用戶挑了對比更高的實心深綠。

> ⚠️ **`&:hover` 一定要寫在 `&.is-on` 前面。** 兩者權重相同（都是兩個 class），
> 靠順序決勝 —— 對調的話滑過已經選中的那顆會變回淺色。

> **為什麼是分開的方塊，不是連在一起的分段控制（segmented control）：**
> 手機一定要能換行 —— 5 顆節日鈕在 390 螢幕排不進一列，
> 而分段控制一換行外框就斷開，看起來像壞掉。
>
> 手機的 `padding` 另外加大到 `.62em 1em`，觸控目標高度實測 40px。

**`.tabs__btn` 已經完全脫鉤**：首頁那組是索引小字，這裡是會填色的方塊，
兩邊已經是不同的東西，繼續共用一個 class 只會讓改一邊就動到另一邊。

### 卡片下面那行文字：要對齊圖片，而且卡內要比卡間更緊

2026-08-26 修掉的視覺 bug（用戶截圖標了兩個雙箭頭）。兩個原因疊在一起：

**1. `.card__meta` 用了 `justify-content: space-between`。**
款號被推到最左、挑款鈕被推到最右，於是（1536 實測）：

| | 距離 |
|---|---|
| 卡**內** 款號 → 挑款鈕 | **198px** |
| 卡**間** 挑款鈕 → 下一張的款號 | **26px** |

**鄰近性整個反過來** —— 眼睛會把「上一張的挑這款」和「下一張的款號」讀成同一組。
改成靠左收成一團（`gap: clamp(12px,1vw,18px)`）之後是卡內 15px／卡間 192～207px。

**2. 直式卡的文字列沒有跟圖片同寬。**
直式的圖只佔欄寬 **75%** 且置中，滿欄寬的文字列左右各超出 **41px** ——
圖與圖之間空 108px、文字與文字之間只剩 26px，看起來就像文字跟隔壁那張卡是一組的。
改法是 `.card__meta { width: var(--meta-w, 100%); margin-inline: auto }`，
直式那一組設 `--meta-w: 75%`。**改圖片寬度時這個變數要一起改。**

> 手機兩欄時 75% 只剩 125px，「款號 ＋ 挑這款」放不進一列會換成兩行 ——
> 這是刻意接受的：兩行都貼齊圖片左緣，仍然讀得出是同一張卡，
> 而且每一張直式卡都一樣高，不會只有幾張特別高。
> 試過改回滿欄寬換取一行，那會把 ±21px 的錯開帶回來，得不償失。

順帶把手機的欄間距下界從 16px 拉到 **22px** —— 兩欄時橫式卡的圖是滿欄寬的，
16px 讓兩張圖幾乎黏在一起（跟列間距的下界 20 也比較配）。

`shoot_ecards.py` 已加上「格線鄰近性」那一段，會量文字列偏移與卡內／卡間距離。

### 「載入更多款式」按完不要把畫面拉走

**`focus()` 預設會把元素捲進視野。** 按完最後一批時按鈕會藏起來，焦點得交出去 ——
原本交給上方的 `.cat__count`（顯示 N 款那行），結果整個畫面被拉回篩選列，
實測跳 **1281～8670px**，每一種篩選組合都會中（羊年＋直式只要按一次就會發生）。

現在交給**這一批剛出現的第一張卡**，而且一定要帶 `preventScroll: true`：

```js
if (更多.hidden) {
  var 落點 = (新的[0] || 卡片.filter(li => !li.hidden).pop());
  var 可聚焦 = 落點 && (落點.querySelector("a") || 落點.querySelector("button"));
  if (可聚焦) 可聚焦.focus({ preventScroll: true });
}
```

那張卡的位置就在剛才按鈕的上方，接得上剛才的動作，鍵盤按 Tab 也不會從頭開始。
`.cat__count` 是 `role="status"`，本來就會自己播報，**不需要拿到焦點**。

> 這個 bug 之前躲過了驗證，因為舊的測試只按了「還有更多」的那一次，
> 走不到「按完就藏起來」那條路。`shoot_ecards.py` 已補上羊年＋直式（16 款）那一段。

### 目前篩選浮條 `.cat__now`

捲過篩選列之後浮在導覽下方，回答「我現在在看哪一批」。按下去捲回篩選列。

```
節日 西元新年    版式 直式    顯示 4 / 4 款    ↑ 回到篩選
```

- **`position: fixed` 不是 `sticky`**，而且 HTML 上**刻意放在 `<main>` 外面**、
  跟挑款清單同一層 —— `.cat` 有 `overflow-x: clip`，`fixed` 的子孫在祖先有 overflow
  時有被裁掉的風險，離開那個容器最保險
- 上緣是 `calc(var(--nav-h, 68px) + 10px)`。**`--nav-h` 由 `main.js` 的 `navHeight()` 量**
  —— 導覽高度是 logo 的 `clamp` 算出來的，CSS 反推不了。量不到就退回 68
- 顯示／收起用 **IntersectionObserver 觀察 `.cat__bar`**，不要用捲動事件：
  Lenis 開著時捲動事件很密，每次都跑 callback 很浪費
- 收起來時是 **`visibility: hidden`**，不能只有 `opacity: 0` —— 那樣它還在 Tab 順序裡
- 文字直接抄「選到的那顆按鈕的字」，不另外維護對照表：
  日後在 `e-cards-data.js` 加節日時這裡不用跟著改
- **值用朱紅 `--seal` 不用綠**：整條浮條與底下的頁面都是綠系，綠字在這裡讀不出「這是重點」。
  朱紅 6.28:1 過門檻，而且是站上既有的色，不新增色票。
  （試過 `#d17717` 那種橘 —— 在宣紙白上只有 **3.23:1**，沒到本文的 4.5，沒有採用）
- 兩項都是「全部」時加 `.is-plain` 把值轉成墨色 —— 沒在篩的時候不要看起來像在篩，
  朱紅要留給「真的正在篩」那一刻才出現
- **不要給 `role="status"`**：底下的 `.cat__count` 已經是即時區域了，
  一個頁面兩個會互相搶播報
- 按下去用 `window.lenis.scrollTo()`（`main.js` 把實例掛出來了），
  各自 `new` 一個會有兩套補間搶 `scrollTop`；沒有 Lenis 時退回 `scrollIntoView()`

### 三個入口都通向這兩頁

```
① 導覽「電子賀卡」▾
     首頁：點父項捲到本頁的 #promo（賀卡最新消息）
     內頁：點父項到 e-cards.html
     子選單：公版款式 / 客製案例

② 首頁 #promo 區的兩顆按鈕：公版 → e-cards.html、客製 → custom-cards.html

③ 內頁的第二層導覽 .pagenav（主導覽底下那一條）：公版款式 / 客製案例
```

**主導覽仍然是六項**，「電子賀卡」多一層子選單。
桌機滑過或 Tab 到就展開（純 CSS 的 `:hover` / `:focus-within`，不需要 JS），
手機在漢堡選單裡直接縮排列出兩項，不再多一顆開關。

> ⚠️ **`.nav__has-sub > a` 與 `.nav__sub a` 都必須 `display: block`。**
> 原本每個 `<a>` 都是 `.nav__links` 的直接 flex 項目、會被 blockify，
> 所以 `.nav__links a { width: 80px }` 生效。包進 `<div>` / `<li>` 之後
> `<a>` 退回 inline —— **inline 元素吃不到 width**，桌機整列會縮掉 14px、
> 右對齊的導覽跟著整組左移；手機的子項目會縮成 81px 的窄條，觸控目標不合格。
> 這個坑踩了兩次。

主導覽的「電子賀卡」在 `custom-cards.html` 標 `aria-current="true"`（目前所在**單元**），
在 `e-cards.html` 標 `aria-current="page"`（就是這一頁）。所以 `style.scss` 的選擇器是
`[aria-current]` 而不是 `[aria-current="page"]`，兩種都要高亮。

### 客製案例：作品集總覽（2026-09-03 定版）

3D 旋轉木馬與逐張主展示都已移除。現在由 `.portfolio-grid` 一次列出所有作品，
桌機三欄、手機兩欄；圖片下面只保留名稱、版式與「觀看動畫」，不再用外框切割內容。
每件作品都在 Fancybox iframe Modal 裡播放自己的完整動畫頁；新增案例時複製一個 `.portfolio-card` 即可。

`.custom__tree` 與 `.custom` 為它加大的下留白一起移除了（用戶指定不要樹）。

### 裝飾要貼齊「視窗」右緣，不是版面右緣

`--wrap` 的上限是 1920。畫面比 1920 ＋ 左右留白更寬時 `.wrap` 就不再貼著視窗，
裝飾若以 `.cat-lead`（＝`.wrap`）為定位基準、只給 `right: calc(-1 * var(--gut))`，
就會停在版面邊緣 —— **2560 實測離視窗右緣還有 248px**。

解法是把定位基準交給滿版的 `<main>`（`main { position: relative }`，
`.cat-lead` 不給 `position: relative`），裝飾寫 `right: 0`。

> **不要用 `100vw` 去算。** 那個值含捲軸寬，會多推出去約 8px，變成橫向捲軸。
> `.cat-lead` 裡的內容各自有 `position: relative` ＋ `z-index`，拿掉父層的定位不影響疊放順序。

### 水彩裝飾

原始素材在 `reference\material\`（不進 git），跑 `_驗證工具uild_deco.py`
裁掉透明邊、縮到顯示尺寸的 2 倍、微降彩度、轉 WebP → `images/deco/`（6 個檔共 187 KB）。

> **蝴蝶要降彩度。** 原檔偏藍紫，品牌色票裡沒有這兩個色相，
> 不降的話會在宣紙白上跳出來，看起來像另一家公司的素材。粉紫那隻（butterfly1）沒有用。

> ⚠️ **`clients/songchuan`（松川珈琲焙煎所）是虛構品牌的示意卡**，不是真的客戶案例。
> 放在客製案例區，但卡片名稱旁邊一定要留著「品牌示意」那個標記 ——
> 拿掉就等於在官網上宣稱做過這個案子。真的接到客戶案例之後，換掉它。

### 裝飾用的是首頁既有的語彙，不要另外發明

PRODUCT.md 訂的是「留白是主角，空的地方就讓它空著」。這一頁一開始看起來太素，
原因不是留白太多，而是**首頁那套視覺語彙一個都沒用到**。現在補上的四個都是照搬：

| 元素 | 對應首頁 | 位置 |
|---|---|---|
| `.cat-lead__ring` | `.about__ring` | 標題區右側，年輪水印（opacity .07 ＋ grayscale） |
| `.cat__vertical` | `.services__vertical` | 格線區右側留白的直排引句 |
| `.cat__mark` | `.services__mark` | 格線區右下角的典藏標記 |
| `.custom` 的米白底＋和紙肌理、`.custom__tree` | `.services` 的底色與 `.about__tree` | 客製案例整區 |

直排引句與典藏標記是 `aria-hidden` 的**純裝飾**（WCAG 1.4.3 對 pure decoration 沒有對比要求），
數值與首頁完全相同。要改深就不再是「低語」而變成內容了 —— 那就不該 aria-hidden。

### 「進入瀏覽」是卡片下緣的 50px 綠帶

滑鼠在卡片**任何位置**（或鍵盤焦點進到卡片）綠帶就升起來，不是只有滑到帶子上才算。
觸控裝置常駐，高度收到 34px —— 手機兩欄的橫式卡只有約 125px 高，50px 會吃掉 40%。

> ⚠️ **底色用 `--green-deep` 不用 `--green`。** 白字壓在 `--green` 上只有 4.11:1，
> 沒到本文門檻 4.5。要維持 `--green` 的話字得放大到 24px 才算「大字」、門檻才降到 3，
> 但 50px 高的帶子塞 24px 的字太重。

### 點卡片會去哪裡

每一款獨立決定：`e-cards-data.js` 的 `動態連結` 有登記網址時，點圖片直接進入該款動畫；
沒有登記時會另開 `card-preview.html?code=款號`，以該款自己的圖片播放基本進場效果，
不會把不同賀卡導向同一張示範稿。公版使用新分頁；客製案例仍使用 Fancybox Modal。
Fancybox 檔案放在 `scripts/fancybox/`，不另外維護自製 `<dialog>`。

圖片 hover 或取得鍵盤焦點時會顯示「觀看動畫」，觸控裝置則常駐。

### 動這一頁之前要知道的三件事

1. **綠字一律用 `--green-deep`。** `--green` #6f8544 在宣紙白上只有 **4.00:1**，
   沒到 PRODUCT.md 訂的本文 4.5。這一頁在 `e-cards.scss` 最上面集中覆寫，
   全站的 tokens 沒動（動了首頁就跟著變）。

2. **卡片的尺寸一律由「寬度」推出來，不要寫 `height: 100%`。**
   外層 `.card__media` 是 `aspect-ratio: 1/1`，它的高度是算出來的；
   對這種高度取百分比會形成循環，Chrome 會退回內容尺寸，**連 `max-width` 都一起失效**。
   症狀很明顯但很容易誤判成別的問題：卡片撐爆欄寬、四張連在一起沒有間隙。
   現在是橫式 `width: 100%` ＋ `aspect-ratio: 4/3`、直式 `width: 75%` ＋ `3/4`
   （75% × 4/3 剛好等於格位高）。

3. **`.card__enter` 用 flex 不要用 grid。** 箭頭是 `::after` 畫的，
   在 grid 容器裡它會變成另一個格子、掉到文字下面變成兩行。
   flex 之下才會排在同一行（前面的空白會被吃掉，所以用 `gap` 補）。

4. **一句話裡有 `<strong>` 或連結的段落，不要用 flex。**
   flex 會把每一段文字各自當成一個項目，句子就在標籤前後被拆行。
   `.cat-lead__upgrade` 踩過：畫面上出現「加價做成　會動的電子賀卡」換行才接「，一條連結…」。
   那種段落就用一般的行內排版，連結靠 `margin-left` 隔開就好。

## 琇端的自助範圍

完整說明給她看 **`cards/琇端修改說明.md`**（含操作步驟與不要碰的東西）。

- `cards/<卡號>/index.html` 裡標了 `✏️` 的文字與檔期日期
- `cards/<卡號>/images/` 圖片同名覆蓋（`poster.jpg` 1200×630、`list.jpg` 540×960）
- 客戶曝光 banner 的圖與連結
- 其他交給製作方

## 導覽與頁尾是共用的【鐵律：只改 _partials，頁面裡的是產物】

導覽、第二層導覽、頁尾三個區塊在每一頁都一樣，來源只有一份：

```
_partials/nav.html      主導覽（含電子賀卡的子選單）
_partials/pagenav.html  內頁的第二層導覽
_partials/foot.html     頁尾
```

改完跑一次，三頁一起更新：

```
python ../_驗證工具/build_pages.py          # 寫入
python ../_驗證工具/build_pages.py --check   # 只檢查有沒有忘記跑（提交前用）
```

> **不要直接改頁面裡的那三段。** 它們被 `<!-- #nav -->…<!-- /#nav -->` 這種記號包著，
> 下次建置會整段覆蓋回去。記號本身的註解也寫了同一句話。

**每頁的差異只有六個變數**（brand href、四條連結的前綴、電子賀卡的 href、三個 aria-current），
對應表寫在 `build_pages.py` 的 `頁面` 那個 dict，新增一頁就多一列。

### 為什麼是建置腳本，不是 JS 注入也不是 Jekyll

| 做法 | 判斷 |
|---|---|
| **建置腳本，產物進 git** ✅ | 輸出仍是純靜態 HTML → GitHub Pages 與 Cloudflare Pages **都零設定**；`file://` 直開與 `_驗證工具` 全部照常 |
| JS 注入 | 頁尾的地址、電話、版權會變成「JS 才出現」，違反 PRODUCT.md「內容看得見，不靠 JS」，LINE／FB 爬蟲抓不到 |
| Jekyll `_includes` | GitHub Pages 原生支援，但 `.html` 會變成 Liquid 模板 —— **直接開檔案會看到 `{% include %}`**，校版工具的 http.server 也跟著失效 |

`_partials/` 是 `_` 開頭，GitHub Pages 的 Jekyll 不會把它輸出成網頁。

## 捲動緩衝（Lenis）

滾輪捲動有一段補間，不是一格一格跳。實作在 `scripts/main.js` 的 `smoothScroll()`。

**為什麼是 Lenis 不是 GSAP 官方的 ScrollSmoother**（GSAP 3.15 已經免費、拿得到）：
ScrollSmoother 是把整頁內容包進 `#smooth-wrapper` 再用 `transform` 推。
transform 會建立新的包含塊，這個站有三個東西會因此壞掉 ——
**sticky 的導覽、fixed 的 `.frame` 冊頁界線、fixed 的挑款清單**，全部要搬到 wrapper 外面。
Lenis 補間的是「真正的 `scrollTop`」，那三個都照常運作，**DOM 一行都不用改**。

四條要記住的：

1. **`html { scroll-behavior: smooth }` 在 Lenis 啟用時一定要關掉**
   （`style.scss` 裡的 `html.lenis { scroll-behavior: auto }`）。
   Lenis 每一幀直接寫 `scrollTop`，瀏覽器又要對每一次寫入再做一次平滑補間，
   兩層疊起來會變得拖泥帶水。保留原本那條是給「沒有 Lenis」時當退路。

2. **錨點不要自己算 offset。** `lenis.scrollTo(element)` 已經會把目標的
   `scroll-margin-top` 算進去。我加過 `offset: -scrollMarginTop`，結果讓開了兩次 ——
   段落上緣落在 184 而不是 92。

3. **攔了 `preventDefault` 就要自己把焦點移過去。** 原生的錨點跳轉會順便移動焦點，
   攔掉之後「跳過導覽」的 skip link 就只會捲動、焦點還留在原地，
   鍵盤使用者按 Tab 又回到導覽第一項。`main.js` 補了 `tabindex="-1"` ＋
   `focus({ preventScroll: true })`（`preventScroll` 不能少，不然瀏覽器會再跳一次把補間打斷）。

4. **頁面裡自己會捲的區塊要加 `data-lenis-prevent`。**
   目前只有 `e-cards.html` 的挑款清單面板（`#pickPanel`，`overflow-y: auto`）。
   沒有的話滾輪會被 Lenis 接走去捲整頁。

用 `gsap.ticker` 驅動、不自己開第二個 `requestAnimationFrame` —— 兩個 rAF 迴圈會讓
捲動與進場動畫落在不同幀上，快速捲動時看得到撕裂。
`prefers-reduced-motion: reduce` 時**完全不啟用**（連 `.lenis` 類別都不會掛上去）。

## SCSS 編譯【鐵律：只改 .scss，.css 是產物】

卡片數量會一直增加，所以用 `--update` 一行掃全部（只重編有改動的）：

```
npx sass --update css:css cards:cards clients:clients --no-source-map
```

單獨編一支也可以：

```
npx sass css/style.scss css/style.css --no-source-map
npx sass cards/CH2026001/css/style.scss cards/CH2026001/css/style.css --no-source-map
```

⚠️ 編譯務必帶 `--no-source-map`，漏了會產生 `.css.map`（`.gitignore` 已擋，但不要養成習慣）。

## 部署

```
python ../_驗證工具/build_pages.py --check   # 確認共用區塊沒忘記重跑
npx sass --update css:css cards:cards clients:clients --no-source-map
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
