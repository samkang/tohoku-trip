import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { EXCHANGE_RATE, TWD_TO_JPY, EXPENSE_CATEGORIES, DEFAULT_CATEGORY } from '../utils/constants';

const ExpenseAddModal = ({ onClose, onSave, expense = null }) => {
  const isEditMode = !!expense;
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('JPY'); // 'JPY' 或 'TWD'
  const [category, setCategory] = useState(DEFAULT_CATEGORY); // 'food', 'clothing', 'accommodation', 'transport'
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 0
  );
  const modalRef = useRef(null);

  // 偵測鍵盤高度（visualViewport API）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        // Fallback: 使用 window.innerHeight
        setViewportHeight(window.innerHeight);
      }
    };

    // 初始設定
    handleResize();

    // 使用 visualViewport 如果可用
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    } else {
      // Fallback: 使用 window resize
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // 輸入框 focus 時自動滾動確保可見
  const handleInputFocus = (e) => {
    setTimeout(() => {
      const input = e.target;
      // 確保輸入框在可見區域
      input.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // 如果 visualViewport 可用，使用它來調整
      if (window.visualViewport && modalRef.current) {
        const modal = modalRef.current;
        const inputRect = input.getBoundingClientRect();
        const viewportHeight = window.visualViewport.height;
        
        // 如果輸入框被鍵盤遮蔽，調整 Modal 位置
        if (inputRect.bottom > viewportHeight) {
          const offset = inputRect.bottom - viewportHeight + 20; // 額外 20px 間距
          modal.style.transform = `translateY(-${offset}px)`;
        }
      }
    }, 300); // 等待鍵盤動畫完成
  };

  // 輸入框 blur 時重置 Modal 位置
  const handleInputBlur = () => {
    if (modalRef.current) {
      modalRef.current.style.transform = '';
    }
  };

  // 初始化表單資料
  useEffect(() => {
    if (expense) {
      // 編輯模式：根據原始幣別轉換回顯示值
      const originalCurrency = expense.currency || 'JPY';
      const amountInDB = expense.amount || 0; // 資料庫中的金額（統一為日幣）
      
      if (originalCurrency === 'TWD') {
        // 原始是台幣，將日幣值轉換回台幣顯示
        const twdAmount = Math.round(amountInDB * EXCHANGE_RATE);
        setAmount(twdAmount.toString());
        setCurrency('TWD');
      } else {
        // 原始是日幣，直接顯示日幣值
        setAmount(amountInDB.toString());
        setCurrency('JPY');
      }
      
      setDesc(expense.desc || '');
      setCategory(expense.category || DEFAULT_CATEGORY); // 載入現有分類，沒有則預設
      
      // 將日期轉換為 YYYY-MM-DD 格式供 input[type="date"] 使用
      if (expense.date) {
        const dateStr = expense.date.includes('-') 
          ? expense.date 
          : expense.date.replace(/\//g, '-');
        setDate(dateStr);
      } else {
        // 如果沒有日期，使用今天
        const today = new Date();
        setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
      }
    } else {
      // 新增模式：使用今天日期，預設日幣和分類
      const today = new Date();
      setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
      setCurrency('JPY');
      setCategory(DEFAULT_CATEGORY);
    }
  }, [expense]);

  const handleSubmit = () => {
    if (!amount) return;
    
    // 統一轉換為日幣儲存
    let amountJPY;
    if (currency === 'TWD') {
      // 台幣轉日幣
      amountJPY = Math.round(parseFloat(amount) * TWD_TO_JPY);
    } else {
      // 日幣直接使用
      amountJPY = parseInt(amount);
    }
    
    const payload = { 
      amount: amountJPY, // 統一儲存為日幣
      currency: currency, // 記錄原始輸入幣別（用於顯示）
      category: category, // 分類
      desc: desc || '一般消費',
      date: date || new Date().toISOString().split('T')[0]
    };
    onSave(payload, isEditMode ? expense.id : null);
    onClose();
  };

  // 計算轉換後的金額（用於顯示）
  const getConvertedAmount = () => {
    if (!amount) return { jpy: 0, twd: 0 };
    const numAmount = parseFloat(amount) || 0;
    if (currency === 'TWD') {
      return {
        jpy: Math.round(numAmount * TWD_TO_JPY),
        twd: numAmount
      };
    } else {
      return {
        jpy: numAmount,
        twd: Math.round(numAmount * EXCHANGE_RATE)
      };
    }
  };

  const converted = getConvertedAmount();

  // 計算 Modal 的最大高度（考慮鍵盤）
  const maxModalHeight = viewportHeight > 0 
    ? `${Math.min(viewportHeight * 0.9, 600)}px` 
    : '90vh';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom-10 transition-transform duration-300"
        style={{
          maxHeight: maxModalHeight,
          paddingBottom: `max(env(safe-area-inset-bottom, 0px), 2.5rem)`,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif font-bold text-xl text-stone-800">{isEditMode ? '編輯款項' : '新增款項'}</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-stone-400" /></button>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            日期
          </label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full mt-2 p-3 bg-stone-50 rounded-xl text-stone-800 outline-none focus:ring-2 focus:ring-stone-200 font-mono"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">金額</label>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {/* 幣別按鈕 */}
              <button
                type="button"
                onClick={() => {
                  // 切換幣別時，轉換金額
                  if (amount) {
                    const numAmount = parseFloat(amount) || 0;
                    if (currency === 'JPY') {
                      // 從日幣切換到台幣
                      setAmount(Math.round(numAmount * EXCHANGE_RATE).toString());
                    } else {
                      // 從台幣切換到日幣
                      setAmount(Math.round(numAmount * TWD_TO_JPY).toString());
                    }
                  }
                  setCurrency(currency === 'JPY' ? 'TWD' : 'JPY');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  currency === 'JPY'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                JPY
              </button>
              <button
                type="button"
                onClick={() => {
                  // 切換幣別時，轉換金額
                  if (amount) {
                    const numAmount = parseFloat(amount) || 0;
                    if (currency === 'JPY') {
                      // 從日幣切換到台幣
                      setAmount(Math.round(numAmount * EXCHANGE_RATE).toString());
                    } else {
                      // 從台幣切換到日幣
                      setAmount(Math.round(numAmount * TWD_TO_JPY).toString());
                    }
                  }
                  setCurrency(currency === 'TWD' ? 'JPY' : 'TWD');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  currency === 'TWD'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                TWD
              </button>
              
              {/* 分類按鈕 */}
              {EXPENSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${
                    category === cat.value
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-baseline mt-2 border-b-2 border-stone-200 pb-2 focus-within:border-stone-800 transition-colors">
            <span className="text-2xl font-serif mr-2 text-stone-400">
              {currency === 'JPY' ? '¥' : 'NT$'}
            </span>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-full text-4xl font-bold text-stone-900 outline-none placeholder-stone-200 bg-transparent font-mono"
              placeholder="0"
            />
          </div>
          <div className="mt-2 text-right text-xs text-stone-400 font-mono">
            {currency === 'JPY' ? (
              <>≈ NT$ {converted.twd.toLocaleString()}</>
            ) : (
              <>≈ ¥ {converted.jpy.toLocaleString()}</>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">項目說明</label>
          <input 
            type="text" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full mt-2 p-3 bg-stone-50 rounded-xl text-stone-800 outline-none focus:ring-2 focus:ring-stone-200"
            placeholder="例如：便利商店、晚餐..."
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
        >
          {isEditMode ? '更新款項' : '儲存至雲端'}
        </button>
      </div>
    </div>
  );
};

export default ExpenseAddModal;

