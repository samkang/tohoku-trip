import React from 'react';
import { X, Receipt, CreditCard, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

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
              expenses.map((ex, idx) => {
                // 格式化日期顯示
                const formatDate = (dateStr) => {
                  if (!dateStr) return '';
                  try {
                    let date;
                    // 處理不同格式的日期字串
                    if (dateStr.includes('-')) {
                      // ISO 格式或 YYYY-MM-DD
                      date = new Date(dateStr);
                    } else if (dateStr.includes('/')) {
                      // 本地格式如 2025/11/25
                      date = new Date(dateStr);
                    } else {
                      // 嘗試直接解析
                      date = new Date(dateStr);
                    }
                    
                    if (isNaN(date.getTime())) {
                      return dateStr;
                    }
                    
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
                    const weekday = weekdays[date.getDay()];
                    return `${month}/${day} (${weekday})`;
                  } catch {
                    return dateStr;
                  }
                };

                // 檢查是否需要顯示日期標題（與上一筆不同日期時）
                const showDateHeader = idx === 0 || expenses[idx - 1].date !== ex.date;

                return (
                  <div key={ex.id}>
                    {showDateHeader && (
                      <div className="mb-2 mt-4 first:mt-0">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-[1px] bg-stone-200"></div>
                          <span className="text-xs font-bold text-stone-500 px-2">
                            {formatDate(ex.date)}
                          </span>
                          <div className="flex-1 h-[1px] bg-stone-200"></div>
                        </div>
                      </div>
                    )}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex justify-between items-center group">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800 text-sm mb-1">{ex.desc}</p>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3 text-stone-400" />
                          <p className="text-[10px] text-stone-400 font-mono">{formatDate(ex.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span className="font-mono font-bold text-stone-700 whitespace-nowrap">¥{ex.amount.toLocaleString()}</span>
                        <button 
                          onClick={() => onDelete(ex.id)}
                          className="text-stone-300 hover:text-red-400 p-2 -mr-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseListModal;

