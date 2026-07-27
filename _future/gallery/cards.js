// ============================================
// 賀卡清單（總覽頁的資料來源）——封存中，啟用總覽頁時搬回 cards/
// 新卡上架：建卡之後在這裡登記一行
// festival：對應節日代號（CH聖誕/NE新年/LU過年/MI中秋/DR端午/MO母親節/FA父親節/VA情人節/HA萬聖節/BI生日）
// listed：false = 不列在總覽（客戶要求隱私時用；網址仍有效）
// poster：總站列表圖，固定路徑 assets/list/list.jpg（540×960 直式縮圖）；留空則顯示文字底圖
// path：展示卡 showcase/<年份>/<代號編號>/；客戶卡 clients/<公司或案號>/<年份-代號編號>/
// ============================================

window.CARDS = [
  {
    id: "2026-CH01",
    path: "showcase/2026/CH01/",
    title: "聖誕・金環花圈",
    festival: "聖誕",
    year: 2026,
    poster: "assets/list/list.jpg",
    listed: true
  },
  {
    id: "2026-NE01",
    path: "showcase/2026/NE01/",
    title: "新年・金日日昇",
    festival: "新年",
    year: 2026,
    poster: "assets/list/list.jpg",
    listed: true
  }
];
