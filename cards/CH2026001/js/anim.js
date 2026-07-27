// CH01 聖誕卡動畫（GSAP）
window.CARD_ANIMATION = function (cfg) {
  if (!window.gsap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".wreath", { scale: 0.92, opacity: 0, duration: 1.6, ease: "expo.out" })
    .from(".card-title", { y: 34, opacity: 0, duration: 1.2 }, "-=1.1")
    .from(".card-subtitle", { y: 16, opacity: 0, duration: 0.9 }, "-=0.7")
    .from(".card-greeting", { y: 18, opacity: 0, duration: 0.9 }, "-=0.5")
    .from(".card-signoff", { opacity: 0, duration: 0.8 }, "-=0.4")
    .from(".card-reply", { opacity: 0, y: 10, duration: 0.7 }, "-=0.3");

  // 金點如雪，緩緩沉浮
  gsap.utils.toArray(".snowdot").forEach(function (dot, i) {
    gsap.to(dot, {
      y: 14 + (i % 3) * 6,
      opacity: 0.25,
      duration: 3.2 + i * 0.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 0.4
    });
  });
};
