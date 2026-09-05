(function () {
  "use strict";

  if (!window.Fancybox) return;

  // 每張作品使用獨立群組：Modal 只保留 X，不出現多餘的縮圖列與左右切換鈕。
  Fancybox.bind('[data-fancybox^="ecard-"], [data-fancybox^="custom-"]', {
    Hash: false,
    closeButton: true,
    backdropClick: "close",
    Carousel: {
      transition: "fade"
    }
  });
})();
