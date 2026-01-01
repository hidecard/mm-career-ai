import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillForm from './components/SkillForm';
import GuideResult from './components/GuideResult';
import TrendChart from './components/TrendChart';
import ResumeBuilder from './components/ResumeBuilder';
import InterviewPrep from './components/InterviewPrep';
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

        {currentPage === 'resume-builder' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 lg:px-8">
            {guide ? (
              <ResumeBuilder careerGuide={guide} userSkills={''} userInterests={''} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">📄</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">ပထမဦးစွာ အလုပ်လမ်းညွှန်ချက် ရယူပါ</h3>
                  <p className="text-slate-500">သင့်အတွက် သင့်စာရွက်စာတမ်း ဖန်တီးရန် အရင်းအမြစ်များ လိုအပ်ပါသည်။</p>
                  <button
                    onClick={() => handleNav('assessment')}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    အခုပဲ စစ်ဆေးကြည့်မယ်
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'interview-prep' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 lg:px-8">
            {guide ? (
              <InterviewPrep careerGuide={guide} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎤</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">ပထမဦးစွာ အလုပ်လမ်းညွှန်ချက် ရယူပါ</h3>
                  <p className="text-slate-500">အင်တာဗျူး ပြင်ဆင်ရန် အရင်းအမြစ်များ လိုအပ်ပါသည်။</p>
                  <button
                    onClick={() => handleNav('assessment')}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    အခုပဲ စစ်ဆေးကြည့်မယ်
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 w-full no-print mt-2 md:mt-4 text-slate-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-6 md:gap-8 mb-6 md:mb-8">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm border-l-4 border-blue-500 pl-4 py-1">Quick Links</h5>
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
            <div className="space-y-4">
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
          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 my-4 md:my-6"></div>

          {/* Bottom copyright section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              <span className="block sm:inline">© ၂၀၂၅ MyanCareer AI</span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="text-slate-500">Empowering Myanmar Youth</span>
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-bold">မူဝါဒများ</a>
              <span className="text-slate-400">•</span>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-300 font-bold">စည်းကမ်းချက်များ</a>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-center text-xs text-slate-500">
              Made with 
              <svg className="w-4 h-4 inline mx-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              for Myanmar youth who dare to dream big.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
