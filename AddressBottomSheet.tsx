import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MapPin, Edit3, Trash2, Plus, Star, Compass, Phone, AlertTriangle, ChevronLeft, History, Check } from 'lucide-react';
import { SavedAddress } from '../types';

interface AddressBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddAddress: () => void;
  onEditAddress: (address: SavedAddress) => void;
  onDeleteAddress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onSetDefault: (id: string) => void;
  onUseCurrentLocation: () => void;
  isDarkMode: boolean;
  isLocationLoading?: boolean;
}

const EXAMPLE_SEARCHES = [
  'MJ Woods',
  'Patia',
  'KIIT',
  'Nexus Esplanade',
  'Infocity',
  'AIIMS Bhubaneswar'
];

export const AddressBottomSheet: React.FC<AddressBottomSheetProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onToggleFavorite,
  onSetDefault,
  onUseCurrentLocation,
  isDarkMode,
  isLocationLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Load Recent Searches from localStorage (last 5)
  const [recentSearches, setRecentSearches] = useState<SavedAddress[]>(() => {
    const stored = localStorage.getItem('brew_bites_recent_searches');
    return stored ? JSON.parse(stored) : [];
  });

  // OpenStreetMap Nominatim autocomplete with debounce (450ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const query = searchQuery.trim().toLowerCase();
        const customSuggestions: any[] = [];

        // Check if query is 'mj woods' or includes it
        const isMatch = query.includes('mj') || query.includes('wood') || query.includes('natwar') || query.includes('vatika') || query.includes('gims') || query.includes('andharua') || query.includes('jagannathprasad');
        if (isMatch) {
          customSuggestions.push({
            place_id: 'custom-mj-woods',
            lat: '20.3164',
            lon: '85.7355',
            display_name: 'Natwar Vatika, Near GIMS, Andharua, Jagannathprasad, Bhubaneswar, Odisha 751029, India',
            name: 'MJ Woods',
            address: {
              building: 'MJ Woods',
              road: 'Natwar Vatika',
              suburb: 'Andharua, Jagannathprasad',
              city: 'Bhubaneswar',
              state: 'Odisha',
              postcode: '751029',
              country: 'India'
            }
          });
        }

        // Fetch remaining results from Nominatim
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          const osmData = data || [];
          
          // Combine and filter out duplicates
          const combined = [...customSuggestions];
          osmData.forEach((item: any) => {
            const isDuplicate = combined.some(c => 
              Math.abs(parseFloat(c.lat) - parseFloat(item.lat)) < 0.001 &&
              Math.abs(parseFloat(c.lon) - parseFloat(item.lon)) < 0.001
            );
            if (!isDuplicate) {
              combined.push(item);
            }
          });
          setSuggestions(combined);
        } else {
          setSuggestions(customSuggestions);
        }
      } catch (err) {
        console.error('Error fetching Nominatim suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle address selection from searched list or recent searches
  const handleSelectSearchedItem = (item: any) => {
    const isCustomMjWoods = item.place_id === 'custom-mj-woods';

    const placeName = isCustomMjWoods ? 'MJ Woods' : (
      item.address?.building ||
      item.address?.amenity ||
      item.address?.shop ||
      item.address?.office ||
      item.address?.tourism ||
      item.address?.road ||
      item.name ||
      'Point of Interest'
    );

    const city = isCustomMjWoods ? 'Bhubaneswar' : (
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.suburb ||
      'Bhubaneswar'
    );

    const cleanAddress: SavedAddress = isCustomMjWoods ? {
      id: `searched-mj-woods-${Date.now()}`,
      name: `MJ Woods 📍`,
      houseNumber: 'MJ Woods',
      street: 'Natwar Vatika',
      area: 'Andharua, Jagannathprasad',
      landmark: 'Near GIMS',
      city: 'Bhubaneswar',
      state: 'Odisha',
      pincode: '751029',
      phone: '',
      isDefault: false,
      isFavorite: false,
      recentlyUsedAt: Date.now(),
      latitude: 20.3164,
      longitude: 85.7355
    } : {
      id: `searched-${Date.now()}`,
      name: `${placeName} 📍`,
      houseNumber: item.address?.building || item.address?.house_number || 'Lobby Level',
      street: item.address?.road || 'Main Road',
      area: item.address?.suburb || item.address?.neighbourhood || item.address?.county || '',
      landmark: item.address?.suburb || 'Searched Landmark',
      city: city,
      state: item.address?.state || 'Odisha',
      pincode: item.address?.postcode || '751001',
      phone: '',
      isDefault: false,
      isFavorite: false,
      recentlyUsedAt: Date.now(),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon)
    };

    // Save searched item globally
    saveAndSelectAddress(cleanAddress);
  };

  // Helper to save and select searched address
  const saveAndSelectAddress = (addr: SavedAddress) => {
    // 1. Save globally in App coordinates (write direct callback simulation)
    const storedAddrs = localStorage.getItem('brew_bites_addresses');
    let addrList: SavedAddress[] = storedAddrs ? JSON.parse(storedAddrs) : [];

    // Filter duplicates based on similar lat/lng
    const existsIndex = addrList.findIndex(
      (a) =>
        a.latitude &&
        a.longitude &&
        Math.abs(a.latitude - (addr.latitude || 0)) < 0.0001 &&
        Math.abs(a.longitude - (addr.longitude || 0)) < 0.0001
    );

    let selectedId = addr.id;
    if (existsIndex >= 0) {
      // Address exists, set the ID to existing and update recentlyUsedAt
      addrList[existsIndex].recentlyUsedAt = Date.now();
      selectedId = addrList[existsIndex].id;
    } else {
      // Add as a new registered saved address
      addrList = [addr, ...addrList];
    }
    localStorage.setItem('brew_bites_addresses', JSON.stringify(addrList));

    // Save to recent searches
    let recentList = [...recentSearches];
    recentList = recentList.filter(
      (r) =>
        r.latitude !== addr.latitude ||
        r.longitude !== addr.longitude
    );
    recentList.unshift(addr);
    if (recentList.length > 5) recentList.pop();
    localStorage.setItem('brew_bites_recent_searches', JSON.stringify(recentList));
    setRecentSearches(recentList);

    // Call state update in parent app
    onSelectAddress(selectedId);
    
    // Close the bottom sheet cleanly
    onClose();
  };

  const handleSelectRecentSearch = (addr: SavedAddress) => {
    saveAndSelectAddress(addr);
  };

  const handleDeleteConfirm = () => {
    if (addressToDelete) {
      onDeleteAddress(addressToDelete);
      setAddressToDelete(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center" id="address-sheet-backdrop">
      {/* Soft dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Floating Full-Screen Address Autocomplete Search Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className={`relative w-full max-w-2xl rounded-t-[36px] sm:rounded-[36px] sm:mb-6 mx-auto glass-panel p-6 sm:p-8 shadow-2xl z-10 h-[92vh] max-h-[92vh] flex flex-col ${
          isDarkMode ? 'bg-[#0e0c0a]/95 border-white/10 text-white' : 'bg-[#fcfaf7]/95 border-amber-900/10 text-[#2c1f15]'
        }`}
        id="address-bottom-sheet"
      >
        {/* iOS Grab Handle */}
        <div className="w-12 h-1.5 bg-gray-400/20 rounded-full mx-auto mb-4 shrink-0" />

        {/* Premium Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-600'
              }`}
              title="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h2 className="text-lg font-black tracking-tight font-sans">Set Delivery Address</h2>
              <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold">
                Professional Autocomplete System
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Autocomplete Input */}
        <div className="space-y-3 shrink-0 mb-4">
          <div className={`flex items-center border rounded-2xl px-4 py-3 transition-all ${
            isDarkMode
              ? 'bg-white/5 border-white/10 focus-within:border-amber-500/40'
              : 'bg-white border-amber-900/10 focus-within:border-amber-700/40 shadow-sm'
          }`}>
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search for area, apartment, street or landmark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-xs bg-transparent border-none outline-none w-full font-semibold ${
                isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'
              }`}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-black/10 rounded-full cursor-pointer text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Example searches tag chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {EXAMPLE_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border cursor-pointer hover:scale-102 ${
                  isDarkMode
                    ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-amber-50 border-amber-900/10 text-amber-900 hover:bg-amber-100/50'
                }`}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Core Action buttons (GPS & Add manual) */}
          {!searchQuery && (
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onUseCurrentLocation}
                disabled={isLocationLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none shadow-xs ${
                  isLocationLoading
                    ? 'bg-amber-500/15 text-amber-500 animate-pulse'
                    : 'bg-amber-600/10 text-amber-600 hover:bg-amber-600/20 active:scale-98'
                }`}
              >
                <Compass className={`w-4 h-4 ${isLocationLoading ? 'animate-spin' : ''}`} />
                <span>{isLocationLoading ? 'Locking Satellite...' : '📍 Use Current Location'}</span>
              </button>

              <button
                onClick={onAddAddress}
                className="px-5 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] text-white font-black text-xs uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all cursor-pointer border-none shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Manual Form</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable suggestions or sections list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-none pb-8">
          {searchQuery ? (
            /* Searching State autocomplete suggestions list */
            isSearching ? (
              <div className="space-y-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 border animate-pulse flex items-start gap-3.5 ${
                      isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white/50 border-black/5'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-400/20 shrink-0" />
                    <div className="space-y-2 flex-1 pt-1">
                      <div className="h-3.5 bg-gray-400/20 rounded-md w-1/3" />
                      <div className="h-3 bg-gray-400/20 rounded-md w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-4xl block mb-3.5 select-none animate-bounce">📍</span>
                <h3 className="font-sans font-black text-base text-gray-500">No matching locations found</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  We couldn't decode that query. Try typing area, landmark, or apartment name.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest mb-2">
                  Search Results from OpenStreetMap
                </span>
                {suggestions.map((item) => {
                  const isCustomMj = item.place_id === 'custom-mj-woods';
                  const placeName = isCustomMj ? 'MJ Woods' : (
                    item.address?.building ||
                    item.address?.amenity ||
                    item.address?.shop ||
                    item.address?.office ||
                    item.address?.tourism ||
                    item.address?.road ||
                    'Point of Interest'
                  );
                  const displayName = isCustomMj ? 'Natwar Vatika, Near GIMS, Andharua, Jagannathprasad, Bhubaneswar, Odisha 751029' : item.display_name;

                  return (
                    <button
                       key={item.place_id}
                       onClick={() => handleSelectSearchedItem(item)}
                       className={`w-full group text-left rounded-2xl p-4 border transition-all flex items-start gap-3.5 cursor-pointer hover:scale-101 ${
                        isDarkMode
                           ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-amber-500/20'
                           : 'bg-white border-amber-900/10 hover:bg-amber-50/40 hover:border-amber-700/30'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-sans font-black text-xs tracking-tight truncate group-hover:text-amber-500 transition-colors">
                          {isCustomMj ? '📍 ' : ''}{placeName}
                        </h4>
                        {isCustomMj ? (
                          <p className={`text-[10px] leading-relaxed font-bold whitespace-pre-line ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Natwar Vatika,
                            Near GIMS, Andharua,
                            Jagannathprasad, Bhubaneswar,
                            Odisha 751029
                          </p>
                        ) : (
                          <p className={`text-[10px] leading-tight font-medium truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {displayName}
                          </p>
                        )}
                        <div className="flex gap-1.5 pt-1 flex-wrap">
                          {item.address?.city && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-400/15 text-gray-400 uppercase font-black tracking-wider leading-none">
                              {item.address.city}
                            </span>
                          )}
                          {item.address?.state && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-400/15 text-gray-400 uppercase font-black tracking-wider leading-none">
                              {item.address.state}
                            </span>
                          )}
                          {item.address?.country && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase font-black tracking-wider leading-none">
                              {item.address.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            /* Recent Searches & Saved Addresses default landing screen */
            <>
              {/* Recent Searches section */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest">
                    Recent Searches
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {recentSearches.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => handleSelectRecentSearch(addr)}
                        className={`w-full group text-left rounded-2xl p-3 border.5 transition-all flex items-center justify-between cursor-pointer ${
                          isDarkMode
                            ? 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10'
                            : 'bg-[#faf7f3] border-amber-900/5 hover:bg-[#f6eee3] hover:border-amber-900/10 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <History className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-amber-500 transition-colors" />
                          <div className="min-w-0">
                            <span className="font-sans font-bold text-xs truncate block">
                              {addr.name}
                            </span>
                            <span className="text-[9px] text-gray-400 truncate block leading-none pt-0.5">
                              {addr.houseNumber}, {addr.street}, {addr.city}
                            </span>
                          </div>
                        </div>
                        <Check className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Addresses section */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-widest">
                    Saved Deliveries ({addresses.length})
                  </span>
                  <button
                    onClick={onAddAddress}
                    className="text-[9px] font-black uppercase text-amber-500 tracking-wider hover:underline cursor-pointer"
                  >
                    + Add New Destination
                  </button>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`group relative rounded-3xl p-5 border text-left transition-all duration-300 flex items-start gap-3.5 ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-amber-500/10 border-amber-500/30 shadow-md ring-1 ring-amber-500/10'
                              : 'bg-amber-600/5 border-amber-600/20 shadow-md ring-1 ring-amber-600/10'
                            : isDarkMode
                              ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                              : 'bg-white/60 border-amber-900/10 hover:bg-white hover:border-[#6f3b16]/25 shadow-xs'
                        }`}
                      >
                        {/* Select Trigger Area */}
                        <div
                          onClick={() => onSelectAddress(addr.id)}
                          className="flex-1 flex gap-3 cursor-pointer select-none"
                        >
                          {/* Custom Radio Button */}
                          <div className="pt-0.5">
                            <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-[#B86B2B] bg-[#B86B2B]'
                                : isDarkMode
                                  ? 'border-gray-600 bg-white/5'
                                  : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-scale-up" />}
                            </div>
                          </div>

                          {/* Address details */}
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-sans font-black text-sm tracking-tight truncate">
                                {addr.name}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-wider leading-none">
                                  Default
                                </span>
                              )}
                              {addr.isFavorite && <span className="text-amber-500 text-xs">⭐</span>}
                            </div>

                            <div className={`text-[11.5px] font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <p className="font-bold">{addr.houseNumber}, {addr.street}</p>
                              <p>{addr.area}</p>
                              {addr.landmark && <p className="italic text-[10px] text-gray-500">Near: {addr.landmark}</p>}
                              <p className="font-bold">{addr.city} – {addr.pincode}</p>
                            </div>

                            {addr.phone && (
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-extrabold">
                                <Phone className="w-3.5 h-3.5 text-[#B86B2B]" />
                                <span>+91 {addr.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions Area */}
                        <div className="flex items-center gap-1 shrink-0 select-none">
                          <button
                            onClick={() => onToggleFavorite(addr.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              addr.isFavorite
                                ? 'text-amber-500 bg-amber-500/10'
                                : isDarkMode
                                  ? 'text-gray-400 hover:text-amber-400 hover:bg-white/5'
                                  : 'text-gray-500 hover:text-amber-500 hover:bg-black/5'
                            }`}
                            title="Favorite"
                          >
                            <Star className={`w-3.5 h-3.5 ${addr.isFavorite ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => onEditAddress(addr)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-[#6F3B16]'
                            }`}
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {!addr.isDefault && (
                            <button
                              onClick={() => onSetDefault(addr.id)}
                              className={`text-[8px] px-1.5 py-1 rounded border font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                isDarkMode ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-black/10 text-gray-600'
                              }`}
                              title="Set Default"
                            >
                              Default
                            </button>
                          )}

                          <button
                            onClick={() => setAddressToDelete(addr.id)}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer text-rose-500 hover:bg-rose-500/10"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* DELETE CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {addressToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => setAddressToDelete(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative max-w-sm w-full p-6 sm:p-7 rounded-[26px] glass-panel z-10 text-center space-y-4 border ${
                isDarkMode ? 'bg-[#120F0D] border-white/10 text-white' : 'bg-[#FCFAF7] border-amber-900/15 text-[#2C1F15]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-sans font-black text-base tracking-tight">Delete Saved Address?</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Are you absolutely sure you want to purge this address? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAddressToDelete(null)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border-none cursor-pointer ${
                    isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-black/5 text-gray-600 hover:bg-black/10'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-600 cursor-pointer border-none shadow-sm animate-pulse"
                >
                  Delete Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
