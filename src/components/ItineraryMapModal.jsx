import React from 'react';
import { X, Map } from 'lucide-react';

const ItineraryMapModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-purple-50 border-b border-purple-100 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-bold tracking-[0.2em] text-purple-600 uppercase">ITINERARY MAP</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">行程導覽圖</h2>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* 手繪風格行程導覽圖 - 圖片版本 */}
          <div className="mb-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
            <img 
              src="/itinerary-map.jpg" 
              alt="行程導覽圖"
              className="w-full h-auto"
              onError={(e) => {
                // 如果圖片不存在，隱藏圖片元素
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* 手繪風格行程導覽圖 - 文字版本（備用） */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 relative overflow-hidden">
            {/* 背景裝飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="text-6xl">🍂</div>
            </div>
            
            {/* 標題 */}
            <div className="text-center mb-6 relative z-10">
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1">Sam & Michelle</h3>
              <p className="text-lg font-serif text-stone-600">東北初冬旅 5 日</p>
            </div>

            {/* D1 */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">D1</span>
                <span className="text-sm font-bold text-stone-700">11/25 (二) 仙台初抵</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  <span className="text-stone-600">IT254 桃園 14:35</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">☁️</span>
                  <span className="text-stone-600">仙台空港 18:45</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚃</span>
                  <span className="text-stone-600">空港線 25分 → 仙台站 20:20</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍽️</span>
                  <span className="text-stone-600">牛舌晚餐 20:45</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏨</span>
                  <span className="text-stone-600">宿: 仙台</span>
                </div>
              </div>
            </div>

            {/* D2 */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">D2</span>
                <span className="text-sm font-bold text-stone-700">11/26 (三) 銀山溫泉 大正浪漫</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚃</span>
                  <span className="text-stone-600">JR仙山線+新幹線 11:50</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-stone-600">大石田站 13:58</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚌</span>
                  <span className="text-stone-600">旅館接駁車 14:00 → 銀山溫泉 14:40</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg my-2">
                  <p className="text-xs text-stone-500 mb-1">💡 行李寄放仙台站，輕裝前往</p>
                  <p className="text-xs text-stone-600">📷 藍調時刻 16:30</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏨</span>
                  <span className="text-stone-600">宿: 銀山溫泉</span>
                </div>
              </div>
            </div>

            {/* D3 */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">D3</span>
                <span className="text-sm font-bold text-stone-700">11/27 (四) 溪谷與冷麵</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚌</span>
                  <span className="text-stone-600">旅館接駁車 14:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚄</span>
                  <span className="text-stone-600">東北新幹線 13:30 → 一之關站 14:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚃</span>
                  <span className="text-stone-600">JR大船渡線 → 猊鼻溪站</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🛶</span>
                    <span className="font-bold text-stone-800">猊鼻溪遊船 15:00 (90分鐘)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚄</span>
                  <span className="text-stone-600">東北新幹線 17:45 → 盛岡站 19:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍜</span>
                  <span className="text-stone-600">盛岡冷麵</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏨</span>
                  <span className="text-stone-600">宿: 盛岡</span>
                </div>
              </div>
            </div>

            {/* D4 */}
            <div className="mb-6 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">D4</span>
                <span className="text-sm font-bold text-stone-700">11/28 (五) 盛岡散策 花卷溫泉</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚶</span>
                  <span className="text-stone-600">盛岡市區散策 09:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏛️</span>
                  <span className="text-stone-600">岩手銀行赤煉瓦館</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span className="text-stone-600">光原社</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚄</span>
                  <span className="text-stone-600">東北新幹線 14:30 → 新花卷站 15:10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚌</span>
                  <span className="text-stone-600">免費接駁車 → 花巻温泉鄉 15:40</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">♨️</span>
                    <span className="font-bold text-stone-800">溫泉巡禮</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏨</span>
                  <span className="text-stone-600">宿: 花巻温泉</span>
                </div>
              </div>
            </div>

            {/* D5 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">D5</span>
                <span className="text-sm font-bold text-stone-700">11/29 (六) 童話村歸途</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-50 p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🍄</span>
                    <span className="font-bold text-stone-800">宮澤賢治童話村 11:30</span>
                  </div>
                  <p className="text-xs text-stone-600 ml-7">奇幻森林</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚕</span>
                  <span className="text-stone-600">計程車</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  <span className="text-stone-600">花巻機場 15:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  <span className="text-stone-600">IT259 花巻 17:50 → 桃園 21:10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryMapModal;

