export const initialTripData = [
  {
    day: "DAY 1", date: "08.01", weekday: "FRI", loc: "沖繩",
    lat: 26.2124, long: 127.6809,
    weather: { icon: "sun", temp: "28°C", desc: "歷史平均" },
    items: [
      {
        id: "o1-0", type: "transport", time: "09:00", title: "🛫 飛往沖繩",
        desc: "從台灣飛往沖繩那霸機場",
        highlight: false
      },
      {
        id: "o1-1", type: "transport", time: "11:00", title: "🚗 租車自駕",
        desc: "在機場租車，開始自駕之旅",
        highlight: false
      },
      {
        id: "o1-2", type: "spot", time: "12:00", title: "🏖️ 首里城",
        desc: "參觀琉球王國的古城",
        highlight: true,
        story: "首里城是琉球王國的王城，建於14世紀。城堡融合了中國和日本的建築風格，是琉球文化的象徵。"
      },
      {
        id: "o1-3", type: "food", time: "14:00", title: "🍜 沖繩麵",
        desc: "品嚐沖繩的特色麵食",
        highlight: false,
        menu: [
          { jp: "沖縄そば", cn: "沖繩麵", price: "¥800" },
          { jp: "ゴーヤチャンプルー", cn: "苦瓜雜炒", price: "¥900" }
        ]
      },
      {
        id: "o1-4", type: "spot", time: "16:00", title: "🏖️ 國際通",
        desc: "沖繩最繁華的街道",
        highlight: false
      },
      {
        id: "o1-5", type: "hotel", time: "18:00", title: "那霸市區飯店",
        desc: "入住那霸市區的飯店",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 2", date: "08.02", weekday: "SAT", loc: "沖繩",
    lat: 26.2124, long: 127.6809,
    weather: { icon: "sun", temp: "29°C", desc: "歷史平均" },
    items: [
      {
        id: "o2-1", type: "spot", time: "08:00", title: "🌅 美之海水族館",
        desc: "參觀世界最大的水槽",
        highlight: true,
        story: "美之海水族館是日本最大的水族館，以巨大的太平洋水槽聞名。水槽長35米、寬27米、水深10米，容水量7,500噸。"
      },
      {
        id: "o2-2", type: "spot", time: "12:00", title: "🏖️ 古宇利島",
        desc: "搭船前往古宇利島",
        highlight: true,
        story: "古宇利島是一個小島，以心型岩石和美麗的海灘聞名。島上可以騎單車環島，欣賞珊瑚礁和清澈的海水。"
      },
      {
        id: "o2-3", type: "food", time: "14:00", title: "🍣 海鮮料理",
        desc: "品嚐新鮮的海鮮",
        highlight: false,
        menu: [
          { jp: "刺身定食", cn: "生魚片定食", price: "¥2,500" },
          { jp: "タコライス", cn: "章魚飯", price: "¥900" }
        ]
      },
      {
        id: "o2-4", type: "spot", time: "16:00", title: "🏖️ 瀨底島",
        desc: "參觀玻璃底船和水上活動",
        highlight: false
      },
      {
        id: "o2-5", type: "info", time: "18:00", title: "日落觀景",
        desc: "欣賞沖繩的美麗日落",
        highlight: true,
        photoSpot: "海邊是最佳拍攝點"
      }
    ]
  },
  {
    day: "DAY 3", date: "08.03", weekday: "SUN", loc: "沖繩",
    lat: 26.2124, long: 127.6809,
    weather: { icon: "sun", temp: "28°C", desc: "歷史平均" },
    items: [
      {
        id: "o3-1", type: "spot", time: "08:00", title: "🏖️ 慶良間諸島",
        desc: "前往慶良間諸島浮潛",
        highlight: true,
        story: "慶良間諸島由12個島嶼組成，以清澈的海水和豐富的珊瑚礁聞名。是浮潛和潛水的絕佳地點。"
      },
      {
        id: "o3-2", type: "info", time: "12:00", title: "🏊 浮潛體驗",
        desc: "進行浮潛活動",
        highlight: true
      },
      {
        id: "o3-3", type: "food", time: "14:00", title: "🍜 島嶼特色料理",
        desc: "品嚐當地的新鮮海鮮",
        highlight: false,
        menu: [
          { jp: "海ぶどう", cn: "海葡萄", price: "¥1,200" },
          { jp: "アグー豚", cn: "阿古豬料理", price: "¥2,800" }
        ]
      },
      {
        id: "o3-4", type: "spot", time: "16:00", title: "🏖️ 備瀬崎",
        desc: "參觀著名的心型岩石",
        highlight: false,
        photoSpot: "心型岩石是必拍景點"
      },
      {
        id: "o3-5", type: "info", time: "18:00", title: "海邊 BBQ",
        desc: "享用海邊的燒烤晚餐",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 4", date: "08.04", weekday: "MON", loc: "沖繩",
    lat: 26.2124, long: 127.6809,
    weather: { icon: "sun", temp: "27°C", desc: "歷史平均" },
    items: [
      {
        id: "o4-1", type: "spot", time: "09:00", title: "🏛️ 玉陵",
        desc: "參觀琉球王國的陵墓",
        highlight: false
      },
      {
        id: "o4-2", type: "spot", time: "11:00", title: "🏖️ 萬座海灘",
        desc: "沖繩最大的海灘",
        highlight: true,
        story: "萬座海灘是沖繩最大的海灘，全長約800米。沙灘潔白，海水清澈，是游泳和日光浴的理想場所。"
      },
      {
        id: "o4-3", type: "food", time: "13:00", title: "🍜 三明治",
        desc: "品嚐沖繩特色的三角飯糰",
        highlight: false,
        menu: [
          { jp: "三角おにぎり", cn: "三角飯糰", price: "¥150" },
          { jp: "サーターアンダギー", cn: "沙翁翁", price: "¥200" }
        ]
      },
      {
        id: "o4-4", type: "info", time: "15:00", title: "購物時間",
        desc: "在國際通購買紀念品",
        highlight: false
      },
      {
        id: "o4-5", type: "transport", time: "18:00", title: "🛫 返回台灣",
        desc: "搭乘飛機返回台灣",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 5", date: "08.05", weekday: "TUE", loc: "沖繩",
    lat: 26.2124, long: 127.6809,
    weather: { icon: "sun", temp: "26°C", desc: "歷史平均" },
    items: [
      {
        id: "o5-1", type: "transport", time: "08:00", title: "🛬 抵達台灣",
        desc: "順利返抵台灣",
        highlight: false
      },
      {
        id: "o5-2", type: "info", time: "全天", title: "休息調整",
        desc: "享受美好的回憶",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 6", date: "08.06", weekday: "WED", loc: "返程",
    lat: 25.0330, long: 121.5654,
    weather: { icon: "sun", temp: "32°C", desc: "歷史平均" },
    items: [
      {
        id: "o6-1", type: "info", time: "全天", title: "後續安排",
        desc: "處理旅行後續事宜",
        highlight: false
      }
    ]
  }
];
