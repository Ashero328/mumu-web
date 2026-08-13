// ============================================
// 木木文化 首頁 A：互動與捲動動態
// 原則：內容預設就看得見，GSAP 只負責進場位移；關閉動態時完全不跑
// ============================================

gsap.registerPlugin(ScrollTrigger);

// 中文字體與圖片載入完成後版面會位移，必須重算觸發點
window.addEventListener("load", function () { ScrollTrigger.refresh(); });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
}

// ---------- 賀卡：手機把「一頁包兩排」的 DOM 打平成六張卡 ----------
// Owl 只把「直接子元素」當成一個 item，所以要一張一張輪播，卡片就必須先提到 .owl-deck 底下。
// 桌機維持巢狀（一個 item ＝ 直式一排＋橫式一排），那組間距是照設計稿量出來的，完全不動。
//
// ⚠️ 這段一定要跑在最前面：下面的 GSAP 進場動畫與 index.html 的 Owl 初始化都會抓 .deck__item，
//    先搬完 DOM 再讓它們抓，才不會拿到搬家前的舊節點。
// 跨斷點要重新載入才會換模式 —— 與「Owl 沒有乾淨的 destroy 路徑」是同一個既有取捨。
(function deckFlatten() {
  var deck = document.getElementById("deck");
  if (!deck || window.matchMedia("(min-width: 900px)").matches) return;

  var page = deck.querySelector(".deck__page");
  if (!page) return;

  // 只取第一頁：第二頁以後目前是第一頁的複製（真卡素材未到的佔位），
  // 照搬會變成六張卡各出現兩次
  var items = page.querySelectorAll(".deck__item");
  if (!items.length) return;

  var frag = document.createDocumentFragment();
  Array.prototype.forEach.call(items, function (item) { frag.appendChild(item); });

  deck.textContent = "";
  deck.appendChild(frag);
  deck.classList.add("is-flat"); // index.html 靠這個記號決定餵哪一組 Owl 參數
})();

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

  // 主視覺
  gsap.from(".hero__title span", { y: 30, opacity: 0, duration: 1.4, stagger: 0.12, ease: ease });
  gsap.from([".hero__kicker", ".hero__actions"], { y: 14, opacity: 0, duration: 1.1, delay: 0.3, stagger: 0.1, ease: ease });
  gsap.from(".hero__stage", { y: 40, opacity: 0, duration: 1.6, delay: 0.15, ease: ease });
  gsap.from(".hero figcaption", { opacity: 0, duration: 1.2, delay: 0.9 });
  gsap.from(".hero__seal", { scale: 0.6, opacity: 0, duration: 1.1, delay: 1, ease: ease });
  gsap.from(".hero__vertical", { opacity: 0, duration: 1.6, delay: 0.8 });

  // 區塊標記
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

  // 年輪：中心與環線先出現，六個項目再浮上來
  var ringTl = gsap.timeline({ scrollTrigger: { trigger: ".rings", start: "top 78%" } });
  ringTl.from(".rings__hub", { scale: 0.84, opacity: 0, duration: 1.1, ease: ease })
        .from(".rings__lines circle", { scale: 0.9, opacity: 0, transformOrigin: "50% 50%", duration: 1.1, stagger: 0.12, ease: ease }, 0.2)
        .from(".orbit__face", { scale: 0.82, opacity: 0, duration: 0.9, stagger: 0.07, ease: ease }, 0.4);

  // 作品
  gsap.from(".wk", {
    y: 26, opacity: 0, duration: 1.1, stagger: 0.08, ease: ease,
    scrollTrigger: { trigger: ".owl-works", start: "top 88%" }
  });

  // 賀卡
  gsap.from(".deck__item", {
    y: 30, opacity: 0, duration: 1.1, stagger: 0.08, ease: ease,
    scrollTrigger: { trigger: ".owl-deck", start: "top 86%" }
  });

  // 訂購流程
  gsap.from(".step", {
    y: 22, opacity: 0, duration: 1, stagger: 0.09, ease: ease,
    scrollTrigger: { trigger: ".flow__list", start: "top 86%" }
  });
});



