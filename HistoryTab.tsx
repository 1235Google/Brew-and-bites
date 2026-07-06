import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Receipt, CheckCircle2, Download, RefreshCw, X, Sparkles, MapPin, Printer } from 'lucide-react';
import { CompletedOrder, generateReceiptPDF } from '../utils/pdfGenerator';
import { MENU_ITEMS } from '../data/menu';
import { MenuItem } from '../types';

interface HistoryTabProps {
  orderHistory: CompletedOrder[];
  onReorder: (items: Array<{ id: string; quantity: number }>) => void;
  isDarkMode: boolean;
  onBrowseMenu: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  orderHistory,
  onReorder,
  isDarkMode,
  onBrowseMenu,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<CompletedOrder | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadPDF = async (order: CompletedOrder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setDownloadingId(order.orderId);
      await generateReceiptPDF(order);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleReorder = (order: CompletedOrder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const itemsToReorder = order.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));
    onReorder(itemsToReorder);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-slide-up-spring" id="order-history-view">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Journal of Gastronomy</span>
        <h1 className="text-3xl font-black tracking-tight leading-none">Order History</h1>
        <p className="text-xs text-gray-400 font-medium">
          Access receipts, verifiable PDF invoices, and reorder your favorite signature brews.
        </p>
      </div>

