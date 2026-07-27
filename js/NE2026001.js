// NE01 新年卡動畫（GSAP）：金日自地平線升起
window.CARD_ANIMATION = function (cfg) {
  if (!window.gsap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".horizon", { scaleX: 0, duration: 1.4, ease: "expo.out" })
    .from(".sunrise", { y: 26, opacity: 0, duration: 1.6, ease: "expo.out" }, "-=0.9")
    .from(".year-ghost", { opacity: 0, duration: 1.8, ease: "sine.out" }, "-=1.4")
    .from(".card-title", { y: 34, opacity: 0, duration: 1.2 }, "-=1.2")
    .from(".card-subtitle", { y: 16, opacity: 0, duration: 0.9 }, "-=0.7")
    .from(".card-greeting", { y: 18, opacity: 0, duration: 0.9 }, "-=0.5")
    .from(".card-signoff", { opacity: 0, duration: 0.8 }, "-=0.4")
    .from(".card-reply", { opacity: 0, y: 10, duration: 0.7 }, "-=0.3");

  // 金日的呼吸光暈
  gsap.to(".sunrise", {
    boxShadow: "0 0 34px rgba(168, 134, 46, .55)",
    duration: 2.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 1.8
  });
};
