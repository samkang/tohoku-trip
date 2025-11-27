import React, { useState, useMemo, useEffect } from 'react';
import { X, Receipt, CreditCard, Calendar as CalendarIcon, Trash2, Edit2, BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { getCategoryLabel, jpyToTwd, getExchangeRate } from '../utils/userPreferences';

const ExpenseListModal = ({ expenses, onClose, onDelete, onEdit }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' 或 'summary'
  const [exchangeRate, setExchangeRate] = useState(getExchangeRate()); // 動態匯率
  const totalSpent = expenses.reduce((acc, cur) => acc + cur.amount, 0);

  // 監聽偏好更新事件
  useEffect(() => {
    const handlePreferencesUpdate = () => {
      setExchangeRate(getExchangeRate());
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('preferencesUpdated', handlePreferencesUpdate);
      return () => {
        window.removeEventListener('preferencesUpdated', handlePreferencesUpdate);
      };
    }
  }, []);

  // 格式化日期函數
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      let date;
      if (dateStr.includes('-')) {
        date = new Date(dateStr);
      } else if (dateStr.includes('/')) {
        date = new Date(dateStr);
      } else {
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

  // 計算統計數據
  const statistics = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalCount: 0,
        totalDays: 0,
        avgPerDay: 0,
        avgPerTransaction: 0,
        maxTransaction: null,
        minTransaction: null,
        dateRange: { start: null, end: null },
        dailyExpenses: [],
        currencyStats: { JPY: 0, TWD: 0 }
      };
    }

    // 日期範圍
    const dates = expenses.map(e => e.date).filter(Boolean).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    
    // 計算總天數
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      var totalDays = diffDays;
    } else {
      var totalDays = 1;
    }

    // 每日花費明細
    const dailyMap = {};
    expenses.forEach(exp => {
      if (!exp.date) return;
      if (!dailyMap[exp.date]) {
        dailyMap[exp.date] = { date: exp.date, total: 0, count: 0 };
      }
      dailyMap[exp.date].total += exp.amount;
      dailyMap[exp.date].count += 1;
    });
    const dailyExpenses = Object.values(dailyMap).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

    // 單筆消費統計
    const amounts = expenses.map(e => e.amount);
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);
    const maxTransaction = expenses.find(e => e.amount === maxAmount);
    const minTransaction = expenses.find(e => e.amount === minAmount);

    // 幣別統計
    const currencyStats = expenses.reduce((acc, exp) => {
      const currency = exp.currency || 'JPY';
      acc[currency] = (acc[currency] || 0) + 1;
      return acc;
    }, { JPY: 0, TWD: 0 });

    // 分類統計
    const categoryStats = expenses.reduce((acc, exp) => {
      const cat = exp.category || 'food';
      if (!acc[cat]) {
        acc[cat] = { count: 0, total: 0 };
      }
      acc[cat].count += 1;
      acc[cat].total += exp.amount;
      return acc;
    }, {});

    return {
      totalCount: expenses.length,
      totalDays: totalDays,
      avgPerDay: totalDays > 0 ? Math.round(totalSpent / totalDays) : 0,
      avgPerTransaction: expenses.length > 0 ? Math.round(totalSpent / expenses.length) : 0,
      maxTransaction,
      minTransaction,
      dateRange: { start: startDate, end: endDate },
      dailyExpenses,
      currencyStats,
      categoryStats
    };
  }, [expenses, totalSpent]);

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
               NT$ {jpyToTwd(totalSpent).toLocaleString()}
             </p>
             <div className="mt-4 pt-4 border-t border-stone-700 flex justify-between items-center">
               <span className="text-xs text-stone-400">日幣總額</span>
               <span className="font-mono text-lg">¥ {totalSpent.toLocaleString()}</span>
             </div>
          </div>
        </div>

        {/* Tab 切換 */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              消費記錄
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'summary'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              摘要報告
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">最新消費記錄</h3>
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-sm">
                尚無消費記錄，點擊右下角「+」新增
              </div>
            ) : (
              expenses.map((ex, idx) => {
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
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-stone-800 text-sm">{ex.desc}</p>
                          <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded font-medium">
                            {getCategoryLabel(ex.category)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3 text-stone-400" />
                          <p className="text-[10px] text-stone-400 font-mono">{formatDate(ex.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="font-mono font-bold text-stone-900 text-sm">¥{ex.amount.toLocaleString()}</span>
                            <span className="font-mono text-xs text-stone-400">/ NT${jpyToTwd(ex.amount).toLocaleString()}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onEdit && onEdit(ex)}
                          className="text-stone-300 hover:text-blue-500 p-2 transition-colors"
                          title="編輯"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(ex.id)}
                          className="text-stone-300 hover:text-red-400 p-2 -mr-2 transition-colors"
                          title="刪除"
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
            </>
          ) : (
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-sm">
                  尚無消費記錄，無法顯示摘要
                </div>
              ) : (
                <>
                  {/* 基本統計 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-4 h-4 text-stone-400" />
                        <p className="text-xs text-stone-400 font-bold uppercase">總天數</p>
                      </div>
                      <p className="text-2xl font-mono font-bold text-stone-900">
                        {statistics.totalDays}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">天</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Receipt className="w-4 h-4 text-stone-400" />
                        <p className="text-xs text-stone-400 font-bold uppercase">總筆數</p>
                      </div>
                      <p className="text-2xl font-mono font-bold text-stone-900">
                        {statistics.totalCount}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">筆</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-stone-400 font-bold uppercase">每日平均</p>
                      </div>
                      <p className="text-xl font-mono font-bold text-stone-900">
                        ¥{statistics.avgPerDay.toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        NT$ {jpyToTwd(statistics.avgPerDay).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <p className="text-xs text-stone-400 font-bold uppercase">單筆平均</p>
                      </div>
                      <p className="text-xl font-mono font-bold text-stone-900">
                        ¥{statistics.avgPerTransaction.toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        NT$ {jpyToTwd(statistics.avgPerTransaction).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 單筆消費統計 */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      單筆消費統計
                    </h4>
                    <div className="space-y-2">
                      {statistics.maxTransaction && (
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-stone-700">最高</span>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-stone-900">
                              ¥{statistics.maxTransaction.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-stone-400 font-mono">
                              NT$ {jpyToTwd(statistics.maxTransaction.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">{statistics.maxTransaction.desc}</p>
                          </div>
                        </div>
                      )}
                      {statistics.minTransaction && (
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-stone-700">最低</span>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-stone-900">
                              ¥{statistics.minTransaction.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-stone-400 font-mono">
                              NT$ {jpyToTwd(statistics.minTransaction.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">{statistics.minTransaction.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 日期範圍 */}
                  {statistics.dateRange.start && statistics.dateRange.end && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                        日期範圍
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">{formatDate(statistics.dateRange.start)}</span>
                        <span className="text-stone-300">→</span>
                        <span className="text-sm text-stone-600">{formatDate(statistics.dateRange.end)}</span>
                      </div>
                    </div>
                  )}

                  {/* 每日花費明細 */}
                  {statistics.dailyExpenses.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                        每日花費明細
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {statistics.dailyExpenses.map((day, idx) => {
                          const maxDaily = Math.max(...statistics.dailyExpenses.map(d => d.total));
                          const barWidth = maxDaily > 0 ? (day.total / maxDaily) * 100 : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-stone-600 font-medium">{formatDate(day.date)}</span>
                                <div className="text-right">
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="font-mono font-bold text-stone-900">
                                      ¥{day.total.toLocaleString()}
                                    </span>
                                    <span className="text-stone-400 font-mono text-[10px]">
                                      / NT${jpyToTwd(day.total).toLocaleString()}
                                    </span>
                                  </div>
                                  <span className="text-stone-400 text-[10px]">({day.count}筆)</span>
                                </div>
                              </div>
                              <div className="w-full bg-stone-100 rounded-full h-2">
                                <div
                                  className="bg-stone-800 h-2 rounded-full transition-all"
                                  style={{ width: `${barWidth}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 分類統計 */}
                  {Object.keys(statistics.categoryStats).length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                        分類統計
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {EXPENSE_CATEGORIES.map((cat) => {
                          const stats = statistics.categoryStats[cat.value] || { count: 0, total: 0 };
                          const percentage = totalSpent > 0 ? Math.round((stats.total / totalSpent) * 100) : 0;
                          // 使用動態標籤（clothing 分類根據偏好顯示）
                          const displayLabel = getCategoryLabel(cat.value);
                          
                          return (
                            <div key={cat.value} className="p-3 bg-stone-50 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-stone-800">{displayLabel}</span>
                                <span className="text-xs text-stone-500">{stats.count}筆</span>
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-mono font-bold text-stone-900 text-base">
                                  ¥{stats.total.toLocaleString()}
                                </p>
                                <p className="text-xs text-stone-400 font-mono">
                                  NT${jpyToTwd(stats.total).toLocaleString()}
                                </p>
                              </div>
                              <div className="mt-2">
                                <div className="w-full bg-stone-200 rounded-full h-1.5">
                                  <div
                                    className="bg-stone-800 h-1.5 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-stone-500 mt-1">{percentage}%</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 幣別統計 */}
                  {(statistics.currencyStats.JPY > 0 || statistics.currencyStats.TWD > 0) && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                        幣別統計
                      </h4>
                      <div className="flex gap-4">
                        {statistics.currencyStats.JPY > 0 && (
                          <div className="flex-1">
                            <p className="text-xs text-stone-500 mb-1">日幣輸入</p>
                            <p className="text-lg font-mono font-bold text-stone-900">
                              {statistics.currencyStats.JPY} 筆
                            </p>
                          </div>
                        )}
                        {statistics.currencyStats.TWD > 0 && (
                          <div className="flex-1">
                            <p className="text-xs text-stone-500 mb-1">台幣輸入</p>
                            <p className="text-lg font-mono font-bold text-stone-900">
                              {statistics.currencyStats.TWD} 筆
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseListModal;

