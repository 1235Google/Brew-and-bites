import React from 'react';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
  isDarkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  quantity,
  onAdd,
  onRemove,
  isDarkMode,
  isFavorite,
  onToggleFavorite
}) => {
  // Generate stable details
  const rating = item.id === 'm1' ? '4.9' : item.id === 'm2' ? '4.8' : item.id === 'm3' ? '4.5' : item.id === 'm4' ? '4.7' : '4.9';
  const calories = item.id === 'm1' ? '45 kcal' : item.id === 'm2' ? '280 kcal' : item.id === 'm3' ? '90 kcal' : item.id === 'm4' ? '190 kcal' : '310 kcal';

  // Soft reflections & custom glow hover classes
  const glowClass = item.id === 'm1' || item.id === 'm5' 
    ? 'glass-glow-lavender' 
    : item.id === 'm3' 
      ? 'glass-glow-cyan' 
      : 'glass-glow-blue';

  return (
    <div 
      className={`glass-panel rounded-[32px] p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] group glass-reflect ${glowClass} ${
        isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
      }`}
      id={`menu-card-${item.id}`}
    >
      <div>
        {/* Floating Accent Background Glow Bubble */}
        <div className="relative h-48 rounded-[24px] bg-gradient-to-tr from-white/20 to-white/45 flex items-center justify-center overflow-hidden mb-5 border border-white/20 shadow-inner">
          {/* Animated decorative visual mesh blobs */}
          <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-indigo-500/10 blur-xl group-hover:scale-135 transition-transform duration-700"></div>
          <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-pink-500/10 blur-xl group-hover:scale-135 transition-transform duration-700"></div>
          
          {/* Premium tag */}
          <span className={`absolute top-4 left-4 px-3.5 py-1.5 backdrop-blur-xl rounded-full text-[9px] font-bold uppercase tracking-widest border ${
            isDarkMode 
              ? 'bg-white/10 border-white/10 text-gray-200' 
              : 'bg-white/80 border-white/60 text-gray-800'
          }`}>
            Organic Recipe
          </span>

          {/* Luxury Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-xl border cursor-pointer transition-all z-20 ${
              isFavorite 
                ? 'bg-rose-500/25 border-rose-500/35 text-rose-500 scale-105' 
                : isDarkMode 
                  ? 'bg-white/10 border-white/10 text-gray-300 hover:text-rose-400 hover:bg-white/20' 
                  : 'bg-white/90 border-white/50 text-gray-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Large High-Res Emoji Food Illustration */}
          <span className="text-7xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 select-none filter drop-shadow-md">
            {item.emoji}
          </span>

          {/* Quick info overlay */}
          <div className={`absolute bottom-4 right-4 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 border ${
            isDarkMode 
              ? 'bg-black/40 border-white/10 text-white' 
              : 'bg-white/95 border-white/20 text-gray-800'
          }`}>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{rating}</span>
            <span className="text-gray-300">|</span>
            <span>{calories}</span>
          </div>
        </div>

        {/* Item Content Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className={`font-bold text-lg tracking-tight transition-colors ${
            isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
          }`}>
            {item.name}
          </h3>
          <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-bold shrink-0 uppercase tracking-wider ${
            isDarkMode ? 'bg-white/5 text-indigo-300' : 'bg-black/5 text-indigo-600'
          }`}>
            {item.category}
          </span>
        </div>

        <p className={`text-xs leading-relaxed mb-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-500'
        }`}>
          {item.description}
        </p>
      </div>

      {/* Pricing + Add Actions */}
      <div className={`flex items-center justify-between pt-4.5 border-t ${
        isDarkMode ? 'border-white/10' : 'border-black/5'
      }`}>
        <div>
          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Price Value</span>
          <span className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-950'}`}>
            ₹{item.price}
          </span>
        </div>

        {/* Dynamic premium glass Add Button */}
        <div className="relative">
          {quantity === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className={`px-6 py-2.5 rounded-xl border font-bold text-xs shadow-xs hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                isDarkMode 
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white' 
                  : 'border-indigo-100 bg-indigo-50/40 text-indigo-600 hover:bg-indigo-600 hover:text-white'
              }`}
              id={`add-btn-${item.id}`}
            >
              <span>Add to Cart</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div 
              className={`flex items-center justify-between font-bold rounded-xl shadow-md border overflow-hidden transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-indigo-600 border-indigo-700 text-white' 
                  : 'bg-indigo-600 border-indigo-600 text-white'
              }`}
              id={`qty-selector-${item.id}`}
            >
              <button
                onClick={() => onRemove(item)}
                className="px-3 py-2 hover:bg-indigo-700 active:scale-90 transition-transform shrink-0 cursor-pointer"
                id={`minus-btn-${item.id}`}
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="px-2 text-xs select-none min-w-5 text-center">
                {quantity}
              </span>

              <button
                onClick={() => onAdd(item)}
                className="px-3 py-2 hover:bg-indigo-700 active:scale-90 transition-transform shrink-0 cursor-pointer"
                id={`plus-btn-${item.id}`}
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
