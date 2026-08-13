// ============================================
// 木木文化 賀卡引擎
// 職責：版式切換、檔期時效、分享功能、動畫啟動
//
// 內容一律直接寫在 index.html（打開原始碼就看得到字，琇端可以自己改，
// 搜尋引擎與 LINE 預覽也抓得到）；設定寫在 <head> 的 <meta>。
// 這支不再讀 config.js —— 那個檔案已經移除。
// ============================================

(function () {
  function $(sel) { return document.querySelector(sel); }

  // 讀 <meta name="…" content="…">，沒有或空白都回空字串
  function meta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    var v = el && el.getAttribute("content");
    return v ? v.trim() : "";
  }

  // 日期字串格式不對時 new Date() 會是 Invalid Date，任何比較都是 false，
  // 也就是「打錯字＝不下架」，不會誤把還在檔期的卡收起來
  function isPast(dateStr) {
    if (!dateStr) return false;
    var end = new Date(dateStr + "T23:59:59");
    return !isNaN(end) && new Date() > end;
  }

  // ---------- 版式：手機直式滿版 / 電腦橫式 ----------
  function applyLayout() {
    var landscape = window.matchMedia("(min-width: 900px)").matches;
    document.documentElement.classList.toggle("layout-landscape", landscape);
    document.documentElement.classList.toggle("layout-portrait", !landscape);
  }
  applyLayout();
  window.addEventListener("resize", applyLayout);

  // ---------- 純淨模式：交付客戶版，隱藏按鈕與資訊區 ----------
  if (/[?&]min=1/.test(location.search)) {
    document.documentElement.classList.add("is-minimal");
  }

  // ---------- 檔期時效 ----------
  // 賀卡到期：整張卡收起，改成一頁公告（網址還活著，舊連結不會變成 404）
  var expired = isPast(meta("card-offline"));
  if (expired) document.documentElement.classList.add("is-expired");

  // 曝光區到期：只有客戶的 banner 消失，賀卡本身照常
  if (isPast(meta("promo-offline"))) {
    var promo = $(".card-promo");
    if (promo) promo.classList.add("is-hidden");
  }

  // ---------- 分享 ----------
  var url = location.href.split("#")[0];

  var lineBtn = $('[data-share="line"]');
  if (lineBtn) {
    lineBtn.href = "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(url);
  }

  var copyBtn = $('[data-share="copy"]');
  if (copyBtn) {
    copyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(url).then(function () {
        copyBtn.textContent = "已複製！";
        setTimeout(function () { copyBtn.textContent = "複製連結"; }, 1500);
      });
    });
  }

  // ---------- 啟動本卡動畫（檔期結束就不跑，卡片已經收起來了） ----------
  if (!expired && typeof window.CARD_ANIMATION === "function") window.CARD_ANIMATION();
})();
