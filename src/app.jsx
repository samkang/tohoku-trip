import React, { useState, useEffect } from 'react';
import { 
  MapPin, Train, Utensils, Camera, Hotel, CreditCard, 
  X, ChevronRight, Navigation, Phone, Globe, 
  Cloud, Sun, Snowflake, Wind, CloudRain,
  Calendar as CalendarIcon, FileText, 
  Trash2, Receipt, RefreshCw, PlusCircle, AlertCircle, Info
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, deleteDoc, 
  onSnapshot, query, orderBy, doc 
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';

// ---------------------------------------------------------
// 1. Firebase Configuration
// ---------------------------------------------------------
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAIPsqVSIpJvzwVJlBCy3jq_q3cTL50qhM",
  authDomain: "tohokutrip-51fe0.firebaseapp.com",
  projectId: "tohokutrip-51fe0",
  storageBucket: "tohokutrip-51fe0.firebasestorage.app",
  messagingSenderId: "745382019820",
  appId: "1:745382019820:web:d93e4470bf0d98e8949bc9"
};

// 優先使用環境變數，若無則使用預設設定
let firebaseConfig;
try {
  firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : defaultFirebaseConfig;
} catch (e) {
  console.warn("Firebase config parse error, using default.");
  firebaseConfig = defaultFirebaseConfig;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 在 Canvas 預覽環境中使用環境變數提供的 appId，確保多人協作時資料隔離
// 若使用者自行部署，則可使用固定的 Collection Name
const appId = typeof __app_id !== 'undefined' ? __app_id : 'tohoku-trip-preview';
const COLLECTION_NAME = 'expenses'; 

// ---------------------------------------------------------
// 2. Data Structure (行程資料)
// ---------------------------------------------------------
const initialTripData = [
  {
    day: "DAY 1", date: "11.25", weekday: "TUE", loc: "仙台市", 
    lat: 38.2682, long: 140.8694, 
    weather: { icon: "cloud", temp: "5°C", desc: "歷史平均" }, 
    items: [
      { 
        id: "d1-0", type: "transport", time: "11:30", title: "🚗 專車接送前往機場", 
        subTitle: "和運接送 (訂單 45IFT2)",
        desc: "駕駛：黃永松 (RFQ-9551)，電話：0922-775049。從台北市出發前往桃園機場。", 
        phone: "0922-775049",
        reservationNo: "驗證碼: 7791",
        link: "https://p.irentcar.com.tw/verify/45IFT2",
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

const getWeatherIcon = (code) => {
  if (code === 0) return { icon: "sun", desc: "晴朗" };
  if (code >= 1 && code <= 3) return { icon: "cloud", desc: "多雲" };
  if (code >= 45 && code <= 48) return { icon: "wind", desc: "起霧" };
  if (code >= 51 && code <= 67) return { icon: "rain", desc: "有雨" };
  if (code >= 71 && code <= 77) return { icon: "snow", desc: "下雪" };
  if (code >= 80 && code <= 82) return { icon: "rain", desc: "陣雨" };
  if (code >= 85 && code <= 86) return { icon: "snow", desc: "暴雪" };
  return { icon: "cloud", desc: "多雲" };
};

// ---------------------------------------------------------
// 3. Components
// ---------------------------------------------------------

const WeatherIcon = ({ type, className }) => {
  if (type === 'snow') return <Snowflake className={`text-blue-300 ${className}`} />;
  if (type === 'sun') return <Sun className={`text-amber-400 ${className}`} />;
  if (type === 'rain') return <CloudRain className={`text-blue-400 ${className}`} />;
  if (type === 'wind') return <Wind className={`text-stone-400 ${className}`} />;
  return <Cloud className={`text-stone-400 ${className}`} />;
};

const CategoryIcon = ({ type }) => {
  const styles = "w-4 h-4";
  if (type === 'food') return <Utensils className={styles} />;
  if (type === 'hotel') return <Hotel className={styles} />;
  if (type === 'spot') return <Camera className={styles} />;
  if (type === 'transport') return <Train className={styles} />;
  return <MapPin className={styles} />;
};

// Detail Modal
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="h-32 bg-stone-200 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF9F6]/90"></div>
          <div className="text-[120px] font-serif text-stone-300/30 font-bold select-none absolute -bottom-10 -right-4 italic">
            {item.type.toUpperCase()}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/50 p-2 rounded-full backdrop-blur-md hover:bg-white transition-colors z-10">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-stone-800 text-white text-[10px] font-bold tracking-wider rounded uppercase">
                {item.type}
              </span>
              <span className="text-stone-500 text-xs font-mono">{item.time}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight mb-1">
              {item.title}
            </h2>
            {item.subTitle && (
              <p className="text-stone-500 font-medium text-sm">{item.subTitle}</p>
            )}
          </div>

          {/* Transport Route Info */}
          {item.type === 'transport' && item.route && (
            <div className="mb-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Train className="w-4 h-4 text-blue-600" />
                <p className="text-blue-800/60 text-xs font-bold tracking-widest uppercase">交通資訊</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">起點</span>
                  <span className="font-bold text-stone-800">{item.route.from}</span>
                </div>
                <div className="flex items-center justify-center py-1">
                  <ChevronRight className="w-4 h-4 text-stone-400 rotate-90" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">終點</span>
                  <span className="font-bold text-stone-800">{item.route.to}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <span className="text-xs text-stone-500">班次</span>
                  <span className="font-mono text-sm text-stone-700">{item.route.trainNo || item.route.busNo}</span>
                </div>
                {item.route.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">時間</span>
                    <span className="text-sm text-stone-700">{item.route.duration}</span>
                  </div>
                )}
                {item.route.cost && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">費用</span>
                    <span className="font-mono text-sm text-stone-700">{item.route.cost}</span>
                  </div>
                )}
              </div>
              <a 
                href={`https://www.google.com/maps/dir/${encodeURIComponent(item.route.from)}/${encodeURIComponent(item.route.to)}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Navigation className="w-4 h-4" />
                查看路線
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-8">
            {item.location && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Navigation className="w-4 h-4" />
                Google 導航
              </a>
            )}
            {item.phone && (
              <a 
                href={`tel:${item.phone}`}
                className="flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4" />
                {item.phone}
              </a>
            )}
            {/* Link Button for Orders/Reservations */}
            {item.link && (
              <a 
                href={item.link}
                target="_blank" rel="noreferrer"
                className={`flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform ${!item.location && !item.phone ? 'col-span-2' : ''}`}
              >
                <Globe className="w-4 h-4" />
                查看訂單資訊
              </a>
            )}
          </div>

          {item.reservationNo && (
            <div className="mb-8 bg-amber-50 border border-amber-100 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-amber-100/50">
                <FileText size={100} />
              </div>
              <p className="text-amber-800/60 text-xs font-bold tracking-widest uppercase mb-1">RESERVATION</p>
              <p className="text-amber-900 text-lg font-serif font-bold">{item.title}</p>
              <div className="mt-3 bg-white/80 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-stone-400 mb-1">Confirmation / Code</p>
                <p className="text-2xl font-mono font-bold text-stone-800 tracking-wider">{item.reservationNo}</p>
              </div>
              <p className="text-xs text-amber-700 mt-2 flex items-center">
                <span className="mr-1">ℹ️</span> {item.link ? '點擊上方按鈕可查看詳細資訊' : 'Check-in 時請出示此畫面'}
              </p>
            </div>
          )}

          {item.menu && (
            <div className="mb-8">
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-stone-400" />
                指差確認 / 推薦清單
              </h3>
              <div className="space-y-3">
                {item.menu.map((m, idx) => (
                  <div key={idx} className="bg-white border border-stone-100 p-4 rounded-xl shadow-sm">
                    <p className="text-xl font-bold text-stone-900 mb-1 font-serif">{m.jp}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-stone-500 text-sm">{m.cn}</p>
                      {m.price && <p className="text-stone-800 font-mono text-sm bg-stone-100 px-2 py-0.5 rounded">{m.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.story && (
            <div className="mb-8">
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">關於此處</h3>
              <p className="text-stone-600 leading-loose text-sm text-justify">
                {item.story}
              </p>
            </div>
          )}

          {item.location && (
            <div className="text-xs text-stone-400 text-center font-mono mt-8 border-t border-stone-100 pt-4">
              ADDR: {item.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Expense Add Modal
const ExpenseAddModal = ({ onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!amount) return;
    onSave({ amount: parseInt(amount), desc: desc || '一般消費' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif font-bold text-xl text-stone-800">新增款項</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-stone-400" /></button>
        </div>
        
        <div className="mb-6">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">金額 (JPY)</label>
          <div className="flex items-baseline mt-2 border-b-2 border-stone-200 pb-2 focus-within:border-stone-800 transition-colors">
            <span className="text-2xl font-serif mr-2 text-stone-400">¥</span>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full text-4xl font-bold text-stone-900 outline-none placeholder-stone-200 bg-transparent font-mono"
              placeholder="0"
              autoFocus
            />
          </div>
          <div className="mt-2 text-right text-xs text-stone-400 font-mono">
            ≈ NT$ {amount ? Math.round(amount * 0.215).toLocaleString() : 0}
          </div>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">項目說明</label>
          <input 
            type="text" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full mt-2 p-3 bg-stone-50 rounded-xl text-stone-800 outline-none focus:ring-2 focus:ring-stone-200"
            placeholder="例如：便利商店、晚餐..."
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
        >
          儲存至雲端
        </button>
      </div>
    </div>
  );
};

// Emergency Info Modal
const EmergencyInfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-red-50 border-b border-red-100 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase">緊急連絡</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">重要資訊</h2>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* 急難救助 */}
          <div className="mb-8">
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              台灣人旅日急難救助聯絡資訊
            </h3>
            <p className="text-stone-600 text-sm mb-4 leading-relaxed">
              如果在日本旅遊期間發生護照遺失、重大疾病、交通事故、天災等緊急情況，請聯繫以下單位。
            </p>

            <div className="space-y-4">
              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">日本全國緊急聯絡電話 (24小時)</p>
                <div className="space-y-2">
                  <a href="tel:080-1009-7179" className="flex items-center gap-2 text-stone-800 font-mono text-lg">
                    <Phone className="w-4 h-4 text-stone-400" />
                    080-1009-7179
                  </a>
                  <a href="tel:080-1009-7436" className="flex items-center gap-2 text-stone-800 font-mono text-lg">
                    <Phone className="w-4 h-4 text-stone-400" />
                    080-1009-7436
                  </a>
                  <p className="text-xs text-stone-500 mt-2">(從日本國內撥打方式，請直接撥打上述號碼)</p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">台北駐日經濟文化代表處 (東京)</p>
                <p className="text-xs text-stone-500 mb-2">您這次旅遊的地區 (宮城縣、山形縣、岩手縣) 皆屬於東京代表處的轄區</p>
                <div className="space-y-1 text-sm">
                  <p className="text-stone-600">地址：東京都港区白金台 5-20-2</p>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">一般辦公：</span>
                    <a href="tel:03-3280-7811" className="font-mono text-stone-800">(03) 3280-7811</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">緊急聯絡：</span>
                    <a href="tel:080-1009-7179" className="font-mono text-stone-800">080-1009-7179</a>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">(下班時間/假日)</p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">外交部旅外國人急難救助服務專線</p>
                <div className="space-y-1">
                  <a href="tel:+886-800-085-095" className="flex items-center gap-2 text-stone-800 font-mono">
                    <Phone className="w-4 h-4 text-stone-400" />
                    +886-800-085-095
                  </a>
                  <p className="text-xs text-stone-500">(國際免付費)</p>
                  <a href="tel:+886-3-398-2629" className="flex items-center gap-2 text-stone-800 font-mono mt-2">
                    <Phone className="w-4 h-4 text-stone-400" />
                    +886-3-398-2629
                  </a>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">日本當地報案電話</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-stone-500 mb-1">警察局</p>
                    <a href="tel:110" className="text-2xl font-mono font-bold text-red-600">110</a>
                    <p className="text-xs text-stone-500 mt-1">報案、事故</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-stone-500 mb-1">消防局</p>
                    <a href="tel:119" className="text-2xl font-mono font-bold text-red-600">119</a>
                    <p className="text-xs text-stone-500 mt-1">火警、救護車</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Japan Web */}
          <div className="mb-6">
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Visit Japan Web (VJW)
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                持台灣護照赴日本短期觀光，強烈建議出發前利用 「Visit Japan Web (VJW)」 線上服務預先填寫資料，以加速通關。
              </p>
              <a 
                href="https://www.vjw.digital.go.jp/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition-transform mb-3"
              >
                <Globe className="w-4 h-4" />
                前往 VJW 官方網站
              </a>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-stone-700">事前準備 (建議出發前 1-2 週完成)：</p>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 ml-2">
                  <li>註冊帳號並登錄護照資料</li>
                  <li>登記本次行程 (抵達日 2025/11/25、航班 IT254、第一晚仙台住宿地址)</li>
                  <li>完成「入境審查」與「海關申報」資料填寫</li>
                  <li>取得並保存兩個 QR Code：黃色 (入境審查用)、藍色 (海關申報用)</li>
                </ol>
                <p className="font-bold text-stone-700 mt-4">抵達時使用：</p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 ml-2">
                  <li>在入境審查櫃檯出示黃色 QR Code</li>
                  <li>領完行李後在海關檢查處出示藍色 QR Code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Expense List Modal
const ExpenseListModal = ({ expenses, onClose, onDelete }) => {
  const totalSpent = expenses.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-white p-6 border-b border-stone-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-4 h-4 text-stone-400" />
              <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">EXPENSES</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">旅行帳本</h2>
          </div>
          <button onClick={onClose} className="bg-stone-100 p-2 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="p-6 pb-0">
          <div className="bg-stone-800 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -top-4 text-stone-700/50">
                <CreditCard size={100} />
             </div>
             <p className="text-stone-400 text-xs font-medium mb-1">總金額 (台幣估算)</p>
             <p className="text-3xl font-mono font-bold tracking-tight">
               NT$ {Math.round(totalSpent * 0.215).toLocaleString()}
             </p>
             <div className="mt-4 pt-4 border-t border-stone-700 flex justify-between items-center">
               <span className="text-xs text-stone-400">日幣總額</span>
               <span className="font-mono text-lg">¥ {totalSpent.toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">最新消費記錄</h3>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-sm">
                尚無消費記錄，點擊右下角「+」新增
              </div>
            ) : (
              expenses.map((ex, idx) => {
                // 格式化日期顯示
                const formatDate = (dateStr) => {
                  if (!dateStr) return '';
                  try {
                    let date;
                    // 處理不同格式的日期字串
                    if (dateStr.includes('-')) {
                      // ISO 格式或 YYYY-MM-DD
                      date = new Date(dateStr);
                    } else if (dateStr.includes('/')) {
                      // 本地格式如 2025/11/25
                      date = new Date(dateStr);
                    } else {
                      // 嘗試直接解析
                      date = new Date(dateStr);
                    }
                    
                    if (isNaN(date.getTime())) {
                      return dateStr;
                    }
                    
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
                    const weekday = weekdays[date.getDay()];
                    return `${month}/${day} (${weekday})`;
                  } catch {
                    return dateStr;
                  }
                };

                // 檢查是否需要顯示日期標題（與上一筆不同日期時）
                const showDateHeader = idx === 0 || expenses[idx - 1].date !== ex.date;

                return (
                  <div key={ex.id}>
                    {showDateHeader && (
                      <div className="mb-2 mt-4 first:mt-0">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-[1px] bg-stone-200"></div>
                          <span className="text-xs font-bold text-stone-500 px-2">
                            {formatDate(ex.date)}
                          </span>
                          <div className="flex-1 h-[1px] bg-stone-200"></div>
                        </div>
                      </div>
                    )}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center group">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800 text-sm mb-1">{ex.desc}</p>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3 text-stone-400" />
                          <p className="text-[10px] text-stone-400 font-mono">{formatDate(ex.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span className="font-mono font-bold text-stone-700 whitespace-nowrap">¥{ex.amount.toLocaleString()}</span>
                        <button 
                          onClick={() => onDelete(ex.id)}
                          className="text-stone-300 hover:text-red-400 p-2 -mr-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// 4. Main App
// ---------------------------------------------------------

const App = () => {
  const [tripData, setTripData] = useState(initialTripData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Weather API
  useEffect(() => {
    const fetchWeather = async () => {
      setIsWeatherLoading(true);
      try {
        const updatedData = await Promise.all(initialTripData.map(async (day) => {
          if (!day.lat || !day.long) return day;
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${day.lat}&longitude=${day.long}&current_weather=true&timezone=Asia%2FTokyo`);
            const data = await res.json();
            if (data.current_weather) {
              const { weathercode, temperature } = data.current_weather;
              const { icon, desc } = getWeatherIcon(weathercode);
              return { ...day, weather: { icon: icon, temp: `${temperature}°C`, desc: desc } };
            }
            return day;
          } catch (err) { return day; }
        }));
        setTripData(updatedData);
      } catch (error) { console.error("Global weather fetch error", error); } finally { setIsWeatherLoading(false); }
    };
    fetchWeather();
  }, []);

  // Auth
  useEffect(() => {
    const initAuth = async () => {
      // 優先檢查是否有環境 Token (預覽環境)，否則使用匿名登入 (Vercel 環境)
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch(e) {
          console.error("Custom token login failed", e);
          signInAnonymously(auth).catch(console.error);
        }
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    };
    initAuth();
    return auth.onAuthStateChanged(setUser);
  }, []);

  // Data Sync (Updated for Preview & Vercel)
  useEffect(() => {
    if (!user) return;
    let q;
    
    if (typeof __app_id !== 'undefined') {
       // 預覽環境路徑
       q = query(collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME));
    } else {
       // Vercel 正式環境路徑
       q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user]);

  const saveExpense = async (data) => {
    if (!user) return;
    // 使用 ISO 格式儲存日期，方便後續格式化顯示
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const payload = { ...data, date: dateStr, createdAt: Date.now(), userId: user.uid };
    try {
      if (typeof __app_id !== 'undefined') {
         await addDoc(collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME), payload);
      } else {
         await addDoc(collection(db, COLLECTION_NAME), payload);
      }
    } catch(e) { console.error(e); }
  };

  const deleteExpense = async (id) => {
    try {
      if (typeof __app_id !== 'undefined') {
         await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, id));
      } else {
         await deleteDoc(doc(db, COLLECTION_NAME, id));
      }
    } catch(e) { console.error(e); }
  };

  const totalSpent = expenses.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-stone-800 max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="pt-12 pb-6 px-6 bg-white relative border-b border-stone-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase mb-1">Family Trip</p>
            <h1 className="text-3xl font-serif font-bold text-stone-900">東北初冬旅</h1>
            <div className="flex items-center mt-2 text-stone-500 text-xs font-medium">
              <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 mr-2">2025</span>
              <span>11.25 - 11.29</span>
            </div>
          </div>
          <div className="text-right cursor-pointer active:opacity-60 transition-opacity" onClick={() => setShowExpenseList(true)}>
             <div className="text-xs text-stone-400 mb-1 flex items-center justify-end gap-1">
               BUDGET <ChevronRight className="w-3 h-3" />
             </div>
             <div className="font-mono font-bold text-stone-800 border-b border-stone-200 pb-0.5">
               ¥{totalSpent.toLocaleString()}
             </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {tripData.map((d, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] text-stone-400 font-bold mb-1">{d.weekday}</span>
              {isWeatherLoading ? (
                <RefreshCw className="w-5 h-5 mb-1 text-stone-300 animate-spin" />
              ) : (
                <WeatherIcon type={d.weather.icon} className="w-5 h-5 mb-1" />
              )}
              <span className="text-xs font-mono text-stone-600">
                {isWeatherLoading ? "--" : d.weather.temp}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-4 pb-32 flex-1 overflow-y-auto">
        {tripData.map((day, dIdx) => (
          <div key={dIdx} className="mb-10">
            <div className="sticky top-0 z-10 bg-[#FAF9F6]/95 backdrop-blur py-3 mb-4 border-b border-stone-200/60 flex items-baseline justify-between pr-4">
              <div className="flex items-baseline">
                <h2 className="text-xl font-serif font-bold mr-3">{day.day}</h2>
                <span className="text-xs font-bold text-stone-400 tracking-wide uppercase">{day.loc}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/50 px-2 py-1 rounded-full">
                 <span>{day.weather.desc}</span>
                 <span className="font-mono">{day.weather.temp}</span>
              </div>
            </div>

            <div className="space-y-4 pl-2 relative">
              <div className="absolute left-[7px] top-2 bottom-4 w-[1px] bg-stone-200"></div>
              {day.items.map((item, iIdx) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className={`relative pl-8 group cursor-pointer transition-transform active:scale-[0.98] ${item.highlight ? 'mb-6' : ''}`}
                >
                  <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#FAF9F6] shadow-sm z-10 
                    ${item.highlight ? 'bg-amber-400' : 'bg-stone-300'}`}></div>

                  {item.highlight ? (
                    <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-amber-600/80 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
                          <CategoryIcon type={item.type} />
                          Special Experience
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone-300" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-stone-800 mb-1">{item.title}</h3>
                      <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{item.desc}</p>
                      <div className="mt-3 flex gap-2">
                        {item.menu && <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded">含推薦菜單</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-stone-100 flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-400">{item.time}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-50 text-stone-500 uppercase tracking-wide">{item.type}</span>
                        </div>
                        <h3 className="font-bold text-stone-700 mb-0.5">{item.title}</h3>
                        {item.type === 'transport' && item.route && (
                          <p className="text-xs text-stone-500 truncate">
                            {item.route.from} → {item.route.to} · {item.route.trainNo || item.route.busNo}
                          </p>
                        )}
                        {item.type !== 'transport' && item.desc && (
                          <p className="text-xs text-stone-500 line-clamp-1">{item.desc}</p>
                        )}
                      </div>
                      {item.reservationNo && <FileText className="w-4 h-4 text-stone-300 flex-shrink-0 ml-2" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-3 flex justify-around items-center z-40 max-w-md mx-auto safe-area-pb">
        <button 
          onClick={() => setShowEmergencyInfo(true)}
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition-colors"
        >
          <AlertCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">緊急</span>
        </button>

        <button 
          onClick={() => setShowExpenseModal(true)}
          className="-mt-8 bg-stone-900 text-white p-4 rounded-full shadow-xl border-4 border-[#FAF9F6] active:scale-95 transition-transform"
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        <button 
          onClick={() => setShowExpenseList(true)}
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition-colors"
        >
          <Receipt className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">帳本</span>
        </button>
      </div>

      {/* MODALS */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showExpenseModal && <ExpenseAddModal onClose={() => setShowExpenseModal(false)} onSave={saveExpense} />}
      {showExpenseList && <ExpenseListModal expenses={expenses} onClose={() => setShowExpenseList(false)} onDelete={deleteExpense} />}
      {showEmergencyInfo && <EmergencyInfoModal onClose={() => setShowEmergencyInfo(false)} />}

    </div>
  );
};

export default App;