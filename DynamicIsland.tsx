import React, { useState } from 'react';
import { TrackingStage, WeatherInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Clock, Bell, ArrowRight } from 'lucide-react';

interface DynamicIslandProps {
  currentStage: TrackingStage;
  isDarkMode: boolean;
  etaMinutes: string;
  arrivalTimeStr: string;
  distanceKm: string;
  latestNotification: string;
  driverName: string;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  currentStage,
  isDarkMode,
  etaMinutes,
  arrivalTimeStr,
  distanceKm,
  latestNotification,
  driverName
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if there's no active order or if the order has been delivered
  if (currentStage === TrackingStage.NOT_ORDERED || currentStage === TrackingStage.DELIVERED) return null;

  // Map tracking stage to island text and icon
  const getStageDisplay = () => {
    switch (currentStage) {
      case TrackingStage.PLACED:
        return { text: 'Order Confirmed', emoji: '🟠', color: 'bg-amber-500' };
      case TrackingStage.ACCEPTED:
        return { text: 'Order Accepted', emoji: '🏪', color: 'bg-blue-500' };
      case TrackingStage.PREPARING:
        return { text: 'Chef Preparing Food', emoji: '👨‍🍳', color: 'bg-yellow-500' };
      case TrackingStage.PACKED:
        return { text: 'Food Packed', emoji: '📦', color: 'bg-indigo-500' };
      case TrackingStage.ASSIGNED:
        return { text: 'Delivery Partner Assigned', emoji: '🚴', color: 'bg-teal-500' };
      case TrackingStage.OUT_FOR_DELIVERY:
        return { text: `Rider ${distanceKm} Away`, emoji: '📍', color: 'bg-rose-500 animate-pulse' };
      case TrackingStage.NEARBY:
        return { text: 'Arriving', emoji: '🏡', color: 'bg-purple-500 animate-pulse' };
      case TrackingStage.DELIVERED:
        return { text: 'Delivered', emoji: '✅', color: 'bg-emerald-500' };
      default:
        return { text: 'Locating System...', emoji: '📡', color: 'bg-gray-500' };
    }
  };

  const displayInfo = getStageDisplay();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90%] sm:max-w-md pointer-events-none select-none animate-slide-down-spring">
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`pointer-events-auto cursor-pointer mx-auto overflow-hidden shadow-2xl border flex flex-col items-center justify-center transition-all ${
          isExpanded 
            ? 'w-full rounded-[28px] p-5 bg-black/90 text-white border-white/10 backdrop-blur-xl' 
            : 'w-fit rounded-full px-4.5 py-2.5 bg-black text-white border-white/15 backdrop-blur-md'
        }`}
      >
        {/* Collapsed view */}
        {!isExpanded ? (
          <motion.div 
            layout="position"
            className="flex items-center gap-3 text-xs font-bold font-sans tracking-wide"
          >
            <span className="text-sm shrink-0">{displayInfo.emoji}</span>
            <span className="whitespace-nowrap">{displayInfo.text}</span>
            {currentStage !== TrackingStage.DELIVERED && (
              <>
                <span className="text-[10px] text-gray-500 font-bold">•</span>
                <span className="text-[10.5px] text-amber-400 font-mono font-black shrink-0">{etaMinutes}</span>
              </>
            )}
          </motion.div>
        ) : (
          /* Expanded detail view */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full space-y-4 text-left"
          >
            {/* Header / Stage Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{displayInfo.emoji}</span>
                <div>
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest block">Live Status</span>
                  <h4 className="text-sm font-black tracking-tight">{displayInfo.text}</h4>
                </div>
              </div>
              
              {/* Glowing active indicator */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold text-gray-400">
                <span className={`w-1.5 h-1.5 rounded-full ${displayInfo.color}`} />
                <span>LIVE TRACKER</span>
              </div>
            </div>

            {/* Smart ETA & Distance Box */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[8.5px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>ETA Arrival</span>
                </span>
                <div className="mt-1">
                  <span className="text-base font-black tracking-tight block">{arrivalTimeStr}</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">{etaMinutes} remaining</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[8.5px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Distance</span>
                </span>
                <div className="mt-1">
                  <span className="text-base font-black tracking-tight block">
                    {currentStage === TrackingStage.DELIVERED ? 'Arrived!' : distanceKm}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-bold">Rider Position</span>
                </div>
              </div>
            </div>

            {/* Rider profile banner */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-950 flex items-center justify-center text-[11px] font-bold text-white shadow-md">
                  {driverName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Your Courier</span>
                  <span className="text-xs font-black tracking-tight">{driverName}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-500 font-extrabold font-mono block">⭐ 4.9</span>
                <span className="text-[8px] text-gray-500 uppercase font-black">2.1K Deliveries</span>
              </div>
            </div>

            {/* Latest alert notification bar */}
            {latestNotification && (
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] flex items-start gap-2 text-gray-300">
                <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-extrabold text-white block text-[9.5px] uppercase tracking-wide">Latest Notification</span>
                  <p className="mt-0.5 font-medium">{latestNotification}</p>
                </div>
              </div>
            )}

            <div className="text-center text-[9px] text-gray-500 font-black uppercase tracking-widest pt-1 flex items-center justify-center gap-1.5">
              <span>Click to collapse</span>
              <ArrowRight className="w-3 h-3 rotate-90" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
