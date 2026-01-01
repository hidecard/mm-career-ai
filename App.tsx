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

            <section id="trends" className="animate-fade-in scroll-mt-16">
              <TrendChart />
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
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm border-l-4 border-indigo-500 pl-4 py-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Community
                </h5>
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
              Made with
              <svg className="w-4 h-4 inline mx-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              for Myanmar youth who dare to dream big. Keep learning, keep growing!
              <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
              </svg>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
