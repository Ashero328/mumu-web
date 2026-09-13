// ============================================
// 木木文化 電子賀卡公版目錄：篩選、載入更多、挑款清單
//
// 資料來自 e-cards-data.js 的 全部款式（琇端要改的都在那一支）。
// 這一支不需要改，除非要動行為
// ============================================

(function () {
  "use strict";

  var grid = document.getElementById("catGrid");
  if (!grid || typeof 全部款式 === "undefined") return;

  var 每頁 = 12;                       // 桌機 4 欄 × 3 排；手機 2 欄 × 6 排
  var LINE = "https://line.me/R/ti/p/@yme1248q";
  var KEY = "mumu.picked";

  var 條件 = { cat: "", fmt: "", q: "" };
  var 已顯示 = 每頁;
  var 挑選 = 讀挑選();
  var 卡片 = [];                       // DOM 節點，順序與 全部款式 相同

  // ---------- localStorage ----------
  // 私密視窗、擋 cookie、清網站資料都可能讓它爆掉或讀到空的。
  // 讀寫一律包起來，壞掉就當作沒挑過，頁面照常能用
  function 讀挑選() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }

  function 存挑選() {
    try {
      localStorage.setItem(KEY, JSON.stringify(挑選));
    } catch (e) { /* 存不進去就只在這次瀏覽有效 */ }
  }

  // ---------- 建立格線 ----------
  function 建卡(c) {
    var 橫 = c.版式 === "橫式";
    // 已完成專屬動畫的款式直接進作品頁；其餘款式先使用自己的圖片預覽動態，
    // 不會再把所有賀卡導向同一張示範稿。
    var 預覽網址 = c.動態 || ("card-preview.html?code=" + encodeURIComponent(c.款號));
    // 公版基本預覽保留原本完整的「賀卡＋款式說明」排版；
    // 只有未來登記的獨立動畫頁才使用純淨模式。
    var 嵌入網址 = c.動態
      ? 預覽網址 + (預覽網址.indexOf("?") === -1 ? "?" : "&") + "min=1"
      : 預覽網址 + "&modal=1";
    var li = document.createElement("li");
    li.className = "card";
    li.dataset.code = c.款號;
    li.dataset.cat = c.分類;
    li.dataset.fmt = c.版式;
    li.dataset.preview = 預覽網址;

    // 圖框的比例由 CSS 依 data-fmt 決定（橫式 4:3、直式 3:4），這裡不寫 inline 樣式
    li.innerHTML =
      '<div class="card__media">' +
        '<a class="card__open" href="' + 預覽網址 + '" data-fancybox="ecard-' + c.款號 + '"' +
          ' data-type="iframe" data-src="' + 嵌入網址 + '" aria-label="在彈出視窗觀看 ' + c.款號 + ' 動畫預覽">' +
          '<img src="images/e-cards/thumb/' + c.款號 + '.jpg"' +
          ' alt="公版賀卡 ' + c.款號 + '：' + c.節日 + ' ' + c.版式 + '"' +
          ' width="' + (橫 ? 720 : 540) + '" height="' + (橫 ? 540 : 720) + '"' +
          ' loading="lazy" decoding="async" draggable="false">' +
          // 只是視覺提示，連結的可及名稱已經由 img 的 alt 給了；
          // 但要補一句說明去哪裡，不然讀螢幕只會念到款號
          '<span class="card__enter" aria-hidden="true">觀看動畫</span>' +
        '</a>' +
      '</div>' +
      '<p class="card__meta">' +
        '<span class="card__code">' + c.款號 + '</span>' +
        '<button class="card__pick" type="button" aria-pressed="false">' +
          '<span class="card__box" aria-hidden="true"></span>' +
          '<span class="card__off">加入詢價清單</span>' +
          '<span class="card__on">已加入</span>' +
          '<span class="sr">' + c.款號 + '</span>' +
        '</button>' +
        (c.補件中 ? '<span class="card__soft">原檔補件中，圖比較不清楚</span>' : '') +
      '</p>';

    return li;
  }

  (function 初始格線() {
    // HTML 裡先擺了 12 個 .card--skel 骨架佔位（慢速連線上不要整塊空白），
    // 真卡建好之前要把它們清掉 —— 下面是 appendChild 不是覆寫，不清會留在最前面
    grid.querySelectorAll(".card--skel").forEach(function (el) { el.remove(); });

    var frag = document.createDocumentFragment();
    全部款式.forEach(function (c) {
      var li = 建卡(c);
      卡片.push(li);
      frag.appendChild(li);
    });
    grid.appendChild(frag);
  })();

  // ---------- 篩選與載入更多 ----------
  var 計數 = document.getElementById("catCount");
  var 更多 = document.getElementById("catMore");
  var 空的 = document.getElementById("catEmpty");

  function 符合條件(li) {
    return (!條件.cat || li.dataset.cat === 條件.cat) &&
           (!條件.fmt || li.dataset.fmt === 條件.fmt) &&
           (!條件.q || li.dataset.code.indexOf(條件.q) !== -1);
  }

  function 套用(新出現) {
    var 符合 = 0;
    var 露出 = 0;

    卡片.forEach(function (li) {
      var ok = 符合條件(li);

      if (!ok) return 收(li);

      符合++;
      if (符合 <= 已顯示) {
        if (li.hidden && 新出現) 新出現.push(li);
        露出++;
        放(li);
      } else {
        收(li);
      }
    });

    var 剩 = 符合 - 露出;

    計數.textContent = 符合
      ? "顯示 " + 露出 + " 款，符合條件共 " + 符合 + " 款"
      : "";

    畫目前篩選(露出, 符合);

    // 標籤照樣寫進去再決定要不要隱藏：只在 剩>0 才寫的話，
    // 一進站的條件就一批放得完（例如 ?f=ENY 再篩直式只有 4 款）時，這顆按鈕會一直是空的
    更多.innerHTML = "載入更多款式<span>（還有 " + Math.max(剩, 0) + " 款）</span>";
    更多.hidden = 剩 <= 0;

    空的.hidden = 符合 !== 0;
  }

  function 放(li) {
    li.hidden = false;
  }

  function 收(li) {
    li.hidden = true;
  }

  // ---------- 目前篩選浮條 ----------
  // 捲過篩選列之後浮在導覽下方，回答「我現在在看哪一批」。
  // 文字直接抄選到的那顆按鈕的字，不另外維護一份對照表 ——
  // 日後在 e-cards-data.js 加節日時，這裡不用跟著改
  var 浮條 = document.getElementById("catNow");
  var 浮條節日 = document.getElementById("catNowCat");
  var 浮條版式 = document.getElementById("catNowFmt");
  var 浮條計數 = document.getElementById("catNowCount");
  var 篩選列 = document.querySelector(".cat__bar");

  function 選中的字(key) {
    var b = document.querySelector('.filter[data-filter="' + key + '"] .filter__btn.is-on');
    return b ? b.textContent.trim() : "全部";
  }

  function 畫目前篩選(露出, 符合) {
    if (!浮條) return;
    浮條節日.textContent = 選中的字("cat");
    浮條版式.textContent = 選中的字("fmt");
    浮條計數.textContent = 符合 ? "顯示 " + 露出 + " / " + 符合 + " 款" : "沒有符合的款式";
    // 兩項都是「全部」時字轉淡：沒有在篩的時候不要看起來像在篩
    浮條.classList.toggle("is-plain", !條件.cat && !條件.fmt && !條件.q);
  }

  if (浮條 && 篩選列) {
    // 篩選列離開視野才出現。用 IntersectionObserver 不用捲動事件 ——
    // 這件事由瀏覽器判斷，不會每次捲動都跑 callback（Lenis 開著時捲動事件很密）
    new IntersectionObserver(function (es) {
      浮條.classList.toggle("is-on", !es[0].isIntersecting);
    }, { rootMargin: "-96px 0px 0px 0px" }).observe(篩選列);

    浮條.addEventListener("click", function () {
      var 目標 = document.getElementById("catalog");
      // Lenis 開著就交給它，捲回去才跟滾輪同一種手感；沒有就退回原生
      if (window.lenis) window.lenis.scrollTo(目標);
      else 目標.scrollIntoView();
    });
  }

  document.querySelectorAll(".filter").forEach(function (group) {
    var key = group.dataset.filter;
    var btns = Array.prototype.slice.call(group.querySelectorAll(".filter__btn"));

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) {
          var on = x === b;
          x.classList.toggle("is-on", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });

        條件[key] = b.dataset.value;
        已顯示 = 每頁;          // 換條件就回到第一批，不然會停在很後面的位置
        套用();
      });
    });
  });

  var 搜尋 = document.getElementById("catSearch");
  var 清搜尋 = document.getElementById("catSearchClear");
  if (搜尋 && 清搜尋) {
    搜尋.addEventListener("input", function () {
      條件.q = 搜尋.value.trim().toUpperCase();
      清搜尋.hidden = !條件.q;
      已顯示 = 每頁;
      套用();
    });

    清搜尋.addEventListener("click", function () {
      搜尋.value = "";
      條件.q = "";
      清搜尋.hidden = true;
      已顯示 = 每頁;
      套用();
      搜尋.focus();
    });
  }

  更多.addEventListener("click", function () {
    var 新的 = [];
    已顯示 += 每頁;
    套用(新的);
    進場(新的);

    // 按完最後一批之後按鈕就藏起來了，焦點會掉回 <body> —— 鍵盤使用者按 Tab 會從頭開始。
    // 交給這一批剛出現的第一張卡：它的位置就在剛才按鈕的上方，接得上剛才的動作。
    //
    // ⚠️ **preventScroll 不能少。** focus() 預設會把元素捲進視野。
    //    這裡原本是把焦點交給上方的 .cat__count（顯示 N 款那行），
    //    結果按下最後一批時整個畫面被拉回篩選列 —— 實測跳了 1281～8670px，
    //    每一種篩選組合都會中。計數本身是 role="status"，會自己播報，
    //    根本不需要拿到焦點。
    if (更多.hidden) {
      // 最後一張最靠近剛消失的按鈕，交給它可讓焦點留在目前視窗附近。
      var 落點 = (新的[新的.length - 1] || 卡片.filter(function (li) { return !li.hidden; }).pop());
      var 可聚焦 = 落點 && (落點.querySelector("a") || 落點.querySelector("button"));
      if (可聚焦) 可聚焦.focus({ preventScroll: true });
    }
  });

  // 首頁六張卡的「進入瀏覽」帶 ?f=ENY 過來，直接預選那個節日
  (function 讀網址() {
    var f = new URLSearchParams(location.search).get("f");
    if (!f) return;
    var b = document.querySelector('.filter[data-filter="cat"] .filter__btn[data-value="' + f + '"]');
    if (b) b.click();
  })();

  套用();

  // ---------- 挑款清單 ----------
  var bar = document.getElementById("pickBar");
  var panel = document.getElementById("pickPanel");
  var list = document.getElementById("pickList");
  var 計 = document.getElementById("pickCount");
  var 展 = document.getElementById("pickToggle");
  var 複製鈕 = document.getElementById("pickCopy");
  var 清空鈕 = document.getElementById("pickClear");
  var LINE鈕 = document.getElementById("pickLine");
  var 訊息計時 = null;

  function 有挑(code) {
    return 挑選.indexOf(code) !== -1;
  }

  function 切換(code) {
    var i = 挑選.indexOf(code);
    if (i === -1) 挑選.push(code); else 挑選.splice(i, 1);
    存挑選();
    畫挑款();
  }

  function 回覆挑款狀態(target, code) {
    if (!target) return;
    target.postMessage({
      type: "mumu:pick-state",
      code: code,
      selected: 有挑(code),
      count: 挑選.length
    }, location.origin === "null" ? "*" : location.origin);
  }

  // 動畫預覽在同網域 iframe 中；用訊息同步外頁的挑款清單，
  // 讓彈窗內按下「加入清單」後，底部清單與格線勾選狀態立即一致。
  window.addEventListener("message", function (event) {
    if (event.origin !== location.origin || !event.data) return;
    var data = event.data;
    if (data.type !== "mumu:pick-query" && data.type !== "mumu:pick-add") return;
    var exists = 卡片.some(function (li) { return li.dataset.code === data.code; });
    if (!exists) return;

    if (data.type === "mumu:pick-add" && !有挑(data.code)) {
      挑選.push(data.code);
      存挑選();
      畫挑款();
      報(data.code + " 已加入清單");
    }
    回覆挑款狀態(event.source, data.code);
  });

  function 畫挑款() {
    // 格線上的按鈕狀態
    卡片.forEach(function (li) {
      li.querySelector(".card__pick")
        .setAttribute("aria-pressed", 有挑(li.dataset.code) ? "true" : "false");
    });

    var n = 挑選.length;
    if (LINE鈕) LINE鈕.textContent = n ? "將 " + n + " 款傳給 LINE 詢價" : "用 LINE 詢價";
    bar.hidden = n === 0;
    document.body.classList.toggle("has-pick", n > 0);

    if (!n) {
      收清單();
      return;
    }

    報(""); // 回到「已挑 N 款」

    list.innerHTML = 挑選.map(function (code) {
      return '<li class="picked">' +
        '<img src="images/e-cards/thumb/' + code + '.jpg" alt="" width="200" height="200" loading="lazy">' +
        '<figcaption>' + code + '</figcaption>' +
        '<button class="picked__off" type="button" data-code="' + code + '">' +
          '<span aria-hidden="true">✕</span><span class="sr">取消挑選 ' + code + '</span>' +
        '</button>' +
      '</li>';
    }).join("");
  }

  // 這一區是頁面上唯一的 role="status"。
  // 平常播「已挑 N 款」，複製之後暫時換成提示句再換回來——
  // 開兩個以上的即時區域會互相搶播，讀螢幕的人只聽得到片段
  function 報(訊息) {
    clearTimeout(訊息計時);
    計.textContent = 訊息 || ("已挑 " + 挑選.length + " 款");
    if (訊息) 訊息計時 = setTimeout(function () { 報(""); }, 4000);
  }

  function 收清單() {
    panel.hidden = true;
    展.setAttribute("aria-expanded", "false");
  }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".card__pick");
    if (b) {
      切換(b.closest(".card").dataset.code);
      return;
    }

  });

  list.addEventListener("click", function (e) {
    var b = e.target.closest(".picked__off");
    if (b) 切換(b.dataset.code);
  });

  展.addEventListener("click", function () {
    var open = panel.hidden;
    panel.hidden = !open;
    展.setAttribute("aria-expanded", open ? "true" : "false");
  });

  清空鈕.addEventListener("click", function () {
    挑選 = [];
    存挑選();
    畫挑款();
  });

  // 剪貼簿：clipboard API 需要安全內容（https 或 localhost），
  // 直接用 file:// 開檔案時會沒有，所以一定要留 textarea 這條退路
  function 複製(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  function 款號字串() {
    return 挑選.join("、");
  }

  複製鈕.addEventListener("click", function () {
    複製(款號字串())
      .then(function () { 報("款號已複製：" + 款號字串()); })
      .catch(function () { 報("複製失敗，請手動記下：" + 款號字串()); });
  });

  // LINE 官方帳號的連結帶不了預填訊息，只能先複製到剪貼簿再請對方貼上。
  // 這條限制要在畫面上講清楚，不要讓人以為訊息會自己出現
  LINE鈕.addEventListener("click", function () {
    複製(款號字串()).catch(function () {});
    報("款號已複製，在 LINE 裡貼上傳給木木就可以了");
  });

  畫挑款();

  // ---------- 防盜：擋右鍵另存與拖曳 ----------
  // 只擋在圖片上。整頁擋掉的話客戶連款號都複製不了，
  // 而且這層本來就只擋一般人，真正的保障是頁尾的版權宣告
  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest(".card, .picked")) {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  // ---------- 進場動態 ----------
  function 進場(節點) {
    if (!window.gsap || !節點 || !節點.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(節點, { y: 18, opacity: 0, duration: .7, stagger: .03, ease: "expo.out" });
  }

  if (window.gsap && window.ScrollTrigger &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.from(".cat__grid > li:not([hidden])", {
      y: 20, opacity: 0, duration: .9, stagger: .025, ease: "expo.out",
      scrollTrigger: { trigger: ".cat__grid", start: "top 88%" }
    });

  }
})();
