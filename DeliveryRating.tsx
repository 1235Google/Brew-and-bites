import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, ThumbsUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeliveryRatingProps {
  isDarkMode: boolean;
  onSubmit: (ratings: { food: number; partner: number; packaging: number; feedback: string }) => void;
  driverName: string;
}

export const DeliveryRating: React.FC<DeliveryRatingProps> = ({ isDarkMode, onSubmit, driverName }) => {
  const [foodRating, setFoodRating] = useState(0);
  const [partnerRating, setPartnerRating] = useState(0);
  const [packagingRating, setPackagingRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [hoverFood, setHoverFood] = useState(0);
  const [hoverPartner, setHoverPartner] = useState(0);
  const [hoverPackaging, setHoverPackaging] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodRating === 0 || partnerRating === 0 || packagingRating === 0) {
      alert('Please provide a star rating for all three categories.');
      return;
    }
    setSubmitted(true);
    onSubmit({
      food: foodRating,
      partner: partnerRating,
      packaging: packagingRating,
      feedback
    });
  };

  const StarSelector = ({
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    label,
    isDarkMode
  }: {
    rating: number;
    setRating: (r: number) => void;
    hoverRating: number;
    setHoverRating: (r: number) => void;
    label: string;
    isDarkMode: boolean;
  }) => {
    return (
      <div className="flex flex-col items-start gap-1.5 w-full">
        <span className={`text-[10.5px] font-extrabold uppercase tracking-widest ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>{label}</span>
        
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
              >
                <Star 
                  className={`w-6.5 h-6.5 transition-colors ${
                    isActive 
                      ? 'fill-amber-500 text-amber-500' 
                      : isDarkMode 
                        ? 'text-gray-700 hover:text-gray-500' 
                        : 'text-gray-300 hover:text-gray-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`glass-panel rounded-[32px] p-6 border text-left relative overflow-hidden transition-all duration-300 ${
      isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
    }`}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="rating-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-1">Feedback Desk</span>
              <h3 className="text-xl font-black tracking-tight">Rate Your Premium Experience</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Your high-end rating ensures our chef and delivery fleet maintain world-class hospitality standards.
              </p>
            </div>

            <div className="space-y-4">
              <StarSelector 
                rating={foodRating}
                setRating={setFoodRating}
                hoverRating={hoverFood}
                setHoverRating={setHoverFood}
                label="Rate Menu & Taste"
                isDarkMode={isDarkMode}
              />
              <StarSelector 
                rating={partnerRating}
                setRating={setPartnerRating}
                hoverRating={hoverPartner}
                setHoverRating={setHoverPartner}
                label={`Rate Delivery Partner (${driverName})`}
                isDarkMode={isDarkMode}
              />
              <StarSelector 
                rating={packagingRating}
                setRating={setPackagingRating}
                hoverRating={hoverPackaging}
                setHoverRating={setHoverPackaging}
                label="Rate Eco-Glass Packaging"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Feedback box */}
            <div className="space-y-2">
              <label className="text-[10.5px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Optional Feedback</span>
              </label>
              <textarea
                placeholder="Share any details of your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={`w-full min-h-[80px] rounded-2xl p-4 text-xs font-semibold outline-none border focus:ring-2 focus:ring-indigo-500/10 transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 text-white focus:border-white/20' 
                    : 'bg-black/5 border-black/5 text-gray-900 focus:border-black/15'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:opacity-95 active:scale-95 font-bold text-xs text-white shadow-lg transition-all border-none cursor-pointer text-center block"
            >
              Submit Star Review
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="rating-success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="py-12 text-center flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="font-black text-lg tracking-tight">Review Submitted Successfully!</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Thank you! Your feedback helps improve future deliveries. Your ratings have been securely transmitted to the Brew & Bites Ledger.
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 pt-2 select-none">
              <ThumbsUp className="w-3.5 h-3.5 animate-bounce" />
              <span>Hospitality Locked</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
