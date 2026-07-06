import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, Heart, Shield, HelpCircle, FileText, RefreshCw, Mail, Phone, Clock, Send,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Compass, Flame, Smile, Star, HelpCircle as HelpIcon, Sparkles, MapPin, Coffee as CoffeeIcon
} from 'lucide-react';

interface PageProps {
  isDarkMode: boolean;
  onNavigate: (tab: any) => void;
  triggerNotification?: (msg: string, emoji: string, type: 'success' | 'info' | 'warning') => void;
}

/* ============================================================================
   1. ABOUT PAGE COMPONENT
   ============================================================================ */
export const AboutPage: React.FC<PageProps> = ({ isDarkMode, onNavigate }) => {
  const cards = [
    { title: 'Premium Ingredients', desc: 'Single-origin Arabica coffee beans and organic farm-fresh sourdough bread.', icon: CoffeeIcon, color: 'text-[#B86B2B]' },
    { title: 'Fast Delivery', desc: 'Predictive routing and dedicated partners ensure your beverages arrive steaming hot.', icon: Compass, color: 'text-amber-600' },
    { title: 'Fresh Preparation', desc: 'Every order is custom-brewed and freshly prepared by hand on demand.', icon: Flame, color: 'text-orange-500' },
    { title: 'Customer Satisfaction', desc: 'Our five-star delivery rating system ensures unmatched culinary care.', icon: Smile, color: 'text-emerald-500' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16 mt-20"
      id="about-page-view"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">About Brew & Bites</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none font-sans">
          Freshly Brewed.<br/>Perfectly Crafted.
        </h1>
        <p className={`text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed pt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Brew & Bites was created with a passion for handcrafted coffee, delicious food and memorable customer experiences. Our mission is to bring premium café-quality food to your doorstep with speed, quality and care.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className={`p-8 rounded-[32px] border text-left space-y-4 ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-amber-900/10 shadow-sm'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-[#6F3B16]/10 flex items-center justify-center text-[#B86B2B]">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <h3 className="font-sans font-black text-lg tracking-tight">Our Mission</h3>
          <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            To build the world's most luxurious, seamless café ordering experience. We unite state-of-the-art predictive dispatching technology with five-star gourmet barista mastery, keeping your cups steaming hot and your breakfast perfectly crisp.
          </p>
        </div>

        <div className={`p-8 rounded-[32px] border text-left space-y-4 ${
          isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-amber-900/10 shadow-sm'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-sans font-black text-lg tracking-tight">Our Vision</h3>
          <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            To transition the local dining landscape into an ultra-reliable, hyper-local digital ecosystem. From the first grind of premium beans to the live-GPS tracked doorstep delivery, we strive to exceed every standard of absolute freshness.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-6 text-center">
        <div className="space-y-1.5">
          <span className="text-[9px] text-[#B86B2B] font-extrabold uppercase tracking-widest block">The Brew & Bites Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">Why Discerning Customers Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border text-center space-y-3 transition-transform hover:scale-102 duration-300 ${
                  isDarkMode ? 'bg-white/3 border-white/5' : 'bg-white border-amber-900/5 shadow-xs'
                }`}
              >
                <div className={`w-10 h-10 rounded-full mx-auto bg-gray-400/10 flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-sans font-extrabold text-xs tracking-tight">{card.title}</h4>
                <p className={`text-[11px] leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action */}
      <div className={`p-8 rounded-[36px] text-center space-y-4 ${
        isDarkMode ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-amber-500/5 border border-amber-900/5'
      }`}>
        <h3 className="font-sans font-black text-xl tracking-tight">Ready to taste perfection?</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
          Try our artisanal espresso or our famous loaded Sourdough. Handcrafted just for you.
        </p>
        <button
          onClick={() => onNavigate('MENU')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] text-white font-black text-xs uppercase tracking-wider shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer border-none inline-flex items-center gap-2"
        >
          <span>Order From Menu Now</span>
        </button>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   2. CONTACT PAGE COMPONENT
   ============================================================================ */
export const ContactPage: React.FC<PageProps> = ({ isDarkMode, triggerNotification }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Enquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      if (triggerNotification) {
        triggerNotification('Please fill in all required fields.', '⚠️', 'warning');
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (triggerNotification) {
        triggerNotification('Thank you! Message transmitted to support desk.', '✉️', 'success');
      }
      setFormData({ name: '', email: '', subject: 'General Enquiry', message: '' });
    }, 1200);
  };

  const supportCards = [
    { title: 'General Enquiry', email: 'hello@brewandbites.com', desc: 'Partnership or general brand questions.' },
    { title: 'Order Support', email: 'orders@brewandbites.com', desc: 'Help with active cart or live delivery issues.' },
    { title: 'Technical Support', email: 'dev@brewandbites.com', desc: 'In-app bugs or payment gateway queries.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16 mt-20"
      id="contact-page-view"
    >
      <div className="text-center space-y-3">
        <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Contact Us</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none font-sans">
          Gourmet Support Desk
        </h1>
        <p className={`text-xs sm:text-sm font-medium max-w-lg mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Our professional café dispatch coordinators are standing by to resolve any order, billing or delivery questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-[28px] border space-y-6 ${
            isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-amber-900/10 shadow-sm'
          }`}>
            <h3 className="font-sans font-black text-base tracking-tight">Customer Care</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#6F3B16]/10 text-[#B86B2B] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-widest leading-none mb-1">Email support</span>
                  <p className="font-bold">support@brewandbites.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-widest leading-none mb-1">Toll-free Hotline</span>
                  <p className="font-bold">+91 1800-000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-widest leading-none mb-1">Operating Hours</span>
                  <p className="font-bold">Mon–Sun, 8:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick cards */}
          <div className="space-y-3">
            {supportCards.map((c, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border text-left text-xs ${
                  isDarkMode ? 'bg-white/2 border-white/5' : 'bg-amber-50/40 border-amber-900/5'
                }`}
              >
                <p className="font-black text-[11px] uppercase tracking-wider text-[#B86B2B]">{c.title}</p>
                <p className="font-bold pt-0.5">{c.email}</p>
                <p className="text-[10px] text-gray-400 pt-0.5 font-medium leading-tight">{c.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Form Container */}
        <div className="lg:col-span-7">
          <form 
            onSubmit={handleSubmit}
            className={`p-6 sm:p-8 rounded-[32px] border space-y-5 text-left ${
              isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-amber-900/10 shadow-sm'
            }`}
          >
            <h3 className="font-sans font-black text-lg tracking-tight">Send Us a Direct Message</h3>
            
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Souvik Dash"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-gray-800'
                  }`}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. souvik@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-gray-800'
                  }`}
                />
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Subject Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border outline-none ${
                    isDarkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-gray-800'
                  }`}
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Delivery Support">Delivery Support</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Detailed Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us how we can perfect your experience..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full text-xs font-semibold px-4 py-3 rounded-xl border outline-none resize-none ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-gray-800'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#6F3B16] to-[#B86B2B] text-white font-black text-xs uppercase tracking-widest hover:opacity-95 active:scale-98 transition-all cursor-pointer border-none shadow-md flex items-center justify-center gap-2"
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
};

/* ============================================================================
   3. HELP CENTER COMPONENT
   ============================================================================ */
export const HelpPage: React.FC<PageProps> = ({ isDarkMode, onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I place an order?",
      a: "Select your desired beverages or meals on the Handcrafted Menu, customize the quantity and click Add. Then click the basket drawer on the top right or proceed from the active checkout screen to finalize payment."
    },
    {
      q: "How do I change my address?",
      a: "Open the Set Delivery Address panel at any time by clicking the delivery coordinate widget on the top navbar, or click 'Saved Addresses' in the footer. You can instantly select, edit, delete or add custom flat and landmark credentials."
    },
    {
      q: "Can I cancel an order?",
      a: "Orders can be canceled free of charge within 60 seconds of placement, prior to kitchen validation. Once our chefs initiate fresh preparation, cancellation requests are governed by our standard Refund Policy."
    },
    {
      q: "How do refunds work?",
      a: "If your order falls short of our five-star standard (e.g. late delivery exceeding 30 mins, incorrect menu packaging, or payment gateway failures), a complete credit or refund is processed within 5-7 bank business days."
    },
    {
      q: "How can I contact support?",
      a: "You can submit an immediate request via our direct contact form, write to us at support@brewandbites.com, or dial our dedicated toll-free care center at +91 1800-000-0000 between 8:00 AM and 10:00 PM."
    }
  ];

  const toggle = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-12 space-y-12 mt-20"
      id="help-page-view"
    >
      <div className="text-center space-y-3">
        <span className="text-[10px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Help Center & FAQ</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none font-sans">
          Frequently Asked Questions
        </h1>
        <p className={`text-xs sm:text-sm font-medium max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Need help? Review our instant-solution answers below.
        </p>
      </div>

      <div className="space-y-4 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div 
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? isDarkMode ? 'bg-[#181310] border-[#B86B2B]/30' : 'bg-[#fbf7f3] border-[#6f3b16]/30'
                  : isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-amber-900/10 shadow-xs hover:border-amber-950/20'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-sans font-black text-sm tracking-tight cursor-pointer"
              >
                <span>{faq.q}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isOpen ? 'bg-[#B86B2B] text-white' : 'bg-gray-400/10'
                }`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-6 text-xs leading-relaxed font-semibold ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Extra help callout */}
      <div className={`p-6 sm:p-8 rounded-[32px] border text-center space-y-4 ${
        isDarkMode ? 'bg-white/3 border-white/5' : 'bg-amber-50/30 border-amber-900/5'
      }`}>
        <div className="w-10 h-10 rounded-xl bg-[#6F3B16]/10 text-[#B86B2B] flex items-center justify-center mx-auto">
          <HelpIcon className="w-5 h-5 animate-bounce" />
        </div>
        <h3 className="font-sans font-black text-sm">Still have questions?</h3>
        <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
          We have direct, trained dispatch teams ready to coordinate with your requests. Contact us anytime.
        </p>
        <button
          onClick={() => onNavigate('CONTACT')}
          className="px-5 py-2.5 rounded-xl border border-[#B86B2B] hover:bg-[#B86B2B]/10 text-[#B86B2B] font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
        >
          Open Support Ticket
        </button>
      </div>

    </motion.div>
  );
};

/* ============================================================================
   4. PRIVACY POLICY COMPONENT
   ============================================================================ */
export const PrivacyPage: React.FC<PageProps> = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-12 space-y-10 mt-20 text-left font-sans"
      id="privacy-page-view"
    >
      <div className="space-y-2 border-b border-gray-300/10 pb-6">
        <span className="text-[9px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Privacy Department</span>
        <h1 className="text-3xl font-black tracking-tight font-sans">Privacy Policy</h1>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Effective Date: July 6, 2026</p>
      </div>

      <div className={`space-y-6 text-xs leading-relaxed font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <p>
          At Brew & Bites, we hold your privacy and personal culinary security in absolute highest regard. This policy outlines how we gather, utilize, protect, and handle your sensitive geographic and personal data.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">1. Information We Collect</h2>
          <p>
            When registering, ordering, or navigating our platforms, we collect details including your name, contact phone numbers, email credentials, designated physical address descriptors, and billing statements to ensure flawless order execution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">2. How We Use Your Information</h2>
          <p>
            The collected indicators are strictly channeled to complete purchases, execute dispatch logistics, transmit live GPS telemetry coordinates, personalize active menu selections, and contact you in real-time regarding kitchen preparation statuses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">3. Location Permissions & Live Tracking</h2>
          <p>
            To activate our real-time GPS delivery tracking engine, you may choose to authorize live geolocation access. These geographic points are solely utilized to map coordinates between our café and your selected flat. We never store passive location logs once an order is marked DELIVERED.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">4. Cookies and Local Cache</h2>
          <p>
            We use secure browser cookies and localStorage structures to persist active carts, favorite coffee listings, selected default delivery coordinates, and sound setting choices. Purging your browser cache will reset these preferences immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">5. Account Security</h2>
          <p>
            All connection layers between your device and our servers use secure HTTPS socket standards. We employ advanced cryptographic hashing algorithms to shield transactional structures.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">6. Third Party Services</h2>
          <p>
            To offer premium services, we cooperate with licensed payment gateways (such as Razorpay or Stripe) and geographic mapping APIs (such as OpenStreetMap Nominatim). These entities operate under their strict self-contained privacy frameworks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">7. Contact Information</h2>
          <p>
            For any queries or formal data requests, contact our compliance officer directly at <span className="text-[#B86B2B] font-black">privacy@brewandbites.com</span> or dial our service center at <span className="font-black">+91 1800-000-0000</span>.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   5. TERMS & CONDITIONS COMPONENT
   ============================================================================ */
export const TermsPage: React.FC<PageProps> = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-12 space-y-10 mt-20 text-left font-sans"
      id="terms-page-view"
    >
      <div className="space-y-2 border-b border-gray-300/10 pb-6">
        <span className="text-[9px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Platform Terms</span>
        <h1 className="text-3xl font-black tracking-tight font-sans">Terms & Conditions</h1>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Last Updated: July 6, 2026</p>
      </div>

      <div className={`space-y-6 text-xs leading-relaxed font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <p>
          Welcome to Brew & Bites. By accessing our platform, utilizing our live tracking systems, and placing premium culinary orders, you agree to comply with and be bound by the following comprehensive terms.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">1. Eligibility</h2>
          <p>
            You must be at least 18 years of age or accessing under direct guardian supervision to initiate payments or register physical delivery coordinates on our digital applications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">2. Ordering and Customs</h2>
          <p>
            All listed items are subject to real-time kitchen availability. We reserve the absolute right to limit purchase quantities, adjust prices, or decline service to any customer when ingredients fall short of our quality benchmarks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">3. Payments & Gateway Processing</h2>
          <p>
            All transactions are charged in Indian Rupees (₹). Payments must be cleared using authorized credit cards, digital UPI networks, or secure wallet partners. We encrypt all transactions on the socket layer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">4. Dispatch Logistics & Delivery</h2>
          <p>
            Brew & Bites strives to fulfill orders within the estimated live ETA timeframe. Real-world blockages such as extreme rainfall, localized traffic, or remote entry codes may influence transit timers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">5. Cancellations</h2>
          <p>
            Once an order moves to the ACCEPTED stage in our tracking timeline, our baristas have initiated fresh grinds. Cancellations initiated beyond this milestone are subject to a nominal prep fee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">6. User Responsibilities</h2>
          <p>
            Users must input accurate physical coordinate addresses, landmark indicators, flat details, and a functional phone number to guarantee delivery. We are not liable for delayed or missed drop-offs resulting from erroneous contact fields.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">7. Disclaimer & Liabilities</h2>
          <p>
            Brew & Bites provides the application on an 'as-is' and 'as-available' basis without warranties of uninterrupted service. Our total liability under any circumstance is strictly capped at the invoice value of the disputed order.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   6. REFUND POLICY COMPONENT
   ============================================================================ */
export const RefundPage: React.FC<PageProps> = ({ isDarkMode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-12 space-y-10 mt-20 text-left font-sans"
      id="refund-page-view"
    >
      <div className="space-y-2 border-b border-gray-300/10 pb-6">
        <span className="text-[9px] text-[#B86B2B] font-extrabold uppercase tracking-widest block leading-none">Resolution Policies</span>
        <h1 className="text-3xl font-black tracking-tight font-sans">Refund Policy</h1>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Effective Date: July 6, 2026</p>
      </div>

      <div className={`space-y-6 text-xs leading-relaxed font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <p>
          At Brew & Bites, we are fundamentally committed to culinary perfection. If your experience falls short, we provide transparent, rapid refund pipelines.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">1. Eligible Conditions for Refunds</h2>
          <p>
            Refund requests are fully authorized under any of the following occurrences:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 pt-1">
            <li><strong>Severe Delivery Delays:</strong> Drops that arrive more than 30 minutes past the estimated maximum ETA, excluding conditions of force majeure.</li>
            <li><strong>Incorrect or Damaged Items:</strong> Missing components, incorrect sizing customizations, or structurally spilled beverage containers.</li>
            <li><strong>Transaction Failures:</strong> Situations where payment is fully deducted on your bank statement, but the order failed to trigger on our tracking desk.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">2. Cancellation Credits</h2>
          <p>
            If you cancel an order within 60 seconds of placement prior to barista accept, a complete credit is re-routed instantly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">3. Verification & Evidence</h2>
          <p>
            To expedite incorrect or damaged item disputes, we may request a brief photograph of the menu packaging, easily submitted via our direct support channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">4. Processing Timelines</h2>
          <p>
            Approved refunds are auto-credited back to the source payment method (UPI, card, or credit wallets) within <strong>5-7 banking business days</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-[#B86B2B] tracking-tight">5. Contact Support</h2>
          <p>
            To initiate a query, draft an email containing your Order Invoice ID directly to <span className="text-[#B86B2B] font-black">refunds@brewandbites.com</span> or submit an active ticket via the Contact page.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

/* ============================================================================
   7. 404 NOT FOUND COMPONENT
   ============================================================================ */
export const NotFoundPage: React.FC<PageProps> = ({ isDarkMode, onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="max-w-md mx-auto px-4 py-16 text-center space-y-6 mt-24"
      id="not-found-page-view"
    >
      <div className="relative w-36 h-36 mx-auto">
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-full h-full rounded-[40px] bg-gradient-to-tr from-[#6F3B16] to-[#B86B2B] flex items-center justify-center text-white shadow-2xl border border-white/10">
          <span className="text-5xl font-black select-none font-sans animate-bounce">☕</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white text-lg font-black shadow-lg">
          404
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight font-sans">Oops! Page is Missing</h1>
        <p className={`text-xs font-semibold leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This coffee run went cold. The page you are looking for has been moved, archived, or does not exist in our system directory.
        </p>
      </div>

      <button
        onClick={() => onNavigate('HOME')}
        className="px-6 py-3.5 rounded-2xl bg-[#6F3B16] hover:bg-amber-950 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer border-none"
      >
        Return to Safety (Home)
      </button>
    </motion.div>
  );
};
