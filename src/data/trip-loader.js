import { getTripConfig, DEFAULT_TRIP_ID } from '../config/trips';

// 行程資料模組映射
const tripModules = {
  'itinerary': () => import('./itinerary.js'),
  'kyoto-trip': () => import('./kyoto-trip.js'),
  'tokyo-trip': () => import('./tokyo-trip.js'),
  'okinawa-trip': () => import('./okinawa-trip.js')
};

// 行程快取，避免重複載入
const tripCache = new Map();

// 載入行程資料
export const loadTripData = async (tripId) => {
  const tripConfig = getTripConfig(tripId);

  if (!tripConfig) {
    throw new Error(`行程 ${tripId} 不存在`);
  }

  // 檢查快取
  if (tripCache.has(tripId)) {
    console.log(`✅ 從快取載入行程: ${tripConfig.name}`);
    return tripCache.get(tripId);
  }

  try {
    console.log(`🔄 載入行程資料: ${tripConfig.name}`);

    // 使用映射的模組載入
    const loadModule = tripModules[tripConfig.dataFile];
    if (!loadModule) {
      throw new Error(`行程資料模組 ${tripConfig.dataFile} 不存在`);
    }

    const module = await loadModule();
    const itineraryData = module.default || module.initialTripData;

    if (!itineraryData) {
      throw new Error(`行程資料載入失敗`);
    }

    const tripData = {
      config: tripConfig,
      itinerary: itineraryData
    };

    // 存入快取
    tripCache.set(tripId, tripData);

    console.log(`✅ 行程載入成功: ${tripConfig.name}`);
    return tripData;

  } catch (error) {
    console.error(`❌ 載入行程 ${tripId} 失敗:`, error);

    // 如果載入失敗且不是預設行程，嘗試載入預設行程
    if (tripId !== DEFAULT_TRIP_ID) {
      console.log(`🔄 嘗試載入預設行程: ${DEFAULT_TRIP_ID}`);
      return await loadTripData(DEFAULT_TRIP_ID);
    }

    throw error;
  }
};

// 預載行程（可選，用於改善效能）
export const preloadTrip = async (tripId) => {
  try {
    await loadTripData(tripId);
    console.log(`✅ 行程預載完成: ${tripId}`);
  } catch (error) {
    console.warn(`⚠️ 行程預載失敗: ${tripId}`, error);
  }
};

// 清除行程快取（用於開發或強制重新載入）
export const clearTripCache = () => {
  tripCache.clear();
  console.log('🧹 行程快取已清除');
};

// 獲取已載入的行程列表
export const getLoadedTrips = () => {
  return Array.from(tripCache.keys());
};

// 檢查行程是否已載入
export const isTripLoaded = (tripId) => {
  return tripCache.has(tripId);
};

// 獲取行程統計資訊
export const getTripStats = async (tripId) => {
  const tripData = await loadTripData(tripId);
  const { itinerary, config } = tripData;

  const stats = {
    totalItems: 0,
    transportCount: 0,
    foodCount: 0,
    spotCount: 0,
    hotelCount: 0,
    infoCount: 0,
    locations: new Set(),
    dateRange: { start: null, end: null }
  };

  itinerary.forEach(day => {
    if (day.items) {
      stats.totalItems += day.items.length;

      day.items.forEach(item => {
        // 統計類型
        switch (item.type) {
          case 'transport':
            stats.transportCount++;
            break;
          case 'food':
            stats.foodCount++;
            break;
          case 'spot':
            stats.spotCount++;
            break;
          case 'hotel':
            stats.hotelCount++;
            break;
          case 'info':
            stats.infoCount++;
            break;
        }

        // 收集地點資訊
        if (item.location) {
          stats.locations.add(item.location);
        }
      });
    }

    // 日期範圍
    if (day.date) {
      if (!stats.dateRange.start || day.date < stats.dateRange.start) {
        stats.dateRange.start = day.date;
      }
      if (!stats.dateRange.end || day.date > stats.dateRange.end) {
        stats.dateRange.end = day.date;
      }
    }
  });

  stats.locations = Array.from(stats.locations);
  stats.uniqueLocations = stats.locations.length;

  return {
    ...config.stats,
    ...stats,
    calculated: true
  };
};
