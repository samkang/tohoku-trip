// 行程配置檔案
export const AVAILABLE_TRIPS = {
  'tohoku-winter': {
    id: 'tohoku-winter',
    name: '東北初冬之旅',
    shortName: '東北之旅',
    description: '2025 日本東北 5 天 4 夜行程助手',
    startDate: '2025-11-25',
    endDate: '2025-11-29',
    destination: '日本東北',
    theme: {
      primaryColor: '#2563eb',
      backgroundColor: '#FAF9F6'
    },
    dataFile: 'itinerary', // 檔案名稱（不含副檔名）
    coverImage: 'itinerary-map.jpg',
    stats: {
      days: 5,
      locations: 4,
      activities: 12
    },
    // 向後相容性：東北行程繼續使用舊的 'expenses' collection
    legacyCollection: true
  },

  'kyoto-autumn': {
    id: 'kyoto-autumn',
    name: '京都楓葉之旅',
    shortName: '京都之旅',
    description: '2025 京都賞楓 4 天 3 夜行程助手',
    startDate: '2025-11-15',
    endDate: '2025-11-18',
    destination: '日本京都',
    theme: {
      primaryColor: '#dc2626',
      backgroundColor: '#FEF7F7'
    },
    dataFile: 'kyoto-trip', // 檔案名稱（不含副檔名）
    coverImage: 'kyoto-autumn.jpg',
    stats: {
      days: 4,
      locations: 5,
      activities: 10
    }
  },

  'tokyo-summer': {
    id: 'tokyo-summer',
    name: '東京夏日探索',
    shortName: '東京之旅',
    description: '2025 東京夏季 5 天 4 夜行程助手',
    startDate: '2025-07-15',
    endDate: '2025-07-19',
    destination: '日本東京',
    theme: {
      primaryColor: '#059669',
      backgroundColor: '#F0FDF4'
    },
    dataFile: 'tokyo-trip', // 檔案名稱（不含副檔名）
    coverImage: 'tokyo-summer.jpg',
    stats: {
      days: 5,
      locations: 6,
      activities: 15
    }
  },

  'okinawa-beach': {
    id: 'okinawa-beach',
    name: '沖繩海島假期',
    shortName: '沖繩之旅',
    description: '2025 沖繩海島 6 天 5 夜行程助手',
    startDate: '2025-08-01',
    endDate: '2025-08-06',
    destination: '日本沖繩',
    theme: {
      primaryColor: '#0891b2',
      backgroundColor: '#F0F9FF'
    },
    dataFile: 'okinawa-trip', // 檔案名稱（不含副檔名）
    coverImage: 'okinawa-beach.jpg',
    stats: {
      days: 6,
      locations: 4,
      activities: 8
    }
  }
};

// 預設行程
export const DEFAULT_TRIP_ID = 'tohoku-winter';

// 獲取行程配置
export const getTripConfig = (tripId) => {
  return AVAILABLE_TRIPS[tripId] || AVAILABLE_TRIPS[DEFAULT_TRIP_ID];
};

// 獲取所有可用行程
export const getAllTrips = () => {
  return Object.values(AVAILABLE_TRIPS);
};

// 檢查行程是否存在
export const isValidTrip = (tripId) => {
  return tripId in AVAILABLE_TRIPS;
};
