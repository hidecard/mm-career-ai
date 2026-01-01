import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillForm from './components/SkillForm';
import GuideResult from './components/GuideResult';
import TrendChart from './components/TrendChart';
import { generateCareerGuide } from './services/geminiService';
import { CareerGuide } from './types';

const STORAGE_KEY = 'myancareer_saved_guide';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<CareerGuide | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGuide(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (skills: string, interests: string) => {
    setIsLoading(true);
    try {
      const result = await generateCareerGuide(skills, interests);
      setGuide(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to generate guide:", error);
      alert("AI တွက်ချက်မှုတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။ နောက်တစ်ကြိမ် ထပ်မံကြိုးစားပေးပါ။");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGuide(null);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 selection:text-blue-700">
      <Navbar onNav={handleNav} currentPage={currentPage} />

      <main className="flex-grow w-full">
        {currentPage === 'home' && (
          <div className="space-y-8 md:space-y-12 px-4 sm:px-6 lg:px-8">
            <Hero onStart={handleStartAssessment} />
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 no-print px-2 md:px-0 max-w-5xl mx-auto">
               {[
                 { label: 'ကူညီပေးပြီးသူ', val: '၁၀,၀၀၀+', icon: '👥', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
                 { label: 'အလုပ်အကိုင် ကဏ္ဍ', val: '၂၅+', icon: '💼', color: 'from-indigo-500 to-indigo-600', lightColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
                 { label: 'ကျွမ်းကျင်မှု နယ်ပယ်', val: '၂၀၀+', icon: '🎯', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
                 { label: 'AI တိကျမှု', val: '၉၈%', icon: '✨', color: 'from-amber-500 to-amber-600', lightColor: 'bg-amber-50', textColor: 'text-amber-600' }
               ].map((stat, i) => (
                 <div key={i} className={`group relative overflow-hidden ${stat.lightColor} p-5 md:p-6 rounded-2xl md:rounded-2xl border border-white/40 shadow-lg backdrop-blur-sm text-center flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-white/60 cursor-default`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-r ${stat.color} opacity-10 blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className="relative z-10">
                      <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                      <p className={`text-2xl md:text-3xl lg:text-4xl font-black ${stat.textColor} mb-2`}>{stat.val}</p>
                      <p className="text-[11px] md:text-xs text-slate-600 font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                 </div>
               ))}
            </div>

            <section id="trends" className="animate-fade-in scroll-mt-16">
              <TrendChart />
            </section>
            
            <section className="pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-10 lg:pb-12 bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl px-6 md:px-8 lg:px-12 text-slate-900 relative overflow-hidden shadow-2xl border border-slate-200/50">
              {/* Premium gradient background elements */}
              <div className="absolute top-0 right-0 w-40 md:w-56 lg:w-80 h-40 md:h-56 lg:h-80 bg-gradient-to-bl from-blue-100/60 to-transparent blur-[100px] md:blur-[120px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-48 md:w-64 lg:w-96 h-48 md:h-64 lg:h-96 bg-gradient-to-tr from-indigo-100/50 to-transparent blur-[80px] md:blur-[100px] rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-1/3 w-32 md:w-48 h-32 md:h-48 bg-purple-100/40 blur-[60px] rounded-full"></div>

              <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16 lg:mb-20 relative z-10 animate-fade-in">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">အလုပ်အကိုင် အခွင့်အလမ်းများ</h2>
                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">ကျွန်ုပ်တို့၏ AI သည် သင့်ကို အောက်ပါဝန်ဆောင်မှုများဖြင့် ကူညီပေးပါမည်</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 relative z-10 mb-10 md:mb-14">
                {[
                  { id: 1, icon: '⚡', title: 'မြန်ဆန်သော ဆန်းစစ်မှု', desc: 'သင့်ရဲ့ ကျွမ်းကျင်မှုတွေကို မိနစ်ပိုင်းအတွင်းမှာပဲ AI က တိကျစွာ ခွဲခြမ်းစိတ်ဖြာပေးပါတယ်။', gradient: 'from-blue-500 to-cyan-500' },
                  { id: 2, icon: '🗺️', title: 'ပြည့်စုံသော လမ်းပြမြေပုံ', desc: 'သင်တက်လှမ်းလိုတဲ့ ရာထူးရောက်ဖို့ လိုအပ်တဲ့ အဆင့်တိုင်းကို သေချာဖော်ပြပေးပါတယ်။', gradient: 'from-emerald-500 to-teal-500' },
                  { id: 3, icon: '📄', title: 'PDF အဖြစ် သိမ်းဆည်းနိုင်မှု', desc: 'သင့်ရဲ့ Career Guide ကို ဖုန်းထဲမှာပဲ အလွယ်တကူ သိမ်းဆည်းပြီး အချိန်မရွေး ပြန်ကြည့်နိုင်ပါတယ်။', gradient: 'from-purple-500 to-pink-500' }
                ].map((feature) => (
                  <div key={feature.id} className="group relative">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <div className="relative bg-white/80 backdrop-blur-xl p-6 md:p-7 lg:p-8 rounded-2xl border border-slate-200/50 shadow-xl transition-all duration-300 group-hover:border-slate-300/60 group-hover:shadow-2xl">
                      <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
                      <h4 className="font-black text-lg md:text-xl mb-3 text-slate-900">{feature.title}</h4>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center relative z-10">
                <button
                  onClick={handleStartAssessment}
                  className="group px-8 md:px-10 lg:px-12 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-3xl"
                >
                  အခုပဲ စတင်လိုက်ပါ
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'assessment' && (
          <div className="space-y-8 md:space-y-12 w-full px-4 sm:px-6 lg:px-8">
            {!guide ? (
              <SkillForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            ) : (
              <GuideResult guide={guide} onReset={handleReset} />
            )}
          </div>
        )}

        {currentPage === 'trends' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 lg:px-8">
            <TrendChart />
          </div>
        )}
      </main>

      <footer className="bg-white/90 backdrop-blur-xl border-t border-slate-200/50 w-full no-print mt-8 md:mt-12 lg:mt-16 text-slate-900 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 md:py-12 lg:py-16">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-10">
            {/* Brand section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-transform duration-300">M</div>
                <div>
                  <span className="block text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">MyanCareer AI</span>
                  <span className="text-xs text-blue-600/70 font-bold tracking-wider">Your Career Compass</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium max-w-sm">
                မြန်မာလူငယ်များအတွက် နည်းပညာနှင့် အသက်မွေးဝမ်းကျောင်းဆိုင်ရာ လမ်းပြမြေပုံများကို AI စနစ်သုံး၍ အခမဲ့ ဖန်တီးပေးနေသော Platform ဖြစ်ပါသည်။
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-3">
                <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-wider">Follow Us:</span>
                <div className="flex gap-2">
                  <a href="#" className="group w-9 h-9 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg flex items-center justify-center transition-all duration-300 border border-blue-200/50 hover:border-blue-300 shadow-md hover:shadow-lg">
                    <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">f</span>
                  </a>
                  <a href="#" className="group w-9 h-9 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg flex items-center justify-center transition-all duration-300 border border-indigo-200/50 hover:border-indigo-300 shadow-md hover:shadow-lg">
                    <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700">D</span>
                  </a>
                  <a href="#" className="group w-9 h-9 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg flex items-center justify-center transition-all duration-300 border border-purple-200/50 hover:border-purple-300 shadow-md hover:shadow-lg">
                    <span className="text-sm font-bold text-purple-600 group-hover:text-purple-700">@</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm border-l-4 border-blue-500 pl-4 py-1">🔗 Quick Links</h5>
                <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full ml-4"></div>
              </div>
              <ul className="space-y-3.5 text-sm md:text-base">
                <li>
                  <button onClick={() => handleNav('home')} className="group text-slate-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>ပင်မစာမျက်နှာ</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('assessment')} className="group text-slate-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>လမ်းညွှန်ချက်ရယူရန်</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('trends')} className="group text-slate-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>အလုပ်အကိုင် ရေစီးကြောင်း</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Community section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm border-l-4 border-indigo-500 pl-4 py-1">👥 Community</h5>
                <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-transparent rounded-full ml-4"></div>
              </div>
              <ul className="space-y-3.5 text-sm md:text-base">
                <li>
                  <a href="#" className="group text-slate-600 hover:text-indigo-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-indigo-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>Facebook Page</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group text-slate-600 hover:text-indigo-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-indigo-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>Discord Server</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="group text-slate-600 hover:text-indigo-600 transition-all duration-300 flex items-center gap-2.5 font-bold">
                    <span className="text-indigo-500 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    <span>Newsletter</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 my-6 md:my-8"></div>

          {/* Bottom copyright section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-3 text-center sm:text-left">
            <p className="text-xs md:text-sm text-slate-600 font-black tracking-wider">
              <span className="block sm:inline">© ၂၀၂၅ MyanCareer AI</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="text-slate-500 font-medium">Empowering Myanmar Youth</span>
              <span className="ml-2">🚀</span>
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-bold">မူဝါဒများ</a>
              <span className="text-slate-400">•</span>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-bold">စည်းကမ်းချက်များ</a>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-200/50">
            <p className="text-center text-xs text-slate-500 font-medium leading-relaxed">
              Made with <span className="text-red-500">❤️</span> for Myanmar youth who dare to dream big. Keep learning, keep growing! 💪
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