// ---------- 年輪：六項服務等分在一條軌道上緩緩旋轉，項目內容維持水平 ----------
// 旋轉走 GSAP 不走 CSS animation（專案鐵律），所以「滑過暫停」不能用 animation-play-state，
// 要改 tween 的 timeScale。外環旋轉與內層反向旋轉是同一批 tween，一起暫停才不會錯位
mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
  var orbits = Array.prototype.slice.call(document.querySelectorAll(".orbit"));
  if (!orbits.length) return;

  var tweens = [];

  orbits.forEach(function (orbit) {
    var speed = Number(orbit.dataset.speed) || 80;
    var dir = Number(orbit.dataset.dir) || 1;

    tweens.push(gsap.to(orbit, {
      rotation: 360 * dir,
      duration: speed,
      ease: "none",
      repeat: -1
    }));

    // 每個項目的內層反向轉回來（起點是各自的 -a），文字才永遠保持水平
    orbit.querySelectorAll(".orbit__item").forEach(function (item) {
      var a = parseFloat(item.style.getPropertyValue("--a")) || 0;
      var inner = item.querySelector(".orbit__inner");
      if (!inner) return;

      tweens.push(gsap.fromTo(inner,
        { rotation: -a },
        { rotation: -a - 360 * dir, duration: speed, ease: "none", repeat: -1 }
      ));
    });
  });

  // 滑鼠進到年輪區就緩緩停下來（文字才好讀），離開再轉起來。
  // 直接改 timeScale 會頓，補間過去才有「慢慢停住」的手感
  var rings = document.getElementById("rings");

  function setSpeed(v) {
    tweens.forEach(function (t) {
      gsap.to(t, { timeScale: v, duration: 0.8, ease: "power2.out", overwrite: true });
    });
  }

  function pause() { setSpeed(0); }
  function resume() { setSpeed(1); }

  if (rings) {
    rings.addEventListener("mouseenter", pause);
    rings.addEventListener("mouseleave", resume);
    rings.addEventListener("focusin", pause);
    rings.addEventListener("focusout", resume);
  }

  return function cleanup() {
    if (rings) {
      rings.removeEventListener("mouseenter", pause);
      rings.removeEventListener("mouseleave", resume);
      rings.removeEventListener("focusin", pause);
      rings.removeEventListener("focusout", resume);
    }
    tweens.forEach(function (t) { t.kill(); });
    gsap.set(".orbit, .orbit__inner", { clearProps: "rotation" });
  };
});

// ---------- 分類切換：範本／客製 ----------
(function tabs() {
  document.querySelectorAll(".tabs").forEach(function (group) {
    var btns = Array.prototype.slice.call(group.querySelectorAll(".tabs__btn"));
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) {
          x.classList.toggle("is-on", x === b);
          x.setAttribute("aria-selected", x === b ? "true" : "false");
        });
      });
    });
  });
})();

// ---------- 主視覺影片：播一次停在尾幀，整段捲出視野再回來才重播 ----------
// HTML 上只留 autoplay，沒有 loop —— 沒有 loop 的影片播完會自然停在最後一幀。
// 「捲回來重播」用 IntersectionObserver 而不是捲動事件：
// 它由瀏覽器在合成執行緒判斷，不會每次捲動都觸發 callback。
(function heroVideo() {
  var video = document.getElementById("heroVideo");
  var hero = document.getElementById("top");
  if (!video || !hero) return;

  // 關閉動態：停在第一幀。autoplay 是 HTML 屬性，CSS 的 prefers-reduced-motion 擋不掉
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.removeAttribute("autoplay");
    video.pause();
    video.currentTime = 0;
    return;
  }

  if (!("IntersectionObserver" in window)) return; // 不支援就維持「只播一次」

  // 必須先「完全離開」再回來才重播，否則捲動時邊緣一進一出就會不停重來
  var hasLeft = false;

  new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) {
        hasLeft = true;
        return;
      }
      if (!hasLeft) return;
      hasLeft = false;
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
  }, { threshold: 0 }).observe(hero);
})();

