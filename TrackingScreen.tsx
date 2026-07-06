import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Phone, MessageSquare, Clock, ShieldCheck, Sparkles, Navigation, X, Printer, Share2, Download, Check, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { TrackingStage, CartItem, Coupon, WeatherInfo, WeatherCondition, SavedAddress } from '../types';
import { LiveDeliveryMap } from './LiveDeliveryMap';
import { playPhoneRing } from '../utils/audio';
import { LiveChat } from './LiveChat';
import { DeliveryRating } from './DeliveryRating';
import { WeatherWidget } from './WeatherWidget';
import { motion, AnimatePresence } from 'motion/react';
import { getEtaMetrics, getTotalDeliverySeconds } from '../utils/eta';
import { DeliveryPartner, VoiceScript } from '../data/partners';
import { AnniversarySecret } from './AnniversarySecret';
import { generateReceiptPDF, CompletedOrder } from '../utils/pdfGenerator';

interface TrackingScreenProps {
  currentStage: TrackingStage;
  onBackToMenu: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isDarkMode: boolean;
  demoMode: boolean;
  setDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
  elapsedSeconds: number;
  setElapsedSeconds: React.Dispatch<React.SetStateAction<number>>;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  weather: WeatherInfo;
  setWeather: (w: WeatherInfo) => void;
  selectedAddress: SavedAddress | null;
  assignedPartner: DeliveryPartner;
  assignedScript: VoiceScript;
}

const Confetti: React.FC = () => {
  const pieces = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const size = 6 + Math.random() * 8;
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}%`, rotate: 0, opacity: 1 }}
            animate={{ 
              y: '100vh', 
              x: `${left + (Math.random() * 20 - 10)}%`, 
              rotate: 360,
              opacity: [1, 1, 0]
            }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        );
      })}
    </div>
  );
};

const FloatingHearts: React.FC = () => {
  const hearts = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((_, i) => {
        const left = 10 + Math.random() * 80;
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 4;
        const size = 12 + Math.random() * 16;
        return (
          <motion.div
            key={i}
            initial={{ y: '100%', x: `${left}%`, scale: 0.5, opacity: 0 }}
            animate={{ 
              y: '-20%', 
              x: `${left + (Math.random() * 15 - 7.5)}%`, 
              scale: [0.5, 1.2, 0.8],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              fontSize: `${size}px`,
            }}
          >
            ❤️
          </motion.div>
        );
      })}
    </div>
  );
};

const SuccessRipple: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-28 h-28 my-4">
      {/* Outer ripples */}
      <motion.div 
        className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div 
        className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 2.0, opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, delay: 0.7, repeat: Infinity, ease: 'easeOut' }}
      />
      
      {/* Central animated checkmark */}
      <motion.div 
        className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        ✓
      </motion.div>
    </div>
  );
};

const SuccessBanner: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`glass-panel rounded-[40px] p-8 text-center relative overflow-hidden border mb-8 flex flex-col items-center justify-center ${
        isDarkMode ? 'bg-gradient-to-b from-emerald-950/20 to-gray-950/40 border-emerald-500/30' : 'bg-gradient-to-b from-emerald-50/50 to-white/80 border-emerald-500/20 shadow-lg'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Success Ripples & Checkmark */}
      <SuccessRipple />

      {/* Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-4 text-[#B86B2B] dark:text-[#F5A962] animate-pulse">
        Order Delivered Successfully
      </h2>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
        Thank you for choosing Brew & Bites.
      </p>
    </motion.div>
  );
};

const ThankYouCard: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`glass-panel rounded-[32px] p-6 text-center border relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] ${
        isDarkMode 
          ? 'bg-gradient-to-b from-indigo-950/10 to-gray-950/40 border-indigo-500/20' 
          : 'bg-gradient-to-b from-indigo-50/30 to-white/80 border-indigo-500/10 shadow-md'
      }`}
    >
      {/* Premium pulsing background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none animate-pulse" />
      
      {/* Floating Hearts */}
      <FloatingHearts />

      {/* Message content */}
      <span className="text-3xl filter drop-shadow-md mb-3 animate-bounce">❤️</span>
      <h3 className="font-sans font-black text-lg tracking-tight text-indigo-400">Thank You!</h3>
      <p className="text-xs font-semibold leading-relaxed text-gray-600 dark:text-gray-300 max-w-sm mt-2 relative z-10">
        We hope you enjoyed your Brew & Bites experience. Your order has been successfully delivered. We look forward to serving you again.
      </p>
    </motion.div>
  );
};

const STAGE_ORDER = [
  TrackingStage.PLACED,
  TrackingStage.ACCEPTED,
  TrackingStage.PREPARING,
  TrackingStage.PACKED,
  TrackingStage.ASSIGNED,
  TrackingStage.OUT_FOR_DELIVERY,
  TrackingStage.NEARBY,
  TrackingStage.DELIVERED
];

