export const initialTripData = [
  {
    day: "DAY 1", date: "11.25", weekday: "TUE", loc: "仙台市", 
    lat: 38.2682, long: 140.8694, 
    weather: { icon: "cloud", temp: "5°C", desc: "歷史平均" }, 
    items: [
      { 
        id: "d1-0", type: "transport", time: "11:30", title: "🚗 專車接送前往機場", 
        subTitle: "和運接送 (訂單 45IFT2)",
        desc: "預計 12:30 抵達桃園機場。", 
        phone: "0922-775049",
        reservationNo: "驗證碼: 7791",
        link: "https://p.irentcar.com.tw/verify/45IFT2",
        // 使用 menu 欄位來顯示司機詳細資訊，版面較整齊
        menu: [
          { jp: "駕駛", cn: "黃永松 (RFQ-9551)" },
          { jp: "電話", cn: "0922-775049" },
          { jp: "路線", cn: "台北市 → 桃園機場" }
        ],
        highlight: false 
      },
      { 
        id: "d1-0a", type: "info", time: "12:30", title: "抵達桃園機場 (TPE)", 
        desc: "辦理登機手續。建議先在 Visit Japan Web 完成入境登錄。", 
        highlight: false 
      },
      { 
        id: "d1-1", type: "transport", time: "14:35", title: "🛫 起飛前往日本", 
        desc: "搭乘 台灣虎航 IT254 班機。準備好心情，出發前往東北！", 
        highlight: false 
      },
      { 
        id: "d1-1a", type: "transport", time: "18:45", title: "🛬 抵達仙台機場 (SDJ)", 
        desc: "辦理入境手續、提領行李。建議先在 Visit Japan Web 完成入境登錄。", 
        highlight: false 
      },
      { 
        id: "d1-2", type: "transport", time: "19:30", title: "搭乘「仙台空港 Access 線」往仙台站", 
        desc: "仙台空港 Access 線", 
        route: { from: "仙台機場", to: "仙台站", trainNo: "仙台空港 Access 線", duration: "約25分", cost: "660円" },
        highlight: false
      },
      { 
        id: "d1-2a", type: "info", time: "20:15", title: "抵達仙台站 & 飯店 Check-in", 
        desc: "先放行李，輕裝出門覓食。", 
        highlight: false 
      },
      { 
        id: "d1-3", type: "food", time: "20:45", title: "牛舌 善治郎", 
        subTitle: "仙台駅前本店",
        location: "宮城県仙台市青葉区中央1-8-38",
        phone: "022-723-1877",
        desc: "仙台必吃名物。善治郎的特色是厚切且帶有炭火香氣，口感脆彈。推薦車站 3F「牛舌通」的善治郎、利久或司。營業至 22:00 後。",
        highlight: true,
        menu: [
          { jp: "牛たん定食", cn: "牛舌定食 (推薦 3 枚 6 切)", price: "¥2,500" },
          { jp: "とろろ", cn: "山藥泥 (配飯絕佳)", price: "¥300" }
        ],
        story: "仙台牛舌的起源可以追溯到二戰後，由佐野啟四郎先生首創。將牛舌切成厚片，以鹽巴或味噌醃漬熟成後，在炭火上大火炙烤。特色是口感Q彈脆口、炭香十足。通常搭配麥飯、山藥泥、以牛尾熬煮的清湯和醃漬小菜一起享用，是一套營養滿點的定食。善治郎堅持手工切肉與長時間熟成，是當地人排隊也要吃的名店。"
      },
      { 
        id: "d1-4", type: "food", time: "21:45", title: "毛豆奶昔 (Zunda Saryo)", 
        subTitle: "ずんだシェイク",
        desc: "仙台的傳統甜點「毛豆泥 (Zunda)」的現代進化版。將新鮮毛豆磨成泥，加入牛奶和香草冰淇淋製成奶昔。喝起來有濃郁的毛豆清香和奶香，甜而不膩，口感帶點顆粒感，非常獨特。",
        highlight: false,
        story: "仙台必喝名物，車站內有許多販賣點。"
      },
      { 
        id: "d1-5", type: "hotel", time: "22:00", title: "仙台大都會飯店", 
        subTitle: "Hotel Metropolitan Sendai",
        location: "仙台市青葉区中央1-1-1",
        phone: "022-268-2525",
        reservationNo: "Agoda-5592831",
        desc: "與仙台車站直結，交通最方便的選擇。建議住仙台車站西口附近。",
        highlight: false
      }
    ]
  },
  {
    day: "DAY 2", date: "11.26", weekday: "WED", loc: "銀山溫泉", 
    lat: 38.5733, long: 140.4005, 
    weather: { icon: "snow", temp: "0°C", desc: "歷史平均" },
    items: [
      { 
        id: "d2-1", type: "info", time: "09:00", title: "早餐：仙台朝市 或 車站周邊", 
        desc: "享用早餐後準備出發。", 
        highlight: false
      },
      { 
        id: "d2-2", type: "info", time: "10:30", title: "【關鍵任務：寄放行李】", 
        desc: "將大行李箱寄放在仙台站置物櫃。⚠️ 只帶一夜過夜包輕裝前往銀山溫泉。", 
        highlight: false
      },
      { 
        id: "d2-3", type: "info", time: "11:00", title: "購買午餐（牛舌便當、零食）", 
        desc: "準備在火車上享用。", 
        highlight: false
      },
      { 
        id: "d2-4", type: "transport", time: "11:51", title: "🚅 火車移動 (Part 1)", 
        desc: "JR仙山線快速，往山形", 
        route: { from: "仙台站", to: "山形站", trainNo: "JR仙山線快速", duration: "約1小時16分" },
        highlight: false
      },
      { 
        id: "d2-5", type: "transport", time: "13:07", title: "抵達 山形站，站內轉乘", 
        desc: "換月台至新幹線搭車處 (轉乘時間約 15 分)。", 
        highlight: false
      },
      { 
        id: "d2-6", type: "transport", time: "13:22", title: "🚅 火車移動 (Part 2)", 
        desc: "山形新幹線 Tsubasa 135號", 
        route: { from: "山形站", to: "JR大石田站", trainNo: "山形新幹線 Tsubasa 135號", duration: "約36分" },
        highlight: false
      },
      { 
        id: "d2-7", type: "transport", time: "13:58", title: "抵達 JR 大石田站", 
        desc: "【關鍵轉乘點】 迅速出站走向巴士站。", 
        highlight: false
      },
      { 
        id: "d2-8", type: "transport", time: "14:10", title: "🚌 轉乘市營巴士", 
        desc: "尾花沢市營巴士 銀山線", 
        route: { from: "JR大石田站", to: "銀山溫泉", busNo: "尾花沢市營巴士 銀山線", duration: "約43分" },
        phone: "0237-23-2111",
        highlight: false
      },
      { 
        id: "d2-9", type: "spot", time: "14:53", title: "抵達 銀山溫泉", 
        desc: "步行至旅館 Check-in，開始享受溫泉街氛圍。", 
        highlight: false
      },
      { 
        id: "d2-10", type: "spot", time: "16:20", title: "📷 藍調時刻 (Blue Hour)", 
        subTitle: "大正浪漫的魔幻時刻",
        location: "山形県尾花沢市銀山新畑",
        desc: "日落後天空轉藍、瓦斯燈亮起的魔幻時刻，務必拍照。",
        highlight: true,
        story: "銀山溫泉位於山形縣深山中，一條沿著銀山川兩岸的溫泉街。這裡完整保留了大正至昭和初期（約1910-1930年代）建造的木造多層建築旅館群。建築風格融合了日式傳統與西洋元素，充滿懷舊的「大正浪漫」氛圍。雖然吉卜力官方未證實，但其華麗的木造建築與夜晚點燈後的魔幻氣氛，被許多粉絲認為是《神隱少女》湯屋的靈感來源之一，特別是紅色的橋樑和能登屋旅館。傍晚時分，街上的瓦斯燈會逐一亮起，暖黃色的光暈映照在河面和建築上。若幸運遇到初雪，白雪覆蓋屋頂的景色更是如夢似幻，是攝影愛好者的聖地。",
        photoSpot: "能登屋旅館前的紅橋是最佳拍攝點。"
      },
      { 
        id: "d2-11", type: "hotel", time: "18:00", title: "晚餐：旅館懷石料理", 
        desc: "享受溫泉旅館的精緻晚餐。", 
        highlight: false
      }
    ]
  },
  {
    day: "DAY 3", date: "11.27", weekday: "THU", loc: "猊鼻溪/盛岡", 
    lat: 38.9329, long: 141.1341, 
    weather: { icon: "cloud", temp: "3°C", desc: "歷史平均" },
    items: [
      { 
        id: "d3-1", type: "transport", time: "09:30", title: "Check-out，搭巴士下山", 
        desc: "尾花沢市營巴士", 
        route: { from: "銀山溫泉", to: "JR大石田站", busNo: "尾花沢市營巴士 銀山線", duration: "約43分" },
        highlight: false
      },
      { 
        id: "d3-2", type: "transport", time: "10:30", title: "搭乘火車返回仙台", 
        desc: "大石田→山形→仙台", 
        route: { from: "JR大石田站", to: "仙台站", trainNo: "山形新幹線→JR仙山線", duration: "約2小時" },
        highlight: false
      },
      { 
        id: "d3-3", type: "info", time: "12:30", title: "【關鍵任務：取回行李】", 
        desc: "在仙台站取回大行李箱。午餐可在車站快速解決。", 
        highlight: false
      },
      { 
        id: "d3-4", type: "transport", time: "13:30", title: "搭乘 東北新幹線 北上", 
        desc: "東北新幹線", 
        route: { from: "仙台站", to: "一之關站", trainNo: "東北新幹線", duration: "約30分" },
        highlight: false
      },
      { 
        id: "d3-5", type: "info", time: "14:00", title: "一之關站 寄放行李", 
        desc: "將大行李寄在車站置物櫃，輕裝轉車。", 
        highlight: false
      },
      { 
        id: "d3-6", type: "transport", time: "14:15", title: "轉乘 JR 大船渡線", 
        desc: "JR 大船渡線", 
        route: { from: "一之關站", to: "猊鼻溪站", trainNo: "JR 大船渡線", duration: "約30分" },
        highlight: false
      },
      { 
        id: "d3-7", type: "spot", time: "15:00", title: "🛶 猊鼻溪遊船 (90分鐘)", 
        subTitle: "日本百景",
        location: "岩手県一関市東山町長坂字町467",
        phone: "0191-47-2341",
        desc: "欣賞溪谷美景，聽船夫唱民謠，投擲運玉許願。(請留意末班船時間可能隨季節調整)",
        highlight: true,
        menu: [
          { jp: "大人2枚お願いします", cn: "請給我兩張大人票" },
          { jp: "運玉 (うんだま)", cn: "運玉 (投擲許願用石頭)" }
        ],
        story: "日本百景之一，是一條長約2公里、兩岸是高達100公尺石灰岩峭壁的溪谷。這裡的遊船是日本唯一「只用一根木篙」人力撐船的往返行程。遊客坐在傳統木舟上，在船夫的撐篙下緩緩前進。回程時，船夫會唱起當地著名的民謠《猊鼻追分》，歌聲在幽靜的山谷中迴盪，非常有氣氛。船行至折返點「大猊鼻岩」下，可以嘗試將刻有「福、緣、壽、愛」等漢字的「運玉」(陶土小球)，丟進對岸岩壁上的小洞穴中。據說投進就能願望成真！11月底的景色是一幅充滿蕭瑟感的水墨畫，若遇初雪，枯枝與岩壁上覆蓋薄雪，別有一番孤寂之美。"
      },
      { 
        id: "d3-8", type: "transport", time: "16:40", title: "返回車站，搭車回一之關", 
        desc: "領取行李。", 
        highlight: false
      },
      { 
        id: "d3-9", type: "transport", time: "17:45", title: "搭乘 東北新幹線", 
        desc: "東北新幹線", 
        route: { from: "一之關站", to: "盛岡站", trainNo: "東北新幹線", duration: "約40分" },
        highlight: false
      },
      { 
        id: "d3-10", type: "food", time: "19:00", title: "盛樓閣 冷麵", 
        subTitle: "盛岡駅前",
        location: "岩手県盛岡市盛岡駅前通15-5",
        phone: "019-654-8752",
        desc: "盛岡三大麵之一 (另外兩個是碗子蕎麥麵、炸醬麵)。源自朝鮮半島的冷麵，經改良後成為在地特色美食。",
        highlight: true,
        menu: [
          { jp: "盛岡冷麺", cn: "盛岡冷麵 (必點)" },
          { jp: "カルビ", cn: "牛五花" },
          { jp: "上タン塩", cn: "上等鹽味牛舌" }
        ],
        story: "麵條使用小麥粉和馬鈴薯澱粉製成，口感極其滑順Q彈，非常有嚼勁。湯頭是冰涼清爽的牛骨高湯，帶有酸甜味。通常會搭配泡菜、水煮蛋、牛肉片和水果 (如西瓜或水梨) 一起吃，非常解膩開胃。"
      },
      { 
        id: "d3-11", type: "hotel", time: "19:30", title: "飯店 Check-in", 
        desc: "建議住盛岡車站附近。", 
        highlight: false
      }
    ]
  },
  {
    day: "DAY 4", date: "11.28", weekday: "FRI", loc: "盛岡/花卷", 
    lat: 39.7020, long: 141.1545, 
    weather: { icon: "sun", temp: "4°C", desc: "歷史平均" },
    items: [
      { 
        id: "d4-1", type: "spot", time: "09:30", title: "盛岡市區散策", 
        subTitle: "利用「蝸牛巴士 (Den-Den Mushi)」繞行市區",
        desc: "搭乘蝸牛巴士巡禮市區景點。",
        highlight: false
      },
      { 
        id: "d4-2", type: "spot", time: "10:00", title: "景點巡禮：岩手銀行赤煉瓦館", 
        subTitle: "辰野金吾作品",
        location: "岩手県盛岡市中ノ橋通1-2-20",
        desc: "建於 1911 年，是日本知名建築師「辰野金吾」在東北地區唯一的作品（他也是東京車站、台灣總統府的設計者）。",
        highlight: false,
        story: "紅磚牆面搭配白色花崗岩飾帶的「辰野式」風格非常鮮明。這棟建築曾是銀行的總行，現在作為多功能展演空間開放參觀，是盛岡市的地標性建築，非常適合拍照打卡。"
      },
      { 
        id: "d4-3", type: "spot", time: "10:30", title: "光原社 (Kogensha)", 
        subTitle: "文藝複合空間",
        location: "岩手県盛岡市",
        desc: "原本是出版宮澤賢治生前唯一童話集《要求特別多的餐廳》的出版社。現在變身為一個充滿文藝氣息的複合式空間。",
        highlight: false,
        story: "園區內有販售精選民藝品、陶器的商店，還有一個氣氛極佳的咖啡館「可否館」。在中庭散步，能感受到宮澤賢治時代的氛圍。"
      },
      { 
        id: "d4-4", type: "food", time: "12:30", title: "午餐：岩手美食", 
        subTitle: "挑戰「碗子蕎麥麵」或在地咖啡廳",
        desc: "可選擇挑戰「碗子蕎麥麵」或在地咖啡廳。",
        highlight: false,
        menu: [
          { jp: "わんこそばコース", cn: "碗子蕎麥麵套餐 (東家本店)" },
          { jp: "証明書", cn: "完食證明書 (吃超過100碗會獲得木牌)" }
        ]
      },
      { 
        id: "d4-5", type: "transport", time: "14:30", title: "回飯店拿行李，搭新幹線", 
        desc: "東北新幹線", 
        route: { from: "盛岡站", to: "新花卷站", trainNo: "東北新幹線", duration: "約12分" },
        highlight: false
      },
      { 
        id: "d4-6", type: "transport", time: "15:00", title: "抵達 新花卷站", 
        subTitle: "【交通選擇時間】",
        desc: "(推薦)🚕 搭乘計程車前往計程車招呼站，直接搭車至飯店。車程約 15-20 分鐘，車資約 3,000~3,500円。", 
        highlight: false
      },
      { 
        id: "d4-7", type: "hotel", time: "15:40", title: "Check-in & 溫泉巡禮", 
        desc: "抵達後盡情享受溫泉設施。", 
        highlight: false
      },
      { 
        id: "d4-8", type: "hotel", time: "18:30", title: "晚餐：飯店 Buffet", 
        subTitle: "花卷溫泉",
        location: "岩手県花巻市湯本1-125",
        desc: "享受岩手在地食材與螃蟹等美食吃到飽。",
        highlight: true,
        story: "花卷溫泉鄉位於岩手縣花卷市西部山區的溫泉地總稱，是東北著名的溫泉度假勝地。如果入住主要的「花卷溫泉」園區（包含千秋閣、花卷、紅葉館三家飯店），館內有連通道相連，房客可以穿著浴衣自由穿梭，一次泡遍三家飯店不同風格的大浴場和露天風呂，享受「溫泉巡禮」的樂趣。",
        menu: [
          { jp: "カニ食べ放題", cn: "螃蟹吃到飽 (Buffet 特色)" },
          { jp: "バラ風呂", cn: "玫瑰浴 (千秋閣大浴場)" }
        ]
      }
    ]
  },
  {
    day: "DAY 5", date: "11.29", weekday: "SAT", loc: "童話村/歸途", 
    lat: 39.3939, long: 141.1173, 
    weather: { icon: "sun", temp: "6°C", desc: "歷史平均" },
    items: [
      { 
        id: "d5-1", type: "hotel", time: "11:00", title: "Check-out", 
        desc: "辦理退房，建議請飯店幫忙叫計程車前往童話村 (約 10 分鐘)。", 
        menu: [
          { jp: "タクシーを呼んでいただけますか", cn: "可以幫我叫計程車嗎？" },
          { jp: "宮沢賢治童話村まで", cn: "要去宮澤賢治童話村" }
        ]
      },
      { 
        id: "d5-2", type: "spot", time: "11:30", title: "🍄 宮澤賢治童話村", 
        subTitle: "充滿水晶與鏡子的夢幻森林",
        location: "岩手県花巻市高松26-19",
        desc: "為了紀念出生於花卷的日本國民作家「宮澤賢治」而建立的主題園區。這裡不是遊樂園，而是一個將他筆下童話世界具象化的學習與體驗空間。(週六有營業)",
        highlight: true,
        story: "入口處設計成《銀河鐵道之夜》中的車站閘門，象徵踏入童話世界。主展館內分為「夢幻大廳」、「宇宙」、「天空」、「大地」、「水」等五個主題房間。利用大量的鏡子、水晶、燈光和影像技術，營造出奇幻、迷離的視覺效果，彷彿置身萬花筒中，超級適合拍照！戶外森林區有散步小徑，以及數棟小木屋，分別展示童話中出現的植物、動物、星星等主題。"
      },
      { 
        id: "d5-3", type: "food", time: "13:00", title: "午餐：山貓軒 (Wildcat House)", 
        subTitle: "注文の多い料理店",
        location: "岩手県花巻市矢沢3-161-33",
        desc: "位於童話村停車場旁，是以宮澤賢治代表作《要求特別多的餐廳》為主題的餐廳。",
        highlight: false,
        menu: [
          { jp: "すいとんセット", cn: "麵疙瘩定食 (鄉土料理)" },
          { jp: "山猫ぞうすい", cn: "山貓雜炊" }
        ],
        story: "店門口就掛著故事中那句著名的標語：「胖一點的人和年輕一點的人，我們特別歡迎」。店內裝潢復古，提供以岩手在地食材製作的洋食料理，如燉牛肉、漢堡排等，在此用餐別有一番趣味。"
      },
      { 
        id: "d5-4", type: "transport", time: "15:00", title: "搭計程車前往機場", 
        desc: "距離很近，約 10-15 分鐘車程，輕鬆方便。", 
        highlight: false
      },
      { 
        id: "d5-4a", type: "info", time: "15:30", title: "抵達 花卷機場 (HNA)", 
        desc: "機場很小，建議入關前完成採買。", 
        highlight: false
      },
      { 
        id: "d5-5", type: "transport", time: "17:50", title: "🛫 起飛回台灣", 
        desc: "搭乘 台灣虎航 IT259 班機。再見東北！", 
        highlight: true
      },
      { 
        id: "d5-5a", type: "transport", time: "21:10", title: "🛬 抵達桃園機場 (TPE)", 
        desc: "辦理入境手續、提領行李。", 
        highlight: false 
      },
      { 
        id: "d5-6", type: "transport", time: "21:40", title: "🚗 專車接送回家", 
        subTitle: "和運接送 (訂單 45IFT3)",
        desc: "司機資訊將於搭車前6小時提供。從桃園機場出發返回台北市。", 
        reservationNo: "驗證碼: 1616",
        link: "https://p.irentcar.com.tw/verify/45IFT3",
        highlight: false 
      }
    ]
  }
];

