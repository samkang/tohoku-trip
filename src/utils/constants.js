// 匯率常數（預設值）
// 1 JPY = 0.215 TWD
export const DEFAULT_EXCHANGE_RATE = 0.215; // JPY to TWD（預設值）
export const DEFAULT_TWD_TO_JPY = 1 / DEFAULT_EXCHANGE_RATE; // TWD to JPY（預設值，約 4.651）

// 注意：實際使用的匯率轉換函數請使用 userPreferences.js 中的函數
// 這些常數僅作為預設值使用

// 消費分類
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: '食' },
  { value: 'clothing', label: '衣' },
  { value: 'accommodation', label: '住' },
  { value: 'transport', label: '行' }
];

export const DEFAULT_CATEGORY = 'food';

