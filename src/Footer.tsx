import React from 'react';
import { Coffee, Heart, ArrowUpRight, Shield, HelpCircle, FileText, RefreshCw, Info, Mail } from 'lucide-react';

interface FooterProps {
  activeTab: string;
  onNavigate: (tab: any) => void;
  onOpenAddresses: () => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  onNavigate,
  onOpenAddresses,
  isDarkMode
}) => {
  const currentYear = 2026;

  const quickLinks = [
    { name: 'Home', tab: 'HOME' },
    { name: 'Menu', tab: 'MENU' },
    { name: 'Orders', tab: 'ORDERS' },
    { name: 'Favorites', tab: 'FAVORITES' },
    { name: 'Profile', tab: 'PROFILE' }
  ];

  const companyLinks = [
    { name: 'About Us', tab: 'ABOUT', icon: Info },
    { name: 'Contact Us', tab: 'CONTACT', icon: Mail },
    { name: 'Help Center', tab: 'HELP', icon: HelpCircle },
    { name: 'Privacy Policy', tab: 'PRIVACY', icon: Shield },
    { name: 'Terms & Conditions', tab: 'TERMS', icon: FileText },
    { name: 'Refund Policy', tab: 'REFUND', icon: RefreshCw }
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className={`w-full mt-20 border-t transition-all duration-300 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-950/45 border-white/10 text-gray-300 shadow-2xl shadow-black/80' 
          : 'bg-[#faf8f5]/65 border-amber-900/10 text-gray-700 shadow-xl'
      }`}
      id="premium-global-footer"
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      {/* Decorative gradient backdrops for premium reflections */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6F3B16]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT SECTION: Brand & Tagline */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6F3B16] to-[#B86B2B] flex items-center justify-center text-white shadow-xl border border-white/10 hover:rotate-6 transition-transform duration-300">
                <Coffee className="w-5.5 h-5.5" />
              </div>
              <div className="text-left">
                <span className="font-sans font-black text-lg tracking-tight block leading-none">
                  Brew & Bites
                </span>
                <span className="text-[9px] uppercase tracking-widest font-black text-[#B86B2B] block pt-1 leading-none">
                  Freshly Brewed. Perfectly Crafted.
                </span>
              </div>
            </div>
            
            <p className={`text-xs leading-relaxed font-medium max-w-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Brew & Bites delivers handcrafted coffee, sandwiches and refreshing beverages with a premium ordering experience. Experience café luxury, delivered five-star direct.
            </p>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-xl border ${
                isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-amber-50 border-amber-900/5 text-amber-800'
              }`}>
                🌟 4.9 App Rating
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-xl border ${
                isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-emerald-50 border-emerald-900/5 text-emerald-800'
              }`}>
                ⚡ Live GPS Tracking
              </span>
            </div>
          </div>

          {/* CENTER SECTION: Quick Links */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#B86B2B]">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-xs font-semibold">
              {quickLinks.map((link) => {
                const isActive = activeTab === link.tab;
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => {
                        onNavigate(link.tab);
                        handleScrollToTop();
                      }}
                      className={`transition-all duration-250 cursor-pointer flex items-center gap-1.5 group ${
                        isActive
                          ? 'text-[#B86B2B] font-black'
                          : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full transition-all bg-[#B86B2B] ${isActive ? 'scale-100' : 'scale-0 group-hover:scale-75'}`} />
                      <span>{link.name}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => {
                    onOpenAddresses();
                    handleScrollToTop();
                  }}
                  className={`transition-all duration-250 cursor-pointer flex items-center gap-1.5 group ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full transition-all bg-[#B86B2B] scale-0 group-hover:scale-75" />
                  <span>Saved Addresses</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-[#B86B2B] transition-colors" />
                </button>
              </li>
            </ul>
          </div>

          {/* RIGHT SECTION: Company Links */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-[#B86B2B]">
              Legal & Support
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companyLinks.map((link) => {
                const isActive = activeTab === link.tab;
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      onNavigate(link.tab);
                      handleScrollToTop();
                    }}
                    className={`transition-all duration-250 cursor-pointer flex items-center gap-2 text-xs font-semibold text-left p-1 rounded-lg ${
                      isActive
                        ? 'text-[#B86B2B] font-black'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-[#6F3B16]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-60" />
                    <span>{link.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Signature */}
        <div className={`mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold ${
          isDarkMode ? 'border-white/10 text-gray-500' : 'border-amber-900/10 text-gray-500'
        }`}>
          <div>
            © {currentYear} <span className="text-[#B86B2B]">Brew & Bites Café</span>. All Rights Reserved.
          </div>
          
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for a Premium Ordering Experience</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => { onNavigate('PRIVACY'); handleScrollToTop(); }} 
              className="hover:text-[#B86B2B] transition-colors"
            >
              Privacy
            </button>
            <span>•</span>
            <button 
              onClick={() => { onNavigate('TERMS'); handleScrollToTop(); }} 
              className="hover:text-[#B86B2B] transition-colors"
            >
              Terms
            </button>
            <span>•</span>
            <button 
              onClick={() => { onNavigate('REFUND'); handleScrollToTop(); }} 
              className="hover:text-[#B86B2B] transition-colors"
            >
              Refunds
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
