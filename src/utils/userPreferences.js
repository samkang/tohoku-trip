import { EXPENSE_CATEGORIES } from './constants';

const STORAGE_KEY = 'tohoku-trip-user-preferences';

// 預設偏好
export const DEFAULT_PREFERENCES = {
  clothingLabel: '衣', // 預設顯示「衣」
  exchangeRate: 0.215 // 預設匯率：1 JPY = 0.215 TWD
};

// 讀取偏好設定
export const getUserPreferences = () => {
  try {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 確保所有必要的欄位都存在
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed
      };
    }
  } catch (e) {
    console.warn('讀取偏好設定失敗:', e);
  }
  return DEFAULT_PREFERENCES;
};

// 儲存偏好設定
export const saveUserPreferences = (preferences) => {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (e) {
    console.error('儲存偏好設定失敗:', e);
    return false;
  }
};

// 更新特定偏好
export const updatePreference = (key, value) => {
  const prefs = getUserPreferences();
  prefs[key] = value;
  saveUserPreferences(prefs);
  // 觸發更新事件，讓其他組件知道偏好已變更
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('preferencesUpdated'));
  }
};

// 取得分類標籤（根據偏好）
export const getCategoryLabel = (category) => {
  if (category !== 'clothing') {
    // 其他分類保持不變
    const cat = EXPENSE_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : '食';
  }
  
  // clothing 分類根據偏好顯示
  const prefs = getUserPreferences();
  return prefs.clothingLabel || '衣';
};

// 取得匯率
export const getExchangeRate = () => {
  const prefs = getUserPreferences();
  return prefs.exchangeRate || DEFAULT_PREFERENCES.exchangeRate;
};

// 設定匯率
export const setExchangeRate = (rate) => {
  const numRate = parseFloat(rate);
  if (isNaN(numRate) || numRate <= 0) {
    console.error('無效的匯率:', rate);
    return false;
  }
  updatePreference('exchangeRate', numRate);
  return true;
};

// 設定分類標籤
export const setClothingLabel = (label) => {
  if (label !== '衣' && label !== '其他') {
    console.error('無效的分類標籤:', label);
    return false;
  }
  updatePreference('clothingLabel', label);
  return true;
};

// 匯率轉換函數（使用使用者自訂匯率）
export const jpyToTwd = (jpy) => {
  const rate = getExchangeRate();
  return Math.round(jpy * rate);
};

export const twdToJpy = (twd) => {
  const rate = getExchangeRate();
  return Math.round(twd / rate);
};