      {orderHistory.length === 0 ? (
        /* Empty State */
        <div className={`rounded-[32px] p-12 text-center border space-y-6 ${
          isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/40 border-amber-950/10 shadow-sm'
        }`}>
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-3xl mx-auto animate-bounce">
            ☕
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-black text-lg text-gray-800 dark:text-gray-100">No Past Orders Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Your gourmet ledger is currently clear. Place an order to register your first digital receipt!
            </p>
          </div>
          <button
            onClick={onBrowseMenu}
            className="px-6 py-2.5 rounded-xl bg-[#6F3B16] hover:bg-[#854B20] text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            Explore Curated Menu
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orderHistory.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const itemsString = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');

            return (
              <div
                key={order.orderId}
                onClick={() => setSelectedReceipt(order)}
                className={`rounded-[28px] p-5 border flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 hover:scale-[1.01] cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-gray-950/25 border-white/5 hover:border-white/10 hover:bg-gray-950/35' 
                    : 'bg-white/45 border-amber-950/10 hover:border-[#6F3B16]/20 hover:bg-white/55 shadow-xs'
                }`}
              >
                {/* Left block: Icon, metadata */}
                <div className="flex items-start gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#B86B2B] flex items-center justify-center font-bold text-xl shrink-0 group-hover:rotate-12 transition-transform duration-300">
                    🧾
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors">
                        {order.orderId}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">
                        {order.date} at {order.time}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 text-[8px] font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Delivered</span>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-md">
                      {itemsString}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 font-medium">
                      <span>{itemCount} Delicac{itemCount > 1 ? 'ies' : 'y'} served</span>
                      <span>•</span>
                      <span>Delivery: <strong className="text-gray-500">{order.deliveryPartner?.name || 'Rahul Sharma'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right block: Total and actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest block">GRAND TOTAL</span>
                    <span className="text-lg font-black text-[#B86B2B]">₹{order.grandTotal}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceipt(order);
                      }}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="View Digital Receipt"
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={(e) => handleDownloadPDF(order, e)}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm relative flex items-center justify-center"
                      title="Download PDF Receipt"
                      disabled={downloadingId === order.orderId}
                    >
                      <Download className={`w-4 h-4 ${downloadingId === order.orderId ? 'animate-bounce' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleReorder(order, e)}
                      className="p-2 rounded-xl bg-[#6F3B16] hover:bg-[#854B20] text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
                      title="Reorder All Items"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED DIGITAL RECEIPT MODAL */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedReceipt(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-[32px] p-6 text-left border relative overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto ${
                isDarkMode ? 'bg-gray-950 border-white/15 text-white' : 'bg-[#FCFAF7] border-[#6F3B16]/20 text-[#2C1F15]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReceipt(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors cursor-pointer z-10 ${
                  isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-gray-900'
                }`}
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Receipt Header */}
              <div className="text-center pb-5 border-b border-dashed border-gray-400/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6F3B16] to-[#B86B2B] flex items-center justify-center text-white font-extrabold text-sm mx-auto mb-2.5 shadow-md">
                  B
                </div>
                <h3 className="font-black text-base tracking-tight text-[#B86B2B]">Brew & Bites Café</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Authentic Digital Receipt</p>
              </div>

              {/* Receipt Metadata */}
              <div className="py-4 space-y-1.5 text-[10px] font-mono text-gray-400 border-b border-dashed border-gray-400/20">
                <div className="flex justify-between">
                  <span>RECEIPT NUMBER:</span>
                  <span className="font-bold text-gray-300 dark:text-gray-100">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>ORDER NUMBER:</span>
                  <span className="font-bold text-gray-300 dark:text-gray-100">{selectedReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE & TIME:</span>
                  <span className="font-bold text-gray-300 dark:text-gray-100">{selectedReceipt.date} at {selectedReceipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYMENT METHOD:</span>
                  <span className="font-bold text-emerald-500">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYMENT STATUS:</span>
                  <span className="font-bold text-emerald-500">{selectedReceipt.paymentStatus}</span>
                </div>
              </div>

              {/* Items */}
              <div className="py-4 border-b border-dashed border-gray-400/20 space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Delicacies Served</span>
                {selectedReceipt.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="select-none filter drop-shadow-sm">{item.emoji}</span>
                      <span>{item.name} <span className="text-gray-400 font-normal">x {item.quantity}</span></span>
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="py-4 border-b border-dashed border-gray-400/20 space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{selectedReceipt.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold">{selectedReceipt.deliveryFee === 0 ? 'FREE' : `₹${selectedReceipt.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold">₹{selectedReceipt.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (9%)</span>
                  <span className="font-bold">₹{selectedReceipt.gst}</span>
                </div>
                {selectedReceipt.discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Discount ({selectedReceipt.couponCode || 'Promo'})</span>
                    <span>-₹{selectedReceipt.discount}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="py-4 flex justify-between items-center">
                <span className="font-extrabold text-xs uppercase tracking-wider text-[#B86B2B]">Total Authorized</span>
                <span className="font-black text-amber-500 text-xl tracking-tight">₹{selectedReceipt.grandTotal}</span>
              </div>

              {/* QR Code and Delivery details */}
              <div className="pt-4 border-t border-dashed border-gray-400/20 flex flex-col sm:flex-row items-center gap-5">
                {/* Real Verifiable QR */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                      `Receipt: ${selectedReceipt.receiptNumber}\nOrder ID: ${selectedReceipt.orderId}\nTotal: INR ${selectedReceipt.grandTotal}\nDate: ${selectedReceipt.date}`
                    )}`}
                    alt="Receipt QR"
                    className="w-24 h-24 rounded-lg bg-white p-1 border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[8px] font-mono text-gray-400 uppercase font-black">Scan to verify</span>
                </div>

                {/* Delivery details */}
                <div className="flex-1 space-y-2 text-left text-[10.5px] text-gray-400">
                  <div>
                    <span className="font-extrabold uppercase text-[9px] text-[#B86B2B] block">Delivery Location</span>
                    {selectedReceipt.deliveryAddress ? (
                      <>
                        <p className="font-bold text-gray-300 dark:text-gray-800">{selectedReceipt.deliveryAddress.name}</p>
                        <p className="font-semibold text-gray-400 truncate max-w-[200px]">
                          {selectedReceipt.deliveryAddress.houseNumber}, {selectedReceipt.deliveryAddress.street}, {selectedReceipt.deliveryAddress.area}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">Home Coordinates</p>
                    )}
                  </div>

                  <div>
                    <span className="font-extrabold uppercase text-[9px] text-[#B86B2B] block">Delivery Courier</span>
                    <p className="font-semibold text-gray-400">
                      {selectedReceipt.deliveryPartner?.name || 'Rahul Sharma'} ({selectedReceipt.deliveryPartner?.vehicleNumber || 'OD-33-F-8822'})
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct PDF Download Action Button inside the Receipt details */}
              <div className="mt-6 pt-4 border-t border-gray-400/10 flex gap-3">
                <button
                  onClick={(e) => handleDownloadPDF(selectedReceipt, e)}
                  disabled={downloadingId === selectedReceipt.orderId}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === selectedReceipt.orderId ? 'Generating...' : 'Download Invoice PDF'}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
