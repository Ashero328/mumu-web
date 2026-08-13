// 松川珈琲焙煎所 客戶版賀卡動畫（GSAP）
// 節奏跟聖誕卡一樣：先出圓、再一段一段把字帶進來，最後裝飾自己動起來。
// 換掉的只是「動什麼」——雪點沉浮 → 熱氣上升＋火光明滅。
window.CARD_ANIMATION = function () {
  if (!window.gsap) return;
  // 關掉動態時整支不跑。內容本來就看得見（CSS 沒有預先藏起來），不會變成空白畫面
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".drum", { scale: 0.92, opacity: 0, duration: 1.6, ease: "expo.out" })
    .from(".card-title", { y: 34, opacity: 0, duration: 1.2 }, "-=1.1")
    .from(".card-subtitle", { y: 16, opacity: 0, duration: 0.9 }, "-=0.7")
    .from(".card-greeting", { y: 18, opacity: 0, duration: 0.9 }, "-=0.5")
    .from(".card-signoff", { opacity: 0, duration: 0.8 }, "-=0.4")
    .from(".card-reply", { opacity: 0, y: 10, duration: 0.7 }, "-=0.3");

  // 熱氣：往上飄再淡掉，三道各自錯開，看起來才不像同一根線在複製。
  //
  // ⚠️ 位移量有上限。橫式（16:9）的舞台上緣到焙煎鼓只有約 65px，
  //    熱氣本身就佔掉四十幾，往上飄太多會被 .card-stage 的 overflow: hidden 切掉。
  //    -26 ~ -38 實測會切到 4～9px。改鼓的大小或熱氣高度時要回來一起看。
  gsap.utils.toArray(".steam").forEach(function (line, i) {
    gsap.fromTo(line,
      { y: 8, opacity: 0, scaleY: 0.7 },
      {
        y: -14 - i * 4,
        opacity: 0.9,
        scaleY: 1.15,
        transformOrigin: "50% 100%",
        duration: 3.4 + i * 0.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.7
      });
  });

  // 火光：緩緩沉浮，明滅不同步
  gsap.utils.toArray(".spark").forEach(function (dot, i) {
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
