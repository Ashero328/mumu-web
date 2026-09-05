(function () {
  "use strict";

  var root = document.querySelector("[data-case-showcase]");
  if (!root) return;

  var buttons = Array.prototype.slice.call(root.querySelectorAll(".case-thumb"));
  var stage = root.querySelector(".case-showcase__stage");
  var visual = root.querySelector(".case-showcase__visual");
  var art = root.querySelector("[data-case-art]");
  var image = root.querySelector("[data-case-image]");
  var number = root.querySelector("[data-case-number]");
  var client = root.querySelector("[data-case-client]");
  var title = root.querySelector("[data-case-title]");
  var caption = root.querySelector("[data-case-caption]");
  var concept = root.querySelector("[data-case-concept]");
  var tags = root.querySelector("[data-case-tags]");
  var play = root.querySelector("[data-case-play]");
  var playLabel = root.querySelector("[data-case-play-label]");
  var slider = root.querySelector(".case-showcase__thumbs");
  var previous = root.querySelector("[data-case-prev]");
  var next = root.querySelector("[data-case-next]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var activeButton = buttons[0];
  var frame = null;
  var activationVersion = 0;

  function resetPlayer() {
    if (frame) {
      frame.remove();
      frame = null;
    }
    visual.classList.remove("is-playing");
    updatePlaybackAvailability();
  }

  function updatePlaybackAvailability() {
    var hasAnimation = Boolean((activeButton.dataset.href || "").trim());
    play.hidden = !hasAnimation;
    play.disabled = !hasAnimation;
    if (hasAnimation) {
      playLabel.textContent = "播放動畫";
      play.setAttribute("aria-label", "播放" + activeButton.dataset.title + "動畫");
    }
  }

  function playAnimation() {
    if (!(activeButton.dataset.href || "").trim()) return;
    if (frame) {
      // 同源 iframe 直接重新載入，讓賀卡動畫從第一格重新開始。
      frame.contentWindow.location.reload();
      playLabel.textContent = "重新播放";
      return;
    }

    frame = document.createElement("iframe");
    frame.className = "case-showcase__iframe";
    frame.src = activeButton.dataset.href;
    frame.title = activeButton.dataset.title + "動畫預覽";
    frame.setAttribute("loading", "eager");
    frame.setAttribute("allow", "autoplay");
    visual.appendChild(frame);
    visual.classList.add("is-playing");
    playLabel.textContent = "重新播放";
    play.setAttribute("aria-label", "重新播放" + activeButton.dataset.title + "動畫");
  }

  function revealStage() {
    if (!window.matchMedia("(max-width: 999px)").matches) return;
    window.requestAnimationFrame(function () {
      stage.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  function updateThumbnailLabels() {
    buttons.forEach(function (item) {
      var active = item === activeButton;
      item.setAttribute("aria-label", (active ? "目前顯示：" : "點選觀看：") + item.dataset.title);
    });
  }

  function activate(button) {
    if (!button) return;
    if (button.classList.contains("is-active")) {
      revealStage();
      return;
    }

    activeButton = button;
    var version = ++activationVersion;
    resetPlayer();
    updateThumbnailLabels();

    buttons.forEach(function (item) {
      var active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });

    function update() {
      image.src = button.dataset.image;
      image.alt = button.dataset.alt;
      art.dataset.crop = button.dataset.crop || "portrait";
      number.textContent = button.dataset.number;
      client.textContent = button.dataset.client;
      title.textContent = button.dataset.title;
      caption.textContent = button.dataset.caption;
      concept.textContent = button.dataset.concept;
      tags.replaceChildren.apply(tags, button.dataset.tags.split("|").map(function (label) {
        var item = document.createElement("li");
        item.textContent = label;
        return item;
      }));
    }

    if (reduceMotion || !stage.animate) {
      update();
      stage.removeAttribute("aria-busy");
      revealStage();
      return;
    }

    stage.getAnimations().forEach(function (animation) { animation.cancel(); });
    stage.setAttribute("aria-busy", "true");
    var exitAnimation = stage.animate([
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(8px)" }
    ], { duration: 150, easing: "ease-in", fill: "forwards" });

    exitAnimation.finished.then(function () {
      if (version !== activationVersion) return;
      update();
      var enterAnimation = stage.animate([
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
      enterAnimation.finished.then(function () {
        if (version !== activationVersion) return;
        stage.removeAttribute("aria-busy");
        revealStage();
      }).catch(function () {});
    }).catch(function () {});
  }

  updatePlaybackAvailability();
  updateThumbnailLabels();
  play.addEventListener("click", playAnimation);

  buttons.forEach(function (button, index) {
    button.addEventListener("click", function () { activate(button); });
    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      var step = event.key === "ArrowRight" ? 1 : -1;
      var nextButton = buttons[(index + step + buttons.length) % buttons.length];
      activate(nextButton);
      nextButton.focus();
    });
  });

  function scrollStep() {
    var first = buttons[0];
    if (!first) return 0;
    var styles = getComputedStyle(slider);
    return first.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
  }

  function updateArrows() {
    var max = slider.scrollWidth - slider.clientWidth;
    previous.disabled = slider.scrollLeft <= 2;
    next.disabled = slider.scrollLeft >= max - 2;
  }

  previous.addEventListener("click", function () {
    slider.scrollBy({ left: -scrollStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });

  next.addEventListener("click", function () {
    slider.scrollBy({ left: scrollStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });

  // 縮圖列可以用滑鼠拖曳橫向捲動。
  // ⚠️ setPointerCapture 會把之後的 pointer 事件「連同 mousedown／mouseup／click」
  //    一起改派到捕捉的元素上，所以一按下去就捕捉的話，click 的 target 會變成
  //    .case-showcase__thumbs 本身，掛在每顆 .case-thumb 上的 click 永遠收不到。
  //    因此只有在真的拖超過門檻時才捕捉，單純點選完全不碰 pointer capture。
  var DRAG_THRESHOLD = 5;
  var dragStartX = 0;
  var dragStartScroll = 0;
  var dragPointer = null;
  var dragging = false;
  var suppressClick = false;

  slider.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragPointer = event.pointerId;
    dragStartX = event.clientX;
    dragStartScroll = slider.scrollLeft;
    dragging = false;
    suppressClick = false;
  });

  slider.addEventListener("pointermove", function (event) {
    if (dragPointer === null || event.pointerId !== dragPointer) return;
    var distance = event.clientX - dragStartX;

    if (!dragging) {
      if (Math.abs(distance) <= DRAG_THRESHOLD) return;
      dragging = true;
      slider.classList.add("is-dragging");
      try {
        slider.setPointerCapture(event.pointerId);
      } catch (error) {
        // 捕捉失敗不影響捲動，只是拖出元素外會斷掉
      }
    }

    slider.scrollLeft = dragStartScroll - distance;
  });

  function finishDrag(event) {
    if (dragPointer === null || event.pointerId !== dragPointer) return;
    if (slider.hasPointerCapture(event.pointerId)) slider.releasePointerCapture(event.pointerId);
    dragPointer = null;
    slider.classList.remove("is-dragging");
    // 拖曳結束後瀏覽器仍會補一個 click，要吃掉它，否則放手就切換案例
    suppressClick = dragging;
    dragging = false;
    window.setTimeout(updateArrows, 80);
  }

  slider.addEventListener("pointerup", finishDrag);
  slider.addEventListener("pointercancel", finishDrag);
  slider.addEventListener("click", function (event) {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  slider.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();
})();
