import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  driverName: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose, isDarkMode, driverName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'driver', text: "Hello! I'm on my way.", time: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState(1); // Track driver conversation progress
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle preset replies
  const handleSendText = (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsgId = `${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // 2. Trigger driver response based on conversation stage
    if (stage === 1) {
      setStage(2);
      triggerDriverTypingAndReply("Please keep your phone reachable.", 2000);
    } else if (stage === 2) {
      setStage(3);
      triggerDriverTypingAndReply("I'll reach in about 5 minutes.", 2500);
    } else {
      // Generic driver responses if chatting further
      triggerDriverTypingAndReply("Okay sure, reaching soon!", 1500);
    }
  };

  const triggerDriverTypingAndReply = (replyText: string, delayMs: number) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const driverMsg: ChatMessage = {
          id: `${Date.now()}-reply`,
          sender: 'driver',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, driverMsg]);
      }, 1500); // Typing indicator active duration
    }, delayMs - 1500 > 0 ? delayMs - 1500 : 200);
  };

  if (!isOpen) return null;

  const quickReplies = ['Okay.', 'Sure.', 'Leave at gate.', 'Call me when here.'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Main chat modal panel */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`w-full max-w-md h-[520px] rounded-[32px] overflow-hidden flex flex-col border shadow-2xl relative ${
          isDarkMode ? 'bg-gray-900/95 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-950'
        } backdrop-blur-xl`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 to-amber-950 flex items-center justify-center text-white font-bold shadow-md">
              {driverName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm tracking-tight">{driverName}</h3>
              <span className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Rider • Online
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 active:scale-95 rounded-xl transition-all text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Badge */}
        <div className="bg-amber-500/10 border-b border-amber-500/10 py-1.5 px-4 flex items-center gap-2 text-[10px] text-amber-500 font-bold justify-center uppercase tracking-wider select-none">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Encrypted Tunnel • Guarded by Secure Systems</span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[80%] rounded-[20px] px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-amber-700 text-white rounded-tr-none text-right'
                    : isDarkMode 
                      ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none text-left' 
                      : 'bg-black/5 border border-black/5 text-gray-800 rounded-tl-none text-left'
                }`}>
                  <p className="font-semibold">{msg.text}</p>
                  <span className="text-[9px] text-gray-400 mt-1 block font-medium opacity-80">{msg.time}</span>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-start"
              >
                <div className={`rounded-[20px] px-4 py-3 rounded-tl-none flex items-center gap-1 shadow-sm ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-black/5'
                }`}>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies & Text Form */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-3.5">
          {/* Quick Replies chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendText(reply)}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10' 
                    : 'border-black/5 bg-black/5 text-gray-600 hover:bg-black/10'
                }`}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              placeholder="Type your message securely..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-semibold outline-none border focus:ring-2 focus:ring-amber-500/20 transition-all ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-white focus:border-white/25' 
                  : 'bg-black/5 border-black/5 text-gray-900 focus:border-black/15'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 text-white transition-all disabled:opacity-40 disabled:scale-100 hover:opacity-95 active:scale-95 cursor-pointer flex items-center justify-center`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
