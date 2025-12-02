export const initialTripData = [
  {
    day: "DAY 1", date: "11.15", weekday: "SAT", loc: "京都",
    lat: 35.0116, long: 135.7681,
    weather: { icon: "cloud", temp: "8°C", desc: "歷史平均" },
    items: [
      {
        id: "k1-0", type: "transport", time: "09:00", title: "🚅 從東京前往京都",
        subTitle: "新幹線",
        desc: "從東京站搭乘新幹線前往京都站",
        route: { from: "東京站", to: "京都站", trainNo: "新幹線", duration: "約2.5小時" },
        highlight: false
      },
      {
        id: "k1-1", type: "info", time: "12:00", title: "抵達京都站",
        desc: "京都站是京都的主要交通樞紐，建築設計融合傳統與現代",
        highlight: false
      },
      {
        id: "k1-2", type: "transport", time: "13:00", title: "🚇 前往清水寺",
        desc: "搭乘地鐵或巴士前往清水寺",
        route: { from: "京都站", to: "清水寺", duration: "約30分鐘" },
        highlight: false
      },
      {
        id: "k1-3", type: "spot", time: "14:00", title: "🏛️ 清水寺",
        subTitle: "世界遺產",
        location: "京都府京都市東山区清水1-294",
        desc: "清水寺是京都最古老的寺院，以懸空的清水舞台聞名",
        highlight: true,
        story: "清水寺建於778年，是京都最古老的寺院。著名的清水舞台從懸崖邊緣向外延伸，俯瞰整個京都盆地。寺院名稱來自於從地下涌出的清泉，據說具有治癒功效。"
      },
      {
        id: "k1-4", type: "food", time: "16:00", title: "🍜 湯豆腐料理",
        subTitle: "湯豆腐専門店",
        desc: "品嚐京都傳統的湯豆腐料理",
        highlight: false,
        menu: [
          { jp: "湯豆腐定食", cn: "湯豆腐定食", price: "¥2,500" },
          { jp: "季節野菜", cn: "季節時蔬", price: "¥800" }
        ]
      },
      {
        id: "k1-5", type: "spot", time: "17:30", title: "🌅 祇園街道散步",
        desc: "漫步在歷史悠久的祇園街道，欣賞傳統町屋建築",
        highlight: true,
        photoSpot: "夜晚的祇園街道特別美麗"
      },
      {
        id: "k1-6", type: "hotel", time: "19:00", title: "京都祇園飯店",
        subTitle: "Gion Ryokan",
        location: "京都府京都市東山区祇園",
        desc: "傳統日式旅館體驗",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 2", date: "11.16", weekday: "SUN", loc: "京都",
    lat: 35.0116, long: 135.7681,
    weather: { icon: "sun", temp: "10°C", desc: "歷史平均" },
    items: [
      {
        id: "k2-1", type: "info", time: "08:00", title: "傳統日式早餐",
        desc: "在旅館享用日式早餐",
        highlight: false
      },
      {
        id: "k2-2", type: "spot", time: "09:30", title: "🏯 金閣寺",
        subTitle: "鹿苑寺",
        location: "京都府京都市北区金閣寺町1",
        desc: "金閣寺是京都最著名的寺院，完全貼金的建築在陽光下閃耀",
        highlight: true,
        story: "金閣寺建於1397年，原為足利義滿的別墅。建築分為三層：最下層為法水院（寝殿造風格）、中層為潮音洞（武士住宅風格）、上層為究竟頂（中國禪宗寺院風格）。"
      },
      {
        id: "k2-3", type: "spot", time: "12:00", title: "🏛️ 伏見稻荷大社",
        location: "京都府京都市伏見区深草薮之内町68",
        desc: "著名的千本鳥居，紅色的鳥居連綿不斷",
        highlight: true,
        story: "伏見稻荷大社是京都最受歡迎的神社之一，以千本鳥居聞名。鳥居排列成隧道狀，象徵著從現世通往神界的道路。神社供奉著五穀豐收之神宇迦之御魂大神。"
      },
      {
        id: "k2-4", type: "food", time: "14:00", title: "🍱 京料理",
        subTitle: "懷石料理",
        desc: "品嚐京都傳統的懷石料理",
        highlight: false,
        menu: [
          { jp: "懐石コース", cn: "懷石套餐", price: "¥8,000" },
          { jp: "季節の盛り合わせ", cn: "季節拼盤", price: "¥3,500" }
        ]
      },
      {
        id: "k2-5", type: "spot", time: "16:00", title: "🏛️ 三十三間堂",
        subTitle: "蓮華王院",
        desc: "世界上最長的木造建築，收藏1001尊千手觀音像",
        highlight: false,
        story: "三十三間堂建於1165年，以收藏1001尊千手觀音像聞名。這些雕像每尊都有40隻手臂，象徵著觀音菩薩的慈悲。"
      },
      {
        id: "k2-6", type: "info", time: "18:00", title: "嵐山散步",
        desc: "漫步在嵐山的渡月橋，欣賞楓葉與河流美景",
        highlight: true,
        photoSpot: "渡月橋是最佳拍攝點"
      }
    ]
  },
  {
    day: "DAY 3", date: "11.17", weekday: "MON", loc: "京都",
    lat: 35.0116, long: 135.7681,
    weather: { icon: "cloud", temp: "7°C", desc: "歷史平均" },
    items: [
      {
        id: "k3-1", type: "spot", time: "09:00", title: "🏛️ 銀閣寺",
        subTitle: "慈照寺",
        location: "京都府京都市左京区銀閣寺町2",
        desc: "銀閣寺的別稱，以其銀色的沙子和建築聞名",
        highlight: true,
        story: "銀閣寺建於1482年，是東山文化的代表。與金閣寺不同的是，銀閣寺沒有貼金，而是以銀色的沙子和優雅的設計聞名。"
      },
      {
        id: "k3-2", type: "food", time: "12:00", title: "🍜 京うどん",
        desc: "品嚐京都特色的烏龍麵",
        highlight: false,
        menu: [
          { jp: "京うどん", cn: "京都烏龍麵", price: "¥800" },
          { jp: "おばんざい", cn: "京都家常菜", price: "¥1,200" }
        ]
      },
      {
        id: "k3-3", type: "info", time: "14:00", title: "京都御所參觀",
        desc: "參觀日本天皇的傳統住所",
        highlight: false
      },
      {
        id: "k3-4", type: "spot", time: "16:00", title: "🌸 哲學之道",
        desc: "沿著小溪散步，欣賞兩旁的楓樹",
        highlight: true,
        story: "哲學之道是一條長約2公里的步道，沿途種滿櫻花和楓樹。相傳京都大學的哲學家西田幾多郎經常在此散步沉思，因此得名。"
      },
      {
        id: "k3-5", type: "transport", time: "18:00", title: "🚅 返回東京",
        desc: "搭乘新幹線返回東京",
        route: { from: "京都站", to: "東京站", trainNo: "新幹線", duration: "約2.5小時" },
        highlight: false
      }
    ]
  },
  {
    day: "DAY 4", date: "11.18", weekday: "TUE", loc: "返程",
    lat: 35.6895, long: 139.6917,
    weather: { icon: "sun", temp: "12°C", desc: "歷史平均" },
    items: [
      {
        id: "k4-1", type: "info", time: "08:00", title: "東京自由活動",
        desc: "在東京進行最後的購物或參觀",
        highlight: false
      },
      {
        id: "k4-2", type: "transport", time: "12:00", title: "🛫 返程飛機",
        desc: "搭乘飛機返回台灣",
        highlight: false
      },
      {
        id: "k4-3", type: "transport", time: "18:00", title: "🛬 抵達台灣",
        desc: "順利返抵台灣",
        highlight: false
      }
    ]
  }
];
