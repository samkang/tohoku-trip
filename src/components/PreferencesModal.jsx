import React, { useState, useEffect } from 'react';
import { X, Settings, DollarSign, Tag } from 'lucide-react';
import { getUserPreferences, setExchangeRate, setClothingLabel, DEFAULT_PREFERENCES } from '../utils/userPreferences';

/**
 * 偏好設定 Modal 組件
 * 允許使用者設定匯率和分類標籤
 */
const PreferencesModal = ({ onClose }) => {
  const [exchangeRate, setExchangeRateValue] = useState('');
  const [clothingLabel, setClothingLabelValue] = useState('衣');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 載入現有偏好設定
  useEffect(() => {
    const prefs = getUserPreferences();
    setExchangeRateValue(prefs.exchangeRate?.toFixed(4) || DEFAULT_PREFERENCES.exchangeRate.toFixed(4));
    setClothingLabelValue(prefs.clothingLabel || DEFAULT_PREFERENCES.clothingLabel);
  }, []);

  // 處理匯率變更
  const handleExchangeRateChange = (e) => {
    const value = e.target.value;
    // 允許空值、小數點、數字
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setExchangeRateValue(value);
      setSaveMessage('');
    }
  };

  // 處理分類標籤變更
  const handleClothingLabelChange = (label) => {
    setClothingLabelValue(label);
    setSaveMessage('');
  };

  // 儲存設定
  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');

    // 驗證匯率
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      setSaveMessage('請輸入有效的匯率（必須大於 0）');
      setIsSaving(false);
      return;
    }

    // 儲存匯率
    const rateSaved = setExchangeRate(rate);
    
    // 儲存分類標籤
    const labelSaved = setClothingLabel(clothingLabel);

    if (rateSaved && labelSaved) {
      setSaveMessage('設定已儲存');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setSaveMessage('儲存失敗，請重試');
    }
    
    setIsSaving(false);
  };

  // 重置為預設值
  const handleReset = () => {
    setExchangeRateValue(DEFAULT_PREFERENCES.exchangeRate.toFixed(4));
    setClothingLabelValue(DEFAULT_PREFERENCES.clothingLabel);
    setSaveMessage('');
  };

  // 計算範例轉換
  const exampleJPY = 1000;
  const exampleTWD = Math.round(exampleJPY * parseFloat(exchangeRate || DEFAULT_PREFERENCES.exchangeRate));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-white p-6 border-b border-stone-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-stone-400" />
              <p className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">SETTINGS</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">偏好設定</h2>
          </div>
          <button onClick={onClose} className="bg-stone-100 p-2 rounded-full hover:bg-stone-200 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* 匯率設定 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-stone-400" />
              <h3 className="font-serif font-bold text-stone-800 text-lg">匯率設定</h3>
            </div>
            
            <div className="mb-4">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                日幣對台幣匯率 (1 JPY = ? TWD)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 font-mono">1 JPY =</span>
                <input
                  type="text"
                  value={exchangeRate}
                  onChange={handleExchangeRateChange}
                  className="flex-1 p-3 bg-stone-50 rounded-xl text-stone-800 outline-none focus:ring-2 focus:ring-stone-200 font-mono text-lg"
                  placeholder="0.215"
                />
                <span className="text-stone-600 font-mono">TWD</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                範例：¥{exampleJPY.toLocaleString()} ≈ NT$ {exampleTWD.toLocaleString()}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-500 mb-2">預設匯率：{DEFAULT_PREFERENCES.exchangeRate.toFixed(4)} TWD</p>
              <button
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-stone-600 underline"
              >
                重置為預設值
              </button>
            </div>
          </div>

          {/* 分類標籤設定 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-stone-400" />
              <h3 className="font-serif font-bold text-stone-800 text-lg">分類標籤</h3>
            </div>
            
            <div className="mb-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
                消費分類標籤顯示
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleClothingLabelChange('衣')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    clothingLabel === '衣'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  衣
                </button>
                <button
                  onClick={() => handleClothingLabelChange('其他')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    clothingLabel === '其他'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  其他
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-3">
                選擇「衣」或「其他」作為消費分類的標籤顯示
              </p>
            </div>
          </div>

          {/* 儲存訊息 */}
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-xl text-sm text-center ${
              saveMessage.includes('失敗') 
                ? 'bg-red-50 text-red-600' 
                : 'bg-green-50 text-green-600'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-stone-100 text-stone-700 py-4 rounded-xl font-bold text-lg hover:bg-stone-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '儲存中...' : '儲存設定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;

