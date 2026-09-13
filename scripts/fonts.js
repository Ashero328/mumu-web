// ============================================
// 網頁字體：用 JS 掛上樣式表，不要讓它擋住第一次繪製
//
// 為什麼要這樣做：
//   `<link rel="stylesheet">` 是**擋渲染**的 —— 瀏覽器拿不到它就不畫任何東西。
//   而中文字體的樣式表非常大：Google 會把每個中文字重切成上百個 unicode-range
//   子集，我們要 7 個中文字面，整份是 **757 條 @font-face、未壓縮 863 KB
//   （gzip 後仍有 239 KB）**。
//
//   實測（Fast 3G 1.6 Mbps／150 ms，e-cards.html 首次內容繪製）：
//     原本擋著        3500 ms   ← 前 3.5 秒畫面全白
//     不讓它擋         1088 ms
//   也就是這一行 `<link>` 一項就吃掉 2.4 秒的白畫面。
//
// 代價：字體晚一步到，會先看到系統字再換成 Noto（FOUT）。
//   這是刻意的取捨 —— 字體跳一下還讀得到內容，白畫面什麼都讀不到。
//   網址本來就帶 `display=swap`，本來就會換，只是以前換在第一次繪製之前。
//
// 用法：在 <head> 放
//     <script src="scripts/fonts.js" data-fonts="https://fonts.googleapis.com/css2?…" defer></script>
//   網址寫在 HTML 上（各頁要的字重不完全一樣），這支只負責掛。
//   沒有 JS 的話走 <noscript> 裡那條一般的 <link>，見各頁 <head>。
//
// ⚠️ 不要把它改回 <link>，也不要用 media="print" onload="…" 的寫法 ——
//    那是 inline script，違反全站「JS 歸 .js」的規則。
// ============================================
(function () {
  "use strict";

  // defer 的 script 讀不到 document.currentScript，用選擇器找自己
  var self = document.querySelector("script[data-fonts]");
  if (!self) return;

  var href = (self.getAttribute("data-fonts") || "").trim();
  if (!href) return;

  // 已經有人掛過就不重複（例如 <noscript> 在某些情境下也被解析）
  if (document.querySelector('link[rel="stylesheet"][href="' + href + '"]')) return;

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
})();
