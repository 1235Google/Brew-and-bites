import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Sparkles, Check, Phone, Landmark, Building, Navigation } from 'lucide-react';
import { SavedAddress } from '../types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, 'id'> & { id?: string }) => void;
  editAddress?: SavedAddress | null;
  isDarkMode: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editAddress,
  isDarkMode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    phone: '',
    isDefault: false,
    isFavorite: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens or editAddress changes
  useEffect(() => {
    if (isOpen) {
      if (editAddress) {
        setFormData({
          name: editAddress.name || '',
          houseNumber: editAddress.houseNumber || '',
          street: editAddress.street || '',
          area: editAddress.area || '',
          landmark: editAddress.landmark || '',
          city: editAddress.city || 'Bengaluru',
          state: editAddress.state || 'Karnataka',
          pincode: editAddress.pincode || '',
          phone: editAddress.phone || '',
          isDefault: editAddress.isDefault || false,
          isFavorite: editAddress.isFavorite || false
        });
      } else {
        setFormData({
          name: '',
          houseNumber: '',
          street: '',
          area: '',
          landmark: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '',
          phone: '',
          isDefault: false,
          isFavorite: false
        });
      }
      setErrors({});
    }
  }, [isOpen, editAddress]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Address label is required';
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House/Flat No. is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.area.trim()) newErrors.area = 'Area/Locality is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    // Pincode validation: 6 digits
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    // Phone validation (optional, but must be 10 digits if provided)
    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        id: editAddress?.id,
        latitude: editAddress?.latitude,
        longitude: editAddress?.longitude
      });
      onClose();
    }
  };

  const addressSuggestions = ['Home 🏠', 'Work 💼', 'Hostel 🏢', 'Grandma 🏡', 'Friend 🤝', 'Gym 🏋️'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark frosted overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`relative w-full max-w-lg rounded-[28px] glass-panel overflow-hidden p-6 sm:p-8 z-10 shadow-2xl border ${
          isDarkMode 
            ? 'bg-[#16120E]/95 border-white/10 text-white' 
            : 'bg-[#FCFAF7]/95 border-[#6F3B16]/20 text-[#2C1F15]'
        }`}
        id="address-modal-container"
      >
        {/* Subtle accent light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B86B2B]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6F3B16]/10 text-[#6F3B16] flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-sans font-black text-lg tracking-tight">
                {editAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                Deliver to your luxury destination
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
              isDarkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Label Selector */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 pl-0.5">
              Address Label *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {addressSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFormData({ ...formData, name: tag })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.name === tag
                      ? 'bg-[#6F3B16] text-white border-none shadow-xs'
                      : isDarkMode
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        : 'bg-white border-[#6F3B16]/10 text-gray-600 hover:border-[#6F3B16]/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom label (e.g. Partner's Place)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                errors.name 
                  ? 'border-rose-500 bg-rose-500/5' 
                  : isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                    : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
              }`}
            />
            {errors.name && <span className="text-[10px] text-rose-500 font-bold mt-1 block">{errors.name}</span>}
          </div>

          {/* Grid: Flat/House No & Street */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
                House / Flat / Block No. *
              </label>
              <input
                type="text"
                placeholder="e.g. Flat 404, Block C"
                value={formData.houseNumber}
                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  errors.houseNumber 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                      : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
                }`}
              />
              {errors.houseNumber && <span className="text-[10px] text-rose-500 font-bold mt-1 block">{errors.houseNumber}</span>}
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
                Street / Road *
              </label>
              <input
                type="text"
                placeholder="e.g. 6th Main Road"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  errors.street 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                      : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
                }`}
              />
              {errors.street && <span className="text-[10px] text-rose-500 font-bold mt-1 block">{errors.street}</span>}
            </div>
          </div>

          {/* Area / Locality */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
              Area / Locality / Sector *
            </label>
            <input
              type="text"
              placeholder="e.g. Sector 7, HSR Layout"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                errors.area 
                  ? 'border-rose-500 bg-rose-500/5' 
                  : isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                    : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
              }`}
            />
            {errors.area && <span className="text-[10px] text-rose-500 font-bold mt-1 block">{errors.area}</span>}
          </div>

          {/* Landmark (Optional) */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
              Landmark (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Opposite Starbucks Coffee"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                  : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
              }`}
            />
          </div>

          {/* Grid: City, State, Pincode */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
                City *
              </label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full px-2.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  errors.city 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                      : 'bg-white border-amber-950/10 focus:border-[#B86B2B]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
                State *
              </label>
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={`w-full px-2.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  errors.state 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                      : 'bg-white border-amber-950/10 focus:border-[#B86B2B]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
                Pincode *
              </label>
              <input
                type="text"
                placeholder="6 digits"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={`w-full px-2.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                  errors.pincode 
                    ? 'border-rose-500 bg-rose-500/5' 
                    : isDarkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                      : 'bg-white border-amber-950/10 focus:border-[#B86B2B]'
                }`}
              />
            </div>
          </div>
          <div className="flex justify-between">
            {errors.city && <span className="text-[9px] text-rose-500 font-bold block">{errors.city}</span>}
            {errors.state && <span className="text-[9px] text-rose-500 font-bold block">{errors.state}</span>}
            {errors.pincode && <span className="text-[9px] text-rose-500 font-bold block">{errors.pincode}</span>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 pl-0.5">
              Contact Phone (optional)
            </label>
            <input
              type="text"
              placeholder="10-digit mobile number"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                errors.phone 
                  ? 'border-rose-500 bg-rose-500/5' 
                  : isDarkMode 
                    ? 'bg-white/5 border-white/10 focus:border-[#B86B2B]/40' 
                    : 'bg-white border-amber-950/10 focus:border-[#B86B2B] shadow-xs'
              }`}
            />
            {errors.phone && <span className="text-[10px] text-rose-500 font-bold mt-1 block">{errors.phone}</span>}
          </div>

          {/* Toggle Switches: Set Default & Set Favorite */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 accent-[#6F3B16]"
              />
              <span className="text-xs font-bold text-gray-500">Mark as default delivery address</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 accent-[#6F3B16]"
              />
              <span className="text-xs font-bold text-gray-500">Pin as favorite ⭐</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-300/10">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                  : 'bg-black/5 hover:bg-black/10 text-gray-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#6F3B16] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#83461B] active:scale-95 transition-all shadow-md cursor-pointer border-none"
            >
              Save Address
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
