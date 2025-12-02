import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const DataReminder = ({ expenses, onBackupClick }) => {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // 檢查是否需要顯示提醒
    const checkReminder = () => {
      const lastReminder = localStorage.getItem('lastBackupReminder');
      const now = Date.now();

      // 如果有5筆以上費用記錄，且上次提醒是7天前或沒有提醒過
      const shouldShow = expenses.length >= 5 && (!lastReminder || now - parseInt(lastReminder) > 7 * 24 * 60 * 60 * 1000);

      setShowReminder(shouldShow);
    };

    checkReminder();

    // 當費用記錄變化時重新檢查
    const handleExpensesChange = () => checkReminder();
    window.addEventListener('expensesUpdated', handleExpensesChange);

    return () => {
      window.removeEventListener('expensesUpdated', handleExpensesChange);
    };
  }, [expenses.length]);

  const dismissReminder = () => {
    setShowReminder(false);
    localStorage.setItem('lastBackupReminder', Date.now().toString());
  };

  const handleBackupClick = () => {
    dismissReminder();
    onBackupClick();
  };

  if (!showReminder) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-lg z-40 max-w-md mx-auto animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-bold text-amber-900 mb-1">資料備份提醒</h4>
          <p className="text-amber-700 text-sm mb-3">
            您已經記錄了 <span className="font-bold">{expenses.length}</span> 筆費用。
            為了避免資料遺失，建議定期備份您的資料。
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleBackupClick}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              立即備份
            </button>
            <button
              onClick={dismissReminder}
              className="text-amber-600 px-4 py-2 text-sm hover:text-amber-800 transition-colors"
            >
              稍後提醒
            </button>
          </div>
        </div>
        <button
          onClick={dismissReminder}
          className="text-amber-400 hover:text-amber-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DataReminder;
