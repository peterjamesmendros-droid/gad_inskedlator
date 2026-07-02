'use client';

import { useState, useEffect, useRef } from 'react';
import { Headset, ShieldCheck, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your GAD assistant. How can I help you manage your space allocations today?", sender: 'bot', id: 0 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Automatically scroll to the lowest message point when a new message streams in
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const userText = textToSend || inputValue.trim();
    if (!userText) return;

    if (!textToSend) setInputValue('');

    // Append user message immediately
    setMessages((prev) => [...prev, { text: userText, sender: 'user', id: Date.now() }]);
    setIsLoading(true);

    // =========================================================
    // DYNAMIC SESSION LOOKUP
    // =========================================================
    let currentUsername = 'Guest';
    const savedUser = localStorage.getItem('session_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.fullname) {
          currentUsername = parsed.fullname;
        }
      } catch (err) {
        console.error("Chatbot component failed to extract user context matrix:", err);
      }
    }

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          username: currentUsername // <-- Pass identity property to backend
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: 'bot', id: Date.now() + 1 }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I'm having trouble pulling real-time database allocation parameters right now.", sender: 'bot', id: Date.now() + 1 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[25px] right-[25px] bg-purple-700 hover:bg-purple-800 text-white rounded-full w-[60px] h-[60px] shadow-lg flex items-center justify-center transition-all hover:scale-105 z-[9999]"
      >
        <Headset className="h-6 w-6" />
      </button>

      {/* Main Chat Interface Panel */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-[25px] w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[9999] font-sans animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header Block */}
          <div className="bg-purple-950 text-white p-4 flex items-center justify-between font-bold text-sm tracking-wide">
            <div className="flex items-center gap-2.5">
              <span className="bg-white/10 p-1.5 rounded-lg text-purple-300">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span>INSKEDLATOR Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Containment Box */}
          <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed font-medium shadow-sm whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-purple-700 text-white self-end rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 self-start rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {/* Quick Trigger Suggestion Pills */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 items-end mt-2">
                <button
                  onClick={() => handleSendMessage('Check room availability')}
                  className="bg-white hover:bg-slate-50 text-purple-700 border border-slate-200 px-3 py-2 rounded-full text-[11px] font-semibold transition-all shadow-sm w-fit"
                >
                  Check room availability
                </button>
                <button
                  onClick={() => handleSendMessage('Check current appointments')}
                  className="bg-white hover:bg-slate-50 text-purple-700 border border-slate-200 px-3 py-2 rounded-full text-[11px] font-semibold transition-all shadow-sm w-fit"
                >
                  Check current appointments
                </button>
              </div>
            )}
          </div>

          {/* Bottom Interaction Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-700 text-xs text-slate-700 rounded-xl outline-none font-medium transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" /> 
            </button>
          </div>

        </div>
      )}
    </>
  );
}