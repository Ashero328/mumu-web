// ============================================
// 賀卡總覽渲染：讀 cards.js 清單，依節日分組列出
// ============================================

(function () {
  var ORDER = ["過年", "中秋", "聖誕", "母親節", "父親節", "生日", "其他"];
  var root = document.getElementById("gallery");
  if (!root) return;

  var cards = (window.CARDS || []).filter(function (c) { return c.listed; });

  var groups = {};
  cards.forEach(function (c) {
    var f = c.festival || "其他";
    (groups[f] = groups[f] || []).push(c);
  });

  var festivals = ORDER.filter(function (f) { return groups[f]; }).concat(
    Object.keys(groups).filter(function (f) { return ORDER.indexOf(f) === -1; })
  );

  festivals.forEach(function (f) {
    var section = document.createElement("section");
    section.className = "festival-section";

    var h2 = document.createElement("h2");
    h2.textContent = f;
    section.appendChild(h2);

    var grid = document.createElement("div");
    grid.className = "card-grid";

    groups[f]
      .sort(function (a, b) { return (b.year || 0) - (a.year || 0); })
      .forEach(function (c) {
        var a = document.createElement("a");
        a.className = "card-tile";
        a.href = c.path;

        if (c.poster) {
          var img = document.createElement("img");
          img.src = c.path + c.poster;
          img.alt = c.title;
          a.appendChild(img);
        }

        var label = document.createElement("div");
        label.className = "tile-label";
        label.textContent = c.title;

        var year = document.createElement("span");
        year.className = "tile-year";
        year.textContent = c.year || "";
        label.appendChild(year);

        a.appendChild(label);
        grid.appendChild(a);
      });

    section.appendChild(grid);
    root.appendChild(section);
  });
})();
