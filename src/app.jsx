import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, RefreshCw, PlusCircle, AlertCircle, Receipt, FileText, MessageCircle, Calendar, Map 
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, doc 
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';

// Custom Imports
import { initialTripData } from './data/itinerary';
import { WeatherIcon, CategoryIcon, getWeatherIcon } from './components/Icons';
import DetailModal from './components/DetailModal';
import ExpenseAddModal from './components/ExpenseAddModal';
import ExpenseListModal from './components/ExpenseListModal';
import EmergencyInfoModal from './components/EmergencyInfoModal';
import LanguageCardModal from './components/LanguageCardModal';
import BookingModal from './components/BookingModal';
import ItineraryMapModal from './components/ItineraryMapModal';

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

// 調試：確認 Firebase 初始化
console.log('🔥 Firebase 已初始化:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// 在 Canvas 預覽環境中使用環境變數提供的 appId，確保多人協作時資料隔離
// 若使用者自行部署，則可使用固定的 Collection Name
const appId = typeof __app_id !== 'undefined' ? __app_id : 'tohoku-trip-preview';
const COLLECTION_NAME = 'expenses'; 

// ---------------------------------------------------------
// 2. Main App
// ---------------------------------------------------------

const App = () => {
  const [tripData, setTripData] = useState(initialTripData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [showLanguageCard, setShowLanguageCard] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

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
          console.log('✅ Firebase 匿名登入成功 (Custom Token)');
        } catch(e) {
          console.error("❌ Custom token login failed", e);
          signInAnonymously(auth).catch(console.error);
        }
      } else {
        try {
          await signInAnonymously(auth);
          console.log('✅ Firebase 匿名登入成功');
        } catch(e) {
          console.error('❌ Firebase 匿名登入失敗:', e);
        }
      }
    };
    initAuth();
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        console.log('✅ Firebase 使用者已登入:', user.uid);
      } else {
        console.log('⚠️ Firebase 使用者未登入');
      }
    });
  }, []);

  // Data Sync (Updated for Preview & Vercel)
  useEffect(() => {
    if (!user) return;
    let q;
    
    if (typeof __app_id !== 'undefined') {
       // 預覽環境路徑（無法使用多個 orderBy，需要在客戶端排序）
       q = query(collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME));
    } else {
       // Vercel 正式環境路徑：先按日期降序（單一排序避免需要複合索引）
       // 注意：如果需要複合索引，可以在 Firebase Console 建立
       // 目前改為客戶端排序以確保立即運作
       q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    }

    return onSnapshot(q, 
      (snap) => {
        const expensesData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // 統一在客戶端排序：先按日期降序，再按 order 升序
        expensesData.sort((a, b) => {
          // 先按日期降序
          if (a.date !== b.date) {
            return b.date?.localeCompare(a.date) || 0;
          }
          // 同一天內按 order 升序
          return (a.order || 0) - (b.order || 0);
        });
        
        console.log('✅ Firebase 資料同步成功，共', expensesData.length, '筆費用');
        setExpenses(expensesData);
      },
      (error) => {
        console.error('❌ Firebase 資料同步失敗:', error);
      }
    );
  }, [user]);

  const saveExpense = async (data, expenseId = null) => {
    if (!user) return;
    
    // 如果是編輯模式
    if (expenseId) {
      await updateExpense(expenseId, data);
      return;
    }

    // 新增模式：使用 ISO 格式儲存日期
    const now = new Date();
    const dateStr = data.date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // 計算 order：找到同一天的最後一筆 order，+1
    const sameDateExpenses = expenses.filter(e => e.date === dateStr);
    const maxOrder = sameDateExpenses.length > 0 
      ? Math.max(...sameDateExpenses.map(e => e.order || 0))
      : 0;
    
    const payload = { 
      ...data, 
      date: dateStr, 
      order: maxOrder + 1,
      createdAt: Date.now(), 
      userId: user.uid 
    };
    
    try {
      if (typeof __app_id !== 'undefined') {
         await addDoc(collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME), payload);
      } else {
         await addDoc(collection(db, COLLECTION_NAME), payload);
      }
    } catch(e) { console.error(e); }
  };

  const updateExpense = async (id, data) => {
    if (!user) return;
    
    try {
      const expense = expenses.find(e => e.id === id);
      if (!expense) return;

      const updates = { ...data };
      const dateChanged = data.date && data.date !== expense.date;
      
      // 如果日期變更，需要重新計算 order
      if (dateChanged) {
        const sameDateExpenses = expenses.filter(e => e.date === data.date && e.id !== id);
        const maxOrder = sameDateExpenses.length > 0 
          ? Math.max(...sameDateExpenses.map(e => e.order || 0))
          : 0;
        updates.order = maxOrder + 1;
      }
      
      updates.updatedAt = Date.now();
      
      const docRef = typeof __app_id !== 'undefined'
        ? doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, id)
        : doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, updates);
    } catch(e) { 
      console.error('Update expense error:', e); 
    }
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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase flex items-center gap-1">
                Family Trip <ChevronRight className="w-3 h-3" />
              </p>
              <button 
                onClick={() => setShowItineraryMap(true)}
                className="bg-purple-100 text-purple-600 p-1.5 rounded-full hover:bg-purple-200 transition-colors"
                title="查看行程導覽圖"
              >
                <Map className="w-3 h-3" />
              </button>
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">東北初冬旅</h1>
            <div className="flex items-center mt-2 text-stone-500 text-xs font-medium">
              <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 mr-2">2025</span>
              <span>11.25 - 11.29</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
             {/* Order Dashboard Button */}
             <button 
               onClick={() => setShowBookingModal(true)}
               className="bg-stone-100 p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
             >
               <Calendar className="w-4 h-4" />
             </button>
             
             {/* Budget Button */}
             <div className="text-right cursor-pointer active:opacity-60 transition-opacity" onClick={() => setShowExpenseList(true)}>
               <div className="text-xs text-stone-400 mb-1 flex items-center justify-end gap-1">
                 BUDGET <ChevronRight className="w-3 h-3" />
               </div>
               <div className="font-mono font-bold text-stone-800 border-b border-stone-200 pb-0.5">
                 ¥{totalSpent.toLocaleString()}
               </div>
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
                    // Highlight Item (Golden Card)
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
                  ) : item.type === 'transport' && !item.highlight ? (
                    // Transport Item (Ticket Style)
                    <div className="bg-stone-100/50 rounded-lg p-3 border border-stone-200/60 flex justify-between items-center relative overflow-hidden">
                      {/* Decorative punched holes */}
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FAF9F6] rounded-full border border-stone-200"></div>
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FAF9F6] rounded-full border border-stone-200"></div>
                      
                      <div className="flex-1 min-w-0 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-400">{item.time}</span>
                          <CategoryIcon type={item.type} />
                        </div>
                        <h3 className="font-bold text-stone-700 text-sm mb-0.5">{item.title}</h3>
                        {item.route && (
                          <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                            <span>{item.route.from}</span>
                            <span className="text-stone-300">➔</span>
                            <span>{item.route.to}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0 mr-2" />
                    </div>
                  ) : (
                    // Default Item
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-stone-100 flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-stone-400">{item.time}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-50 text-stone-500 uppercase tracking-wide">{item.type}</span>
                        </div>
                        <h3 className="font-bold text-stone-700 mb-0.5">{item.title}</h3>
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
          className="flex flex-col items-center text-stone-400 hover:text-stone-800 transition-colors min-w-[40px]"
        >
          <AlertCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">緊急</span>
        </button>

        <button 
          onClick={() => {
            setEditingExpense(null);
            setShowExpenseModal(true);
          }}
          className="bg-stone-900 text-white p-4 rounded-full shadow-xl border-4 border-[#FAF9F6] active:scale-95 transition-transform mb-6"
        >
          <PlusCircle className="w-7 h-7" />
        </button>

        <button 
          onClick={() => setShowLanguageCard(true)}
          className="flex flex-col items-center text-stone-400 hover:text-indigo-600 transition-colors min-w-[40px]"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">溝通</span>
        </button>
      </div>

      {/* MODALS */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showExpenseModal && (
        <ExpenseAddModal 
          onClose={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
            // 編輯完成後，如果 ExpenseListModal 沒有開啟，不需要做任何事
            // 如果 ExpenseListModal 有開啟，它會自動更新（因為 expenses 狀態已更新）
          }} 
          onSave={saveExpense}
          expense={editingExpense}
        />
      )}
      {showExpenseList && (
        <ExpenseListModal 
          expenses={expenses} 
          onClose={() => setShowExpenseList(false)} 
          onDelete={deleteExpense}
          onEdit={(expense) => {
            setEditingExpense(expense);
            // 不關閉 ExpenseListModal，讓編輯後可以繼續停留在帳本畫面
            setShowExpenseModal(true);
          }}
        />
      )}
      {showEmergencyInfo && <EmergencyInfoModal onClose={() => setShowEmergencyInfo(false)} />}
      {showLanguageCard && <LanguageCardModal onClose={() => setShowLanguageCard(false)} />}
      {showBookingModal && <BookingModal tripData={tripData} onClose={() => setShowBookingModal(false)} />}
      {showItineraryMap && <ItineraryMapModal onClose={() => setShowItineraryMap(false)} />}

    </div>
  );
};

export default App;
