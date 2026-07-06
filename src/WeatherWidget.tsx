import React from 'react';
import { Sun, CloudSun, CloudRain, CloudLightning, Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';
import { WeatherInfo } from '../types';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  isDarkMode: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isDarkMode }) => {
  const renderIcon = () => {
    switch (weather.condition) {
      case 'SUNNY':
        return <Sun className="w-8 h-8 text-amber-500 animate-[spin_20s_linear_infinite]" />;
      case 'CLOUDY':
        return <CloudSun className="w-8 h-8 text-blue-400 animate-pulse" />;
      case 'RAINY':
        return <CloudRain className="w-8 h-8 text-indigo-400 animate-bounce" />;
      case 'STORMY':
        return <CloudLightning className="w-8 h-8 text-purple-400 animate-pulse" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className={`glass-panel rounded-[24px] p-4.5 border text-left flex items-center justify-between gap-4 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
    }`}>
      <div className="flex items-center gap-3.5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          isDarkMode ? 'bg-white/5' : 'bg-black/5'
        }`}>
          {renderIcon()}
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 block">Weather Status</span>
          <h4 className="text-sm font-black tracking-tight">{weather.label} • {weather.temp}°C</h4>
          
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-semibold">
            {weather.delayMinutes > 0 ? (
              <span className="text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Delayed by {weather.delayMinutes} mins
              </span>
            ) : weather.delayMinutes < 0 ? (
              <span className="text-emerald-500 font-bold">
                Arriving {Math.abs(weather.delayMinutes)} mins early!
              </span>
            ) : (
              <span className="text-gray-400">Perfect shipping conditions</span>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-gray-400 text-[10.5px] font-bold uppercase tracking-wider pl-4 border-l border-white/10">
        <div className="flex flex-col items-center">
          <Thermometer className="w-4 h-4 text-orange-400 mb-0.5" />
          <span>{weather.temp}°C</span>
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="w-4 h-4 text-blue-400 mb-0.5" />
          <span>{weather.humidity}% HR</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
