// ============================================
// 提案 A：中式文青・留白 — 捲動動態
// 原則：內容預設就看得見，GSAP 只負責進場位移與線條生長；關閉動態時完全不跑
// ============================================

gsap.registerPlugin(ScrollTrigger);

// 中文字體與圖片載入完成後版面會位移，必須重算觸發點，否則捲動動態不會啟動
window.addEventListener("load", function () { ScrollTrigger.refresh(); });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
}

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

// ---------- 導覽：目前所在區塊高亮（與動態偏好無關，一律啟用） ----------
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

// ---------- 關係圖：滑到節點時點亮對應曲線（不依賴動態偏好） ----------
(function mindmapHover() {
  var paths = document.querySelectorAll(".mindmap__lines path");
  if (!paths.length) return;

  document.querySelectorAll(".mnode").forEach(function (node) {
    var line = paths[Number(node.dataset.line)];
    if (!line) return;

    var on = function () { line.classList.add("is-lit"); };
    var off = function () { line.classList.remove("is-lit"); };

    node.addEventListener("mouseenter", on);
    node.addEventListener("mouseleave", off);
    node.addEventListener("focusin", on);
    node.addEventListener("focusout", off);
  });
})();

// ---------- 捲動動態 ----------
var mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", function () {
  var ease = "expo.out";

  // 主視覺
  gsap.from(".hero__title span", { y: 30, opacity: 0, duration: 1.4, stagger: 0.12, ease: ease });
  gsap.from([".hero__kicker", ".hero__actions"], { y: 14, opacity: 0, duration: 1.1, delay: 0.3, stagger: 0.1, ease: ease });
  gsap.from(".hero__figure", { y: 40, opacity: 0, duration: 1.6, delay: 0.15, ease: ease });
  gsap.from(".hero__seal", { scale: 0.6, opacity: 0, rotate: -24, duration: 1.1, delay: 1, ease: ease });
  gsap.from(".hero__vertical", { opacity: 0, duration: 1.6, delay: 0.8 });

  // 區塊標記：短線先展開
  gsap.utils.toArray(".section-label").forEach(function (el) {
    gsap.from(el, {
      x: -14, opacity: 0, duration: 1, ease: ease,
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });

  // 理念
  gsap.from(".about__lead", {
    y: 24, opacity: 0, duration: 1.2, ease: ease,
    scrollTrigger: { trigger: ".about", start: "top 74%" }
  });

  gsap.from(".about__body > *", {
    y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: ease,
    scrollTrigger: { trigger: ".about__body", start: "top 80%" }
  });

  // 作品：小卡依序浮現
  gsap.from(".wk", {
    y: 26, opacity: 0, duration: 1.1, stagger: 0.09, ease: ease,
    scrollTrigger: { trigger: ".works__grid", start: "top 86%" }
  });

  // 賀卡疊卡：前一張退到後面（B 案的疊卡層次移植過來）
  var cards = gsap.utils.toArray(".stack__card");
  cards.forEach(function (card, i) {
    if (i === cards.length - 1) return;

    gsap.to(card, {
      scale: 0.975,
      opacity: 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: cards[i + 1],
        start: "top 82%",
        end: "top 24%",
        scrub: true
      }
    });
  });

  gsap.from(".promo__ask", {
    y: 18, opacity: 0, duration: 1, ease: ease,
    scrollTrigger: { trigger: ".promo__ask", start: "top 92%" }
  });
});

// ---------- 關係圖動畫：曲線生長＋節點浮現（桌機才有曲線） ----------
mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
  var paths = gsap.utils.toArray(".mindmap__lines path");
  var tl = gsap.timeline({
    scrollTrigger: { trigger: ".mindmap", start: "top 76%" }
  });

  tl.from(".mindmap__hub", { scale: 0.86, opacity: 0, duration: 1.1, ease: "expo.out" });

  paths.forEach(function (path, i) {
    var len = path.getTotalLength();
    if (!len) return;

    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" }, 0.35 + i * 0.09);
  });

  tl.from(".mnode", { y: 14, opacity: 0, duration: .9, stagger: 0.08, ease: "expo.out" }, 0.7);

  return function cleanup() {
    gsap.set(paths, { clearProps: "strokeDasharray,strokeDashoffset" });
  };
});

// ---------- 手機：關係圖節點依序浮現（無曲線） ----------
mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", function () {
  gsap.from(".mindmap__hub", {
    scale: 0.9, opacity: 0, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".mindmap", start: "top 82%" }
  });

  gsap.from(".mnode", {
    x: -14, opacity: 0, duration: .9, stagger: 0.08, ease: "expo.out",
    scrollTrigger: { trigger: ".mindmap__nodes", start: "top 86%" }
  });
});
