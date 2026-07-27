// ============================================
// 本卡專屬動畫（GSAP）——由製作方撰寫
// 引擎會在設定載入完成後呼叫 window.CARD_ANIMATION(cfg)
// ============================================

window.CARD_ANIMATION = function (cfg) {
  if (!window.gsap) return;

  gsap.from(".card-title", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" });
  gsap.from(".card-greeting", { y: 30, opacity: 0, duration: 1, delay: 0.5, ease: "power2.out" });
  gsap.from(".card-signoff", { opacity: 0, duration: 1, delay: 1.1 });
  gsap.from(".card-reply", { opacity: 0, y: 10, duration: 0.8, delay: 1.6 });
};
