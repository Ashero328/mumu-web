// ============================================
// 木木文化 賀卡引擎
// 職責：版式切換、設定檔文字帶入、檔期時效、分享功能、動畫啟動
// 每張卡的 config.js 定義內容，anim.js 定義動畫（window.CARD_ANIMATION）
// ============================================

(function () {
  var cfg = window.CARD_CONFIG || {};

  function $(sel) { return document.querySelector(sel); }

  // ---------- 版式：手機直式滿版 / 電腦橫式 ----------
  function applyLayout() {
    var landscape = window.matchMedia("(min-width: 900px)").matches;
    document.documentElement.classList.toggle("layout-landscape", landscape);
    document.documentElement.classList.toggle("layout-portrait", !landscape);
  }
  applyLayout();
  window.addEventListener("resize", applyLayout);

  // ---------- 文字槽：config 的值填入 [data-slot] ----------
  document.querySelectorAll("[data-slot]").forEach(function (el) {
    var key = el.getAttribute("data-slot");
    if (cfg[key]) el.textContent = cfg[key];
  });

  // ---------- 檔期時效 ----------
  var now = new Date();
  if (cfg.offlineDate && now > new Date(cfg.offlineDate + "T23:59:59")) {
    document.documentElement.classList.add("is-expired");
    var note = $(".card-expired-note");
    if (note) note.classList.remove("is-hidden");
  }
  if (cfg.promoOfflineDate && now > new Date(cfg.promoOfflineDate + "T23:59:59")) {
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

  var dlBtn = $('[data-share="download"]');
  if (dlBtn) {
    if (cfg.videoFile) dlBtn.href = cfg.videoFile;
    else dlBtn.classList.add("is-hidden");
  }

  // ---------- 回覆按鈕（TAP TO REPLY） ----------
  var reply = $('[data-slot-link="reply"]');
  if (reply) {
    if (cfg.replyLink) reply.href = cfg.replyLink;
    else reply.classList.add("is-hidden");
  }

  // ---------- 啟動本卡動畫 ----------
  if (typeof window.CARD_ANIMATION === "function") window.CARD_ANIMATION(cfg);
})();
