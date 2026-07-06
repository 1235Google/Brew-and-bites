import { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { BottomNavbar } from './components/BottomNavbar';
import { HomeTab } from './components/HomeTab';
import { FavoritesTab } from './components/FavoritesTab';
import { ProfileTab } from './components/ProfileTab';
import { MenuCard } from './components/MenuCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutScreen } from './components/CheckoutScreen';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { TrackingScreen } from './components/TrackingScreen';
import { NotificationToast } from './components/NotificationToast';
import { DynamicIsland } from './components/DynamicIsland';
import { AddressBottomSheet } from './components/AddressBottomSheet';
import { AddressModal } from './components/AddressModal';
import { HistoryTab } from './components/HistoryTab';
import { Footer } from './components/Footer';
import { AboutPage, ContactPage, HelpPage, PrivacyPage, TermsPage, RefundPage, NotFoundPage } from './components/InfoPages';
import { AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from './data/menu';
import { MenuItem, CartItem, ToastNotification, TrackingStage, Coupon, WeatherInfo, SavedAddress } from './types';
import { 
  playAddToCart, 
  playOrderPlaced, 
  playOrderAccepted, 
  playOutForDelivery, 
  playDeliverySuccess, 
  setMuted,
  playPhoneRing,
  playDoorbell
} from './utils/audio';
import { ShoppingBag, ArrowRight, Sparkles, Star, ShieldCheck, HelpCircle, Heart, Receipt } from 'lucide-react';
import { getEtaMetrics, getTotalDeliverySeconds, getStageLimits } from './utils/eta';
import { DELIVERY_PARTNERS, VOICE_CONVERSATIONS, DeliveryPartner, VoiceScript } from './data/partners';

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

export default function App() {
  // Theme & Sound Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Premium Routing Tabs & Favorites
  const [activeTab, setActiveTab] = useState<'HOME' | 'MENU' | 'ORDERS' | 'FAVORITES' | 'PROFILE' | 'ABOUT' | 'CONTACT' | 'HELP' | 'PRIVACY' | 'TERMS' | 'REFUND' | 'NOT_FOUND' | 'HISTORY'>('HOME');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('brew_bites_favorites');
    return stored ? JSON.parse(stored) : ['m1', 'm5']; // Preloaded favorites for realistic luxurious demo
  });

  // Saved Addresses State Engine
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const stored = localStorage.getItem('brew_bites_addresses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If it contains old Patia or Bengaluru coordinates, force upgrade to precise MJ Woods seeds
        const hasOldWoods = parsed.some((a: any) => a.houseNumber === 'MJ Woods' && a.pincode === '751024');
        const hasBangalore = parsed.some((a: any) => a.city === 'Bengaluru');
        if (!hasBangalore && !hasOldWoods && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    const seeds: SavedAddress[] = [
      {
        id: 'addr-1',
        name: 'Home 🏡',
        houseNumber: 'MJ Woods',
        street: 'Natwar Vatika',
        area: 'Andharua, Jagannathprasad',
        landmark: 'Near GIMS',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751029',
        phone: '9876543210',
        isDefault: true,
        isFavorite: true,
        recentlyUsedAt: Date.now(),
        latitude: 20.3164,
        longitude: 85.7355
      },
      {
        id: 'addr-2',
        name: 'Office 💼',
        houseNumber: 'KIIT Campus 3',
        street: 'Patia',
        area: 'Bhubaneswar',
        landmark: 'Near Infocity',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751024',
        phone: '9876500123',
        isDefault: false,
        isFavorite: false,
        recentlyUsedAt: Date.now() - 3600000,
        latitude: 20.3522,
        longitude: 85.8183
      }
    ];
    localStorage.setItem('brew_bites_addresses', JSON.stringify(seeds));
    return seeds;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    const stored = localStorage.getItem('brew_bites_selected_address_id');
    if (stored) return stored;
    // Fallback to default address if exists, otherwise first address
    const storedAddrs = localStorage.getItem('brew_bites_addresses');
    if (storedAddrs) {
      try {
        const parsed: SavedAddress[] = JSON.parse(storedAddrs);
        const def = parsed.find(a => a.isDefault);
        if (def) return def.id;
        if (parsed.length > 0) return parsed[0].id;
      } catch(e) {}
    }
    return 'addr-1';
  });

  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState<boolean>(false);

  // Delivery Partner and Voice Script state
  const [assignedPartner, setAssignedPartner] = useState<DeliveryPartner>(() => {
    const storedId = localStorage.getItem('brew_bites_assigned_partner_id');
    const partner = DELIVERY_PARTNERS.find(p => p.id === storedId);
    if (partner) return partner;
    
    // Fallback
    localStorage.setItem('brew_bites_assigned_partner_id', DELIVERY_PARTNERS[0].id);
    return DELIVERY_PARTNERS[0];
  });

  const [assignedScript, setAssignedScript] = useState<VoiceScript>(() => {
    const storedId = localStorage.getItem('brew_bites_assigned_script_id');
    const script = VOICE_CONVERSATIONS.find(s => s.id === storedId);
    if (script) return script;
    
    // Fallback
    localStorage.setItem('brew_bites_assigned_script_id', VOICE_CONVERSATIONS[0].id);
    return VOICE_CONVERSATIONS[0];
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);

  // Screen View Controllers
  const [currentScreen, setCurrentScreen] = useState<'MENU' | 'CHECKOUT' | 'TRACKING'>(() => {
    const start = localStorage.getItem('brew_bites_order_start');
    if (start) {
      const demo = localStorage.getItem('brew_bites_demo_mode') === 'true';
      const elapsed = Math.floor((Date.now() - Number(start)) / 1000);
      const limitDelivered = demo ? 150 : 1500;
      if (elapsed < limitDelivered) {
        return 'TRACKING';
      }
    }
    return 'MENU';
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Application Data States
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('brew_bites_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Real-time toast queue + Persistent alert log for notification bell
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Array<{ id: string; text: string; time: string }>>([
    { id: 'h1', text: 'Welcome to Brew & Bites Café.', time: 'Just now' }
  ]);
  
  const [areNotificationsMuted, setAreNotificationsMuted] = useState<boolean>(() => {
    const stored = localStorage.getItem('brew_bites_notifications_muted');
    return stored ? stored === 'true' : true; // Default to true (muted) because user finds them irritating!
  });
  
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('brew_bites_demo_mode');
    return stored ? stored === 'true' : false; // Realistic Mode by default!
  });

  const [trackingStage, setTrackingStage] = useState<TrackingStage>(() => {
    const start = localStorage.getItem('brew_bites_order_start');
    if (start) {
      const demo = localStorage.getItem('brew_bites_demo_mode') === 'true';
      const elapsed = Math.floor((Date.now() - Number(start)) / 1000);
      
      const storedAddrs = localStorage.getItem('brew_bites_addresses');
      let currentAddr = null;
      if (storedAddrs) {
        try {
          const parsed = JSON.parse(storedAddrs);
          const storedAddrId = localStorage.getItem('brew_bites_selected_address_id');
          currentAddr = parsed.find((a: any) => a.id === storedAddrId) || parsed[0];
        } catch (e) {}
      }

      const totalSeconds = getTotalDeliverySeconds(demo, 4, currentAddr);
      const limits = getStageLimits(totalSeconds);

      if (elapsed >= limits.limitDelivered) return TrackingStage.DELIVERED;
      if (elapsed >= limits.limitNearby) return TrackingStage.NEARBY;
      if (elapsed >= limits.limitDelivery) return TrackingStage.OUT_FOR_DELIVERY;
      if (elapsed >= limits.limitAssigned) return TrackingStage.ASSIGNED;
      if (elapsed >= limits.limitPacked) return TrackingStage.PACKED;
      if (elapsed >= limits.limitPreparing) return TrackingStage.PREPARING;
      if (elapsed >= limits.limitAccepted) return TrackingStage.ACCEPTED;
      return TrackingStage.PLACED;
    }
    return TrackingStage.NOT_ORDERED;
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const start = localStorage.getItem('brew_bites_order_start');
    if (start) {
      return Math.floor((Date.now() - Number(start)) / 1000);
    }
    return 0;
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('brew_bites_cart', JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('brew_bites_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync demoMode settings with localStorage
  useEffect(() => {
    localStorage.setItem('brew_bites_demo_mode', String(demoMode));
  }, [demoMode]);

  // Sync areNotificationsMuted with localStorage
  useEffect(() => {
    localStorage.setItem('brew_bites_notifications_muted', String(areNotificationsMuted));
  }, [areNotificationsMuted]);

  // Sync addresses with localStorage
  useEffect(() => {
    localStorage.setItem('brew_bites_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Sync selectedAddressId with localStorage
  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem('brew_bites_selected_address_id', selectedAddressId);
    } else {
      localStorage.removeItem('brew_bites_selected_address_id');
    }
  }, [selectedAddressId]);

  // Dynamically geocode selected address if latitude/longitude is missing
  useEffect(() => {
    if (!selectedAddressId) return;
    const addr = addresses.find(a => a.id === selectedAddressId);
    if (!addr || (addr.latitude && addr.longitude)) return;

    const geocodeSelectedAddress = async () => {
      const queryParts = [addr.houseNumber, addr.street, addr.area, addr.city, addr.state, addr.pincode]
        .map(p => p?.trim())
        .filter(Boolean);
      
      try {
        let q = queryParts.join(', ');
        let url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
        let res = await fetch(url);
        let data = await res.json();

        if ((!data || !Array.isArray(data) || data.length === 0) && queryParts.length > 3) {
          const simplerParts = [addr.street, addr.area, addr.city, addr.state]
            .map(p => p?.trim())
            .filter(Boolean);
          q = simplerParts.join(', ');
          url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
          res = await fetch(url);
          data = await res.json();
        }

        if (data && Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setAddresses(prev => prev.map(a => a.id === addr.id ? { ...a, latitude: lat, longitude: lon } : a));
          triggerNotification(`Geocoded ${addr.name} successfully.`, '🗺️', 'success');
        } else {
          triggerNotification('Unable to locate this address.', '❌', 'warning');
        }
      } catch (err) {
        console.error('Error geocoding selected address:', err);
      }
    };

    geocodeSelectedAddress();
  }, [selectedAddressId]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || null;

  // Saved Address Handlers
  const handleSaveAddress = (addressData: Omit<SavedAddress, 'id'> & { id?: string }) => {
    if (addressData.id && addressData.id !== 'temp-gps') {
      // Edit
      setAddresses(prev => prev.map(addr => {
        if (addr.id === addressData.id) {
          return {
            ...addr,
            ...addressData,
            id: addr.id,
            isDefault: addressData.isDefault,
            isFavorite: addressData.isFavorite
          };
        }
        if (addressData.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
      triggerNotification('Address updated.', '✍️', 'success');
    } else {
      // Add
      const newId = `addr-${Date.now()}`;
      const newAddr: SavedAddress = {
        ...addressData,
        id: newId,
        recentlyUsedAt: Date.now()
      };

      setAddresses(prev => {
        let updated = prev;
        if (newAddr.isDefault) {
          updated = prev.map(a => ({ ...a, isDefault: false }));
        }
        return [...updated, newAddr];
      });

      if (!selectedAddressId || newAddr.isDefault) {
        setSelectedAddressId(newId);
      }
      triggerNotification('Address registered.', '🏡', 'success');
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
    triggerNotification('Saved address removed.', '🗑️', 'warning');
  };

  const handleToggleFavoriteAddress = (id: string) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
    triggerNotification('Address favorite status toggled.', '⭐', 'info');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    setSelectedAddressId(id);
    triggerNotification('Default address switched.', '📍', 'success');
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, recentlyUsedAt: Date.now() } : a));
    triggerNotification('Delivery destination selected.', '🗺️', 'success');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      triggerNotification('Geolocation is not supported by your browser.', '❌', 'warning');
      return;
    }
    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const name = addr.building || addr.amenity || addr.shop || addr.office || 'Current Location';
            
            const detectedAddress: SavedAddress = {
              id: `gps-${Date.now()}`,
              name: `${name} 📍`,
              houseNumber: addr.house_number || 'Apartment/Suite',
              street: addr.road || 'Current Street',
              area: addr.suburb || addr.neighbourhood || addr.county || 'HSR Layout',
              landmark: 'GPS Auto-Point',
              city: addr.city || addr.town || addr.village || 'Bengaluru',
              state: addr.state || 'Karnataka',
              pincode: addr.postcode || '560102',
              phone: '',
              isDefault: false,
              isFavorite: false,
              recentlyUsedAt: Date.now(),
              latitude: lat,
              longitude: lng
            };
            
            setAddresses(prev => [detectedAddress, ...prev]);
            setSelectedAddressId(detectedAddress.id);
            triggerNotification('GPS location locked & decoded successfully!', '📍', 'success');
            setIsAddressSheetOpen(false);
            setIsLocationLoading(false);
            return;
          }
        } catch (e) {
          console.error('Nominatim reverse lookup failed', e);
        }
        
        // Fallback if reverse lookup fails
        const fallbackAddress: SavedAddress = {
          id: `gps-${Date.now()}`,
          name: 'GPS Auto-Point 📍',
          houseNumber: 'Plot 104',
          street: '19th Main Road',
          area: 'Sector 4, HSR Layout',
          landmark: 'Detected via Satellite',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560102',
          phone: '',
          isDefault: false,
          isFavorite: false,
          recentlyUsedAt: Date.now(),
          latitude: lat,
          longitude: lng
        };
        
        setAddresses(prev => [fallbackAddress, ...prev]);
        setSelectedAddressId(fallbackAddress.id);
        triggerNotification('GPS location detected successfully!', '📍', 'success');
        setIsAddressSheetOpen(false);
        setIsLocationLoading(false);
      },
      (error) => {
        setIsLocationLoading(false);
        let msg = 'Failed to fetch current location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permission denied by user or sandbox constraints.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Satellite coordinates are unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location check timed out.';
        }
        triggerNotification(msg, '⚠️', 'warning');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Applied Coupon state & Weather conditions
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [weather, setWeather] = useState<WeatherInfo>({
    condition: 'RAINY',
    label: 'Heavy Rainstorm',
    temp: 22,
    humidity: 88,
    windSpeed: 22,
    delayMinutes: 4,
    emoji: '🌧'
  });

  // Synchronize sounds mute status
  useEffect(() => {
    setMuted(isAudioMuted);
  }, [isAudioMuted]);

  // Helper to trigger both floating Toast and Header Dropdown Log
  const triggerNotification = (message: string, emoji: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = {
      id,
      message,
      type,
      emoji,
      timestamp: new Date()
    };
    setToasts((prev) => [newToast, ...prev]);

    // Feed to dropdown history log
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotificationHistory((prev) => [
      { id, text: `${emoji} ${message}`, time: nowStr },
      ...prev
    ]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    playAddToCart();
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    triggerNotification(`Added ${item.name} to your cart.`, '☕', 'info');
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    playAddToCart(); // Soft feedback pop
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        if (copy[existingIdx].quantity <= 1) {
          triggerNotification(`Removed ${item.name} from cart.`, '🗑️', 'warning');
          return copy.filter((i) => i.menuItem.id !== item.id);
        } else {
          copy[existingIdx].quantity -= 1;
          return copy;
        }
      }
      return prev;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleProceedToPay = () => {
    setIsCartOpen(false);
    setCurrentScreen('CHECKOUT');
    setActiveTab('ORDERS');
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(itemId);
      if (isFav) {
        triggerNotification('Removed item from your favorites.', '💔', 'info');
        return prev.filter((id) => id !== itemId);
      } else {
        triggerNotification('Saved item to your favorites.', '❤️', 'success');
        return [...prev, itemId];
      }
    });
  };

  const handleClearDatabase = () => {
    localStorage.removeItem('brew_bites_order_start');
    localStorage.removeItem('brew_bites_cart');
    localStorage.removeItem('brew_bites_favorites');
    setCart([]);
    setFavorites(['m1', 'm5']);
    setAppliedCoupon(null);
    setTrackingStage(TrackingStage.NOT_ORDERED);
    setElapsedSeconds(0);
    setActiveTab('HOME');
    setCurrentScreen('MENU');
    triggerNotification('Application cache reset successfully.', '✨', 'success');
  };

  const handlePayNow = (upiId: string) => {
    setIsProcessing(true);
  };

  const handlePaymentComplete = () => {
    setIsProcessing(false);
    setCurrentScreen('TRACKING');
    setTrackingStage(TrackingStage.PLACED);
    const now = Date.now();
    localStorage.setItem('brew_bites_order_start', String(now));
    setElapsedSeconds(0);

    // Randomly assign ONE delivery partner (Never repeat consecutively if possible)
    const lastPartnerId = localStorage.getItem('brew_bites_last_partner_id');
    const candidates = DELIVERY_PARTNERS.filter(p => p.id !== lastPartnerId);
    const chosenPartner = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)];
    
    localStorage.setItem('brew_bites_assigned_partner_id', chosenPartner.id);
    localStorage.setItem('brew_bites_last_partner_id', chosenPartner.id);
    setAssignedPartner(chosenPartner);

    // Randomly choose one voice script (conversation) out of 20
    const chosenScript = VOICE_CONVERSATIONS[Math.floor(Math.random() * VOICE_CONVERSATIONS.length)];
    localStorage.setItem('brew_bites_assigned_script_id', chosenScript.id);
    setAssignedScript(chosenScript);
  };

  // Helper to map elapsed seconds to appropriate stage
  const getCurrentStageFromSeconds = (seconds: number, isDemo: boolean) => {
    const totalSeconds = getTotalDeliverySeconds(isDemo, weather.delayMinutes, selectedAddress);
    const limits = getStageLimits(totalSeconds);

    if (seconds >= limits.limitDelivered) return TrackingStage.DELIVERED;
    if (seconds >= limits.limitNearby) return TrackingStage.NEARBY;
    if (seconds >= limits.limitDelivery) return TrackingStage.OUT_FOR_DELIVERY;
    if (seconds >= limits.limitAssigned) return TrackingStage.ASSIGNED;
    if (seconds >= limits.limitPacked) return TrackingStage.PACKED;
    if (seconds >= limits.limitPreparing) return TrackingStage.PREPARING;
    if (seconds >= limits.limitAccepted) return TrackingStage.ACCEPTED;
    return TrackingStage.PLACED;
  };

  // Active timing ticks for the tracking simulation
  useEffect(() => {
    if (currentScreen !== 'TRACKING' || trackingStage === TrackingStage.NOT_ORDERED || trackingStage === TrackingStage.DELIVERED) {
      return;
    }

    const syncSeconds = () => {
      const start = localStorage.getItem('brew_bites_order_start');
      if (start) {
        setElapsedSeconds(Math.floor((Date.now() - Number(start)) / 1000));
      } else {
        localStorage.setItem('brew_bites_order_start', String(Date.now()));
        setElapsedSeconds(0);
      }
    };

    syncSeconds();
    const interval = window.setInterval(syncSeconds, 1000);
    window.addEventListener('focus', syncSeconds);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncSeconds);
    };
  }, [currentScreen, trackingStage]);

  // Synchronize trackingStage state based on elapsedSeconds & demoMode
  useEffect(() => {
    if (currentScreen !== 'TRACKING' || trackingStage === TrackingStage.NOT_ORDERED) return;
    const computedStage = getCurrentStageFromSeconds(elapsedSeconds, demoMode);
    if (computedStage !== trackingStage) {
      setTrackingStage(computedStage);
    }
  }, [elapsedSeconds, demoMode, currentScreen, trackingStage]);

  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const subtotal = cartTotalPrice;
  const isFreeDelivery = appliedCoupon?.code === 'FREEBREW' || (appliedCoupon && appliedCoupon.discountValue === 0 && appliedCoupon.code !== 'FREEBREW');
  const baseDeliveryFee = 39;
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const platformFee = 6;
  const gst = Math.round(subtotal * 0.09);
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountValue > 0) {
      couponDiscount = Math.min(subtotal, appliedCoupon.discountValue);
    } else if (isFreeDelivery) {
      couponDiscount = baseDeliveryFee;
    }
  }
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + gst - (isFreeDelivery ? 0 : couponDiscount));

  const saveCompletedOrderToHistory = () => {
    if (cart.length === 0) return;
    const orderId = localStorage.getItem('brew_bites_current_order_id') || `ORD${Math.floor(10000 + Math.random() * 90000)}`;
    const receiptNumber = localStorage.getItem('brew_bites_current_receipt_number') || `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const historyJSON = localStorage.getItem('brew_bites_order_history');
    let history: any[] = [];
    if (historyJSON) {
      try {
        history = JSON.parse(historyJSON);
      } catch (e) {
        history = [];
      }
    }

    if (history.some((o) => o.orderId === orderId)) {
      return;
    }

    const completedOrder = {
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
      } : {
        name: 'Souvik Dash',
        houseNumber: 'Plot No. 129',
        street: 'MJ Woods, Patia',
        area: 'Bhubaneswar',
        city: 'Odisha',
        pincode: '751024'
      },
      deliveryPartner: assignedPartner ? {
        name: assignedPartner.name,
        vehicleType: assignedPartner.vehicleType,
        vehicleNumber: assignedPartner.vehicleNumber
      } : {
        name: 'Rohan Sharma',
        vehicleType: 'Electric Bicycle',
        vehicleNumber: 'OR-02-B-8142'
      }
    };

    history.unshift(completedOrder);
    localStorage.setItem('brew_bites_order_history', JSON.stringify(history));
    
    localStorage.setItem('brew_bites_current_order_id', orderId);
    localStorage.setItem('brew_bites_current_receipt_number', receiptNumber);
  };

  const handleReorder = (items: Array<{ id: string; name: string; emoji: string; price: number; quantity: number }>) => {
    playAddToCart();
    setCart((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        const menuItem = MENU_ITEMS.find((m) => m.id === item.id);
        if (menuItem) {
          const idx = updated.findIndex((i) => i.menuItem.id === menuItem.id);
          if (idx > -1) {
            updated[idx].quantity += item.quantity;
          } else {
            updated.push({ menuItem, quantity: item.quantity });
          }
        }
      });
      return updated;
    });
    triggerNotification(`Reordered ${items.length} items successfully!`, '🛍️', 'success');
    setActiveTab('ORDERS');
  };

  // Handle premium chimes and notifications on stage updates
  useEffect(() => {
    if (currentScreen !== 'TRACKING' || trackingStage === TrackingStage.NOT_ORDERED) return;

    switch (trackingStage) {
      case TrackingStage.PLACED:
        triggerNotification('Payment authorized. Order confirmed!', '✓', 'success');
        playOrderPlaced();
        break;
      case TrackingStage.ACCEPTED:
        triggerNotification('Brew & Bites Café accepted your order!', '🏪', 'success');
        playOrderAccepted();
        break;
      case TrackingStage.PREPARING:
        triggerNotification('Chef started cooking! Preparing organic recipe.', '👨‍🍳', 'info');
        // Let's use playOrderAccepted for kitchen starting
        playOrderAccepted();
        break;
      case TrackingStage.PACKED:
        triggerNotification('Food packed! Sealed in custom micro-thermal glass packaging.', '📦', 'info');
        playOrderPlaced(); // soft chime
        break;
      case TrackingStage.ASSIGNED:
        triggerNotification(`Delivery Partner Assigned: ${assignedPartner.name} is arriving at Brew & Bites.`, '🚴', 'success');
        playOrderAccepted(); // nice feedback tone
        break;
      case TrackingStage.OUT_FOR_DELIVERY:
        triggerNotification(`${assignedPartner.name} picked up order! Out for delivery.`, '🛵', 'success');
        playOutForDelivery();
        break;
      case TrackingStage.NEARBY:
        triggerNotification(`${assignedPartner.name} is approaching your block! Get ready to receive.`, '📍', 'info');
        playPhoneRing(); // soft ringing tone alert
        break;
      case TrackingStage.DELIVERED:
        saveCompletedOrderToHistory();
        triggerNotification('Your delivery partner has arrived! 🛎️', '🎉', 'success');
        playDeliverySuccess();
        playDoorbell(); // Trigger doorbell sound!
        break;
      default:
        break;
    }
  }, [trackingStage, currentScreen, assignedPartner]);

  // Categories definition
  const categories = ['All', 'Beverage', 'Shake', 'Snack', 'Dessert'];
  
  // Custom filter items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Smart ETA calculations for Floating alert HUD
  const etaMetricsHUD = getEtaMetrics(elapsedSeconds, demoMode, trackingStage, weather.delayMinutes, selectedAddress);

  const getArrivalTimeStringHUD = (remSeconds: number) => {
    if (trackingStage === TrackingStage.DELIVERED) return 'Delivered';
    const d = new Date();
    d.setSeconds(d.getSeconds() + remSeconds);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const arrivalTimeStrHUD = getArrivalTimeStringHUD(etaMetricsHUD.remainingSeconds);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 antialiased font-sans ${
      isDarkMode 
        ? 'bg-gradient-to-tr from-[#0F0B09] via-[#1A130E] to-[#241A13] text-[#F3EFE9]' 
        : 'bg-gradient-to-tr from-[#FCFAF7] via-[#F4EFEA] to-[#ECE4D9] text-[#2C1F15]'
    }`}>
      
      {/* 0. FLOATING STATUS ALERT HUD */}
      <DynamicIsland 
        currentStage={trackingStage}
        isDarkMode={isDarkMode}
        etaMinutes={etaMetricsHUD.displayEtaStr}
        arrivalTimeStr={arrivalTimeStrHUD}
        distanceKm={etaMetricsHUD.distanceStr}
        latestNotification={toasts[0]?.message || ''}
        driverName="Rahul Sharma"
      />

      {/* 1. AMBIENT BACKGROUND GLOW LIGHTS (Warm Caramel and Golden Brown halos for luxury cafe feels) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#6F3B16]/8 blur-[110px] animate-float-1 animate-ambient-pulse" />
        <div className="absolute top-1/2 right-1/4 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-[#B86B2B]/6 blur-[120px] animate-float-2 animate-ambient-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full bg-[#6F3B16]/5 blur-[100px] animate-float-3 animate-ambient-pulse" />
      </div>

      {/* Toast Overlay Container */}
      {!areNotificationsMuted && (
        <NotificationToast toasts={toasts} onDismiss={handleDismissToast} isDarkMode={isDarkMode} />
      )}

      {/* 2. FLOATING TOP NAVBAR */}
      <TopNavbar 
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
        notifications={notificationHistory}
        onGoToMenuTab={() => {
          setActiveTab('MENU');
          setCurrentScreen('MENU');
        }}
        onAddToCart={handleAddToCart}
        areNotificationsMuted={areNotificationsMuted}
        onToggleNotifications={() => setAreNotificationsMuted(!areNotificationsMuted)}
      />

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <ProcessingOverlay onComplete={handlePaymentComplete} isDarkMode={isDarkMode} />
      )}

      {/* Primary Workspace screen body */}
      <main className="flex-1 pb-28 md:pb-32 z-10 w-full">
        
        {/* HOME TAB */}
        {activeTab === 'HOME' && (
          <HomeTab 
            onBrowseMenu={(category) => {
              if (category) {
                setSelectedCategory(category);
              } else {
                setSelectedCategory('All');
              }
              setActiveTab('MENU');
              setCurrentScreen('MENU');
            }}
            isDarkMode={isDarkMode}
            selectedAddress={selectedAddress}
            onOpenAddressManager={() => setIsAddressSheetOpen(true)}
            onAddAddress={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
          />
        )}

        {/* MENU TAB */}
        {activeTab === 'MENU' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 mt-20 animate-slide-up-spring" id="menu-view">
            
            {/* Search and Category header */}
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Artisanal Selection</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none font-sans">
                Our Curated Menu
              </h1>
              <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hand-selected specialty roasts, premium cold milkshakes, toasted vegetable sandwiches and gourmet pastries.
              </p>
            </div>

            {/* Functional search bar for Menu Tab */}
            <div className={`flex items-center border rounded-2xl px-4 py-3 max-w-xl focus-within:ring-2 focus-within:ring-[#B86B2B]/20 transition-all ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 focus-within:border-[#B86B2B]/30' 
                : 'bg-white border-amber-950/10 focus-within:border-[#B86B2B] shadow-sm'
            }`}>
              <span className="text-gray-400 mr-2.5 shrink-0 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Search coffee, sandwiches, cakes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`text-xs bg-transparent border-none outline-none w-full font-semibold ${
                  isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-[#2C1F15] placeholder:text-gray-400'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="p-1 hover:bg-black/10 rounded-full cursor-pointer text-gray-400 text-[10px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Menu Sections Toolbar */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t ${
              isDarkMode ? 'border-white/10' : 'border-black/5'
            }`}>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none pr-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] border-none text-white shadow-md'
                        : isDarkMode
                          ? 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                          : 'bg-white border-[#6F3B16]/10 text-gray-600 hover:border-[#6F3B16]/30 shadow-xs'
                    }`}
                  >
                    {cat === 'All' ? '🍽️ All Selection' : cat === 'Beverage' ? '☕ Fine Brews' : cat === 'Shake' ? '🥤 Creamy Shakes' : cat === 'Snack' ? '🥪 Sourdough' : '🍰 Cake Patisseries'}
                  </button>
                ))}
              </div>

              {/* Dynamic search results summary */}
              <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest shrink-0 text-left">
                <span>Displaying {filteredItems.length} curated menu items</span>
              </div>
            </div>

            {/* Menu Cards Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="menu-items-grid">
                {filteredItems.map((item) => {
                  const cartItem = cart.find((i) => i.menuItem.id === item.id);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  const isFav = favorites.includes(item.id);
                  return (
                    <MenuCard
                      key={item.id}
                      item={item}
                      quantity={quantity}
                      onAdd={handleAddToCart}
                      onRemove={handleRemoveFromCart}
                      isDarkMode={isDarkMode}
                      isFavorite={isFav}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-[32px] border p-8 ${
                isDarkMode ? 'bg-gray-950/20 border-white/10' : 'bg-white/30 border-black/5 shadow-xs'
              }`}>
                <span className="text-5xl select-none block mb-3">🔍</span>
                <h3 className="font-bold text-base">No selection found</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Adjust your premium search queries or reset categories to view our five-star hand-crafted menu.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ORDERS TAB (Checkout, Tracking, or Active Cart status hub) */}
        {activeTab === 'ORDERS' && (
          <div className="mt-20">
            {currentScreen === 'CHECKOUT' ? (
              <CheckoutScreen
                cart={cart}
                onBackToMenu={() => {
                  setCurrentScreen('MENU');
                  setActiveTab('MENU');
                }}
                onPayNow={handlePayNow}
                isDarkMode={isDarkMode}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                selectedAddress={selectedAddress}
                onOpenAddressManager={() => setIsAddressSheetOpen(true)}
              />
            ) : currentScreen === 'TRACKING' ? (
              <TrackingScreen
                currentStage={trackingStage}
                onBackToMenu={() => {
                  localStorage.removeItem('brew_bites_order_start');
                  localStorage.removeItem('brew_bites_cart');
                  handleClearCart();
                  setAppliedCoupon(null);
                  setCurrentScreen('MENU');
                  setTrackingStage(TrackingStage.NOT_ORDERED);
                  setElapsedSeconds(0);
                  setActiveTab('HOME');
                }}
                isAudioMuted={isAudioMuted}
                onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
                isDarkMode={isDarkMode}
                demoMode={demoMode}
                setDemoMode={setDemoMode}
                elapsedSeconds={elapsedSeconds}
                setElapsedSeconds={setElapsedSeconds}
                cart={cart}
                appliedCoupon={appliedCoupon}
                weather={weather}
                setWeather={setWeather}
                selectedAddress={selectedAddress}
                assignedPartner={assignedPartner}
                assignedScript={assignedScript}
              />
            ) : (
              <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-8 animate-slide-up-spring">
                
                {cart.length > 0 ? (
                  <div className={`p-8 rounded-[36px] border text-left space-y-6 ${
                    isDarkMode ? 'bg-gray-950/25 border-white/5' : 'bg-white/45 border-[#6F3B16]/10 shadow-md'
                  }`}>
                    <div className="flex items-center gap-3 border-b border-gray-300/10 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#6F3B16]/10 flex items-center justify-center text-[#6F3B16]">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-sans font-black text-base tracking-tight text-[#6F3B16]">Active Basket</h3>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{cartTotalQty} items selected</p>
                      </div>
                    </div>

                    <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1 scrollbar-none">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{item.menuItem.emoji}</span>
                            <div>
                              <p className="font-black">{item.menuItem.name}</p>
                              <span className="text-[10px] text-gray-400">Qty: {item.quantity} • ₹{item.menuItem.price} each</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-[#6F3B16]">₹{item.menuItem.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-300/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block leading-none">SUBTOTAL</span>
                        <span className="text-xl font-black text-[#B86B2B]">₹{cartTotalPrice}</span>
                      </div>

                      <button
                        onClick={handleProceedToPay}
                        className="px-6 py-3 rounded-xl bg-[#6F3B16] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-950 active:scale-95 transition-all cursor-pointer border-none"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-10 rounded-[36px] border ${
                    isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/45 border-black/5 shadow-xs'
                  }`}>
                    <div className="w-16 h-16 rounded-full bg-[#6F3B16]/10 text-[#6F3B16] flex items-center justify-center mx-auto mb-6">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="font-sans font-black text-lg tracking-tight">No Active Orders</h3>
                    <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                      You haven’t initialized any orders yet. Place a custom breakfast request on our handcrafted menu.
                    </p>
                    <button
                      onClick={() => setActiveTab('MENU')}
                      className="mt-6 px-6 py-3 rounded-xl bg-[#6F3B16] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-950 active:scale-95 transition-all cursor-pointer border-none inline-flex items-center gap-2"
                    >
                      <span>Explore Fresh Menu</span>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'FAVORITES' && (
          <FavoritesTab 
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            isDarkMode={isDarkMode}
            onBrowseMenu={() => {
              setActiveTab('MENU');
              setCurrentScreen('MENU');
            }}
          />
        )}

        {/* PROFILE TAB */}
        {activeTab === 'PROFILE' && (
          <ProfileTab 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            isAudioMuted={isAudioMuted}
            onToggleAudio={() => setIsAudioMuted(!isAudioMuted)}
            onClearDatabase={handleClearDatabase}
            favoritesCount={favorites.length}
          />
        )}

        {/* HISTORY TAB */}
        {activeTab === 'HISTORY' && (
          <HistoryTab 
            isDarkMode={isDarkMode}
            onReorder={handleReorder}
          />
        )}

        {/* INFO & LEGAL PAGES */}
        {activeTab === 'ABOUT' && (
          <AboutPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'CONTACT' && (
          <ContactPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
            triggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'HELP' && (
          <HelpPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'PRIVACY' && (
          <PrivacyPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'TERMS' && (
          <TermsPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'REFUND' && (
          <RefundPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'NOT_FOUND' && (
          <NotFoundPage 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab} 
          />
        )}

      </main>

      {/* Floating Bottom Sheet Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAdd={handleAddToCart}
        onRemove={handleRemoveFromCart}
        onCheckout={handleProceedToPay}
        isDarkMode={isDarkMode}
      />

      {/* 3. RESPONSIVE FLOATING CART NOTIFICATION PILL FOR MOBILE VIEWPORT */}
      {cart.length > 0 && activeTab === 'MENU' && (
        <div 
          className="fixed bottom-24 inset-x-0 px-4 md:hidden z-30 animate-slide-up-spring"
          id="mobile-cart-sticky-bar"
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-md mx-auto py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F3B16] via-[#854B20] to-[#B86B2B] text-white font-bold text-xs flex items-center justify-between shadow-lg border-none cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>{cartTotalQty} item{cartTotalQty > 1 ? 's' : ''} added</span>
              <span className="text-white/40">|</span>
              <span className="font-black">₹{cartTotalPrice}</span>
            </div>
            <div className="flex items-center gap-1 font-black uppercase tracking-wider text-[10px]">
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* 4. FLOATING BOTTOM NAVIGATION BAR */}
      <BottomNavbar 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'MENU') {
            setCurrentScreen('MENU');
          } else if (tab === 'HISTORY') {
            setCurrentScreen('MENU');
          } else if (tab === 'ORDERS') {
            const start = localStorage.getItem('brew_bites_order_start');
            if (start) {
              setCurrentScreen('TRACKING');
            } else if (cart.length > 0) {
              setCurrentScreen('CHECKOUT');
            } else {
              setCurrentScreen('MENU');
            }
          }
        }}
        isDarkMode={isDarkMode}
        cartCount={cartTotalQty}
      />

      {/* 5. SAVED ADDRESS BOTTOM SHEET */}
      <AnimatePresence>
        {isAddressSheetOpen && (
          <AddressBottomSheet
            isOpen={isAddressSheetOpen}
            onClose={() => setIsAddressSheetOpen(false)}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={handleSelectAddress}
            onAddAddress={() => {
              setEditingAddress(null);
              setIsAddressModalOpen(true);
            }}
            onEditAddress={(addr) => {
              setEditingAddress(addr);
              setIsAddressModalOpen(true);
            }}
            onDeleteAddress={handleDeleteAddress}
            onToggleFavorite={handleToggleFavoriteAddress}
            onSetDefault={handleSetDefaultAddress}
            onUseCurrentLocation={handleUseCurrentLocation}
            isDarkMode={isDarkMode}
            isLocationLoading={isLocationLoading}
          />
        )}
      </AnimatePresence>

      {/* 6. SAVED ADDRESS ADD/EDIT FORM MODAL */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            onSave={handleSaveAddress}
            editAddress={editingAddress}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* 7. PREMIUM GLOBAL FOOTER */}
      <Footer 
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'MENU') {
            setCurrentScreen('MENU');
          }
        }}
        onOpenAddresses={() => setIsAddressSheetOpen(true)}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
