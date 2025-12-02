import React from 'react';
import { X, Map } from 'lucide-react';

/**
 * 行程導覽圖 Modal
 * - 依照 currentTrip / tripData 動態產生每一天的簡易總覽
 * - 若有設定 coverImage，優先顯示對應行程的導覽圖圖片
 */
const ItineraryMapModal = ({ onClose, currentTrip, tripData }) => {
  // 避免沒有資料時出錯
  const safeTripData = Array.isArray(tripData) ? tripData : [];
  const tripName = currentTrip?.name || '行程導覽圖';
  const tripSubTitle = currentTrip?.destination || '';
  const imageSrc = currentTrip?.coverImage
    ? `/${currentTrip.coverImage}`
    : '/itinerary-map.jpg';

  /**
   * 將每天的 items 萃取成 3~4 個重點摘要
   * 交通 / 景點 / 餐食 / 住宿 優先
   */
  const buildDayHighlights = (day) => {
    if (!day?.items || !Array.isArray(day.items)) return [];

    const priorityOrder = ['transport', 'spot', 'food', 'hotel', 'info'];

    const sorted = [...day.items].sort((a, b) => {
      const ia = priorityOrder.indexOf(a.type);
      const ib = priorityOrder.indexOf(b.type);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    return sorted.slice(0, 4).map((item) => {
      const iconMap = {
        transport: '🚃',
        food: '🍽️',
        spot: '📍',
        hotel: '🏨',
        info: '📝',
      };

      const icon = iconMap[item.type] || '•';
      const time = item.time ? `${item.time} ` : '';
      return {
        id: item.id,
        icon,
        text: `${time}${item.title || ''}`,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        {/* HEADER */}
        <div className="bg-purple-50 border-b border-purple-100 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-purple-600" />
              <p className="text-xs font-bold tracking-[0.2em] text-purple-600 uppercase">
                ITINERARY MAP
              </p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              {tripName}
            </h2>
            {tripSubTitle && (
              <p className="text-xs text-stone-500 mt-1">{tripSubTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 圖片版導覽圖（若有提供） */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200">
            <img
              src={imageSrc}
              alt="行程導覽圖"
              className="w-full h-auto"
              onError={(e) => {
                // 如果圖片不存在，隱藏圖片元素
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* 文字版行程總覽 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 relative overflow-hidden">
            {/* 背景裝飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
              <div className="text-6xl">🍂</div>
            </div>

            <div className="relative z-10 space-y-5">
              {safeTripData.map((day, index) => {
                const highlights = buildDayHighlights(day);
                const dayLabel = day.day || `DAY ${index + 1}`;
                const title =
                  day.date && day.weekday
                    ? `${day.date} (${day.weekday}) ${day.loc || ''}`
                    : day.loc || dayLabel;

                return (
                  <div
                    key={dayLabel + index}
                    className="pb-4 border-b border-stone-200 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                        D{index + 1}
                      </span>
                      <span className="text-sm font-bold text-stone-700">
                        {title}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-600">
                      {highlights.length === 0 ? (
                        <p className="text-stone-400">本日行程詳見下方時間軸。</p>
                      ) : (
                        highlights.map((h) => (
                          <div
                            key={h.id}
                            className="flex items-center gap-2 leading-snug"
                          >
                            <span className="text-base w-5 text-center">
                              {h.icon}
                            </span>
                            <span>{h.text}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}

              {safeTripData.length === 0 && (
                <p className="text-xs text-stone-500">
                  尚未載入行程資料，請稍後再試或重新整理頁面。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryMapModal;

