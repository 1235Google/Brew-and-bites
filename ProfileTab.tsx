import React from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Sun, Moon, Volume2, VolumeX, Trash2, Award, Sparkles, MapPin, Gift, Clock, LogOut } from 'lucide-react';

interface ProfileTabProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onClearDatabase: () => void;
  favoritesCount: number;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  isDarkMode,
  onToggleDarkMode,
  isAudioMuted,
  onToggleAudio,
  onClearDatabase,
  favoritesCount,
}) => {
  
  // Custom dummy client data for high fidelity presentation
  const clientData = {
    name: 'Jane Doe',
    email: 'jane.doe@luxury.com',
    tier: 'Gold Member VIP',
    points: 1250,
    joinDate: 'Joined March 2026',
    ordersCount: 18,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 mt-20"
      id="profile-tab-view"
    >
      {/* 1. HEADER PROFILE CARD */}
      <div className={`rounded-[36px] p-6 sm:p-10 border transition-all duration-300 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-950/20 border-white/5 text-white' 
          : 'bg-white/35 border-white/40 text-gray-950 shadow-sm'
      }`}>
        
        {/* Glow effect behind avatar */}
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#B86B2B]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* High-res Avatar inside glass circle */}
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#6F3B16] via-[#B86B2B] to-[#EBE4D8] shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={clientData.avatar} 
                alt={clientData.name} 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black tracking-tight">{clientData.name}</h2>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/15 text-[9px] font-black uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>{clientData.tier}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium font-mono leading-none">{clientData.email}</p>
              <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-widest leading-none pt-1">{clientData.joinDate}</p>
            </div>
          </div>

          {/* Quick Member Stats Panel */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            <div className={`p-4 rounded-[20px] text-center sm:text-left border ${
              isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/[0.04]'
            }`}>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mb-1">MEMBER POINTS</span>
              <span className="text-xl font-black text-[#B86B2B]">{clientData.points} XP</span>
            </div>
            <div className={`p-4 rounded-[20px] text-center sm:text-left border ${
              isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/[0.04]'
            }`}>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mb-1">ORDER HISTORIES</span>
              <span className="text-xl font-black text-[#B86B2B]">{clientData.ordersCount} Meals</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. DUAL COLUMN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Membership Perks & Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">Club Benefits</span>
            <h3 className="text-lg font-black tracking-tight leading-none">Your VIP Membership Status</h3>
          </div>

          <div className="space-y-4">
            
            {/* Perk 1 */}
            <div className={`rounded-2xl p-5 border flex items-start gap-4 ${
              isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/40 border-white/30 shadow-sm'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                🎁
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold block">Complimentary Cake Slice Perks</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">As a VIP member, get a complimentary sweet treat on any espresso order over ₹199.</p>
              </div>
            </div>

            {/* Perk 2 */}
            <div className={`rounded-2xl p-5 border flex items-start gap-4 ${
              isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/40 border-white/30 shadow-sm'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg shrink-0">
                ⚡
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold block">No Minimum Delivery Charges</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">Your orders from Brew & Bites Café are dispatched with top priority, completely free of charge.</p>
              </div>
            </div>

            {/* Perk 3 */}
            <div className={`rounded-2xl p-5 border flex items-start gap-4 ${
              isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/40 border-white/30 shadow-sm'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0">
                ⭐
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold block">Invite-only Private Events</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">Exclusive access to single-origin roast testing sessions and masterclasses hosted at HSR Heights.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Account Preferences & Dangerous Utilities */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">System Adjustments</span>
            <h3 className="text-lg font-black tracking-tight leading-none">Preferences & Safety</h3>
          </div>

          <div className={`rounded-[30px] p-6 border space-y-6 ${
            isDarkMode ? 'bg-gray-950/20 border-white/5' : 'bg-white/40 border-white/30 shadow-sm'
          }`}>
            
            {/* Preference 1: Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold block">Interface Design</span>
                <span className="text-[10px] text-gray-400 font-medium">Toggle between dark and light aesthetics.</span>
              </div>

              <button
                onClick={onToggleDarkMode}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10' 
                    : 'border-black/5 bg-black/5 text-gray-600 hover:bg-black/10'
                }`}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Preference 2: Acoustic Volume */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-300/10">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold block">Café Sounds & Acoustics</span>
                <span className="text-[10px] text-gray-400 font-medium">Mute or play ambient auditory confirmations.</span>
              </div>

              <button
                onClick={onToggleAudio}
                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isAudioMuted 
                    ? 'border-white/10 text-gray-400 bg-white/5 hover:bg-white/10' 
                    : 'border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/15'
                }`}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Preference 3: Database wipeout */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-300/10">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-rose-500 block">Wipe Cache Storage</span>
                <span className="text-[10px] text-gray-400 font-medium">Clear active cart, favorites, and reset databases.</span>
              </div>

              <button
                onClick={onClearDatabase}
                className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer flex items-center justify-center"
                title="Wipe Databases"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </motion.div>
  );
};
