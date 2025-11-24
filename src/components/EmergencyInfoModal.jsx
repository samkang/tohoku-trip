import React from 'react';
import { X, AlertCircle, Phone, Info, Globe } from 'lucide-react';

const EmergencyInfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-red-50 border-b border-red-100 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase">緊急連絡</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">重要資訊</h2>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* 急難救助 */}
          <div className="mb-8">
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              台灣人旅日急難救助聯絡資訊
            </h3>
            <p className="text-stone-600 text-sm mb-4 leading-relaxed">
              如果在日本旅遊期間發生護照遺失、重大疾病、交通事故、天災等緊急情況，請聯繫以下單位。
            </p>

            <div className="space-y-4">
              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">日本全國緊急聯絡電話 (24小時)</p>
                <div className="space-y-2">
                  <a href="tel:080-1009-7179" className="flex items-center gap-2 text-stone-800 font-mono text-lg">
                    <Phone className="w-4 h-4 text-stone-400" />
                    080-1009-7179
                  </a>
                  <a href="tel:080-1009-7436" className="flex items-center gap-2 text-stone-800 font-mono text-lg">
                    <Phone className="w-4 h-4 text-stone-400" />
                    080-1009-7436
                  </a>
                  <p className="text-xs text-stone-500 mt-2">(從日本國內撥打方式，請直接撥打上述號碼)</p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">台北駐日經濟文化代表處 (東京)</p>
                <p className="text-xs text-stone-500 mb-2">您這次旅遊的地區 (宮城縣、山形縣、岩手縣) 皆屬於東京代表處的轄區</p>
                <div className="space-y-1 text-sm">
                  <p className="text-stone-600">地址：東京都港区白金台 5-20-2</p>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">一般辦公：</span>
                    <a href="tel:03-3280-7811" className="font-mono text-stone-800">(03) 3280-7811</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">緊急聯絡：</span>
                    <a href="tel:080-1009-7179" className="font-mono text-stone-800">080-1009-7179</a>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">(下班時間/假日)</p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">外交部旅外國人急難救助服務專線</p>
                <div className="space-y-1">
                  <a href="tel:+886-800-085-095" className="flex items-center gap-2 text-stone-800 font-mono">
                    <Phone className="w-4 h-4 text-stone-400" />
                    +886-800-085-095
                  </a>
                  <p className="text-xs text-stone-500">(國際免付費)</p>
                  <a href="tel:+886-3-398-2629" className="flex items-center gap-2 text-stone-800 font-mono mt-2">
                    <Phone className="w-4 h-4 text-stone-400" />
                    +886-3-398-2629
                  </a>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">日本當地報案電話</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-stone-500 mb-1">警察局</p>
                    <a href="tel:110" className="text-2xl font-mono font-bold text-red-600">110</a>
                    <p className="text-xs text-stone-500 mt-1">報案、事故</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-stone-500 mb-1">消防局</p>
                    <a href="tel:119" className="text-2xl font-mono font-bold text-red-600">119</a>
                    <p className="text-xs text-stone-500 mt-1">火警、救護車</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Japan Web */}
          <div className="mb-6">
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Visit Japan Web (VJW)
            </h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                持台灣護照赴日本短期觀光，強烈建議出發前利用 「Visit Japan Web (VJW)」 線上服務預先填寫資料，以加速通關。
              </p>
              <a 
                href="https://www.vjw.digital.go.jp/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition-transform mb-3"
              >
                <Globe className="w-4 h-4" />
                前往 VJW 官方網站
              </a>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-stone-700">事前準備 (建議出發前 1-2 週完成)：</p>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 ml-2">
                  <li>註冊帳號並登錄護照資料</li>
                  <li>登記本次行程 (抵達日 2025/11/25、航班 IT254、第一晚仙台住宿地址)</li>
                  <li>完成「入境審查」與「海關申報」資料填寫</li>
                  <li>取得並保存兩個 QR Code：黃色 (入境審查用)、藍色 (海關申報用)</li>
                </ol>
                <p className="font-bold text-stone-700 mt-4">抵達時使用：</p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 ml-2">
                  <li>在入境審查櫃檯出示黃色 QR Code</li>
                  <li>領完行李後在海關檢查處出示藍色 QR Code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyInfoModal;

