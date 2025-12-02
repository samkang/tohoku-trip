import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Navigation, Clock, Camera, Utensils, ChevronRight } from 'lucide-react';
import { getAllTrips } from '../config/trips';

const TripSelector = ({ onTripSelect, currentTripId }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 載入所有可用行程
    const loadTrips = async () => {
      try {
        const availableTrips = getAllTrips();
        setTrips(availableTrips);
        setLoading(false);
      } catch (error) {
        console.error('載入行程列表失敗:', error);
        setLoading(false);
      }
    };

    loadTrips();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-500">載入行程列表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center bg-white border-b border-stone-100">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            選擇您的行程
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            探索精心規劃的日本旅行路線，開始您的美好旅程
          </p>
        </div>
      </div>

      {/* Trip Grid */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-md mx-auto">
          <div className="grid gap-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={currentTripId === trip.id}
                onSelect={() => onTripSelect(trip.id)}
              />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-stone-400 mb-2">💡 提示</p>
            <p className="text-stone-500 text-sm leading-relaxed">
              每個行程都包含詳細的交通、景點、餐廳和住宿資訊，
              並支援費用記錄和資料備份功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TripCard = ({ trip, isSelected, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-blue-500 shadow-lg scale-[1.02]'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
      }`}
    >

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        {!imageError ? (
          <img
            src={`/${trip.coverImage}`}
            alt={trip.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : null}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Destination Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 text-xs font-bold rounded-full text-white"
            style={{ backgroundColor: trip.theme.primaryColor }}
          >
            {trip.destination}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Description */}
        <div className="mb-3">
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
            {trip.name}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {trip.description}
          </p>
        </div>

        {/* Trip Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{trip.startDate} - {trip.endDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{trip.stats.days}天</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MapPin className="w-3 h-3 text-stone-400" />
            </div>
            <div className="text-xs font-bold text-stone-900">{trip.stats.locations}</div>
            <div className="text-xs text-stone-500">地點</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Camera className="w-3 h-3 text-stone-400" />
            </div>
            <div className="text-xs font-bold text-stone-900">{trip.stats.activities}</div>
            <div className="text-xs text-stone-500">活動</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Utensils className="w-3 h-3 text-stone-400" />
            </div>
            <div className="text-xs font-bold text-stone-900">精選</div>
            <div className="text-xs text-stone-500">美食</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Navigation className="w-3 h-3" />
            <span>查看詳情</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${
            isSelected ? 'text-blue-500' : 'text-stone-400'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default TripSelector;
