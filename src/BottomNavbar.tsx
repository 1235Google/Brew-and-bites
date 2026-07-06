import React from 'react';
import { Home, BookOpen, Receipt, Heart, User, History } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavbarProps {
  activeTab: string;
  onTabChange: (tab: 'HOME' | 'MENU' | 'ORDERS' | 'FAVORITES' | 'PROFILE' | 'HISTORY') => void;
  isDarkMode: boolean;
  cartCount: number;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
  cartCount,
}) => {
  const tabs: Array<{
    id: 'HOME' | 'MENU' | 'ORDERS' | 'FAVORITES' | 'PROFILE' | 'HISTORY';
    label: string;
    icon: any;
    badge?: number;
  }> = [
    { id: 'HOME', label: 'Home', icon: Home },
    { id: 'MENU', label: 'Menu', icon: BookOpen },
    { id: 'ORDERS', label: 'Orders', icon: Receipt, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'HISTORY', label: 'History', icon: History },
    { id: 'FAVORITES', label: 'Favorites', icon: Heart },
    { id: 'PROFILE', label: 'Profile', icon: User },
  ];

  return (
    <div 
      className="fixed bottom-6 inset-x-4 z-40 max-w-lg mx-auto"
      id="premium-bottom-navbar"
    >
      <div className={`glass-panel rounded-[28px] p-2 flex items-center justify-between shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-950/75 border-white/10 shadow-black/45' 
          : 'bg-white/65 border-white/50 shadow-amber-900/10'
      } backdrop-blur-2xl`}>
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-3.5 px-1 rounded-[20px] transition-all duration-300 focus:outline-none cursor-pointer group"
              id={`nav-tab-${tab.id.toLowerCase()}`}
            >
              {/* Highlight Background on Active */}
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-[20px] bg-gradient-to-tr from-[#6F3B16] via-[#8c4d20] to-[#B86B2B] shadow-lg shadow-amber-900/25 border border-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon & Label container */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1 transition-transform group-active:scale-95 duration-150">
                <div className="relative">
                  <IconComponent 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive 
                        ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]' 
                        : isDarkMode 
                          ? 'text-gray-400 group-hover:text-gray-200' 
                          : 'text-gray-500 group-hover:text-amber-950'
                    }`} 
                  />

                  {/* Redesigning Badges on Tabs */}
                  {tab.badge !== undefined && !isActive && (
                    <span className="absolute -top-1.5 -right-2 bg-[#B86B2B] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white scale-90 animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span 
                  className={`text-[10px] font-black tracking-tight leading-none uppercase transition-all duration-300 ${
                    isActive 
                      ? 'text-white font-extrabold tracking-widest' 
                      : isDarkMode 
                        ? 'text-gray-500 group-hover:text-gray-300' 
                        : 'text-gray-400 group-hover:text-amber-950/80'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
};
