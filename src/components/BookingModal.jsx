import React from 'react';
import { X, Plane, Hotel, FileText, Copy, Check } from 'lucide-react';

const BookingModal = ({ tripData, onClose }) => {
  // 自動從行程資料中提取訂單資訊
  const bookings = [];

  tripData.forEach(day => {
    day.items.forEach(item => {
      // 1. 航班
      if (item.flightNo || item.title.includes('起飛')) {
        bookings.push({
          type: 'flight',
          date: day.date,
          title: item.title,
          sub: item.flightNo || item.desc,
          code: item.flightNo
        });
      }
      // 2. 住宿
      else if (item.type === 'hotel' && item.title !== 'Check-out') {
        bookings.push({
          type: 'hotel',
          date: day.date,
          title: item.title,
          sub: item.location,
          code: item.reservationNo,
          phone: item.phone
        });
      }
      // 3. 其他預約 (有 reservationNo 的)
      else if (item.reservationNo) {
        bookings.push({
          type: 'other',
          date: day.date,
          title: item.title,
          sub: item.subTitle || item.desc,
          code: item.reservationNo,
          link: item.link
        });
      }
    });
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // 這裡可以加個簡單的 toast 提示，但為了簡化先省略
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
        
        <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">RESERVATIONS</p>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">訂單彙整</h2>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Flights */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">航班資訊</h3>
            <div className="space-y-3">
              {bookings.filter(b => b.type === 'flight').map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-full text-blue-600">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-400 font-mono mb-0.5">{item.date}</p>
                    <p className="font-bold text-stone-800 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-stone-500 truncate">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">住宿預約</h3>
            <div className="space-y-3">
              {bookings.filter(b => b.type === 'hotel').map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="bg-amber-50 p-2.5 rounded-full text-amber-600">
                      <Hotel className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-400 font-mono mb-0.5">{item.date}</p>
                      <p className="font-bold text-stone-800 text-sm leading-tight mb-1">{item.title}</p>
                      <p className="text-xs text-stone-500 line-clamp-2">{item.sub}</p>
                    </div>
                  </div>
                  {item.code && (
                    <div className="bg-stone-50 rounded-lg p-2 flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="text-[10px] text-stone-400 uppercase">Reservation No.</p>
                        <p className="font-mono font-bold text-stone-700 text-sm truncate">{item.code}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(item.code)}
                        className="p-1.5 hover:bg-stone-200 rounded text-stone-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Others */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">交通與其他</h3>
            <div className="space-y-3">
              {bookings.filter(b => b.type === 'other').map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                  <div className="flex-1 min-w-0 mb-3">
                    <p className="text-xs text-stone-400 font-mono mb-0.5">{item.date}</p>
                    <p className="font-bold text-stone-800 text-sm">{item.title}</p>
                    <p className="text-xs text-stone-500 truncate">{item.sub}</p>
                  </div>
                  {item.code && (
                    <div className="bg-stone-50 rounded-lg p-2 flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="text-[10px] text-stone-400 uppercase">Booking Code</p>
                        <p className="font-mono font-bold text-stone-700 text-sm truncate">{item.code}</p>
                      </div>
                      {item.link ? (
                         <a href={item.link} target="_blank" rel="noreferrer" className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
                           開啟
                         </a>
                      ) : (
                        <button 
                          onClick={() => copyToClipboard(item.code)}
                          className="p-1.5 hover:bg-stone-200 rounded text-stone-400 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingModal;
