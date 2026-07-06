import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Volume2, VolumeX, Sun, Moon, MapPin, Coffee, Star, Award, ShieldCheck, Mail, Phone, ExternalLink, Sparkles, Compass, ShoppingBag, RotateCcw, Check, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data/menu';

interface TopNavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  notifications: Array<{ id: string; text: string; time: string }>;
  onGoToMenuTab: () => void;
  onAddToCart?: (item: any) => void;
  areNotificationsMuted?: boolean;
  onToggleNotifications?: () => void;
}

const MOODS = [
  { id: 'cozy', label: 'Cozy Boost ☕', items: ['m1'], description: 'Premium aromatic dark roast espresso blend' },
  { id: 'sweet', label: 'Sweet Tooth 🍰', items: ['m5', 'm2'], description: 'Decadent chocolate pastries or cream shakes' },
  { id: 'healthy', label: 'Light Bite 🥪', items: ['m4'], description: 'Healthy sourdough sandwiches with fresh pesto' },
  { id: 'chill', label: 'Cool Refresh 🥤', items: ['m3', 'm2'], description: 'Chilled lemonade or double-blended shakes' }
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  isAudioMuted,
  onToggleAudio,
  notifications,
  onGoToMenuTab,
  onAddToCart,
  areNotificationsMuted = true,
  onToggleNotifications,
}) => {
  const [showCraveMatcher, setShowCraveMatcher] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingItemIndex, setRollingItemIndex] = useState(0);
  const [matchedItem, setMatchedItem] = useState<any>(null);
  const [isAdded, setIsAdded] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle slot-machine rolling animation
  const handleSelectMood = (moodId: string, itemIds: string[]) => {
    setSelectedMood(moodId);
    setIsRolling(true);
    setIsAdded(false);
    setMatchedItem(null);

    let count = 0;
    const interval = setInterval(() => {
      setRollingItemIndex((prev) => (prev + 1) % MENU_ITEMS.length);
      count++;
      if (count > 12) {
        clearInterval(interval);
        const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
        const found = MENU_ITEMS.find(m => m.id === randomItemId) || MENU_ITEMS[0];
        setMatchedItem(found);
        setIsRolling(false);
      }
    }, 80);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowCraveMatcher(false);
      }
    };

    if (showCraveMatcher) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCraveMatcher]);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCraveMatcher(false);
      }
    };

    if (showCraveMatcher) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCraveMatcher]);

  return (
    <>
      <nav 
        className="fixed top-4 left-4 right-4 z-40 max-w-7xl mx-auto"
        id="premium-top-navbar"
      >
        <div className={`glass-panel rounded-[24px] px-5 sm:px-8 py-3 flex items-center justify-center transition-all duration-300 shadow-xl ${
          isDarkMode 
            ? 'bg-gray-950/70 border-white/10 text-white shadow-black/20' 
            : 'bg-white/55 border-white/40 text-gray-900 shadow-gray-200/40'
        } backdrop-blur-xl`}>
          
          {/* Center: Brew & Bites Café logo */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6F3B16] to-[#B86B2B] flex items-center justify-center text-white shadow-lg border border-white/10">
              <Coffee className="w-4.5 h-4.5 text-cream-100" />
            </div>
            <span className="font-sans font-black text-sm tracking-tight sm:text-base">
              Brew & <span className="text-[#B86B2B]">Bites</span>
            </span>
          </div>

          <div ref={notificationRef} className="relative flex items-center gap-2">
            {/* Crave Matcher Dropdown Pane */}
            <AnimatePresence>
              {showCraveMatcher && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute right-0 mt-14 w-80 rounded-[28px] p-6 shadow-2xl border z-50 ${
                    isDarkMode 
                      ? 'bg-[#15120F]/95 border-white/10 text-white' 
                      : 'bg-[#FCFAF7]/95 border-amber-900/10 text-[#2C1F15]'
                  } backdrop-blur-2xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#B86B2B] animate-spin-slow" />
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#B86B2B]">Crave Matcher</h4>
                    </div>
                    <button 
                      onClick={() => setShowCraveMatcher(false)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedMood === null ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold leading-tight">Indecisive today?</p>
                        <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Select your current vibe and let our five-star chefs suggest the perfect culinary match for your taste.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {MOODS.map((mood) => (
                          <button
                            key={mood.id}
                            onClick={() => handleSelectMood(mood.id, mood.items)}
                            className={`p-3 text-left rounded-2xl border text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer ${
                              isDarkMode 
                                ? 'bg-white/5 border-white/5 hover:border-amber-500/30 hover:bg-white/10' 
                                : 'bg-white border-amber-900/10 hover:border-amber-700/30 hover:bg-amber-50/50 shadow-sm'
                            }`}
                          >
                            <span className="block text-sm mb-1">{mood.label}</span>
                            <span className={`text-[9px] font-medium leading-none block truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {mood.description}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : isRolling ? (
                    <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-2xl animate-spin">
                        🔮
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-500 block animate-pulse">
                          Curating Selection...
                        </span>
                        <p className="text-xs font-mono font-bold text-gray-400">
                          {MENU_ITEMS[rollingItemIndex]?.emoji} {MENU_ITEMS[rollingItemIndex]?.name}
                        </p>
                      </div>
                    </div>
                  ) : matchedItem ? (
                    <div className="space-y-5 text-center">
                      <div className="space-y-2">
                        <div className="mx-auto w-16 h-16 rounded-[20px] bg-gradient-to-tr from-amber-500/10 to-orange-500/10 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                          {matchedItem.emoji}
                        </div>
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] uppercase font-black bg-amber-500/10 text-amber-600 tracking-wider">
                            Perfect Match
                          </span>
                          <h5 className="font-extrabold text-sm tracking-tight">{matchedItem.name}</h5>
                          <p className={`text-[10px] leading-relaxed max-w-[220px] mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {matchedItem.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 font-mono text-sm font-black text-amber-600">
                        <span>₹{matchedItem.price}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedMood(null);
                            setMatchedItem(null);
                            setIsAdded(false);
                          }}
                          className={`flex-1 py-2.5 rounded-xl border text-[10px] uppercase font-extrabold tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isDarkMode 
                              ? 'border-white/10 hover:bg-white/5 text-gray-300' 
                              : 'border-amber-900/10 hover:bg-black/5 text-gray-600'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Re-Roll</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onAddToCart) {
                              onAddToCart(matchedItem);
                              setIsAdded(true);
                            }
                          }}
                          disabled={isAdded}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white ${
                            isAdded
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] hover:opacity-95 shadow-md'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                          <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </nav>

      {/* Side Slide-out Drawer */}
      <AnimatePresence>
        {showSideDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSideDrawer(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm cursor-pointer"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className={`fixed top-0 left-0 bottom-0 w-full max-w-sm z-50 p-6 flex flex-col justify-between shadow-2xl ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-[#0c0f17] to-[#121824] text-white border-r border-white/5' 
                  : 'bg-gradient-to-b from-[#FCFAF7] to-[#F3EDE2] text-gray-950 border-r border-amber-900/10'
              }`}
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#6F3B16] flex items-center justify-center text-white">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <span className="font-sans font-black text-sm tracking-tight">
                      Brew & <span className="text-[#B86B2B]">Bites</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSideDrawer(false)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isDarkMode ? 'border-white/10 hover:bg-white/10 text-gray-400' : 'border-gray-300 hover:bg-black/5 text-gray-600'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-wider block">Est. 2026</span>
                    <h3 className="text-lg font-black tracking-tight leading-tight">
                      The Handcrafted Culinary Standard.
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Experience café dining reimagined. We hand-roast single-origin coffee beans and prepare artisanal fresh snacks with unmatched culinary devotion.
                    </p>
                  </div>

                  {/* Accolades */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">5-Star Gold Standard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">Sourced from Sustainable Farms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">HSR Layout Premium Delivery</span>
                    </div>
                  </div>

                  {/* Settings quick toggles */}
                  <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mb-3">Quick Preferences</span>
                    <div className="space-y-3">
                      {/* Dark Mode toggle */}
                      <button
                        onClick={onToggleDarkMode}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 text-yellow-400' 
                            : 'bg-black/5 border-black/5 hover:bg-black/10 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          <span>{isDarkMode ? 'Light Aesthetic' : 'Dark Aesthetic'}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Switch</span>
                      </button>

                      {/* Sound Toggle */}
                      <button
                        onClick={onToggleAudio}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isAudioMuted 
                            ? 'border-white/10 text-gray-400 bg-white/5 hover:bg-white/10' 
                            : 'border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/15'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          <span>{isAudioMuted ? 'Muted Audio' : 'Acoustics Active'}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Toggle</span>
                      </button>

                      {/* Notification Toast Toggle */}
                      <button
                        onClick={onToggleNotifications}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          areNotificationsMuted 
                            ? 'border-white/10 text-gray-400 bg-white/5 hover:bg-white/10' 
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {areNotificationsMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                          <span>{areNotificationsMuted ? 'Popups Muted' : 'Popups Active'}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Toggle</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 pt-6 border-t border-dashed border-gray-300/40">
                <button
                  onClick={() => {
                    setShowSideDrawer(false);
                    onGoToMenuTab();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 transition-all"
                >
                  <span>Explore Fresh Menu</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> hello@brewbites.cafe</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91 9999-8888</span>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
