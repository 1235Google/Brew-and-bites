import React from 'react';
import { X, ShoppingBasket, Plus, Minus, CreditCard, Clock, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { CartItem, MenuItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAdd: (item: MenuItem) => void;
  onRemove: (item: MenuItem) => void;
  onCheckout: () => void;
  isDarkMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onAdd,
  onRemove,
  onCheckout,
  isDarkMode
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 19 : 0;
  const luxuryTax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% luxury service tax
  const grandTotal = subtotal + deliveryFee + luxuryTax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center" id="cart-drawer-container">
      {/* Back blur overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Floating Bottom Sheet */}
      <div className={`relative w-full max-w-2xl rounded-t-[36px] sm:rounded-[36px] sm:mb-6 mx-auto glass-panel p-6 sm:p-8 animate-slide-up-spring shadow-2xl z-10 max-h-[85vh] overflow-y-auto ${
        isDarkMode ? 'bg-gray-950/85 border-white/10 text-white' : 'bg-white/75 border-white/40 text-gray-900'
      }`}>
        
        {/* iOS Grab Handle */}
        <div className="w-12 h-1 bg-gray-400/30 rounded-full mx-auto mb-6" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <ShoppingBasket className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold tracking-tight">Brew & Bites - Your Cart</h2>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
                {cart.length === 0 ? 'Empty' : `${cart.reduce((s, i) => s + i.quantity, 0)} items selected`}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-gray-800'
            }`}
            id="close-cart-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-6xl block mb-4 select-none animate-bounce">☕</span>
            <h3 className="font-bold text-lg">Your Cart is Empty</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Explore our fresh organic hot brews, premium milkshakes, or warm toast sandwiches to add items.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Brew & Bites Premium Card (Visual masterpiece) */}
            <div className="bg-gradient-to-tr from-amber-900 via-stone-900 to-[#3d2516] rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
              {/* Overlay graphics */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-700/10 rounded-full blur-xl -ml-12 -mb-12" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-300">Brew & Bites Card</span>
                  <h4 className="text-lg font-bold mt-1 tracking-tight">Virtual Platinum</h4>
                </div>
                <div className="w-10 h-7 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                  <span className="text-[10px] font-black tracking-tight text-white">B</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Total Price</span>
                  <span className="text-2xl font-black tracking-tight text-indigo-200">₹{grandTotal}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-400 font-semibold block uppercase tracking-wider">Device account</span>
                  <span className="font-mono text-xs text-indigo-300">•••• 1024</span>
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div className="space-y-3 text-left">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                Order Summary
              </h3>
              
              <div className={`rounded-[24px] border p-4 divide-y ${
                isDarkMode ? 'bg-black/20 border-white/10 divide-white/5' : 'bg-white/40 border-white/20 divide-black/5'
              }`}>
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0 select-none filter drop-shadow-sm">{item.menuItem.emoji}</span>
                      <div className="min-w-0 text-left">
                        <h4 className="font-bold text-sm truncate">{item.menuItem.name}</h4>
                        <span className="text-xs text-gray-400 font-extrabold">₹{item.menuItem.price}</span>
                      </div>
                    </div>

                    {/* Compact Quantity Selectors */}
                    <div className={`flex items-center border rounded-xl overflow-hidden shrink-0 ${
                      isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                    }`}>
                      <button
                        onClick={() => onRemove(item.menuItem)}
                        className={`p-2 transition-transform active:scale-95 cursor-pointer ${
                          isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'
                        }`}
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onAdd(item.menuItem)}
                        className={`p-2 transition-transform active:scale-95 cursor-pointer ${
                          isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'
                        }`}
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details Breakdown */}
            <div className="space-y-3 text-left">
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                Receipt
              </h3>
              
              <div className={`rounded-[24px] border p-5 space-y-3 text-xs ${
                isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white/40 border-white/20'
              }`}>
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal Value</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Luxury Delivery Fee</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Brew & Bites Surcharge</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{luxuryTax}</span>
                </div>
                
                <div className={`pt-3.5 border-t flex justify-between items-center text-sm ${
                  isDarkMode ? 'border-white/15' : 'border-black/5'
                }`}>
                  <span className="font-extrabold">Final Authorized Amount</span>
                  <span className="font-black text-xl text-indigo-500">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Payment Safety Notice */}
            <div className="flex items-center gap-2 px-1 text-[10.5px] text-gray-400 text-left justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Securely processed with end-to-end encryption.</span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={onCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:opacity-95 active:scale-[0.99] font-bold text-sm text-white shadow-lg shadow-amber-900/20 flex items-center justify-between transition-all cursor-pointer border-none"
                id="proceed-pay-btn"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>Secure UPI Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-lg">₹{grandTotal}</span>
                  <span className="font-bold">→</span>
                </div>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
