import React, { useState } from 'react';
import { X, Download, Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { getExchangeRate, getCategoryLabel } from '../utils/userPreferences';

const DataBackupModal = ({
  expenses,
  currentTrip,
  onClose,
  onImportSuccess
}) => {
  const [importData, setImportData] = useState('');
  const [importStatus, setImportStatus] = useState(null); // 'success', 'error', 'loading', null
  const [importMessage, setImportMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // 匯出資料
  const exportData = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tripId: currentTrip?.id || 'unknown',
        tripName: currentTrip?.name || '未知行程',
        data: {
          expenses: expenses,
          userPreferences: {
            exchangeRate: getExchangeRate(),
            clothingLabel: getCategoryLabel('clothing')
          },
          appVersion: '1.0.0',
          exportInfo: {
            totalExpenses: expenses.length,
            totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
            dateRange: expenses.length > 0 ? {
              start: expenses.reduce((min, exp) => exp.date < min ? exp.date : min, expenses[0]?.date),
              end: expenses.reduce((max, exp) => exp.date > max ? exp.date : max, expenses[0]?.date)
            } : null
          }
        }
      };

      // 建立下載檔案
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `trip-backup-${currentTrip?.id || 'unknown'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ 資料匯出成功');
    } catch (error) {
      console.error('❌ 資料匯出失敗:', error);
      alert('匯出失敗，請重試');
    } finally {
      setIsExporting(false);
    }
  };

  // 處理檔案上傳
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setImportData(JSON.stringify(data, null, 2));
        validateImportData(data);
      } catch (error) {
        setImportStatus('error');
        setImportMessage('檔案格式錯誤，請確認是有效的JSON檔案');
      }
    };
    reader.readAsText(file);
  };

  // 驗證匯入資料
  const validateImportData = (data) => {
    if (!data.version || !data.data) {
      setImportStatus('error');
      setImportMessage('資料格式不符合預期，缺少必要欄位');
      return;
    }

    if (!data.data.expenses || !Array.isArray(data.data.expenses)) {
      setImportStatus('error');
      setImportMessage('費用資料格式錯誤或不存在');
      return;
    }

    // 檢查費用資料的必要欄位
    const invalidExpenses = data.data.expenses.filter(exp =>
      !exp.amount || !exp.date || !exp.desc
    );

    if (invalidExpenses.length > 0) {
      setImportStatus('error');
      setImportMessage(`發現 ${invalidExpenses.length} 筆無效的費用記錄`);
      return;
    }

    setImportStatus('success');
    setImportMessage(`發現 ${data.data.expenses.length} 筆費用記錄，準備匯入`);
  };

  // 執行匯入
  const executeImport = async () => {
    if (importStatus !== 'success') return;

    setImportStatus('loading');
    try {
      const data = JSON.parse(importData);

      // 呼叫父組件的匯入函數
      await onImportSuccess(data.data);

      setImportStatus('success');
      setImportMessage('資料匯入成功！');

      // 延遲關閉模態框
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('❌ 資料匯入失敗:', error);
      setImportStatus('error');
      setImportMessage('匯入失敗：' + error.message);
    }
  };

  // 從文字區域匯入
  const importFromText = () => {
    try {
      const data = JSON.parse(importData);
      validateImportData(data);
    } catch (error) {
      setImportStatus('error');
      setImportMessage('JSON格式錯誤：' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-stone-800 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold">資料備份</h2>
              <p className="text-stone-300 text-sm mt-1">
                {currentTrip?.name || '當前行程'}
              </p>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* 匯出區塊 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">匯出資料</h3>
            </div>
            <p className="text-blue-700 text-sm mb-4">
              將您的費用記錄和偏好設定匯出為JSON檔案，方便備份或轉移到其他裝置。
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-600">
                <div>費用記錄：{expenses.length} 筆</div>
                <div>匯出時間：{new Date().toLocaleString('zh-TW')}</div>
              </div>
              <button
                onClick={exportData}
                disabled={isExporting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
              >
                {isExporting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? '匯出中...' : '匯出'}
              </button>
            </div>
          </div>

          {/* 匯入區塊 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-900">匯入資料</h3>
            </div>
            <p className="text-green-700 text-sm mb-4">
              從備份檔案匯入資料。注意：匯入將覆蓋現有資料。
            </p>

            {/* 檔案上傳 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700 mb-2">
                選擇備份檔案
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition-colors"
              />
            </div>

            {/* 文字匯入 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700 mb-2">
                或貼上JSON資料
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="貼上從備份檔案複製的JSON內容..."
                className="w-full h-32 p-3 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                style={{ fontFamily: 'monospace' }}
              />
              <button
                onClick={importFromText}
                className="mt-2 text-sm text-green-600 hover:text-green-800 underline transition-colors"
              >
                驗證JSON格式
              </button>
            </div>

            {/* 狀態訊息 */}
            {importStatus && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                importStatus === 'success'
                  ? 'bg-green-100 border border-green-200'
                  : importStatus === 'error'
                  ? 'bg-red-100 border border-red-200'
                  : 'bg-blue-100 border border-blue-200'
              }`}>
                {importStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : importStatus === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                )}
                <span className={`text-sm ${
                  importStatus === 'success'
                    ? 'text-green-700'
                    : importStatus === 'error'
                    ? 'text-red-700'
                    : 'text-blue-700'
                }`}>
                  {importMessage}
                </span>
              </div>
            )}

            {/* 匯入按鈕 */}
            <div className="flex justify-end">
              <button
                onClick={executeImport}
                disabled={importStatus !== 'success'}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  importStatus === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {importStatus === 'loading' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {importStatus === 'loading' ? '匯入中...' : '執行匯入'}
              </button>
            </div>
          </div>

          {/* 警告訊息 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">重要提醒</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• 匯入資料將完全覆蓋現有記錄</li>
                  <li>• 建議在匯入前先匯出目前的資料</li>
                  <li>• 匿名登入的使用者資料可能會遺失</li>
                  <li>• 請妥善保存備份檔案</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackupModal;
