// ============================================
// 松川珈琲焙煎所：互動與捲動動態
// 原則：內容預設就看得見，GSAP 只負責進場位移；關閉動態時完全不跑
//
// 輪播一律用 Owl，不自己寫。這一包自足：jQuery／Owl／GSAP 都在 scripts/ 底下，
// 不引用總站的檔案，整個資料夾複製走就能跑。
// ============================================

gsap.registerPlugin(ScrollTrigger);

// 中文字體與圖片載入完成後版面會位移，必須重算觸發點
window.addEventListener("load", function () { ScrollTrigger.refresh(); });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
}

// ---------- 輪播 ----------
// 初始化參數寫在這裡不寫 inline：這一包照專案的歸檔規則走（CSS 歸 .css、JS 歸 .js）
jQuery(function ($) {
  $(".owl-shots").owlCarousel({
    items: 3,
    margin: 20,
    dots: true,
    nav: false,
    mouseDrag: true,
    touchDrag: true,
    slideBy: "page",
    // 不用 stagePadding：輪播收在內容欄裡、左緣要跟大標對齊，
    // 一給 stagePadding 就會把第一張往右推，兩條左緣就差開了（見 style.scss 的說明）
    responsive: {
      0:    { items: 1, margin: 12 },
      600:  { items: 2, margin: 16 },
      1000: { items: 3, margin: 20 }
    }
  });
});

// ---------- 導覽：捲動後顯示分隔線 ----------
(function navShadow() {
  var nav = document.getElementById("nav");
  if (!nav) return;
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

// ---------- 導覽：手機版選單開關 ----------
(function navToggle() {
  var nav = document.getElementById("nav");
  var btn = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!nav || !btn || !links) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
  }

  btn.addEventListener("click", function () {
    setOpen(nav.classList.contains("is-open") === false);
  });

  // 點了任一連結就收起來，否則捲到目標後選單還蓋在上面
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Esc 關閉，並把焦點還給開關按鈕
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      btn.focus();
    }
  });
})();

// ---------- 導覽：目前所在區塊高亮 ----------
(function navActive() {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var map = {};

  links.forEach(function (a) {
    var section = document.getElementById(a.getAttribute("href").slice(1));
    if (section) map[section.id] = a;
  });

  if (!Object.keys(map).length) return;

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
// 全部包在 prefers-reduced-motion 之內：關掉動態時這一段完全不執行，
// 內容維持 CSS 的預設狀態（本來就看得見，不靠 JS 才顯示）
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", function () {
  var ease = "expo.out";

  // 主視覺：三行標題錯開進場
  gsap.from(".hero__title span", { y: 40, opacity: 0, duration: 1.3, stagger: 0.11, ease: ease });
  gsap.from([".eyebrow", ".hero__lead", ".hero__actions"],
    { y: 16, opacity: 0, duration: 1.1, delay: 0.25, stagger: 0.09, ease: ease });
  gsap.from(".hero__spec > div",
    { y: 18, opacity: 0, duration: 1, delay: 0.55, stagger: 0.08, ease: ease });

  // 鍋爐暖光：極慢的呼吸，幅度小到不會分心
  gsap.to(".hero__glow", {
    scale: 1.12, opacity: .78, duration: 7,
    repeat: -1, yoyo: true, ease: "sine.inOut"
  });

  // 段落標記與大標
  gsap.utils.toArray(".section-label").forEach(function (el) {
    gsap.from(el, {
      x: -16, opacity: 0, duration: .9, ease: ease,
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });

  gsap.utils.toArray(".about__head h2, .beans__head h2, .gallery__lead, .visit__head h2")
    .forEach(function (el) {
      gsap.from(el, {
        y: 26, opacity: 0, duration: 1.1, ease: ease,
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

  gsap.from(".about__body > *", {
    y: 20, opacity: 0, duration: 1, stagger: 0.09, ease: ease,
    scrollTrigger: { trigger: ".about__body", start: "top 82%" }
  });

  // 豆單：每一列各自進場，焙煎度標尺一格一格點亮
  // ——「一格一格」是有意義的動態：它就是這支豆子焙到第幾度，不是純裝飾
  gsap.utils.toArray(".bean").forEach(function (row) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });

    tl.from(row, { y: 22, opacity: 0, duration: .9, ease: ease })
      .from(row.querySelectorAll(".meter i"),
        { scaleX: 0, transformOrigin: "left center", duration: .45, stagger: 0.07, ease: "power2.out" }, .25);
  });

  gsap.from(".info__row", {
    y: 18, opacity: 0, duration: .9, stagger: 0.07, ease: ease,
    scrollTrigger: { trigger: ".info", start: "top 86%" }
  });

  gsap.from(".shot", {
    y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: ease,
    scrollTrigger: { trigger: ".owl-shots", start: "top 88%" }
  });
});
