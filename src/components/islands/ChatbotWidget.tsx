import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, X, Send } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo! Saya asisten AI Grand Bedahan Residence. Ada yang bisa saya bantu terkait perumahan ini?', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response (MVP dummy)
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        text: 'Terima kasih atas pertanyaan Anda. Untuk informasi lebih detail, Anda dapat menghubungi tim sales kami via WhatsApp di nomor 0812-1577-6218.', 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-[88px] z-50 font-sans">
      {/* Chat Button (shows when closed) */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="flex items-center justify-center w-14 h-14 bg-[#047857] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none group"
          aria-label="Buka Chat AI"
        >
          <span className="absolute bottom-16 right-0 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-gray-100">
            Tanya AI Assistant
          </span>
          <MessageSquare className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 sm:right-[88px] bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 h-[500px] max-h-[80vh]' : 'scale-0 opacity-0 h-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#047857] text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#047857] mr-3 font-bold shadow-xs">
              <Bot className="w-6 h-6 text-[#047857]" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight text-white">AI Assistant</h3>
              <p className="text-xs text-emerald-100">Grand Bedahan Residence</p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white hover:text-emerald-100 focus:outline-none p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#17201C] text-white self-end rounded-br-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik pesan Anda..."
              className="flex-1 bg-gray-100 text-sm px-4 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-[#047857] border border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full flex-shrink-0 transition-colors ${
                inputValue.trim() 
                  ? 'bg-[#047857] text-white hover:bg-[#065F46]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            AI dapat membuat kesalahan. Hubungi <a href="#kontak" onClick={toggleChat} className="text-[#047857] font-semibold hover:underline">sales</a> untuk konfirmasi.
          </p>
        </div>
      </div>
    </div>
  );
}
