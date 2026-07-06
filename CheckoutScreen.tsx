import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Info, CreditCard, Sparkles, Smartphone, Ticket, Check, AlertCircle, MapPin, Clock } from 'lucide-react';
import { CartItem, Coupon, SavedAddress } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutScreenProps {
  cart: CartItem[];
  onBackToMenu: () => void;
  onPayNow: (upiId: string) => void;
  isDarkMode: boolean;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  selectedAddress: SavedAddress | null;
  onOpenAddressManager: () => void;
}

export const getAddressEtaRange = (address: SavedAddress | null): string => {
  if (!address) return "15–20 mins";
  const nameLower = address.name.toLowerCase();
  if (nameLower.includes('home') || nameLower.includes('🏡') || nameLower.includes('🏠')) {
    return "12–18 mins";
  } else if (nameLower.includes('work') || nameLower.includes('office') || nameLower.includes('💼')) {
    return "18–25 mins";
  } else if (nameLower.includes('hostel') || nameLower.includes('🏢')) {
    return "14–22 mins";
  } else {
    const pinSum = address.pincode.split('').reduce((acc, digit) => acc + parseInt(digit || '0'), 0);
    if (pinSum % 3 === 0) {
      return "25–35 mins";
    } else if (pinSum % 2 === 0) {
      return "18–25 mins";
    } else {
      return "12–18 mins";
    }
  }
};

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME50', discountType: 'percent', discountValue: 50, minOrderValue: 50, description: '50% off on your first order (up to ₹100)' },
  { code: 'SAVE20', discountType: 'percent', discountValue: 20, minOrderValue: 80, description: '20% off on your subtotal' },
  { code: 'FREEDEL', discountType: 'free_delivery', discountValue: 35, minOrderValue: 40, description: 'Free elite delivery (saves ₹35)' },
  { code: 'ANNIVERSARY16', discountType: 'flat', discountValue: 100, minOrderValue: 150, description: 'Flat ₹100 premium anniversary discount' }
];

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  onBackToMenu,
  onPayNow,
  isDarkMode,
  appliedCoupon,
  setAppliedCoupon,
  selectedAddress,
  onOpenAddressManager
}) => {
  const [upiPrefix, setUpiPrefix] = useState('');
  const [upiSuffix, setUpiSuffix] = useState('@okaxis');
  const [error, setError] = useState('');
  
  // Coupon input state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  
  // Professional fees
  const baseDeliveryFee = subtotal > 0 ? 35 : 0;
  const isFreeDelivery = appliedCoupon?.discountType === 'free_delivery';
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const platformFee = subtotal > 0 ? 6 : 0;
  const gst = subtotal > 0 ? Math.round(subtotal * 0.09) : 0; // Dynamic ~9% GST (which gives exactly 18 for subtotal 198!)

  // Discount calculation
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      couponDiscount = Math.round(subtotal * (appliedCoupon.discountValue / 100));
      if (appliedCoupon.code === 'WELCOME50') {
        couponDiscount = Math.min(couponDiscount, 100);
      }
    } else if (appliedCoupon.discountType === 'flat') {
      couponDiscount = Math.min(subtotal, appliedCoupon.discountValue);
    } else if (isFreeDelivery) {
      couponDiscount = baseDeliveryFee;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + gst - (isFreeDelivery ? 0 : couponDiscount));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const trimmedInput = couponCodeInput.trim().toUpperCase();
    if (!trimmedInput) return;

    const matched = AVAILABLE_COUPONS.find(c => c.code === trimmedInput);
    if (!matched) {
      setCouponError('Invalid Coupon Code. Try WELCOME50 or SAVE20!');
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < matched.minOrderValue) {
      setCouponError(`Min order value to apply ${matched.code} is ₹${matched.minOrderValue}`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(matched);
    setCouponSuccess(`Coupon ${matched.code} Applied Successfully!`);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      setError('Please select a delivery address before completing payment');
      return;
    }
    if (!upiPrefix.trim()) {
      setError('Please enter a valid UPI address username');
      return;
    }
    setError('');
    const fullUpiId = `${upiPrefix.trim().toLowerCase()}${upiSuffix}`;
    onPayNow(fullUpiId);
  };

  const handles = ['@okaxis', '@okhdfc', '@okicici', '@paytm', '@ybl'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="checkout-screen">
      
      {/* Back button */}
      <button 
        onClick={onBackToMenu}
        className={`mb-8 inline-flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer group ${
          isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
        id="checkout-back-btn"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Menu</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: UPI Payment & QR Code */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`glass-panel rounded-[32px] p-6 sm:p-8 relative overflow-hidden text-left ${
            isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
          }`}>
            
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-950 flex items-center justify-center text-white font-extrabold text-sm">
                B
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Secure UPI Checkout</h2>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">SECURE TRANSACTION PORTAL</p>
              </div>
            </div>

            {/* Fake QR Code Box (CSS ONLY with scanner effect) */}
            <div className={`flex flex-col items-center justify-center p-6 border rounded-[24px] mb-8 relative ${
              isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/40 border-black/5'
            }`}>
              <div className="relative w-44 h-44 bg-white border border-gray-100 rounded-[20px] p-3 flex flex-col justify-between overflow-hidden shadow-lg">
                
                {/* Horizontal Sweeping Laser Scanner Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent shadow-lg shadow-amber-700/50 animate-scan-line z-10" />

                {/* 3 Corner Anchors (concentric squares) */}
                <div className="flex justify-between w-full h-11">
                  {/* Top-Left Anchor */}
                  <div className="w-11 h-11 border-4 border-gray-950 p-1 flex items-center justify-center rounded-xs shrink-0">
                    <div className="w-4 h-4 bg-gray-950 rounded-xs"></div>
                  </div>
                  {/* Top-Right Anchor */}
                  <div className="w-11 h-11 border-4 border-gray-950 p-1 flex items-center justify-center rounded-xs shrink-0">
                    <div className="w-4 h-4 bg-gray-950 rounded-xs"></div>
                  </div>
                </div>

                {/* Middle Grid of pixelated dots */}
                <div className="flex-1 my-2 flex flex-col justify-between">
                  <div className="flex justify-between px-2">
                    <div className="w-2 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-4 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-xs"></div>
                    <div className="w-2 h-2 bg-gray-950 rounded-xs"></div>
                  </div>
                  <div className="flex justify-between px-1">
                    <div className="w-4 h-2 bg-gray-300 rounded-xs"></div>
                    <div className="w-2 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-5 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-3 h-2 bg-gray-300 rounded-xs"></div>
                  </div>
                  <div className="flex justify-between px-3">
                    <div className="w-2 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-xs"></div>
                    <div className="w-4 h-2 bg-gray-950 rounded-xs"></div>
                    <div className="w-2 h-2 bg-gray-950 rounded-xs"></div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-end w-full h-11">
                  {/* Bottom-Left Anchor */}
                  <div className="w-11 h-11 border-4 border-gray-950 p-1 flex items-center justify-center rounded-xs shrink-0">
                    <div className="w-4 h-4 bg-gray-950 rounded-xs"></div>
                  </div>
                  {/* Bottom-Right custom pixel blocks */}
                  <div className="w-11 h-11 flex flex-col justify-between p-0.5 shrink-0">
                    <div className="flex justify-between">
                       <div className="w-3.5 h-3.5 bg-gray-950 rounded-xs"></div>
                       <div className="w-3.5 h-3.5 bg-gray-300 rounded-xs"></div>
                    </div>
                    <div className="flex justify-between">
                       <div className="w-3.5 h-3.5 bg-gray-300 rounded-xs"></div>
                       <div className="w-3.5 h-3.5 bg-gray-950 rounded-xs"></div>
                    </div>
                  </div>
                </div>

                {/* Tiny Logo Overlay in center of QR */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-amber-800 border-2 border-white flex items-center justify-center shadow-xs">
                  <span className="text-white text-[9px] font-black leading-none font-sans">B</span>
                </div>
              </div>

              {/* QR instructions */}
              <p className={`text-[11px] font-bold mt-3 text-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Scan using UPI, GPay, PhonePe, or any banking app
              </p>
              <div className="mt-2 text-[10px] bg-indigo-500/10 border border-indigo-500/15 rounded-lg px-3 py-1.5 text-indigo-400 font-extrabold uppercase tracking-wide">
                Amount Link: <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* UPI ID Form */}
            <form onSubmit={handlePay} className="space-y-5">
              <div className="space-y-2">
                <label className={`text-xs font-bold block uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Enter UPI Address (VPA)
                </label>
                
                <div className={`flex rounded-xl border transition-all overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 focus-within:border-white/20' 
                    : 'border-gray-200 bg-gray-100/50 focus-within:border-indigo-500/50 focus-within:bg-white'
                }`}>
                  <div className="p-3.5 text-gray-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. customer"
                    value={upiPrefix}
                    onChange={(e) => {
                      setUpiPrefix(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''));
                      setError('');
                    }}
                    className={`flex-1 bg-transparent py-3 text-sm font-bold placeholder:text-gray-500 placeholder:font-normal outline-none ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                    required
                    id="upi-input"
                  />
                  {/* Select suffix dropdown */}
                  <select
                    value={upiSuffix}
                    onChange={(e) => setUpiSuffix(e.target.value)}
                    className={`border-l text-xs font-bold px-3 outline-none cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-900 border-white/10 text-gray-300' 
                        : 'bg-white border-gray-100 text-gray-700'
                    }`}
                  >
                    {handles.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
              </div>

              {/* Quick Fill Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mr-1">Pre-Fill:</span>
                {handles.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setUpiSuffix(h);
                      if (!upiPrefix) {
                        setUpiPrefix('luxe.guest');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      upiSuffix === h 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-xs' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* CTA Pay Button */}
              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-2xl bg-[#ffefe4] text-[#fc8019] border border-[#ffdbb2] hover:bg-[#fc8019] hover:text-white active:scale-[0.99] font-black text-sm shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                id="pay-now-btn"
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>Secure UPI Checkout (₹{grandTotal})</span>
              </button>
            </form>
          </div>

          {/* Secure elements info */}
          <div className="flex items-start gap-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 p-4 text-left">
            <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold">Encrypted End-to-End Tunnel</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                Brew & Bites Café complies fully with secure financial regulations. Your payment details are fully encrypted and securely authorized via UPI.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary breakdown card */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`glass-panel rounded-[32px] p-6 text-left ${
            isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Order Summary</span>
            </h3>

            {/* List of items */}
            <div className="divide-y divide-white/10 max-h-56 overflow-y-auto pr-1 scrollbar-none">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 select-none filter drop-shadow-sm">{item.menuItem.emoji}</span>
                    <div className="min-w-0">
                      <h4 className="font-bold truncate">{item.menuItem.name}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold shrink-0">
                    ₹{item.menuItem.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Premium Coupon Input Section */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Apply Promo Code</span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. WELCOME50, SAVE20"
                  value={couponCodeInput}
                  onChange={(e) => {
                    setCouponCodeInput(e.target.value);
                    setCouponError('');
                    setCouponSuccess('');
                  }}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold outline-none border focus:ring-2 focus:ring-indigo-500/10 uppercase placeholder:normal-case transition-all ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-white/25' 
                      : 'bg-black/5 border-black/5 text-gray-950 focus:border-black/15'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              <AnimatePresence mode="wait">
                {couponSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-[11px] font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{couponSuccess}</span>
                  </motion.div>
                )}
                {couponError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/15 text-rose-500 text-[11px] font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestions helper */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase mr-1">Coupons:</span>
                {AVAILABLE_COUPONS.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCouponCodeInput(c.code);
                      setCouponError('');
                      setCouponSuccess('');
                    }}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md text-[9px] font-bold font-mono text-indigo-400 tracking-wider cursor-pointer"
                    title={c.description}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium receipt styling */}
            <div className="mt-5 pt-4 border-t border-dashed border-white/20 space-y-2.5 text-xs text-gray-400 font-sans relative">
              {/* Fake serrated edge cut visuals inside card for receipt feeling */}
              <div className="absolute -top-1.5 inset-x-0 flex justify-between px-2 text-gray-600/30 font-mono tracking-widest text-[8px] pointer-events-none select-none">
                • • • • • • • • • • • • • • • • • • • • • • • • • • • •
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isFreeDelivery ? 'line-through text-gray-500' : ''}`}>₹{baseDeliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (9%)</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{gst}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              
              <div className="pt-3 border-t border-dashed border-white/20 flex justify-between items-center">
                <span className="font-extrabold text-sm text-gray-400">GRAND TOTAL</span>
                <span className="font-black text-amber-500 text-xl tracking-tight">₹{grandTotal}</span>
              </div>
            </div>

            {/* Address Info */}
            <div className={`mt-6 p-4 rounded-2xl border text-left space-y-3 ${
              isDarkMode ? 'bg-black/25 border-white/5' : 'bg-white border-[#6F3B16]/10 shadow-xs'
            }`}>
              {selectedAddress ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#B86B2B] shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-extrabold text-[#6F3B16] block mb-0.5">📍 Delivering to {selectedAddress.name}</span>
                      <p className="font-semibold text-gray-500">{selectedAddress.houseNumber}, {selectedAddress.street}</p>
                      <p className="text-gray-400">{selectedAddress.area}, {selectedAddress.city} – {selectedAddress.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-amber-500/10 text-[#B86B2B] text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Estimated delivery time: {getAddressEtaRange(selectedAddress)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenAddressManager}
                    className="w-full py-1.5 text-center text-[10px] font-extrabold uppercase tracking-widest text-[#B86B2B] hover:text-[#6F3B16] bg-transparent border-none cursor-pointer"
                  >
                    Change Destination Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-center py-2">
                  <span className="text-xl block">⚠️</span>
                  <p className="text-xs font-bold text-rose-500">No Shipping Address Selected</p>
                  <p className="text-[10px] text-gray-400">Please choose or register a delivery coordinate to authenticate checkout.</p>
                  <button
                    type="button"
                    onClick={onOpenAddressManager}
                    className="px-4 py-2 rounded-xl bg-[#6F3B16] text-white text-[10px] font-extrabold uppercase tracking-widest cursor-pointer border-none shadow-xs"
                  >
                    Select Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

