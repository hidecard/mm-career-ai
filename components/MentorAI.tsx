import React, { useState, useRef, useEffect } from 'react';
import { chatWithMentor } from '../services/geminiService';

const MentorAI: React.FC = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen, isChatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', parts: [{ text: userMsg }] }]);
    setIsChatLoading(true);
    try {
      const reply = await chatWithMentor(chatHistory, userMsg);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: reply || '' }] }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "ဆောရီးပါ၊ ထပ်ကြိုးစားကြည့်ပေးပါ။" }] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isChatOpen && (
        <div className="mb-4 w-full sm:w-[380px] h-[500px] bg-white shadow-xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <p className="font-bold">MyanCareer AI </p>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {chatHistory.length === 0 && (
              <div className="text-center py-10 opacity-60 text-sm text-slate-500">
                အလုပ်အကိုင်နဲ့ ပတ်သက်ပြီး စဉ်းစားရခက်နေလား? MyanCareer AI နဲ့ အတူ လွယ်ကူစွာ မေးမြန်းနိုင်ပါတယ်။
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-100 rounded-xl px-3 py-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="မေးခွန်းရိုက်ထည့်ပါ..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button type="submit" disabled={isChatLoading} className="p-2 bg-blue-600 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isChatOpen ? 'bg-slate-800' : 'bg-blue-600'} text-white hover:scale-105`}
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default MentorAI;
