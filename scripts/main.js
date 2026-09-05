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
// 內頁的導覽連結是 index.html#about 這種跨頁網址，不是本頁錨點；
// 而「目前這一頁」那一項用 aria-current 標，不歸這裡管——
// 沒有排除的話，捲到內頁頁尾時它的高亮會被清掉，而且捲回來不會恢復
(function navActive() {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]:not([aria-current])')
  );
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

// 2026-08-25：原本這裡有一支 pagenavAlign()，把第二層導覽對齊主導覽的
// 「電子賀卡」那一項（要用 JS 量是因為那一項的位置由 flex 決定）。
// 第二層導覽已經搬進標題區、改成貼齊內容欄右緣，位置純 CSS 就決定得了，
// 這支連同 CSS 的 --x 退路一起移除。理由寫在 style.scss 的 .pagenav

// ---------- 導覽高度寫進 --nav-h ----------
// 給「要貼在導覽下緣」的浮動元素用（目前是公版目錄的篩選浮條）。
// 導覽高度是 logo 的 clamp 算出來的，CSS 這邊沒有辦法反推，只能量
(function navHeight() {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  function set() {
    document.documentElement.style.setProperty("--nav-h", Math.round(nav.offsetHeight) + "px");
  }

  set();
  window.addEventListener("resize", set);
  // 中文字體載完之後導覽的高度會變，要重量一次
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
})();

// ---------- 捲動緩衝：Lenis ----------
// 為什麼用 Lenis 不用 GSAP 官方的 ScrollSmoother（3.15 已經免費、拿得到）：
//   ScrollSmoother 是把整頁內容包進 #smooth-wrapper 再用 transform 推。
//   transform 會建立新的包含塊，這個站有三個東西會因此壞掉 ——
//   sticky 的導覽、fixed 的 .frame 冊頁界線、fixed 的挑款清單。
//   Lenis 補間的是「真正的 scrollTop」，那三個都照常運作，DOM 一行都不用改。
//
// 只接管滾輪：`syncTouch` 保持預設的 false，觸控走瀏覽器原生慣性
// （手機的原生慣性本來就比任何 JS 補間好，硬接管只會變鈍）。
(function smoothScroll() {
  // 檔案沒載到（離線、路徑錯）就當作沒有這個功能，其餘照常
  if (typeof Lenis === "undefined") return;

  // 使用者開了「減少動態」就完全不啟用 —— 捲動緩衝正是這個設定要擋的東西
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var lenis = new Lenis({
    duration: 0.9,        // 秒。再長就開始「跟不上手」，這個站的調性撐不住
    // easeOutCubic：起步快、收尾軟。用內建的預設會太黏
    easing: function (t) { return 1 - Math.pow(1 - t, 3); },
    wheelMultiplier: 1
  });

  // 用 GSAP 的 ticker 驅動，不要自己再開一個 requestAnimationFrame ——
  // 兩個 rAF 迴圈會讓捲動與進場動畫落在不同幀上，快速捲動時看得到撕裂
  // 掛到 window：內頁的浮條要用同一個實例把畫面捲回篩選列，
  // 各自 new 一個會有兩套補間互相搶 scrollTop
  window.lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0); // GSAP 官方建議的搭配：掉幀時不要跳補，交給 Lenis

  // 站內錨點：不攔的話瀏覽器會瞬間跳過去，跟滾輪的緩衝感差太多。
  // ⚠️ **不要自己再算 offset。** Lenis 的 scrollTo(element) 已經會把目標的
  //    scroll-margin-top 算進去（那條 clamp 就是用來讓開 sticky 導覽的）。
  //    我加過 `offset: -scrollMarginTop`，結果讓開了兩次，段落上緣落在 184 而不是 92
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    lenis.scrollTo(target);

    // preventDefault 會連「焦點移到目標」一起擋掉 —— 跳過導覽的 skip link
    // 就變成只捲動、焦點還留在原地，鍵盤使用者按 Tab 又回到導覽第一項。
    // preventScroll 是必要的：不加的話瀏覽器會自己再跳一次，把補間打斷
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    // 網址列同步，讓這一段可以被複製分享。用 replaceState 不用 pushState：
    // 上一頁應該回到前一個頁面，不是回到前一個段落
    if (history.replaceState) history.replaceState(null, "", id);
  });
})();

