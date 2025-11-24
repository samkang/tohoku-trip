import React from 'react';
import { 
  X, Navigation, Phone, Globe, FileText, Utensils, Train, ChevronRight 
} from 'lucide-react';

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="h-32 bg-stone-200 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF9F6]/90"></div>
          <div className="text-[120px] font-serif text-stone-300/30 font-bold select-none absolute -bottom-10 -right-4 italic">
            {item.type.toUpperCase()}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/50 p-2 rounded-full backdrop-blur-md hover:bg-white transition-colors z-10">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-stone-800 text-white text-[10px] font-bold tracking-wider rounded uppercase">
                {item.type}
              </span>
              <span className="text-stone-500 text-xs font-mono">{item.time}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight mb-1">
              {item.title}
            </h2>
            {item.subTitle && (
              <p className="text-stone-500 font-medium text-sm">{item.subTitle}</p>
            )}
          </div>

          {/* Transport Route Info */}
          {item.type === 'transport' && item.route && (
            <div className="mb-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Train className="w-4 h-4 text-blue-600" />
                <p className="text-blue-800/60 text-xs font-bold tracking-widest uppercase">交通資訊</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">起點</span>
                  <span className="font-bold text-stone-800">{item.route.from}</span>
                </div>
                <div className="flex items-center justify-center py-1">
                  <ChevronRight className="w-4 h-4 text-stone-400 rotate-90" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">終點</span>
                  <span className="font-bold text-stone-800">{item.route.to}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                  <span className="text-xs text-stone-500">班次</span>
                  <span className="font-mono text-sm text-stone-700">{item.route.trainNo || item.route.busNo}</span>
                </div>
                {item.route.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">時間</span>
                    <span className="text-sm text-stone-700">{item.route.duration}</span>
                  </div>
                )}
                {item.route.cost && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">費用</span>
                    <span className="font-mono text-sm text-stone-700">{item.route.cost}</span>
                  </div>
                )}
              </div>
              <a 
                href={`https://www.google.com/maps/dir/${encodeURIComponent(item.route.from)}/${encodeURIComponent(item.route.to)}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Navigation className="w-4 h-4" />
                查看路線
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-8">
            {item.location && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Navigation className="w-4 h-4" />
                Google 導航
              </a>
            )}
            {item.phone && (
              <a 
                href={`tel:${item.phone}`}
                className="flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4" />
                {item.phone}
              </a>
            )}
            {/* Link Button for Orders/Reservations */}
            {item.link && (
              <a 
                href={item.link}
                target="_blank" rel="noreferrer"
                className={`flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform ${!item.location && !item.phone ? 'col-span-2' : ''}`}
              >
                <Globe className="w-4 h-4" />
                查看訂單資訊
              </a>
            )}
          </div>

          {/* Embedded Google Maps */}
          {item.location && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-stone-100">
              <iframe
                title="map"
                width="100%"
                height="200"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(item.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed&hl=zh-TW`}
                allowFullScreen
              ></iframe>
            </div>
          )}

          {item.reservationNo && (
            <div className="mb-8 bg-amber-50 border border-amber-100 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-amber-100/50">
                <FileText size={100} />
              </div>
              <p className="text-amber-800/60 text-xs font-bold tracking-widest uppercase mb-1">RESERVATION</p>
              <p className="text-amber-900 text-lg font-serif font-bold">{item.title}</p>
              <div className="mt-3 bg-white/80 p-3 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-stone-400 mb-1">Confirmation / Code</p>
                <p className="text-2xl font-mono font-bold text-stone-800 tracking-wider">{item.reservationNo}</p>
              </div>
              <p className="text-xs text-amber-700 mt-2 flex items-center">
                <span className="mr-1">ℹ️</span> {item.link ? '點擊上方按鈕可查看詳細資訊' : 'Check-in 時請出示此畫面'}
              </p>
            </div>
          )}

          {item.menu && (
            <div className="mb-8">
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-4 flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-stone-400" />
                指差確認 / 推薦清單
              </h3>
              <div className="space-y-3">
                {item.menu.map((m, idx) => (
                  <div key={idx} className="bg-white border border-stone-100 p-4 rounded-xl shadow-sm">
                    <p className="text-xl font-bold text-stone-900 mb-1 font-serif">{m.jp}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-stone-500 text-sm">{m.cn}</p>
                      {m.price && <p className="text-stone-800 font-mono text-sm bg-stone-100 px-2 py-0.5 rounded">{m.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.story && (
            <div className="mb-8">
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">關於此處</h3>
              <p className="text-stone-600 leading-loose text-sm text-justify">
                {item.story}
              </p>
            </div>
          )}

          {item.location && (
            <div className="text-xs text-stone-400 text-center font-mono mt-8 border-t border-stone-100 pt-4">
              ADDR: {item.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;

