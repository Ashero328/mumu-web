// 聖誕示範卡動畫（GSAP）
window.CARD_ANIMATION = function (cfg) {
  if (!window.gsap) return;

  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".card-title", { y: 50, opacity: 0, scale: 0.92, duration: 1.4 })
    .from(".card-greeting", { y: 30, opacity: 0, duration: 1 }, "-=0.7")
    .from(".card-signoff", { opacity: 0, duration: 0.9 }, "-=0.4")
    .from(".card-reply", { opacity: 0, y: 12, duration: 0.8 }, "-=0.2");

  // 標題微微呼吸的環境動態
  gsap.to(".card-title", {
    y: -6,
    duration: 2.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    delay: 1.6
  });
};
