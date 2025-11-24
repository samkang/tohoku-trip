import React, { useState } from 'react';
import { X } from 'lucide-react';

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

export default ExpenseAddModal;