const WEATHER_PRESETS: WeatherInfo[] = [
  { condition: 'SUNNY', label: 'Clear Skies', temp: 30, humidity: 40, windSpeed: 8, delayMinutes: -2, emoji: '☀' },
  { condition: 'CLOUDY', label: 'Overcast Clouds', temp: 26, humidity: 55, windSpeed: 12, delayMinutes: 0, emoji: '🌤' },
  { condition: 'RAINY', label: 'Heavy Rainstorm', temp: 22, humidity: 88, windSpeed: 22, delayMinutes: 4, emoji: '🌧' },
  { condition: 'STORMY', label: 'Severe Lightning Storm', temp: 20, humidity: 95, windSpeed: 32, delayMinutes: 8, emoji: '⛈' }
];

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  currentStage,
  onBackToMenu,
  isAudioMuted,
  onToggleAudio,
  isDarkMode,
  demoMode,
  setDemoMode,
  elapsedSeconds,
  setElapsedSeconds,
  cart,
  appliedCoupon,
  weather,
  setWeather,
  selectedAddress,
  assignedPartner,
  assignedScript
}) => {
  // Chat & call popup state managers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'incoming' | 'connected' | 'declined'>('incoming');
  const [hasCallBeenTriggered, setHasCallBeenTriggered] = useState(false);
  const [trafficFluctuation, setTrafficFluctuation] = useState(0);

  // Voice Settings & Speech Synthesis State
  const [voiceMuted, setVoiceMuted] = useState<boolean>(() => {
    const stored = localStorage.getItem('brew_bites_voice_muted');
    return stored ? stored === 'true' : isAudioMuted;
  });
  const [voiceSpeed, setVoiceSpeed] = useState<number>(() => {
    const stored = localStorage.getItem('brew_bites_voice_speed');
    return stored ? parseFloat(stored) : 1.0;
  });

  const [dialogueIndex, setDialogueIndex] = useState<number>(-1);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>('');
  const [currentSpeaker, setCurrentSpeaker] = useState<'partner' | 'customer' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [collectingCountdown, setCollectingCountdown] = useState<number | null>(null);

  // Download states for digital receipt
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [receiptToast, setReceiptToast] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showAnniversarySecret, setShowAnniversarySecret] = useState(false);
  const [isTransitionActive, setIsTransitionActive] = useState(false);

  // Trigger anniversary secret automatically when order status becomes DELIVERED
  useEffect(() => {
    if (currentStage === TrackingStage.DELIVERED && !isTransitionActive && !showAnniversarySecret) {
      setIsTransitionActive(true);
      
      // Step 1: Wait 60 seconds showing the delivered screen
      const timer = setTimeout(() => {
        // Step 2: Fade the entire screen to black over 2 seconds
        setFadeToBlack(true);
        
        // Step 3: Wait 2 seconds (transition is 2s) and show the anniversary secret component
        const nextTimer = setTimeout(() => {
          setShowAnniversarySecret(true);
        }, 2000);
        
        return () => clearTimeout(nextTimer);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [currentStage, isTransitionActive, showAnniversarySecret]);

  // Reset avatar error when partner changes
  useEffect(() => {
    setAvatarError(false);
  }, [assignedPartner]);

  // Persist Voice Settings
  useEffect(() => {
    localStorage.setItem('brew_bites_voice_muted', String(voiceMuted));
  }, [voiceMuted]);

  useEffect(() => {
    localStorage.setItem('brew_bites_voice_speed', String(voiceSpeed));
  }, [voiceSpeed]);

  // Periodically fluctuate traffic multiplier for extreme realism (every 15 seconds)
  useEffect(() => {
    if (currentStage === TrackingStage.DELIVERED) return;
    const interval = setInterval(() => {
      // Small fluctuation between -1 and +1 minutes
      const flux = Math.floor(Math.random() * 3) - 1;
      setTrafficFluctuation(flux);
    }, 15000);
    return () => clearInterval(interval);
  }, [currentStage]);

  // Trigger call modal at Nearby stage (approx 150m)
  useEffect(() => {
    if (currentStage === TrackingStage.NEARBY && !hasCallBeenTriggered) {
      setIsCallPopupOpen(true);
      setCallStatus('incoming');
      setHasCallBeenTriggered(true);
      if (!voiceMuted) {
        playPhoneRing();
      }
    }
  }, [currentStage, hasCallBeenTriggered, voiceMuted]);

  // Repeat ringtone while incoming call is ringing
  useEffect(() => {
    if (!isCallPopupOpen || callStatus !== 'incoming' || voiceMuted) return;
    
    const ringInterval = setInterval(() => {
      playPhoneRing();
    }, 3000);

    return () => clearInterval(ringInterval);
  }, [isCallPopupOpen, callStatus, voiceMuted]);

  // Call duration counter
  useEffect(() => {
    if (callStatus !== 'connected' || !isCallPopupOpen) {
      setCallDuration(0);
      return;
    }
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus, isCallPopupOpen]);

  // Handle Speech Dialogue progression
  useEffect(() => {
    if (callStatus !== 'connected' || !isCallPopupOpen || dialogueIndex < 0) {
      if (dialogueIndex >= 0) {
        setDialogueIndex(-1);
      }
      return;
    }

    if (dialogueIndex >= assignedScript.messages.length) {
      handleConversationEnded();
      return;
    }

    const msg = assignedScript.messages[dialogueIndex];
    setCurrentSpeaker(msg.speaker);
    setCurrentSpeechText(msg.text);
    setIsSpeaking(true);

    let isCancelled = false;

    // Custom voice settings: Partner uses custom pitch/speed, customer is standard
    const pitch = msg.speaker === 'partner' ? assignedPartner.voicePitch : 1.0;
    const rate = msg.speaker === 'partner' 
      ? assignedPartner.voiceRate * voiceSpeed 
      : 1.02 * voiceSpeed;

    const handleLineFinished = () => {
      if (isCancelled) return;
      setIsSpeaking(false);
      
      const timeout = setTimeout(() => {
        setDialogueIndex(prev => {
          if (prev < 0) return -1;
          if (prev + 1 < assignedScript.messages.length) {
            return prev + 1;
          } else {
            handleConversationEnded();
            return -1;
          }
        });
      }, 1200); // 1.2s natural pause
    };

    if (voiceMuted) {
      // Simulation mode
      const words = msg.text.split(' ').length;
      const duration = Math.max(2000, (words * 320) / voiceSpeed);
      const timeout = setTimeout(() => {
        handleLineFinished();
      }, duration);
      return () => {
        isCancelled = true;
        clearTimeout(timeout);
      };
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.text);
      utterance.pitch = pitch;
      utterance.rate = rate;

      const rawVoices = typeof window.speechSynthesis.getVoices === 'function' ? window.speechSynthesis.getVoices() : [];
      const voices = rawVoices || [];
      if (voices.length > 0) {
        const englishVoices = voices.filter(v => v && v.lang && (v.lang.startsWith('en') || v.lang.startsWith('hi')));
        const available = englishVoices.length > 0 ? englishVoices : voices;
        
        if (msg.speaker === 'partner') {
          const charSum = assignedPartner.name.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
          utterance.voice = available[charSum % available.length];
        } else {
          utterance.voice = available[(assignedPartner.name.length * 3) % available.length];
        }
      }

      utterance.onend = () => {
        handleLineFinished();
      };

      utterance.onerror = () => {
        handleLineFinished();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      const words = msg.text.split(' ').length;
      const duration = Math.max(2000, (words * 320) / voiceSpeed);
      const timeout = setTimeout(() => {
        handleLineFinished();
      }, duration);
      return () => {
        isCancelled = true;
        clearTimeout(timeout);
      };
    }

    return () => {
      isCancelled = true;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [callStatus, isCallPopupOpen, dialogueIndex, voiceMuted, voiceSpeed, assignedScript, assignedPartner]);

  const handleConversationEnded = () => {
    setIsCallPopupOpen(false);
    setDialogueIndex(-1);
    setCurrentSpeaker(null);
    setCurrentSpeechText('');
    setIsSpeaking(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCollectingCountdown(30);
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
    setDialogueIndex(0);
  };

  const handleDeclineCall = () => {
    setCallStatus('declined');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setTimeout(() => {
      setIsCallPopupOpen(false);
      setCollectingCountdown(30);
    }, 800);
  };

  const handleHangUpCall = () => {
    handleConversationEnded();
  };

  // Tick the 30-second collection timer
  useEffect(() => {
    if (collectingCountdown === null) return;
    
    const intervalTime = demoMode ? 100 : 1000;
    const timer = setInterval(() => {
      setCollectingCountdown(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          const limitDelivered = demoMode ? 150 : 1500;
          setElapsedSeconds(limitDelivered);
          return null;
        }
        return prev - 1;
      });
    }, intervalTime);
    
    return () => clearInterval(timer);
  }, [collectingCountdown, demoMode, setElapsedSeconds]);

  const handleToggleDemoMode = () => {
    const prevDemo = demoMode;
    const nextDemo = !prevDemo;
    
    // Scale elapsed seconds proportionally to prevent jumping states
    const prevTotal = getTotalDeliverySeconds(prevDemo, weather.delayMinutes, selectedAddress);
    const nextTotal = getTotalDeliverySeconds(nextDemo, weather.delayMinutes, selectedAddress);
    const progressFraction = Math.min(1, elapsedSeconds / prevTotal);
    const newSeconds = Math.round(progressFraction * nextTotal);
    
    const newStart = Date.now() - newSeconds * 1000;
    localStorage.setItem('brew_bites_order_start', String(newStart));
    localStorage.setItem('brew_bites_demo_mode', String(nextDemo));
    
    setDemoMode(nextDemo);
    setElapsedSeconds(newSeconds);
  };

  const currentStageIdx = STAGE_ORDER.indexOf(currentStage);

  // Compute our beautiful ultra-realistic ETA metrics using the deterministic helper
  const etaMetrics = getEtaMetrics(elapsedSeconds, demoMode, currentStage, weather.delayMinutes);

  const eta = etaMetrics.etaMinutes;

  // Generate an ETA arrival clock string based on precise remaining seconds
  const getArrivalTimeString = (remSeconds: number) => {
    if (currentStage === TrackingStage.DELIVERED) return 'Delivered';
    const d = new Date();
    d.setSeconds(d.getSeconds() + remSeconds);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const arrivalTimeStr = getArrivalTimeString(etaMetrics.remainingSeconds);

  const formatCallDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Calculated distance in KM or meters
  const distanceKm = etaMetrics.distanceStr === 'Arriving' ? 0 : parseFloat(etaMetrics.distanceStr) || 0;

  const getStageHeader = () => {
    switch (currentStage) {
      case TrackingStage.PLACED:
        return { title: 'Order Confirmed', desc: 'Securely transmitting culinary specifications to our kitchen...' };
      case TrackingStage.ACCEPTED:
        return { title: 'Order Accepted', desc: 'Brew & Bites Café has acknowledged and queued your recipe.' };
      case TrackingStage.PREPARING:
        return { title: 'Sizzling & Brewing', desc: 'Our head barista and pastry chef are preparing your menu selections.' };
      case TrackingStage.PACKED:
        return { title: 'Order Hermetically Sealed', desc: 'Selections sealed inside bespoke micro-thermal glass locks.' };
      case TrackingStage.ASSIGNED:
        return { title: 'Courier Token Exchanged', desc: `Rider ${assignedPartner.name} is verifying tokens at our kitchen counter.` };
      case TrackingStage.OUT_FOR_DELIVERY:
        return { title: 'Out For Delivery!', desc: `${assignedPartner.name} is driving with premium GPS navigation.` };
      case TrackingStage.NEARBY:
        return { title: `${assignedPartner.name} is Nearby!`, desc: `Rider ${assignedPartner.name} is entering your building gate now.` };
      case TrackingStage.DELIVERED:
        return { title: 'Delivered • Bon Appétit!', desc: 'Order completed. Exquisite dining is served.' };
      default:
        return { title: 'GPS Tracking Active', desc: 'Establishing satellite lock...' };
    }
  };

  const headerDetails = getStageHeader();

  const steps = [
    {
      title: 'Order Placed',
      description: 'Your payment was authorized and registered in our system.',
      emoji: '✓',
    },
    {
      title: 'Restaurant Accepted',
      description: 'Brew & Bites Café accepted and queued your order.',
      emoji: '🏪',
    },
    {
      title: 'Chef Preparing Food',
      description: 'Baristas are pulling espresso shots and preparing pastries.',
      emoji: '👨‍🍳',
    },
    {
      title: 'Food Packed',
      description: 'Dishes sealed inside custom micro-thermal eco-glass boxes.',
      emoji: '📦',
    },
    {
      title: 'Delivery Partner Assigned',
      description: `Courier ${assignedPartner.name} is taking custody of your package.`,
      emoji: '🚴',
    },
    {
      title: 'Out for Delivery',
      description: `${assignedPartner.name} is on the move with smart route optimization.`,
      emoji: '🛵',
    },
    {
      title: 'Rider Nearby',
      description: `${assignedPartner.name} is approaching your entrance lobby.`,
      emoji: '📍',
    },
    {
      title: 'Delivered',
      description: 'Enjoy your food! Secure UPI transaction complete. ❤️',
      emoji: '🏡',
    }
  ];

  // Dynamic progress line calculations
  const progressPercent = currentStageIdx >= 0 ? `${(currentStageIdx / (STAGE_ORDER.length - 1)) * 100}%` : '0%';

  // Dynamic values for receipt
  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const baseDeliveryFee = subtotal > 0 ? 35 : 0;
  const isFreeDelivery = appliedCoupon?.discountType === 'free_delivery';
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const platformFee = subtotal > 0 ? 6 : 0;
  const gst = subtotal > 0 ? Math.round(subtotal * 0.09) : 0;

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

  // Trigger action toasts
  const triggerToast = (text: string, setAction: (b: boolean) => void) => {
    setAction(true);
    setReceiptToast(text);
    setTimeout(() => {
      setAction(false);
      setReceiptToast('');
    }, 2200);
  };

  const orderId = localStorage.getItem('brew_bites_current_order_id') || 'ORD78312';
  const receiptNumber = localStorage.getItem('brew_bites_current_receipt_number') || 'BB-2026-4821';

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const completedOrderData: CompletedOrder = {
        orderId,
        receiptNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cart.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          emoji: item.menuItem.emoji,
          price: item.menuItem.price,
          quantity: item.quantity
        })),
        subtotal,
        deliveryFee,
        platformFee,
        gst,
        discount: couponDiscount,
        grandTotal,
        couponCode: appliedCoupon?.code,
        paymentMethod: 'UPI Secure',
        paymentStatus: 'SUCCESS',
        customerName: 'Souvik Dash',
        customerEmail: 'souvikdashbbsr@gmail.com',
        deliveryAddress: selectedAddress ? {
          name: selectedAddress.name,
          houseNumber: selectedAddress.houseNumber,
          street: selectedAddress.street,
          area: selectedAddress.area,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode
        } : null,
        deliveryPartner: assignedPartner ? {
          name: assignedPartner.name,
          vehicleType: assignedPartner.vehicleType,
          vehicleNumber: assignedPartner.vehicleNumber
        } : null
      };

      await generateReceiptPDF(completedOrderData);
      triggerToast('Receipt PDF Downloaded!', setDownloading);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative" id="tracking-screen-container">
      {currentStage === TrackingStage.DELIVERED && <Confetti />}
      
      {/* 1. TOP HEADER NAVIGATION BLOCK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBackToMenu}
          className={`inline-flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer group self-start ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-950'
          }`}
          id="tracking-back-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Menu</span>
        </button>
        
        {/* Timing Modes Switcher + Sound Toggle row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Smart timing switcher */}
          <button
            onClick={handleToggleDemoMode}
            className={`px-4.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              demoMode 
                ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400' 
                : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
            }`}
            title="Toggle between fast demo and realistic order speeds"
          >
            <span>Speed: {demoMode ? '⚡ Demo (2 Min)' : '🐢 Realistic (25 Min)'}</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleAudio}
            className={`px-4.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              isAudioMuted 
                ? 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10' 
                : 'border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            <span>Audio: {isAudioMuted ? 'Muted' : 'Enabled'}</span>
          </button>
        </div>
      </div>

      {/* 2. WEATHER EXPERIMENTATION PANEL (Enables weather condition changes to update ETAs in real-time!) */}
      {currentStage !== TrackingStage.DELIVERED && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-black uppercase tracking-widest text-indigo-400">Weather simulation simulator</span>
            <div className="flex gap-1.5">
              {WEATHER_PRESETS.map((preset) => (
                <button
                  key={preset.condition}
                  onClick={() => setWeather(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    weather.condition === preset.condition
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-1">{preset.emoji}</span>
                  <span className="hidden sm:inline">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
          <WeatherWidget weather={weather} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* 3. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Live map + Driver Card */}
        <div className="lg:col-span-7 space-y-6">

          {/* Dynamic Order Collection Countdown Banner */}
          {collectingCountdown !== null && (
            <div className="glass-panel rounded-[32px] p-6 text-left border border-emerald-500/30 bg-emerald-500/10 text-white animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl animate-ping" />
                    <span className="text-xl animate-bounce">🚶</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xs tracking-widest text-emerald-300 uppercase">Arrived!</h3>
                    <p className="text-sm font-bold text-gray-100 mt-1">Customer is collecting the order...</p>
                    <p className="text-[10.5px] text-gray-400 font-medium mt-0.5">Please step downstairs to collect your fresh delivery from {assignedPartner.name}.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
                    00:{collectingCountdown < 10 ? `0${collectingCountdown}` : collectingCountdown}
                  </span>
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 animate-pulse">
                    {collectingCountdown}s
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Status Header Block */}
          {currentStage === TrackingStage.DELIVERED ? (
            <SuccessBanner isDarkMode={isDarkMode} />
          ) : (
            <div className={`glass-panel rounded-[32px] p-6 text-left relative overflow-hidden border ${
              isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -mr-6 -mt-6" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none" id="tracking-headline">
                    {headerDetails.title}
                  </h1>
                  <p className="text-[10.5px] text-gray-400 font-extrabold mt-1.5 uppercase tracking-widest leading-normal" id="tracking-subline">
                    {headerDetails.desc}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-4 mt-4">
                    <div className="flex flex-col gap-1 sm:border-r sm:border-white/10 sm:pr-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">ETA</span>
                      <span className="text-2xl font-black tracking-tight" id="tracking-eta-display">
                        {currentStage === TrackingStage.DELIVERED ? 'Arrived' : etaMetrics.displayEtaStr}
                      </span>
                      {currentStage !== TrackingStage.DELIVERED && (
                        <span className="text-xs font-black font-mono text-gray-400 bg-white/5 border border-white/5 rounded-md px-1.5 py-0.5 mt-0.5 tracking-wider w-fit" id="tracking-countdown-live">
                          ⏱️ {etaMetrics.liveCountdownStr}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Elapsed Time</span>
                      <span className="text-sm font-bold text-gray-400 font-mono" id="tracking-elapsed-display">
                        {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GPS Map Component */}
          {currentStage !== TrackingStage.DELIVERED ? (
            <LiveDeliveryMap currentStage={currentStage} isDarkMode={isDarkMode} demoMode={demoMode} elapsedSeconds={elapsedSeconds} selectedAddress={selectedAddress} />
          ) : (
            /* Show Rating & Thank You Card panels when delivered */
            <div className="space-y-6 animate-fade-in">
              <ThankYouCard isDarkMode={isDarkMode} />
              <DeliveryRating 
                isDarkMode={isDarkMode} 
                driverName={assignedPartner.name} 
                onSubmit={(review) => console.log('Rating saved locally:', review)} 
              />
            </div>
          )}

          {/* Premium Delivery Partner Card */}
          {currentStageIdx >= 3 && currentStage !== TrackingStage.DELIVERED && (
            <div className={`glass-panel rounded-[32px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left border relative overflow-hidden transition-all duration-500 animate-slide-up-spring ${
              isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
            }`} id="driver-card-container">
              
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative shrink-0">
                  {assignedPartner.avatar && !avatarError ? (
                    <img 
                      src={assignedPartner.avatar} 
                      alt={assignedPartner.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg shrink-0"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white font-extrabold text-xl shadow-lg border-2 border-white select-none shrink-0">
                      {assignedPartner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse">
                    ✓
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm">{assignedPartner.name}</span>
                    <span className="text-[9px] font-black text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/15 uppercase tracking-wider">
                      ★ {assignedPartner.rating} Rating
                    </span>
                    <span className="text-[8.5px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 uppercase tracking-widest">
                      {assignedPartner.experienceBadge}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {assignedPartner.vehicleType} • <span className="font-mono text-xs text-indigo-500 font-bold">{assignedPartner.vehicleNumber}</span> • {assignedPartner.totalDeliveries} Deliveries
                  </div>
                  <p className="text-[9px] text-emerald-500 font-extrabold uppercase tracking-widest">Verified Brew & Bites Courier • Contactless Assured</p>
                </div>
              </div>

              {/* Dynamic ETA indicator & custom communication actions on driver card */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/10 pt-4 sm:pt-0 gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest">Distance remaining</span>
                  <span className="text-sm font-black text-indigo-500 block">
                    {etaMetrics.distanceStr}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsCallPopupOpen(true);
                      setCallStatus('incoming');
                      if (!voiceMuted) playPhoneRing();
                    }}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                      isDarkMode ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-xs'
                    }`}
                    title={`Call ${assignedPartner.name}`}
                  >
                    <Phone className="w-4.5 h-4.5 text-emerald-500" />
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                      isDarkMode ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shadow-xs'
                    }`}
                    title={`Chat with ${assignedPartner.name}`}
                  >
                    <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {currentStageIdx < 3 && currentStage !== TrackingStage.DELIVERED && (
            /* Shimmering Skeletal state while preparing */
            <div className={`glass-panel rounded-[32px] p-6 flex items-center justify-between gap-4 text-left border relative overflow-hidden ${
              isDarkMode ? 'bg-gray-950/20 border-white/5 text-white/50' : 'bg-white/20 border-white/25 text-gray-400'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-400/10 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-400/15 rounded-md animate-pulse" />
                  <div className="h-3 w-48 bg-gray-400/10 rounded-md animate-pulse" />
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400/60 animate-pulse">Assigning Courier...</span>
            </div>
          )}

        </div>

        {/* Right column: Vertical Timeline or Digital Receipt (Delivered state) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Delivery Voice Studio Card */}
          {currentStage !== TrackingStage.DELIVERED && (
            <div className={`glass-panel rounded-[32px] p-6 text-left border relative overflow-hidden transition-all duration-300 ${
              isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
            }`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">🎙️ Voice Studio</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">Interactive simulation</span>
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setVoiceMuted(prev => !prev)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        voiceMuted 
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' 
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                      title={voiceMuted ? "Unmute Delivery Calls" : "Mute Delivery Calls"}
                    >
                      {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className="text-xs font-black block">Call Audio Speech</span>
                      <span className="text-[10px] text-gray-400 font-medium leading-none">
                        {voiceMuted ? 'Muted (Simulation Mode)' : 'Unmuted (Speaks Live)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rate:</span>
                    <input 
                      type="range" 
                      min="0.8" 
                      max="1.5" 
                      step="0.1" 
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-20 accent-emerald-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono font-bold text-indigo-400">{voiceSpeed.toFixed(1)}x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 font-semibold italic">Re-trigger call screen anytime:</span>
                  <button
                    onClick={() => {
                      setIsCallPopupOpen(true);
                      setCallStatus('incoming');
                      if (!voiceMuted) playPhoneRing();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Replay Last Call</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {currentStage !== TrackingStage.DELIVERED ? (
            <div className={`glass-panel rounded-[32px] p-6 sm:p-8 text-left border ${
              isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
                <span>Order Milestones</span>
                <span className="text-[10px] font-bold text-indigo-400">{currentStageIdx + 1}/8 Steps</span>
              </h3>

              {/* Vertical Timeline Stages */}
              <div className="relative pl-8 space-y-8">
                {/* Connective gray progress line */}
                <div className="absolute top-3 left-[15px] bottom-3 w-0.5 bg-gray-400/20" />
                <div 
                  className="absolute top-3 left-[15px] w-0.5 bg-indigo-500 transition-all duration-1000 ease-in-out"
                  style={{ height: progressPercent }}
                />

                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStageIdx;
                  const isActive = idx === currentStageIdx;

                  return (
                    <div key={idx} className="relative flex gap-4 text-xs group" id={`tracker-step-${idx}`}>
                      {/* Ring Marker */}
                      <div className="absolute -left-8 top-0.5 flex items-center justify-center w-8 h-8 z-10">
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white shadow-md transition-all duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isActive ? (
                          <div className="relative flex items-center justify-center w-8 h-8 transition-all duration-300">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-indigo-500 font-extrabold text-[10px] shadow-md">
                              ●
                            </div>
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-gray-400 transition-all duration-300 ${
                            isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-gray-100 border-gray-200'
                          }`} />
                        )}
                      </div>

                      {/* Step Texts */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm select-none">{step.emoji}</span>
                          <h4 className={`font-black text-sm tracking-tight transition-colors duration-300 ${
                            isActive 
                              ? 'text-indigo-500' 
                              : isCompleted 
                                ? 'text-gray-900 dark:text-white font-bold' 
                                : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h4>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed transition-all duration-300 ${
                          isActive 
                            ? 'text-gray-600 dark:text-gray-300 font-medium' 
                            : isCompleted 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-gray-300 dark:text-gray-600/45'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Digital Receipt (Serrated, high-fidelity card) */
            <div className={`glass-panel rounded-[32px] p-6 text-left border relative overflow-hidden transition-all duration-300 ${
              isDarkMode ? 'bg-gray-950/40 border-white/10 text-white' : 'bg-white/45 border-white/35 text-gray-950'
            }`}>
              
              {/* Receipt Header */}
              <div className="text-center pb-5 border-b border-dashed border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6F3B16] to-[#B86B2B] flex items-center justify-center text-white font-extrabold text-sm mx-auto mb-2.5">
                  B
                </div>
                <h3 className="font-black text-base tracking-tight text-indigo-400">Brew & Bites Café</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Official Digital Receipt</p>
              </div>

              {/* Receipt metadata */}
              <div className="py-4 space-y-1.5 text-[10px] font-mono text-gray-400 border-b border-dashed border-white/20">
                <div className="flex justify-between">
                  <span>RECEIPT NUMBER:</span>
                  <span className="font-bold text-gray-300 dark:text-gray-100">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>ORDER NUMBER:</span>
                  <span className="font-bold text-gray-300 dark:text-gray-100">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE & TIME:</span>
                  <span className="font-bold text-gray-300">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYMENT METHOD:</span>
                  <span className="font-bold text-emerald-500">UPI Secure (SUCCESS)</span>
                </div>
              </div>

              {/* Items listing */}
              <div className="py-4 border-b border-dashed border-white/20 space-y-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Delicacies Served</span>
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="select-none filter drop-shadow-sm">{item.menuItem.emoji}</span>
                      <span>{item.menuItem.name} <span className="text-gray-400 font-normal">x {item.quantity}</span></span>
                    </span>
                    <span>₹{item.menuItem.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Receipt Breakdown of values */}
              <div className="py-4 border-b border-dashed border-white/20 space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={isFreeDelivery ? 'line-through text-gray-500' : 'font-bold'}>₹{baseDeliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold">₹{6}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (9%)</span>
                  <span className="font-bold">₹{gst}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-500 font-bold">
                    <span>Coupon Applied ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="py-4 flex justify-between items-center">
                <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-400">Total Authorized</span>
                <span className="font-black text-amber-500 text-xl tracking-tight">₹{grandTotal}</span>
              </div>

              {/* Print, share, download actions row */}
              <div className="pt-4 border-t border-dashed border-white/20 grid grid-cols-3 gap-2 shrink-0 relative">
                
                {/* Temporary Success Notification inside the digital receipt */}
                <AnimatePresence>
                  {receiptToast && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-0 -top-10 bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{receiptToast}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleDownloadPDF}
                  className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isDarkMode ? 'border-white/15 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  disabled={downloading}
                >
                  <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                  <span>{downloading ? 'Saving...' : 'Download'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Brew & Bites Order Receipt ${orderId}`);
                    triggerToast('Sharing Link Copied!', setSharing);
                  }}
                  className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isDarkMode ? 'border-white/15 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  disabled={sharing}
                >
                  <Share2 className={`w-3.5 h-3.5 ${sharing ? 'animate-pulse' : ''}`} />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => {
                    window.print();
                    triggerToast('Serrating Printer Spooled!', setPrinting);
                  }}
                  className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[9px] font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isDarkMode ? 'border-white/15 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  disabled={printing}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              {/* QR Code and Delivery details */}
              <div className="mt-4 pt-4 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center gap-4">
                {/* Real Verifiable QR */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                      `Receipt: ${receiptNumber}\nOrder ID: ${orderId}\nTotal: INR ${grandTotal}\nDate: ${new Date().toLocaleDateString()}`
                    )}`}
                    alt="Receipt QR"
                    className="w-20 h-20 rounded-lg bg-white p-1 border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[7px] font-mono text-gray-400 uppercase font-black">Scan to verify</span>
                </div>

                {/* Delivery details */}
                <div className="flex-1 text-left text-[10px] text-gray-400 space-y-1">
                  <div>
                    <span className="font-extrabold uppercase text-[8px] text-indigo-400 block">Delivery Location</span>
                    {selectedAddress ? (
                      <p className="font-semibold text-gray-300 dark:text-gray-800 truncate max-w-[150px]">
                        {selectedAddress.houseNumber}, {selectedAddress.street}, {selectedAddress.area}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">Home Coordinates</p>
                    )}
                  </div>

                  <div>
                    <span className="font-extrabold uppercase text-[8px] text-indigo-400 block">Courier</span>
                    <p className="font-semibold text-gray-300 dark:text-gray-800">{assignedPartner.name}</p>
                  </div>
                </div>
              </div>

              {/* Thank you message */}
              <div className="mt-5 text-center text-[10px] text-gray-500 font-extrabold tracking-wide uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Thank you for ordering!</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. ULTRA REALISTIC VOICE CALL MODAL (TRIGGERED AT ~2 MINS ETA) */}
      {isCallPopupOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="incoming-call-modal">
          <div className="w-full max-w-sm rounded-[32px] overflow-hidden bg-gray-900 border border-white/15 p-8 text-center text-white relative shadow-2xl animate-scale-up">
            
            {/* Top Close icon (X) */}
            <button 
              onClick={() => setIsCallPopupOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {callStatus === 'incoming' && (
              <div className="space-y-6 my-auto">
                <div className="relative mx-auto w-24 h-24 mt-4 flex items-center justify-center">
                  {/* Pulsating green rings */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
                  {assignedPartner.avatar && !avatarError ? (
                    <img 
                      src={assignedPartner.avatar} 
                      alt={assignedPartner.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/40 shadow-xl z-10 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white text-3xl font-black border-4 border-emerald-500/40 select-none shadow-inner z-10 shrink-0">
                      {assignedPartner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight">{assignedPartner.name}</h2>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-widest mt-1.5 font-extrabold flex items-center justify-center gap-1">
                    <span>★ {assignedPartner.rating} Rating</span>
                    <span>•</span>
                    <span>Your delivery partner is calling...</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {assignedPartner.vehicleType} ({assignedPartner.vehicleNumber})
                  </p>
                </div>

                <div className="text-[10px] text-gray-500 animate-pulse font-mono tracking-wider">
                  📞 INCOMING CUSTOMER HANDSHAKE VOICE LINE...
                </div>

                <div className="flex items-center justify-center gap-10 pt-4">
                  {/* Decline Button */}
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={handleDeclineCall}
                      className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg shadow-rose-950/40"
                      title="Decline Call"
                    >
                      <Phone className="w-6 h-6 rotate-[135deg]" />
                    </button>
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">Decline</span>
                  </div>

                  {/* Accept Button */}
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={handleAcceptCall}
                      className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg shadow-emerald-950/40 relative animate-pulse"
                      title="Accept Call"
                    >
                      <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping -z-10" />
                      <Phone className="w-6 h-6 animate-bounce" />
                    </button>
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">Accept</span>
                  </div>
                </div>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="space-y-5 my-auto flex flex-col justify-center">
                <div className="relative mx-auto w-20 h-20 mt-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
                  {assignedPartner.avatar && !avatarError ? (
                    <img 
                      src={assignedPartner.avatar} 
                      alt={assignedPartner.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-lg shrink-0 z-10"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white text-2xl font-black border-2 border-emerald-500 select-none shadow-inner shrink-0 z-10">
                      {assignedPartner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-tight">{assignedPartner.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">Ongoing Call</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono text-emerald-400 font-black">{formatCallDuration(callDuration)}</span>
                  </div>
                </div>

                {/* Animated Audio Waveform visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-14 py-2">
                  {[...Array(12)].map((_, i) => {
                    const heights = ['h-3', 'h-10', 'h-14', 'h-8', 'h-12', 'h-6', 'h-11', 'h-4', 'h-13', 'h-7', 'h-9', 'h-5'];
                    const randomHeightClass = heights[i % heights.length];
                    return (
                      <div 
                        key={i} 
                        className={`w-1 bg-emerald-500 rounded-full transition-all duration-300 ${
                          isSpeaking ? 'animate-pulse bg-emerald-400' : 'opacity-30 bg-gray-600'
                        } ${isSpeaking ? randomHeightClass : 'h-1.5'}`}
                        style={{ 
                          animationDelay: `${i * 0.08}s`,
                          animationDuration: isSpeaking ? `${0.4 + (i % 3) * 0.2}s` : '0s'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Subtitles box (Displays live spoken transcript) */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left min-h-[96px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/5 rounded-full blur-md" />
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider mb-1 text-indigo-400 select-none">
                    <span>{currentSpeaker === 'partner' ? `${assignedPartner.name} (Rider)` : 'You (Customer)'}</span>
                    <span className="animate-pulse text-emerald-400">● Speaking...</span>
                  </div>
                  <p className="text-[11.5px] font-medium leading-relaxed text-gray-100 italic transition-all duration-300">
                    "{currentSpeechText || 'Connecting audio feeds...'}"
                  </p>
                </div>

                {/* Call Action controls row */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
                  {/* Call Mute button inside Call modal */}
                  <button
                    onClick={() => setVoiceMuted(prev => !prev)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      voiceMuted 
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' 
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    title={voiceMuted ? "Unmute Call" : "Mute Call"}
                  >
                    {voiceMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                  </button>

                  <button 
                    onClick={handleHangUpCall}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 font-extrabold text-[10px] uppercase tracking-widest shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    End Handshake Call
                  </button>

                  {/* Speed toggle inside Call modal */}
                  <button
                    onClick={() => {
                      const rates = [1.0, 1.2, 1.5, 0.8];
                      const nextRate = rates[(rates.indexOf(voiceSpeed) + 1) % rates.length];
                      setVoiceSpeed(nextRate);
                    }}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-[10px] font-mono font-bold text-indigo-400 flex items-center justify-center transition-all hover:bg-white/10"
                    title="Toggle speed"
                  >
                    {voiceSpeed.toFixed(1)}x
                  </button>
                </div>
              </div>
            )}

            {callStatus === 'declined' && (
              <div className="space-y-6 py-8 my-auto animate-fade-in text-gray-400">
                <span className="text-4xl block animate-bounce">🔇</span>
                <p className="text-xs font-black uppercase tracking-widest text-rose-400 leading-none">Line Terminated</p>
                <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto leading-relaxed">Proceeding with drop-off protocols automatically...</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LIVE CHAT WITH DRIVER */}
      <AnimatePresence>
        {isChatOpen && (
          <LiveChat 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            isDarkMode={isDarkMode} 
            driverName={assignedPartner.name} 
          />
        )}
      </AnimatePresence>

      {/* 6. SECRET ANNIVERSARY TRANSITIONS AND OVERLAY */}
      {isTransitionActive && (
        <div 
          className={`fixed inset-0 bg-black z-[90] transition-opacity duration-[2000ms] ease-in-out pointer-events-auto ${
            fadeToBlack ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {showAnniversarySecret && (
        <AnniversarySecret 
          onClose={() => {
            setShowAnniversarySecret(false);
            setFadeToBlack(false);
            setIsTransitionActive(false);
            onBackToMenu();
          }}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
};
