import React, { useState, useEffect } from 'react';
import { 
  MapPin, Train, Utensils, Camera, Hotel, CreditCard, 
  X, ChevronRight, Navigation, Phone, Globe, 
  Cloud, Sun, Snowflake, Wind, CloudRain,
  Calendar as CalendarIcon, FileText, 
  Trash2, Receipt, RefreshCw, PlusCircle
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
        id: "d1-0", type: "transport", time: "11:30", title: "和運接送 (前往機場)", 
        subTitle: "專車接送",
        desc: "司機資訊將於搭車前6小時提供。", 
        reservationNo: "驗證碼: 7791",
        link: "https://p.irentcar.com.tw/verify/45IFT2",
        highlight: false 
      },
      { 
        id: "d1-1", type: "transport", time: "14:35", title: "桃園起飛 IT254", 
        desc: "準備好心情，出發前往東北！", 
        highlight: false 
      },
      { 
        id: "d1-2", type: "transport", time: "19:30", title: "仙台空港線", 
        desc: "搭乘 Access 線前往仙台站，約 25 分鐘。", 
        meta: { cost: "660円" } 
      },
      { 
        id: "d1-3", type: "food", time: "20:45", title: "牛舌 善治郎", 
        subTitle: "仙台駅前本店",
        location: "宮城県仙台市青葉区中央1-8-38",
        phone: "022-723-1877",
        desc: "仙台必吃名物。善治郎的特色是厚切且帶有炭火香氣，口感脆彈。",
        highlight: true,
        menu: [
          { jp: "牛たん定食", cn: "牛舌定食 (推薦 3 枚 6 切)", price: "¥2,500" },
          { jp: "とろろ", cn: "山藥泥 (配飯絕佳)", price: "¥300" }
        ],
        story: "仙台牛舌的起源可以追溯到二戰後，由佐野啟四郎先生首創。善治郎堅持手工切肉與長時間熟成，是當地人排隊也要吃的名店。"
      },
      { 
        id: "d1-4", type: "hotel", time: "22:00", title: "仙台大都會飯店", 
        subTitle: "Hotel Metropolitan Sendai",
        location: "仙台市青葉区中央1-1-1",
        phone: "022-268-2525",
        reservationNo: "Agoda-5592831",
        desc: "與仙台車站直結，交通最方便的選擇。",
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
        id: "d2-1", type: "info", time: "10:30", title: "寄放大型行李", 
        desc: "關鍵任務！將大行李寄放在仙台站，只帶輕便過夜包上山。", 
        badge: "MUST DO" 
      },
      { 
        id: "d2-2", type: "transport", time: "14:10", title: "尾花澤市營巴士", 
        desc: "大石田站發車。轉乘時間短，請迅速移動。", 
        phone: "0237-23-2111",
        highlight: false
      },
      { 
        id: "d2-3", type: "spot", time: "16:20", title: "銀山溫泉 Blue Hour", 
        subTitle: "大正浪漫的魔幻時刻",
        location: "山形県尾花沢市銀山新畑",
        desc: "日落後天空呈現深藍色，煤氣燈亮起的瞬間，是銀山溫泉最美的時刻。",
        highlight: true,
        story: "銀山溫泉曾是江戶時代的銀礦區，後來沒落。直到大正時期挖掘出溫泉，並興建了洋風木造建築，才形成如今獨特的景觀。",
        photoSpot: "能登屋旅館前的紅橋是最佳拍攝點。"
      },
      { 
        id: "d2-4", type: "hotel", time: "18:00", title: "古勢起屋別館", 
        subTitle: "Kosekiya Bekkan",
        reservationNo: "Jalan-889201",
        desc: "位於溫泉街中心，感受歷史的氛圍。",
        menu: [
          { jp: "チェックインお願いします", cn: "你好，我要辦理入住" },
          { jp: "夕食は何時ですか", cn: "請問晚餐幾點開始？" }
        ]
      }
    ]
  },
  {
    day: "DAY 3", date: "11.27", weekday: "THU", loc: "猊鼻溪/盛岡", 
    lat: 38.9329, long: 141.1341, 
    weather: { icon: "cloud", temp: "3°C", desc: "歷史平均" },
    items: [
      { 
        id: "d3-1", type: "spot", time: "15:00", title: "猊鼻溪遊船", 
        subTitle: "日本百景",
        location: "岩手県一関市東山町長坂字町467",
        phone: "0191-47-2341",
        desc: "搭乘扁舟遊覽溪谷，船夫會吟唱民謠「猊鼻追分」。記得購買魚飼料餵鴨子和魚。",
        highlight: true,
        menu: [
          { jp: "大人2枚お願いします", cn: "請給我兩張大人票" },
          { jp: "運玉 (うんだま)", cn: "運玉 (投擲許願用石頭)" }
        ]
      },
      { 
        id: "d3-2", type: "food", time: "19:00", title: "盛樓閣 冷麵", 
        subTitle: "盛岡駅前",
        location: "岩手県盛岡市盛岡駅前通15-5",
        phone: "019-654-8752",
        desc: "盛岡必吃燒肉冷麵名店。麵條Q彈，湯頭清爽帶點微辣。",
        highlight: true,
        menu: [
          { jp: "盛岡冷麺", cn: "盛岡冷麵 (必點)" },
          { jp: "カルビ", cn: "牛五花" },
          { jp: "上タン塩", cn: "上等鹽味牛舌" }
        ]
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
        subTitle: "岩手銀行赤レンガ館",
        location: "岩手県盛岡市中ノ橋通1-2-20",
        desc: "搭乘蝸牛巴士巡禮。赤煉瓦館是東京車站設計師辰野金吾的作品，充滿復古風情。",
        highlight: false,
        story: "盛岡是一座充滿文學與歷史的城市，宮澤賢治與石川啄木都曾在此生活。市區內保留了許多明治時期的洋風建築。"
      },
      { 
        id: "d4-2", type: "food", time: "12:30", title: "東家 本店 (Wanko Soba)", 
        subTitle: "わんこそば",
        location: "岩手県盛岡市中ノ橋通1-8-3",
        phone: "019-622-2252",
        desc: "岩手縣著名的「碗子蕎麥麵」挑戰。服務生會一邊喊著「Hai-Jan-Jan」一邊不斷幫你加麵。",
        highlight: true,
        menu: [
          { jp: "わんこそばコース", cn: "碗子蕎麥麵套餐" },
          { jp: "証明書", cn: "完食證明書 (吃超過100碗會獲得木牌)" }
        ]
      },
      { 
        id: "d4-3", type: "transport", time: "15:10", title: "飯店接駁車", 
        desc: "在新花卷站西口搭乘花卷溫泉免費接駁巴士。", 
        highlight: false
      },
      { 
        id: "d4-4", type: "hotel", time: "15:40", title: "花卷溫泉 紅葉館", 
        subTitle: "Hanamaki Onsen",
        location: "岩手県花巻市湯本1-125",
        reservationNo: "Agoda-229910",
        desc: "大型溫泉度假村，擁有著名的露天岩風呂與釜淵瀑布美景。",
        highlight: true,
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
        id: "d5-2", type: "spot", time: "11:30", title: "宮澤賢治童話村", 
        subTitle: "夢幻森林",
        location: "岩手県花巻市高松26-19",
        desc: "彷彿走進宮澤賢治的童話世界。「賢治的學校」內有巨大的萬花筒與鏡廳，非常適合拍照。",
        highlight: true,
        story: "花卷是日本國民作家宮澤賢治的故鄉。這裡將他的作品如《銀河鐵道之夜》具象化，充滿了宇宙、自然與幻想的元素。"
      },
      { 
        id: "d5-3", type: "food", time: "13:00", title: "山貓軒 (Wildcat House)", 
        subTitle: "注文の多い料理店",
        location: "岩手県花巻市矢沢3-161-33",
        desc: "以童話《要求很多的餐廳》為原型的餐廳。門口有貓咪站長迎接。",
        highlight: false,
        menu: [
          { jp: "すいとんセット", cn: "麵疙瘩定食 (鄉土料理)" },
          { jp: "山猫ぞうすい", cn: "山貓雜炊" }
        ]
      },
      { 
        id: "d5-4", type: "transport", time: "15:00", title: "前往花卷機場", 
        desc: "搭乘計程車前往機場 (約 10 分鐘)。機場很小，建議提早入關採買。", 
        highlight: false
      },
      { 
        id: "d5-5", type: "transport", time: "17:50", title: "飛往桃園 IT259", 
        desc: "再見東北！預計 21:10 抵達台灣。", 
        highlight: true
      },
      { 
        id: "d5-6", type: "transport", time: "21:10", title: "和運接送 (返家)", 
        subTitle: "桃園機場接機",
        desc: "司機資訊將於搭車前6小時提供。", 
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
              expenses.map((ex) => (
                <div key={ex.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-stone-800 text-sm mb-0.5">{ex.desc}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{ex.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-stone-700">¥{ex.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => onDelete(ex.id)}
                      className="text-stone-300 hover:text-red-400 p-2 -mr-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
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
    const payload = { ...data, date: new Date().toLocaleDateString(), createdAt: Date.now(), userId: user.uid };
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
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-400">{item.time}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-50 text-stone-500 uppercase tracking-wide">{item.type}</span>
                        </div>
                        <h3 className="font-bold text-stone-700">{item.title}</h3>
                      </div>
                      {item.reservationNo && <FileText className="w-4 h-4 text-stone-300" />}
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
        <button className="flex flex-col items-center text-stone-800">
          <CalendarIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">行程</span>
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

    </div>
  );
};

export default App;