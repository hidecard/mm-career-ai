import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-white w-full pt-8 md:pt-12 lg:pt-16 pb-12 md:pb-16 lg:pb-20">
      {/* Premium background decoration with multiple layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-15%] right-[-20%] w-[45%] h-[45%] bg-indigo-100 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[80px] opacity-30"></div>
      </div>

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6 md:mb-8">
            <span className="text-xs sm:text-sm font-black text-blue-600 uppercase tracking-[2px] bg-blue-50/80 backdrop-blur px-4 py-2 rounded-full border border-blue-200/50 shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.409l-7-14z"/>
              </svg>
              MyanCareer AI - Your Career Compass
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 md:mb-6 leading-[1.2] lg:leading-[1.25]">
            သင့်ရဲ့ <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">အနာဂတ် အလုပ်အကိုင်</span> ကို AI နဲ့ <span className="text-blue-600">ပုံဖော်လိုက်ပါ</span>
          </h1>

          <p className="mt-4 md:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            ဘာကိုသင်ယူရမှန်း မသိဖြစ်နေသလား? မိမိမှာရှိတဲ့ စွမ်းရည်တွေနဲ့ ဘယ်အလုပ်က အကိုက်ညီဆုံးလဲဆိုတာကို MyanCareer AI က လမ်းညွှန်ပေးမှာပါ။
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
            <Link
              to="/assessment"
              className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl font-black text-white text-base md:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 inline-block text-center"
            >
              အခုပဲ စစ်ဆေးကြည့်မယ်
            </Link>

          </div>
        </div>

        {/* Hero Image Section */}
        <div className="mt-12 md:mt-16 lg:mt-20 w-full max-w-5xl mx-auto">
          <div className="relative group">
            {/* Premium glass morphism border */}
            <div className="absolute -inset-1.5 md:-inset-2 lg:-inset-2.5 bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-blue-500/30 rounded-2xl md:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl bg-white/50 backdrop-blur-xl p-1.5 md:p-2 lg:p-3 ring-1 ring-white/20 shadow-2xl">
              <div className="relative rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl bg-slate-200 aspect-[16/9] md:aspect-[16/10] lg:aspect-[1.8/1]">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1400&h=700"
                  alt="Collaboration at workspace"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent"></div>

                {/* Floating premium badge */}
                <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 animate-fade-in opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                  <div className="bg-white/95 backdrop-blur-xl px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-xl shadow-xl flex items-center gap-2.5 border border-white/30">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-wider">AI Powered Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
