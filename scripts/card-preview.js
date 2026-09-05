(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  var code = params.get("code");
  if (params.get("embed") === "1") document.body.classList.add("is-embed");
  if (params.get("modal") === "1") document.body.classList.add("is-modal");
  var cards = typeof 全部款式 === "undefined" ? [] : 全部款式;
  var card = cards.find(function (item) { return item.款號 === code; });
  var main = document.getElementById("main");
  var error = document.getElementById("previewError");

  if (!card) {
    main.hidden = true;
    error.hidden = false;
    return;
  }

  var image = document.getElementById("previewImage");
  var frame = document.getElementById("previewCard");

  image.src = "images/e-cards/full/" + card.款號 + ".jpg";
  image.alt = card.款號 + "「" + card.節日 + "」" + card.版式 + "電子賀卡";
  frame.dataset.fmt = card.版式;
  document.getElementById("previewTitle").textContent = card.節日;
  document.getElementById("previewMeta").textContent = card.款號 + "・" + card.版式;
  document.title = card.款號 + " 動態預覽｜木木文化";

  var pickButton = document.getElementById("previewPick");
  var pickState = document.getElementById("previewPickState");

  function 顯示挑款狀態(selected) {
    pickButton.setAttribute("aria-pressed", selected ? "true" : "false");
    pickButton.textContent = selected ? "已加入清單 ✓" : "加入清單";
    pickButton.disabled = selected;
    pickState.textContent = selected ? card.款號 + " 已成功加入清單" : "尚未加入清單";
  }

  function 傳給外頁(type) {
    window.parent.postMessage({ type: type, code: card.款號 },
      location.origin === "null" ? "*" : location.origin);
  }

  // 先直接讀取同網域共用的 localStorage，讓外面已挑過的款式
  // 在 iframe 第一個畫面就顯示完成狀態，不必等 postMessage 往返。
  var key = "mumu.picked";
  var picked = [];
  try { picked = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
  顯示挑款狀態(picked.indexOf(card.款號) !== -1);

  if (window.parent !== window) {
    window.addEventListener("message", function (event) {
      if (event.origin !== location.origin || !event.data ||
          event.data.type !== "mumu:pick-state" || event.data.code !== card.款號) return;
      顯示挑款狀態(Boolean(event.data.selected));
    });
    pickButton.addEventListener("click", function () { 傳給外頁("mumu:pick-add"); });
    傳給外頁("mumu:pick-query");
  } else {
    pickButton.addEventListener("click", function () {
      if (picked.indexOf(card.款號) === -1) picked.push(card.款號);
      try { localStorage.setItem(key, JSON.stringify(picked)); } catch (e) {}
      顯示挑款狀態(true);
    });
  }

  document.addEventListener("contextmenu", function (event) {
    if (event.target === image) event.preventDefault();
  });
})();