// ---------- 捲動動態 ----------
var mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", function () {
  var ease = "expo.out";

  // ⚠️ 這支 main.js 是全站共用的（首頁、公版目錄、客製案例都載）。
  //    每一組動畫都要先確認元素在這一頁 —— 對空選集下 gsap.from 會在
  //    內頁的 console 印一整排「GSAP target ... not found」。
  //    不是錯誤，但打開 devtools 就是一片黃，真的有問題時反而看不到
  function 有(sel) { return !!document.querySelector(sel); }

  // 主視覺（只有首頁有）
  if (有(".hero")) {
    gsap.from(".hero__title span", { y: 30, opacity: 0, duration: 1.4, stagger: 0.12, ease: ease });
    gsap.from([".hero__kicker", ".hero__actions"], { y: 14, opacity: 0, duration: 1.1, delay: 0.3, stagger: 0.1, ease: ease });
    gsap.from(".hero__stage", { y: 40, opacity: 0, duration: 1.6, delay: 0.15, ease: ease });
    gsap.from(".hero figcaption", { opacity: 0, duration: 1.2, delay: 0.9 });
    gsap.from(".hero__seal", { scale: 0.6, opacity: 0, duration: 1.1, delay: 1, ease: ease });
    gsap.from(".hero__vertical", { opacity: 0, duration: 1.6, delay: 0.8 });
  }

  // 區塊標記（每一頁都有）
  gsap.utils.toArray(".section-label").forEach(function (el) {
    gsap.from(el, {
      x: -14, opacity: 0, duration: 1, ease: ease,
      scrollTrigger: { trigger: el, start: "top 90%" }
    });
  });

  // 理念
  if (有(".about__body")) {
    gsap.from(".about__lead", {
      y: 24, opacity: 0, duration: 1.2, ease: ease,
      scrollTrigger: { trigger: ".about", start: "top 74%" }
    });

    gsap.from(".about__body > *", {
      y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: ease,
      scrollTrigger: { trigger: ".about__body", start: "top 80%" }
    });
  }

  // 年輪：中心與環線先出現，六個項目再浮上來
  if (有(".rings")) {
    var ringTl = gsap.timeline({ scrollTrigger: { trigger: ".rings", start: "top 78%" } });
    ringTl.from(".rings__hub", { scale: 0.84, opacity: 0, duration: 1.1, ease: ease })
          .from(".rings__lines circle", { scale: 0.9, opacity: 0, transformOrigin: "50% 50%", duration: 1.1, stagger: 0.12, ease: ease }, 0.2)
          .from(".orbit__face", { scale: 0.82, opacity: 0, duration: 0.9, stagger: 0.07, ease: ease }, 0.4);
  }

  // 作品
  if (有(".owl-works")) {
    gsap.from(".wk", {
      y: 26, opacity: 0, duration: 1.1, stagger: 0.08, ease: ease,
      scrollTrigger: { trigger: ".owl-works", start: "top 88%" }
    });
  }

  // 賀卡
  if (有(".owl-deck")) {
    gsap.from(".deck__item", {
      y: 30, opacity: 0, duration: 1.1, stagger: 0.08, ease: ease,
      scrollTrigger: { trigger: ".owl-deck", start: "top 86%" }
    });
  }

  // 客製案例（custom-cards.html）：舞台與縮圖列分層進場。
  if (有(".case-showcase")) {
    gsap.from(".case-showcase__stage", {
      y: 26, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: ".case-showcase", start: "top 86%" }
    });
    gsap.from(".case-thumb", {
      opacity: 0, duration: .75, stagger: .08, ease: "expo.out",
      scrollTrigger: { trigger: ".case-showcase__index", start: "top 92%" }
    });
  }

  // 訂購流程
  if (有(".flow__list")) {
    gsap.from(".step", {
      y: 22, opacity: 0, duration: 1, stagger: 0.09, ease: ease,
      scrollTrigger: { trigger: ".flow__list", start: "top 86%" }
    });
  }
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
    // 裡面是連結的話不歸這裡管：那是跳頁的入口，不是同頁切換。
    // 硬套的話會在跳頁前先閃一下高亮
    if (group.querySelector("a")) return;

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
