// ============================================
// 提案 B：幾何線條 — 捲動動態
// 原則：內容預設就看得見，GSAP 只做進場位移與幾何線條的生長；關閉動態時完全不跑
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ---------- 導覽：捲動後顯示分隔線 ----------
(function navShadow() {
  var nav = document.getElementById("nav");
  var ticking = false;

  function update() {
    nav.classList.toggle("is-stuck", window.scrollY > 8);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  update();
})();

// ---------- 導覽：目前所在區塊高亮 ----------
(function navActive() {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var map = {};

  links.forEach(function (a) {
    var section = document.getElementById(a.getAttribute("href").slice(1));
    if (section) map[section.id] = a;
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove("is-active"); });
      if (map[entry.target.id]) map[entry.target.id].classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
})();

// ---------- 捲動動態 ----------
var mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", function () {
  var ease = "expo.out";

  // Hero：幾何圖形自中心生長、文字浮現
  gsap.from(".hero .geo", {
    scale: 0.82,
    opacity: 0,
    duration: 1.8,
    stagger: 0.09,
    ease: ease
  });

  gsap.from(".hero__title", { y: 38, opacity: 0, duration: 1.4, ease: ease });
  gsap.from([".hero__sub", ".hero__actions", ".hero__facts"], {
    y: 20, opacity: 0, duration: 1.1, delay: 0.3, stagger: 0.12, ease: ease
  });
  gsap.from(".hero__vertical", { opacity: 0, duration: 1.6, delay: 0.6 });

  // 區塊標記
  gsap.utils.toArray(".tag").forEach(function (el) {
    gsap.from(el, {
      x: -16, opacity: 0, duration: .9, ease: ease,
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });

  // 理念：色塊自左推入
  gsap.from(".about__panel", {
    x: -36,
    opacity: 0,
    duration: 1.4,
    ease: ease,
    scrollTrigger: { trigger: ".about", start: "top 74%" }
  });

  gsap.from(".about__side", {
    y: 40, opacity: 0, duration: 1.3, ease: ease,
    scrollTrigger: { trigger: ".about", start: "top 70%" }
  });

  // 營業項目：格子依序浮現
  gsap.from(".svc__item", {
    y: 26, opacity: 0, duration: 1, stagger: 0.07, ease: ease,
    scrollTrigger: { trigger: ".svc", start: "top 82%" }
  });

  gsap.from(".mark", {
    scale: 0.7, opacity: 0, duration: 1.1, stagger: 0.07, ease: ease,
    scrollTrigger: { trigger: ".svc", start: "top 80%" }
  });

  // 作品：錯位進場（GSAP 會沿用 CSS 既有的傾斜角，只疊加位移）
  gsap.utils.toArray(".w").forEach(function (item) {
    gsap.from(item, {
      y: 56,
      opacity: 0,
      duration: 1.5,
      ease: ease,
      scrollTrigger: { trigger: item, start: "top 90%" }
    });
  });

  // 訂單流程與詢問區
  gsap.from(".flow__list li", {
    y: 22, opacity: 0, duration: 1, stagger: 0.09, ease: ease,
    scrollTrigger: { trigger: ".flow__list", start: "top 86%" }
  });

  gsap.from(".promo__ask", {
    y: 26, opacity: 0, duration: 1.2, ease: ease,
    scrollTrigger: { trigger: ".promo__ask", start: "top 88%" }
  });

  // 聯絡區幾何圓環
  gsap.from(".contact__geo span", {
    scale: 0.8, opacity: 0, duration: 1.6, stagger: 0.12, ease: ease,
    scrollTrigger: { trigger: ".contact", start: "top 80%" }
  });
});

// ---------- 疊卡：桌機加上層層後退的深度（CSS sticky 本身已可運作） ----------
mm.add("(min-width: 760px) and (prefers-reduced-motion: no-preference)", function () {
  var cards = gsap.utils.toArray(".stack__card");

  cards.forEach(function (card, i) {
    if (i === cards.length - 1) return;

    gsap.to(card, {
      scale: 0.97,
      opacity: 0.55,
      ease: "none",
      scrollTrigger: {
        trigger: cards[i + 1],
        start: "top 80%",
        end: "top 20%",
        scrub: true
      }
    });
  });

  return function cleanup() {
    gsap.set(cards, { clearProps: "scale,opacity" });
  };
});
