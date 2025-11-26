import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { EXCHANGE_RATE, TWD_TO_JPY } from '../utils/constants';

const ExpenseAddModal = ({ onClose, onSave, expense = null }) => {
  const isEditMode = !!expense;
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('JPY'); // 'JPY' 或 'TWD'

  // 初始化表單資料
  useEffect(() => {
    if (expense) {
      // 編輯模式：資料庫中的金額是日幣，預設顯示為日幣
      setAmount(expense.amount?.toString() || '');
      setDesc(expense.desc || '');
      setCurrency(expense.currency || 'JPY'); // 如果有記錄原始幣別，使用它；否則預設日幣
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
      // 新增模式：使用今天日期，預設日幣
      const today = new Date();
      setDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
      setCurrency('JPY');
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom-10">
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
            className="w-full mt-2 p-3 bg-stone-50 rounded-xl text-stone-800 outline-none focus:ring-2 focus:ring-stone-200 font-mono"
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">金額</label>
            <div className="flex gap-2">
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
              className="w-full text-4xl font-bold text-stone-900 outline-none placeholder-stone-200 bg-transparent font-mono"
              placeholder="0"
              autoFocus
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

