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
        id: "d1-5", type: "hotel", time: "22:00", title: "Hotel Unisite Sendai", 
        subTitle: "ユナイトサイト仙台",
        location: "仙台市青葉区中央1-1-1",
        phone: "022-268-2525",
        reservationNo: "Booking.com",
        link: "https://www.booking.com/hotel/jp/hotel-unisite-sendai.zh-tw.html?aid=898224&app_hotel_id=1629859&checkin=2025-11-25&checkout=2025-11-26&from_sn=ios&group_adults=2&group_children=0&label=hotel_details-1L5CKt7%401763989437&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA%2C",
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
        id: "d2-11", type: "food", time: "18:00", title: "晚餐：旅館懷石料理", 
        desc: "享受溫泉旅館的精緻晚餐。", 
        highlight: false
      },
      { 
        id: "d2-12", type: "hotel", time: "19:00", title: "銀山溫泉 Yanadaya", 
        subTitle: "やなだや",
        location: "山形県尾花沢市銀山新畑",
        desc: "銀山溫泉的傳統溫泉旅館，享受大正浪漫的住宿體驗。", 
        highlight: false
      }
    ]
  },
  {
    day: "DAY 3", date: "11.27", weekday: "THU", loc: "仙台市", 
    lat: 38.2682, long: 140.8694, 
    weather: { icon: "cloud", temp: "5°C", desc: "歷史平均" },
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
        id: "d3-4", type: "hotel", time: "13:30", title: "飯店 Check-in", 
        desc: "前往 OneFive Sendai 飯店辦理入住，放行李。", 
        highlight: false
      },
      { 
        id: "d3-5", type: "transport", time: "14:30", title: "🚌 搭乘仙台環遊巴士", 
        desc: "購買一日券，開始市區觀光。路線涵蓋仙台主要景點，可自由上下車。", 
        highlight: false,
        story: "仙台市營的觀光循環巴士，以仙台站為起點，串聯市區主要觀光景點。購買一日券後可自由上下車，非常適合市區觀光。路線經過定禪寺通、青葉通、仙台城跡、瑞鳳殿等知名景點。"
      },
      { 
        id: "d3-6", type: "spot", time: "15:00", title: "📷 銀杏拍照", 
        subTitle: "定禪寺通銀杏並木",
        location: "宮城県仙台市青葉区定禪寺通",
        desc: "前往定禪寺通或青葉通等銀杏名所。11月底正值銀杏轉黃，是拍照的絕佳時機。",
        highlight: true,
        story: "仙台市區最著名的銀杏大道，全長約1公里，兩側種滿了高大的銀杏樹。11月底正值銀杏轉黃的季節，整條街道被金黃色的銀杏葉覆蓋，是仙台秋季最美的風景之一。無論是白天陽光灑落，還是夜晚點燈後的景色，都非常適合拍照。",
        photoSpot: "定禪寺通是拍攝銀杏的最佳地點，建議在下午時分前往，光線較佳。"
      },
      { 
        id: "d3-7", type: "info", time: "16:00", title: "逛街購物", 
        desc: "在仙台市區自由逛街，探索在地商店。", 
        highlight: false
      },
      { 
        id: "d3-8", type: "food", time: "18:00", title: "善治郎 (牛舌)", 
        subTitle: "仙台駅前本店",
        location: "宮城県仙台市青葉区中央1-8-38",
        phone: "022-723-1877",
        desc: "品嚐仙台最知名的牛舌名店。建議提前預約或早點前往，避免排隊。",
        highlight: true,
        menu: [
          { jp: "牛たん定食", cn: "牛舌定食 (推薦 3 枚 6 切)", price: "¥2,500" },
          { jp: "とろろ", cn: "山藥泥 (配飯絕佳)", price: "¥300" }
        ],
        story: "善治郎的牛舌厚度適中，經過炭火直烤後外層微焦、內層多汁，口感層次豐富。搭配的麥飯、山藥泥和牛尾湯都是經典組合。建議提前預約或避開用餐尖峰時段。"
      },
      { 
        id: "d3-9", type: "info", time: "20:00", title: "🛒 逛 Yodobashi", 
        subTitle: "Yodobashi Camera 仙台店",
        location: "宮城県仙台市青葉区中央1-1-1",
        desc: "前往 Yodobashi Camera 仙台店。可購買電器、相機、藥妝等商品。", 
        highlight: false,
        story: "日本大型連鎖電器量販店，仙台店位於車站附近，交通便利。除了相機、電器用品外，還有藥妝、化妝品、文具、玩具等豐富商品。免稅服務完善，是採買伴手禮和電器用品的好去處。"
      },
      { 
        id: "d3-10", type: "hotel", time: "22:00", title: "仙台 OneFive Sendai 飯店", 
        subTitle: "ワンファイブ仙台",
        location: "仙台市",
        desc: "返回飯店休息。", 
        highlight: false
      }
    ]
  },
  {
    day: "DAY 4", date: "11.28", weekday: "FRI", loc: "盛岡", 
    lat: 39.7020, long: 141.1545, 
    weather: { icon: "sun", temp: "4°C", desc: "歷史平均" },
    items: [
      { 
        id: "d4-1", type: "info", time: "10:00", title: "仙台市區自由活動", 
        desc: "可選擇在仙台站周邊逛逛，或享受飯店設施。",
        highlight: false
      },
      { 
        id: "d4-2", type: "hotel", time: "12:00", title: "Check-out", 
        desc: "退房並寄放行李（或直接帶行李前往盛岡）。", 
        highlight: false
      },
      { 
        id: "d4-3", type: "transport", time: "13:00", title: "搭乘 東北新幹線", 
        desc: "東北新幹線", 
        route: { from: "仙台站", to: "盛岡站", trainNo: "東北新幹線", duration: "約40分" },
        highlight: false
      },
      { 
        id: "d4-4", type: "info", time: "14:00", title: "抵達盛岡站", 
        desc: "可在車站內或周邊稍作休息。", 
        highlight: false
      },
      { 
        id: "d4-5", type: "hotel", time: "15:00", title: "飯店 Check-in", 
        desc: "前往 Art 盛岡辦理入住，放行李。", 
        highlight: false
      },
      { 
        id: "d4-6", type: "food", time: "18:00", title: "盛岡冷麵", 
        subTitle: "盛樓閣 或 Pyonpyon-sha",
        location: "岩手県盛岡市",
        desc: "在盛岡站周邊或市區品嚐正宗的盛岡冷麵。推薦：盛樓閣、Pyonpyon-sha 等名店。",
        highlight: true,
        menu: [
          { jp: "盛岡冷麺", cn: "盛岡冷麵 (必點)" },
          { jp: "カルビ", cn: "牛五花" }
        ],
        story: "盛岡三大麵之一 (另外兩個是碗子蕎麥麵、炸醬麵)。源自朝鮮半島的冷麵，經改良後成為在地特色美食。麵條使用小麥粉和馬鈴薯澱粉製成，口感極其滑順Q彈，非常有嚼勁。湯頭是冰涼清爽的牛骨高湯，帶有酸甜味。通常會搭配泡菜、水煮蛋、牛肉片和水果 (如西瓜或水梨) 一起吃，非常解膩開胃。"
      },
      { 
        id: "d4-7", type: "info", time: "19:30", title: "盛岡市區散步", 
        desc: "可在車站周邊或市區悠閒散步，感受盛岡的夜晚氛圍。", 
        highlight: false
      },
      { 
        id: "d4-8", type: "hotel", time: "21:00", title: "Art 盛岡 (Art Morioka)", 
        subTitle: "アートホテル盛岡",
        location: "岩手県盛岡市",
        desc: "返回飯店休息。", 
        highlight: false
      }
    ]
  },
  {
    day: "DAY 5", date: "11.29", weekday: "SAT", loc: "盛岡/新花卷/歸途", 
    lat: 39.3939, long: 141.1173, 
    weather: { icon: "sun", temp: "6°C", desc: "歷史平均" },
    items: [
      { 
        id: "d5-1", type: "info", time: "09:00", title: "飯店早餐", 
        desc: "在 Art 盛岡享受最後的早餐時光。", 
        highlight: false
      },
      { 
        id: "d5-2", type: "spot", time: "10:00", title: "🚶 步行前往盛岡城跡", 
        subTitle: "盛岡城跡公園（岩手公園）",
        location: "岩手県盛岡市内丸",
        desc: "從飯店步行前往盛岡城跡公園。欣賞秋季景色，適合拍照。",
        highlight: false,
        story: "盛岡城是江戶時代南部藩的居城，現已改建為公園。園內保留著石垣、護城河等遺跡，是盛岡市區重要的歷史地標。公園內種植了許多櫻花樹和楓樹，春季賞櫻、秋季賞楓都是絕佳地點。11月底雖然已過楓葉季，但仍可欣賞到蕭瑟的秋景，適合悠閒散步和拍照。"
      },
      { 
        id: "d5-3", type: "spot", time: "10:30", title: "🏛️ 參觀岩手銀行赤煉瓦館", 
        subTitle: "辰野金吾作品",
        location: "岩手県盛岡市中ノ橋通1-2-20",
        desc: "從盛岡城跡步行約 10 分鐘。欣賞辰野金吾設計的紅磚建築。",
        highlight: false,
        story: "建於 1911 年，是日本知名建築師「辰野金吾」在東北地區唯一的作品（他也是東京車站、台灣總統府的設計者）。紅磚牆面搭配白色花崗岩飾帶的「辰野式」風格非常鮮明。這棟建築曾是銀行的總行，現在作為多功能展演空間開放參觀，是盛岡市的地標性建築，非常適合拍照打卡。"
      },
      { 
        id: "d5-4", type: "spot", time: "11:00", title: "🌸 參觀石割櫻", 
        subTitle: "國家天然紀念物",
        location: "岩手県盛岡市",
        desc: "從岩手銀行步行約 5 分鐘。欣賞從巨石中生長出的櫻花樹（國家天然紀念物）。",
        highlight: false,
        story: "一棵從巨大花崗岩裂縫中生長出來的櫻花樹，被指定為日本國家天然紀念物。據說樹齡超過 400 年，展現了生命力的奇蹟。這棵櫻花樹從直徑約 3 公尺的巨石中央裂縫中長出，樹幹直徑約 1 公尺，是盛岡市最著名的自然奇觀之一。雖然 11 月底不是櫻花季，但仍可欣賞到這棵奇樹的獨特姿態。"
      },
      { 
        id: "d5-5", type: "hotel", time: "11:30", title: "返回飯店 Check-out", 
        desc: "退房並整理行李。", 
        highlight: false
      },
      { 
        id: "d5-6", type: "spot", time: "12:00", title: "🏢 Malios 眺望臺", 
        subTitle: "20 樓展望台",
        location: "岩手県盛岡市",
        desc: "前往 Malios 大樓 20 樓展望台。欣賞盛岡市區全景（距離盛岡站約 250 公尺）。",
        highlight: false,
        story: "位於盛岡站附近的 Malios 大樓 20 樓，是免費的展望台，可俯瞰盛岡市區全景。從展望台可以遠眺盛岡市區、岩手山等風景，是欣賞盛岡城市風貌的最佳地點。距離盛岡站僅約 250 公尺，交通便利，非常適合在離開前最後一覽盛岡美景。"
      },
      { 
        id: "d5-7", type: "transport", time: "12:30", title: "🚅 搭乘 JR 前往新花卷站", 
        desc: "東北新幹線", 
        route: { from: "盛岡站", to: "新花卷站", trainNo: "東北新幹線", duration: "約12分" },
        highlight: false
      },
      { 
        id: "d5-8", type: "info", time: "12:45", title: "抵達新花卷站", 
        desc: "可先寄放行李在車站置物櫃。", 
        highlight: false
      },
      { 
        id: "d5-9", type: "spot", time: "13:00", title: "⚾ 參觀大谷翔平展覽室", 
        subTitle: "Ohtani Shohei Exhibition Room",
        location: "岩手県花巻市",
        desc: "前往大谷翔平展覽室參觀。（請確認展覽室具體位置與開放時間）",
        highlight: true,
        story: "展示日本職棒傳奇球星大谷翔平相關文物與紀念品的展覽空間。大谷翔平出生於岩手縣奧州市，是日本職棒史上最受矚目的二刀流選手之一。展覽室內展示大谷翔平的球衣、簽名球、照片、獎盃等珍貴收藏，讓球迷能夠近距離感受這位傳奇球星的成長歷程與輝煌成就。是棒球迷必訪的朝聖地點。"
      },
      { 
        id: "d5-10", type: "food", time: "14:30", title: "🍜 午餐：白龍榨醬麵", 
        subTitle: "新花卷站內",
        location: "岩手県花巻市新花巻駅",
        desc: "在新花卷站內品嚐盛岡三大麵之一的榨醬麵。",
        highlight: true,
        menu: [
          { jp: "じゃじゃ麺", cn: "榨醬麵 (必點)" },
          { jp: "半ライス", cn: "半份白飯 (可加點)" }
        ],
        story: "盛岡三大麵之一（另外兩個是冷麵、碗子蕎麥麵）。榨醬麵源自中國的炸醬麵，經在地化改良後成為盛岡的特色美食。白龍是新花卷站內知名的榨醬麵店。榨醬麵的特色是將炒過的肉末和蔬菜（如洋蔥、青椒、豆芽等）與甜麵醬一起炒製成醬料，淋在Q彈的麵條上，再搭配黃瓜絲、蔥花等配菜。吃法通常是先將醬料與麵條充分拌勻，讓每一根麵條都裹上濃郁的醬汁，口感豐富且層次分明。"
      },
      { 
        id: "d5-11", type: "transport", time: "15:00", title: "前往花卷機場", 
        desc: "從新花卷站搭乘計程車或巴士前往花卷機場。車程約 10-15 分鐘。", 
        highlight: false
      },
      { 
        id: "d5-12", type: "info", time: "15:30", title: "抵達 花卷機場 (HNA)", 
        desc: "機場很小，建議入關前完成採買。", 
        highlight: false
      },
      { 
        id: "d5-13", type: "transport", time: "17:50", title: "🛫 起飛回台灣", 
        desc: "搭乘 台灣虎航 IT259 班機。再見東北！", 
        highlight: true
      },
      { 
        id: "d5-14", type: "transport", time: "21:10", title: "🛬 抵達桃園機場 (TPE)", 
        desc: "辦理入境手續、提領行李。", 
        highlight: false 
      },
      { 
        id: "d5-15", type: "transport", time: "21:40", title: "🚗 專車接送回家", 
        subTitle: "和運接送 (訂單 45IFT3)",
        desc: "司機資訊將於搭車前6小時提供。從桃園機場出發返回台北市。", 
        reservationNo: "驗證碼: 1616",
        link: "https://p.irentcar.com.tw/verify/45IFT3",
        highlight: false 
      }
    ]
  }
];

