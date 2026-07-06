import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, HelpCircle, Heart, Award, Sparkles, Coffee, Leaf, ChevronRight, MapPin, Plus } from 'lucide-react';
import { SavedAddress } from '../types';

interface HomeTabProps {
  onBrowseMenu: (category?: string) => void;
  isDarkMode: boolean;
  selectedAddress: SavedAddress | null;
  onOpenAddressManager: () => void;
  onAddAddress: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ 
  onBrowseMenu, 
  isDarkMode,
  selectedAddress,
  onOpenAddressManager,
  onAddAddress
}) => {
  
  const features = [
    {
      id: 'f1',
      icon: '👑',
      title: 'Premium Quality',
      subtitle: 'Single-origin specialty coffee beans roasted to gold standard.'
    },
    {
      id: 'f2',
      icon: '🌿',
      title: 'Fresh Ingredients',
      subtitle: 'Artisanal organic snacks prepared fresh upon your order.'
    },
    {
      id: 'f3',
      icon: '⭐',
      title: '4.9 Rated Café',
      subtitle: 'Voted HSR Heights’ top five-star culinary breakfast destination.'
    }
  ];

  const categories = [
    {
      id: 'c1',
      name: 'Coffee',
      subtitle: 'Aromatic & Hand-roasted',
      image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
      filterName: 'Beverage'
    },
    {
      id: 'c2',
      name: 'Sandwiches',
      subtitle: 'Toasted organic sourdough',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600&auto=format&fit=crop',
      filterName: 'Snack'
    },
    {
      id: 'c3',
      name: 'Desserts',
      subtitle: 'Artisanal molten pastries',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
      filterName: 'Dessert'
    },
    {
      id: 'c4',
      name: 'Milkshakes',
      subtitle: 'Creamy double-blended',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop',
      filterName: 'Shake'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 mt-20"
      id="redesigned-home-tab"
    >
      {/* ==========================================
          0. DELIVERY ADDRESS HUD
          ========================================== */}
      <div className="w-full max-w-xl text-left">
        {selectedAddress ? (
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={onOpenAddressManager}
            className={`p-4 rounded-[24px] border cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center justify-between gap-4 ${
              isDarkMode 
                ? 'bg-amber-950/20 hover:bg-amber-950/30 border-white/10 shadow-lg' 
                : 'bg-white/60 hover:bg-white/80 border-[#6F3B16]/15 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3.5 text-left min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#6F3B16]/10 text-[#6F3B16] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 animate-bounce-slow" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block leading-none mb-1">
                  📍 Deliver to
                </span>
                <h4 className="font-sans font-black text-sm tracking-tight truncate text-[#6F3B16]">
                  {selectedAddress.name}
                </h4>
                <p className="text-[11.5px] font-semibold text-gray-400 truncate mt-0.5 max-w-[280px] sm:max-w-md md:max-w-lg">
                  {selectedAddress.houseNumber}, {selectedAddress.street}, {selectedAddress.area}, {selectedAddress.city} – {selectedAddress.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#B86B2B] shrink-0">
              <span>Change</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ y: -2 }}
            onClick={onAddAddress}
            className={`p-4 rounded-[24px] border cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
              isDarkMode 
                ? 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20' 
                : 'bg-white/60 hover:bg-white/80 border-[#6F3B16]/15 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block leading-none mb-1">
                  📍 Delivery Location
                </span>
                <h4 className="font-sans font-black text-sm tracking-tight">
                  Add your delivery address
                </h4>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddAddress();
              }}
              className="w-8 h-8 rounded-full bg-[#6F3B16] hover:bg-[#83461B] text-white flex items-center justify-center cursor-pointer border-none shadow-xs transition-transform active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ==========================================
          1. HERO SECTION (Split Layout)
          ========================================== */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
        {/* Left: Heading & Call to Action */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          {/* Subtle micro badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B86B2B]/10 text-[#B86B2B] border border-[#B86B2B]/10 text-[9.5px] font-black uppercase tracking-widest leading-none">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>The Handcrafted Standard</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] font-sans">
            Fresh Brews.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6F3B16] via-[#944F1D] to-[#B86B2B]">
              Beautiful Bites.
            </span>
          </h1>

          <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Premium single-origin coffee, handcrafted sourdough sandwiches, and delicious molten desserts prepared with love by award-winning pastry chefs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {/* CTA: Browse Menu Button */}
            <button
              onClick={() => onBrowseMenu()}
              className="group relative px-8 py-4.5 rounded-[18px] bg-gradient-to-r from-[#6F3B16] via-[#8c4d20] to-[#B86B2B] text-white font-bold text-xs tracking-wider uppercase shadow-xl hover:shadow-amber-900/35 active:scale-[0.98] transition-all cursor-pointer border-none flex items-center gap-2"
              id="hero-cta-button"
            >
              <span>Browse Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Minor info text */}
            <span className={`text-[10px] font-black uppercase tracking-wider ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              • Delivery in 20 Mins • Free Over ₹249
            </span>
          </div>
        </div>

        {/* Right: Floating stacked premium elements */}
        <div className="lg:col-span-5 relative h-[380px] sm:h-[450px] w-full flex items-center justify-center">
          
          {/* Decorative Glow Blob behind images */}
          <div className="absolute w-72 h-72 rounded-full bg-[#B86B2B]/10 blur-[100px] pointer-events-none animate-float-2" />

          {/* Coffee Cup Floating Frame (Front element) */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-4 sm:left-10 w-48 h-48 sm:w-56 sm:h-56 rounded-[32px] overflow-hidden shadow-2xl z-20 border border-white/20"
          >
            <div className="absolute inset-0 bg-black/10 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop" 
              alt="Artisanal Espresso Cup" 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
            />
            {/* Minimal floating details */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white">
              <span className="text-[9px] font-black uppercase tracking-widest block text-white/70">Single-Origin</span>
              <span className="text-xs font-black">Dark Roast Latte</span>
            </div>
          </motion.div>

          {/* Chocolate Cake Floating Frame (Back stacked element) */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-10 right-4 sm:right-10 w-48 h-48 sm:w-56 sm:h-56 rounded-[32px] overflow-hidden shadow-2xl z-10 border border-white/10"
          >
            <div className="absolute inset-0 bg-black/15 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop" 
              alt="Decadent Chocolate Pastry" 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
            />
            {/* Minimal floating details */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/45 backdrop-blur-md p-3.5 rounded-2xl border border-white/5 text-white">
              <span className="text-[9px] font-black uppercase tracking-widest block text-amber-400">Chef Signature</span>
              <span className="text-xs font-black">Choco Molten Fudge</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ==========================================
          2. FEATURE HIGHLIGHTS (Scroll-in Cards)
          ========================================== */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">Core Commitments</span>
          <h2 className="text-2xl font-black tracking-tight leading-none">Why Dine With Us?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`rounded-[28px] p-6.5 border text-left space-y-3.5 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-950/20 border-white/5 text-white hover:bg-gray-950/30' 
                  : 'bg-white/30 border-white/35 text-gray-950 hover:bg-white/50 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6F3B16]/10 text-[#6F3B16] flex items-center justify-center font-bold text-xl shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1.5">
                <span className="text-sm font-black tracking-tight block">{item.title}</span>
                <p className="text-[11.5px] text-gray-400 font-medium leading-relaxed">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ==========================================
          3. POPULAR CATEGORIES (Horizontal Scroll)
          ========================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">Curated Selections</span>
            <h2 className="text-2xl font-black tracking-tight leading-none">Popular Categories</h2>
          </div>
          <button 
            onClick={() => onBrowseMenu()}
            className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest cursor-pointer group transition-colors ${
              isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-amber-950'
            }`}
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-[#B86B2B]" />
          </button>
        </div>

        {/* Horizontal scrollbar container */}
        <div className="flex gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              onClick={() => onBrowseMenu(cat.filterName)}
              whileHover={{ y: -6 }}
              className={`flex-none w-64 snap-start rounded-[30px] overflow-hidden p-3.5 border transition-all duration-300 cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-950/20 border-white/5 text-white hover:bg-gray-950/30' 
                  : 'bg-white/30 border-white/35 text-gray-950 hover:bg-white/60 hover:shadow-lg'
              }`}
            >
              {/* Image Frame */}
              <div className="relative h-44 rounded-[22px] overflow-hidden mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Text Meta */}
              <div className="px-1 space-y-0.5">
                <h3 className="text-base font-black tracking-tight">{cat.name}</h3>
                <p className="text-[10px] text-[#B86B2B] uppercase font-extrabold tracking-widest">{cat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ==========================================
          4. SPECIAL OFFER CARD (Steam effect banner)
          ========================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[36px] overflow-hidden p-8 sm:p-14 text-center sm:text-left bg-gradient-to-br from-[#2a170a] via-[#4d2b12] to-[#6F3B16] text-white shadow-2xl border border-white/5"
      >
        {/* Steam overlay (subtle animated particles) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
          <div className="absolute bottom-0 left-1/4 w-12 h-44 bg-gradient-to-t from-white/0 via-white/20 to-white/0 rounded-full blur-md animate-float-1" />
          <div className="absolute bottom-0 left-1/2 w-16 h-56 bg-gradient-to-t from-white/0 via-white/25 to-white/0 rounded-full blur-lg animate-float-2" />
          <div className="absolute bottom-0 right-1/4 w-10 h-40 bg-gradient-to-t from-white/0 via-white/20 to-white/0 rounded-full blur-md animate-float-3" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Limited Hour Treats</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Freshly Brewed.<br />
              Perfectly Crafted.
            </h2>
            <p className="text-xs text-amber-100/70 font-medium leading-relaxed max-w-sm">
              Receive a complimentary slice of our signature Choco Fudge cake on any order of handcrafted espresso over ₹199. Available daily.
            </p>
          </div>

          <button
            onClick={() => onBrowseMenu()}
            className="px-8 py-3.5 rounded-full bg-white text-amber-950 font-black text-xs uppercase tracking-wider shadow-xl hover:bg-amber-50 active:scale-95 transition-all cursor-pointer border-none"
          >
            Explore Now
          </button>
        </div>

        {/* Ambient light source inside card */}
        <div className="absolute -right-24 -bottom-24 w-60 h-60 bg-[#B86B2B]/20 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

    </motion.div>
  );
};
