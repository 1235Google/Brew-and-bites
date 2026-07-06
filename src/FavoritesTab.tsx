import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, BookOpen, Star, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface FavoritesTabProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (item: MenuItem) => void;
  isDarkMode: boolean;
  onBrowseMenu: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onToggleFavorite,
  onAddToCart,
  isDarkMode,
  onBrowseMenu,
}) => {
  // Map favorite IDs to actual menu item objects
  const favoriteItems = MENU_ITEMS.filter((item) => favorites.includes(item.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 mt-20"
      id="favorites-tab-view"
    >
      <div className="text-left space-y-1">
        <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">Your Loved Flavors</span>
        <h1 className="text-3xl font-black tracking-tight leading-none">Your Favorites</h1>
      </div>

      <AnimatePresence mode="popLayout">
        {favoriteItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {favoriteItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                className={`rounded-[30px] p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                  isDarkMode 
                    ? 'bg-gray-950/20 border-white/5 text-white hover:bg-gray-950/30' 
                    : 'bg-white/35 border-white/40 text-gray-950 hover:bg-white/60 hover:shadow-lg'
                }`}
              >
                {/* Heart Toggle Button */}
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer z-20 border-none"
                  title="Remove from Favorites"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#B86B2B] font-black uppercase tracking-widest bg-[#B86B2B]/10 px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] text-indigo-500 font-extrabold uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Header Title & Description */}
                  <div className="flex gap-4">
                    <span className="text-4xl select-none filter drop-shadow-sm leading-none shrink-0">{item.emoji}</span>
                    <div className="space-y-1">
                      <h3 className="text-base font-black tracking-tight">{item.name}</h3>
                      <p className="text-[11.5px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Add to Cart */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-300/15">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">Premium Price</span>
                    <span className="text-base font-black text-[#B86B2B]">₹{item.price}</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] text-white font-bold text-xs tracking-wide shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center py-20 rounded-[36px] border p-10 max-w-xl mx-auto ${
              isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/30 border-white/35 shadow-sm'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-black text-lg tracking-tight">No Favorites Yet</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Browse our handcrafted café menu and tap the heart icon on any selection to catalog your luxury flavor list.
            </p>
            <button
              onClick={onBrowseMenu}
              className="mt-6 px-6 py-3 rounded-xl bg-[#6F3B16] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-950 active:scale-95 transition-all cursor-pointer border-none inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Cafe Menu</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
