import React from 'react';
import { 
  MapPin, Train, Utensils, Camera, Hotel, 
  Cloud, Sun, Snowflake, Wind, CloudRain
} from 'lucide-react';

export const WeatherIcon = ({ type, className }) => {
  if (type === 'snow') return <Snowflake className={`text-blue-300 ${className}`} />;
  if (type === 'sun') return <Sun className={`text-amber-400 ${className}`} />;
  if (type === 'rain') return <CloudRain className={`text-blue-400 ${className}`} />;
  if (type === 'wind') return <Wind className={`text-stone-400 ${className}`} />;
  return <Cloud className={`text-stone-400 ${className}`} />;
};

export const CategoryIcon = ({ type }) => {
  const styles = "w-4 h-4";
  if (type === 'food') return <Utensils className={styles} />;
  if (type === 'hotel') return <Hotel className={styles} />;
  if (type === 'spot') return <Camera className={styles} />;
  if (type === 'transport') return <Train className={styles} />;
  return <MapPin className={styles} />;
};

export const getWeatherIcon = (code) => {
  if (code === 0) return { icon: "sun", desc: "晴朗" };
  if (code >= 1 && code <= 3) return { icon: "cloud", desc: "多雲" };
  if (code >= 45 && code <= 48) return { icon: "wind", desc: "起霧" };
  if (code >= 51 && code <= 67) return { icon: "rain", desc: "有雨" };
  if (code >= 71 && code <= 77) return { icon: "snow", desc: "下雪" };
  if (code >= 80 && code <= 82) return { icon: "rain", desc: "陣雨" };
  if (code >= 85 && code <= 86) return { icon: "snow", desc: "暴雪" };
  return { icon: "cloud", desc: "多雲" };
};

