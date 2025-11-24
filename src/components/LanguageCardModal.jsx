import React, { useState } from 'react';
import { X, MessageCircle, Maximize2, ChevronLeft } from 'lucide-react';

const cards = [
  // --- 食 Dining ---
  { category: '用餐', title: '有英文菜單嗎?', jp: '英語のメニューはありますか？', sub: 'English menu?' },
  { category: '用餐', title: '有推薦的嗎?', jp: 'おすすめは何ですか？', sub: 'Recommendation?' },
  { category: '用餐', title: '我不吃牛肉', jp: '牛肉が食べられません', sub: 'No Beef' },
  { category: '用餐', title: '請給我冰水', jp: 'お水をお願いします', sub: 'Water please' },
  { category: '用餐', title: '請去冰', jp: '氷なしでお願いします', sub: 'No ice' },
  { category: '用餐', title: '我要這個', jp: 'これをください', sub: 'This one please' },
  { category: '用餐', title: '結帳', jp: 'お会計をお願いします', sub: 'Check please' },
  { category: '用餐', title: '請給我收據', jp: '領収書をください', sub: 'Receipt please' },

  // --- 衣/購物 Shopping ---
  { category: '購物', title: '多少錢?', jp: 'いくらですか？', sub: 'How much?' },
  { category: '購物', title: '可以刷卡嗎?', jp: 'カードは使えますか？', sub: 'Credit card OK?' },
  { category: '購物', title: '可以免稅嗎?', jp: '免税になりますか？', sub: 'Tax free?' },
  { category: '購物', title: '可以試穿嗎?', jp: '試着してもいいですか？', sub: 'Try on?' },
  { category: '購物', title: '有大一點的尺寸嗎?', jp: '大きいサイズはありますか？', sub: 'Larger size?' },
  
  // --- 住 Hotel ---
  { category: '住宿', title: '可以寄放行李嗎?', jp: '荷物を預かってもらえますか？', sub: 'Luggage storage?' },
  { category: '住宿', title: 'Check-in', jp: 'チェックインをお願いします', sub: 'Check-in please' },
  { category: '住宿', title: 'Wi-Fi 密碼是多少?', jp: 'Wi-Fiのパスワードは何ですか？', sub: 'Wi-Fi password?' },
  { category: '住宿', title: '早餐幾點開始?', jp: '朝食は何時からですか？', sub: 'Breakfast time?' },
  { category: '住宿', title: '想預約貸切溫泉', jp: '貸切風呂を予約したいです', sub: 'Reserve private bath' },
  { category: '住宿', title: '請幫我叫計程車', jp: 'タクシーを呼んでいただけますか？', sub: 'Taxi please' },

  // --- 行 Transport ---
  { category: '交通', title: '請載我去車站', jp: '駅までお願いします', sub: 'To the station' },
  { category: '交通', title: '這班車去仙台嗎?', jp: 'これは仙台行きですか？', sub: 'To Sendai?' },
  { category: '交通', title: '要在哪裡下車?', jp: 'どこで降りればいいですか？', sub: 'Where to get off?' },
  { category: '交通', title: '下一班車幾點?', jp: '次のバス/電車は何時ですか？', sub: 'Next bus/train time?' },
  
  // --- 其他 Others ---
  { category: '其他', title: '廁所在哪裡?', jp: 'トイレはどこですか？', sub: 'Where is toilet?' },
  { category: '其他', title: '可以拍照嗎?', jp: '写真を撮ってもいいですか？', sub: 'Photo OK?' },
  { category: '其他', title: '不好意思', jp: 'すみません', sub: 'Excuse me' },
  { category: '其他', title: '謝謝', jp: 'ありがとうございます', sub: 'Thank you' },
];

const LanguageCardModal = ({ onClose }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [filter, setFilter] = useState('全部');

  const categories = ['全部', '用餐', '購物', '住宿', '交通', '其他'];
  
  const filteredCards = filter === '全部' 
    ? cards 
    : cards.filter(c => c.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 relative">
        
        {/* Full Screen Card Mode */}
        {selectedCard ? (
          <div className="absolute inset-0 z-20 bg-white flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-stone-100">
              <button 
                onClick={() => setSelectedCard(null)}
                className="flex items-center text-stone-500 font-bold text-lg"
              >
                <ChevronLeft className="w-6 h-6 mr-1" />
                返回列表
              </button>
              <button onClick={onClose} className="p-2 bg-stone-100 rounded-full">
                <X className="w-6 h-6 text-stone-400" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="text-stone-400 text-sm font-bold mb-4 px-3 py-1 bg-stone-100 rounded-full">
                {selectedCard.category}
              </span>
              <p className="text-stone-400 text-2xl font-bold mb-8 uppercase tracking-widest">{selectedCard.title}</p>
              <p className="text-4xl sm:text-5xl font-black text-stone-900 leading-tight mb-6 font-serif break-words w-full">
                {selectedCard.jp}
              </p>
              <p className="text-stone-400 text-2xl font-mono">{selectedCard.sub}</p>
            </div>
            <div className="p-8 text-center text-stone-400 text-sm">
              請出示此畫面給對方看
            </div>
          </div>
        ) : (
          /* List Mode */
          <>
            <div className="bg-indigo-50 border-b border-indigo-100 p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                    <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 uppercase">COMMUNICATION</p>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">語言溝通卡</h2>
                </div>
                <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-stone-100 transition-colors">
                  <X className="w-5 h-5 text-stone-600" />
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                      ${filter === cat 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-stone-500 border border-stone-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-3">
                {filteredCards.map((card, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedCard(card)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 text-left flex justify-between items-center group hover:border-indigo-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <p className="font-bold text-stone-800">{card.title}</p>
                      </div>
                      <p className="text-stone-400 text-xs font-mono line-clamp-1">{card.jp}</p>
                    </div>
                    <Maximize2 className="w-4 h-4 text-stone-300 group-hover:text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageCardModal;
