// 匯率常數
// 1 JPY = 0.215 TWD
export const EXCHANGE_RATE = 0.215; // JPY to TWD
export const TWD_TO_JPY = 1 / EXCHANGE_RATE; // TWD to JPY (約 4.651)

// 匯率轉換函數
export const jpyToTwd = (jpy) => Math.round(jpy * EXCHANGE_RATE);
export const twdToJpy = (twd) => Math.round(twd * TWD_TO_JPY);

// 消費分類
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: '食' },
  { value: 'clothing', label: '衣' },
  { value: 'accommodation', label: '住' },
  { value: 'transport', label: '行' }
];

export const DEFAULT_CATEGORY = 'food';

