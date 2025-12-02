import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, RefreshCw, PlusCircle, AlertCircle, Receipt, FileText, MessageCircle, Calendar, Map, Settings
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  onSnapshot, query, orderBy, doc, writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';

// Custom Imports
import { WeatherIcon, CategoryIcon, getWeatherIcon } from './components/Icons';
import TripSelector from './components/TripSelector';
import { loadTripData } from './data/trip-loader';
import { DEFAULT_TRIP_ID, getTripConfig } from './config/trips';
import { updatePreference } from './utils/userPreferences';
import DetailModal from './components/DetailModal';
import ExpenseAddModal from './components/ExpenseAddModal';
import ExpenseListModal from './components/ExpenseListModal';
import EmergencyInfoModal from './components/EmergencyInfoModal';
import LanguageCardModal from './components/LanguageCardModal';
import BookingModal from './components/BookingModal';
import ItineraryMapModal from './components/ItineraryMapModal';
import PreferencesModal from './components/PreferencesModal';
import DataBackupModal from './components/DataBackupModal';
import DataReminder from './components/DataReminder';

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

// ---------------------------------------------------------
// 2. Main App
// ---------------------------------------------------------

const App = () => {
  // 行程相關狀態
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [isTripLoading, setIsTripLoading] = useState(true);

  // 應用狀態
  const [selectedItem, setSelectedItem] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [showLanguageCard, setShowLanguageCard] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showItineraryMap, setShowItineraryMap] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showDataBackup, setShowDataBackup] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // 天氣資料快取 (包含時間戳) - 使用普通物件以確保相容性
  const weatherCache = useRef({});
  const [weatherData, setWeatherData] = useState({});

  // 清理過期的天氣快取 (30分鐘)
  const cleanupWeatherCache = () => {
    const now = Date.now();
    const expiryTime = 30 * 60 * 1000; // 30分鐘

    Object.keys(weatherCache.current).forEach(key => {
      const value = weatherCache.current[key];
      if (value.timestamp && (now - value.timestamp) > expiryTime) {
        delete weatherCache.current[key];
      }
    });
  };

  // 動態獲取 Collection Name
  const getCollectionName = () => {
    if (!currentTrip) return 'expenses';

    // 向後相容性：檢查是否有 legacyCollection 標記
    if (currentTrip.legacyCollection) {
      return 'expenses'; // 繼續使用舊的 collection
    }

    return `expenses_${currentTrip.id}`;
  };

  // 行程載入邏輯
  useEffect(() => {
    const loadInitialTrip = async () => {
      try {
        // 從URL參數或localStorage獲取行程ID
        const urlParams = new URLSearchParams(window.location.search);
        const urlTripId = urlParams.get('trip');
        const storedTripId = localStorage.getItem('selectedTrip');

        // 如果沒有任何行程選擇，顯示選擇器
        if (!urlTripId && !storedTripId) {
          console.log('首次使用，顯示行程選擇器');
          setIsTripLoading(false);
          setShowTripSelector(true);
          return;
        }

        const tripId = urlTripId || storedTripId || DEFAULT_TRIP_ID;

        console.log(`載入行程: ${tripId}`);
        const tripDataResult = await loadTripData(tripId);

        setCurrentTrip(tripDataResult.config);
        setTripData(tripDataResult.itinerary);
        // 注意：不要在這裡設定 setIsTripLoading(false)
        // 讓費用資料載入完成後再設定

      } catch (error) {
        console.error('載入行程失敗:', error);
        // 如果載入失敗，顯示行程選擇器
        setIsTripLoading(false);
        setShowTripSelector(true);
      }
    };

    loadInitialTrip();
  }, []);

  // 選擇行程
  const handleTripSelect = async (tripId) => {
    try {
      setIsTripLoading(true);
      console.log(`選擇行程: ${tripId}`);

      // 先清空現有資料，避免顯示舊行程的資料
      setExpenses([]);
      setSelectedItem(null);
      setWeatherData({});

      const tripDataResult = await loadTripData(tripId);
      setCurrentTrip(tripDataResult.config);
      setTripData(tripDataResult.itinerary);

      // 儲存選擇
      localStorage.setItem('selectedTrip', tripId);

      // 更新URL
      const url = new URL(window.location);
      url.searchParams.set('trip', tripId);
      window.history.pushState({}, '', url);

      setShowTripSelector(false);
      // 注意：不要在這裡設定 setIsTripLoading(false)
      // 讓費用資料載入完成後再設定

    } catch (error) {
      console.error('選擇行程失敗:', error);
      setIsTripLoading(false);
      alert('載入行程失敗，請重試');
    }
  };

  // 切換行程（顯示選擇器）
  const switchTrip = () => {
    setShowTripSelector(true);
  };

  // 重新載入天氣資料
  const refreshWeather = async () => {
    if (!tripData) return;

    console.log('🌤️ 重新載入天氣資料');

    // 清空相關地點的快取
    tripData.forEach((day) => {
      if (day.lat && day.long) {
        const cacheKey = `${day.lat},${day.long}`;
        delete weatherCache.current[cacheKey];
      }
    });

    // 重新觸發 useEffect
    setTripData([...tripData]);
  };

  // Weather API with caching and rate limiting
  useEffect(() => {
    if (!tripData) return;

    const fetchWeatherWithCache = async () => {
      setIsWeatherLoading(true);
      try {
        // 收集需要請求天氣的所有地點
        const locationsToFetch = [];
        tripData.forEach((day) => {
          if (day.lat && day.long) {
            const cacheKey = `${day.lat},${day.long}`;
            if (!(cacheKey in weatherCache.current)) {
              locationsToFetch.push({ day, cacheKey });
            }
          }
        });

        // 清理過期的快取
        cleanupWeatherCache();

        if (locationsToFetch.length === 0) {
          // 所有天氣資料都在快取中，直接更新 weatherData
          const newWeatherData = { ...weatherData };
          tripData.forEach((day) => {
            if (day.lat && day.long) {
              const cacheKey = `${day.lat},${day.long}`;
              const cachedWeather = weatherCache.current[cacheKey];
              if (cachedWeather && cachedWeather.data) {
                newWeatherData[cacheKey] = cachedWeather.data;
              }
            }
          });
          setWeatherData(newWeatherData);
          setIsWeatherLoading(false);
          return;
        }

        console.log(`🌤️ 請求 ${locationsToFetch.length} 個地點的天氣資料`);

        // 批次請求天氣資料，加入延遲避免觸發速率限制
        const newWeatherData = { ...weatherData };
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < locationsToFetch.length; i++) {
          const { day, cacheKey } = locationsToFetch[i];

          try {
            // 加入延遲，避免同時請求太多
            if (i > 0) await delay(200);

            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${day.lat}&longitude=${day.long}&current_weather=true&timezone=Asia%2FTokyo`
            );

            // 檢查是否被限速
            if (response.status === 429) {
              console.warn('🌤️ 天氣 API 請求過於頻繁，稍後重試');
              // 設定一個備用天氣資料
              const fallbackWeather = {
                icon: 'cloud',
                temp: '--°C',
                desc: '暫無資料'
              };
              weatherCache.current[cacheKey] = {
                data: fallbackWeather,
                timestamp: Date.now()
              };
              newWeatherData[cacheKey] = fallbackWeather;
              continue;
            }

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data.current_weather) {
              const { weathercode, temperature } = data.current_weather;
              const { icon, desc } = getWeatherIcon(weathercode);
              const weatherInfo = {
                icon: icon,
                temp: `${temperature}°C`,
                desc: desc
              };

              // 存入快取（包含時間戳）
              weatherCache.current[cacheKey] = {
                data: weatherInfo,
                timestamp: Date.now()
              };
              newWeatherData[cacheKey] = weatherInfo;
            }
          } catch (error) {
            console.warn(`🌤️ 無法獲取 ${day.loc} 天氣資料:`, error);
            // 設定備用天氣資料
            const fallbackWeather = {
              icon: 'cloud',
              temp: '--°C',
              desc: '載入失敗'
            };
            weatherCache.current[cacheKey] = {
              data: fallbackWeather,
              timestamp: Date.now()
            };
            newWeatherData[cacheKey] = fallbackWeather;
          }
        }

        setWeatherData(newWeatherData);
      } catch (error) {
        console.error("🌤️ 天氣資料載入錯誤:", error);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherWithCache();
  }, [currentTrip]);

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
    if (!user || !currentTrip) return;

    // 在 useEffect 內部計算 COLLECTION_NAME，確保使用最新的 currentTrip
    const currentCollectionName = currentTrip.legacyCollection
      ? 'expenses'
      : `expenses_${currentTrip.id}`;
    console.log('📡 Firebase 資料同步 useEffect 執行, COLLECTION_NAME:', currentCollectionName, 'currentTrip:', currentTrip?.id);

    let q;

    if (typeof __app_id !== 'undefined') {
       // 預覽環境路徑（無法使用多個 orderBy，需要在客戶端排序）
       q = query(collection(db, 'artifacts', appId, 'public', 'data', currentCollectionName));
    } else {
       // Vercel 正式環境路徑：先按日期降序（單一排序避免需要複合索引）
       // 注意：如果需要複合索引，可以在 Firebase Console 建立
       // 目前改為客戶端排序以確保立即運作
       q = query(collection(db, currentCollectionName), orderBy('date', 'desc'));
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
        
        console.log(`✅ ${currentTrip?.name || '當前行程'} 費用資料同步成功，共`, expensesData.length, '筆費用');
        setExpenses(expensesData);

        // 當費用資料載入完成時，設定載入狀態為 false
        if (isTripLoading) {
          setIsTripLoading(false);
        }
      },
      (error) => {
        console.error('❌ Firebase 資料同步失敗:', error);
      }
    );
  }, [user, currentTrip]);

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
      const collectionName = getCollectionName();
      if (typeof __app_id !== 'undefined') {
         await addDoc(collection(db, 'artifacts', appId, 'public', 'data', collectionName), payload);
      } else {
         await addDoc(collection(db, collectionName), payload);
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

      const collectionName = getCollectionName();
      const docRef = typeof __app_id !== 'undefined'
        ? doc(db, 'artifacts', appId, 'public', 'data', collectionName, id)
        : doc(db, collectionName, id);
      
      await updateDoc(docRef, updates);
    } catch(e) { 
      console.error('Update expense error:', e); 
    }
  };

  const deleteExpense = async (id) => {
    try {
      const collectionName = getCollectionName();
      if (typeof __app_id !== 'undefined') {
         await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
      } else {
         await deleteDoc(doc(db, collectionName, id));
      }
    } catch(e) { console.error(e); }
  };

  // 處理資料匯入
  const handleDataImport = async (importData) => {
    if (!currentTrip) {
      throw new Error('請先選擇行程');
    }

    try {
      // 清除現有資料 - 使用批次操作
      if (expenses.length > 0) {
        const collectionName = getCollectionName();
        const batch = writeBatch(db);
        expenses.forEach(expense => {
          const docRef = typeof __app_id !== 'undefined'
            ? doc(db, 'artifacts', appId, 'public', 'data', collectionName, expense.id)
            : doc(db, collectionName, expense.id);
          batch.delete(docRef);
        });
        await batch.commit();
      }

      // 匯入新資料
      const collectionName = getCollectionName();
      const importPromises = importData.expenses.map(async (expense, index) => {
        const payload = {
          ...expense,
          tripId: currentTrip.id,
          order: index + 1,
          importedAt: Date.now()
        };

        if (typeof __app_id !== 'undefined') {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', collectionName), payload);
        } else {
          await addDoc(collection(db, collectionName), payload);
        }
      });

      await Promise.all(importPromises);

      // 更新偏好設定
      if (importData.userPreferences) {
        if (importData.userPreferences.exchangeRate) {
          updatePreference('exchangeRate', importData.userPreferences.exchangeRate);
        }
        if (importData.userPreferences.clothingLabel) {
          updatePreference('clothingLabel', importData.userPreferences.clothingLabel);
        }
      }

      console.log(`✅ 成功匯入 ${importData.expenses.length} 筆費用記錄`);

      // 觸發費用更新事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('expensesUpdated'));
      }

    } catch (error) {
      console.error('❌ 資料匯入失敗:', error);
      throw error;
    }
  };

  const totalSpent = expenses.reduce((acc, cur) => acc + cur.amount, 0);

  // 如果正在載入行程，顯示載入畫面
  if (isTripLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-500">載入行程中...</p>
        </div>
      </div>
    );
  }

  // 如果顯示行程選擇器（首次使用或手動切換）
  if (showTripSelector) {
    return (
      <TripSelector
        onTripSelect={handleTripSelect}
        currentTripId={currentTrip?.id}
      />
    );
  }

  // 如果沒有行程資料，顯示載入狀態
  if (!currentTrip || !tripData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-500">準備行程資料...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-stone-800 max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="pt-12 pb-6 px-6 bg-white relative border-b border-stone-100">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase flex items-center gap-1">
                {currentTrip.destination} <ChevronRight className="w-3 h-3" />
              </p>
              <button
                onClick={() => setShowItineraryMap(true)}
                className="bg-purple-100 text-purple-600 p-1.5 rounded-full hover:bg-purple-200 transition-colors"
                title="查看行程導覽圖"
              >
                <Map className="w-3 h-3" />
              </button>
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">{currentTrip.name}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-stone-500 text-xs font-medium">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600 mr-2">2025</span>
                <span>{currentTrip.startDate} - {currentTrip.endDate}</span>
              </div>
              <button
                onClick={switchTrip}
                className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full hover:bg-stone-200 transition-colors text-xs font-medium"
                title="切換行程"
              >
                切換行程
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="flex gap-2">
               {/* Settings Button */}
               <button 
                 onClick={() => setShowPreferences(true)}
                 className="bg-stone-100 p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
                 title="偏好設定"
               >
                 <Settings className="w-4 h-4" />
               </button>
               {/* Order Dashboard Button */}
               <button 
                 onClick={() => setShowBookingModal(true)}
                 className="bg-stone-100 p-2 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
                 title="預訂資訊"
               >
                 <Calendar className="w-4 h-4" />
               </button>
             </div>
             
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
          {/* 天氣重新載入按鈕 */}
          {!isWeatherLoading && (
            <div className="flex-shrink-0 flex flex-col items-center min-w-[60px] justify-center">
              <button
                onClick={refreshWeather}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center"
                title="重新載入天氣"
              >
                <RefreshCw className="w-4 h-4 text-stone-600" />
              </button>
              <span className="text-[10px] text-stone-400 mt-1">更新</span>
            </div>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-4 pb-32 flex-1 overflow-y-auto">
        {tripData.map((day, dIdx) => {
          const weatherKey = day.lat && day.long ? `${day.lat},${day.long}` : null;
          const dayWeather = weatherKey ? weatherData[weatherKey] : null;

          return (
            <div key={dIdx} className="mb-10">
              <div className="sticky top-0 z-10 bg-[#FAF9F6]/95 backdrop-blur py-3 mb-4 border-b border-stone-200/60 flex items-baseline justify-between pr-4">
                <div className="flex items-baseline">
                  <h2 className="text-xl font-serif font-bold mr-3">{day.day}</h2>
                  <span className="text-xs font-bold text-stone-400 tracking-wide uppercase">{day.loc}</span>
                </div>
                {dayWeather && (
                  <div className="flex items-center gap-2 text-xs text-stone-500 bg-white/50 px-2 py-1 rounded-full">
                     <span>{dayWeather.desc}</span>
                     <span className="font-mono">{dayWeather.temp}</span>
                  </div>
                )}
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
        );
      })}
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
          onBackup={() => setShowDataBackup(true)}
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
      {showPreferences && <PreferencesModal onClose={() => setShowPreferences(false)} />}
      {showDataBackup && (
        <DataBackupModal
          expenses={expenses}
          currentTrip={currentTrip}
          onClose={() => setShowDataBackup(false)}
          onImportSuccess={handleDataImport}
        />
      )}

      {/* 行程選擇器 */}
      {showTripSelector && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden">
              <TripSelector
                onTripSelect={handleTripSelect}
                currentTripId={currentTrip?.id}
              />
            </div>
          </div>
        </div>
      )}

      {/* 資料備份提醒 */}
      <DataReminder
        expenses={expenses}
        onBackupClick={() => setShowDataBackup(true)}
      />

    </div>
  );
};

export default App;
