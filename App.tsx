import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillForm from './components/SkillForm';
import GuideResult from './components/GuideResult';
import ResumeBuilder from './components/ResumeBuilder';
import InterviewPrep from './components/InterviewPrep';
import LearningRoadmap from './pages/LearningRoadmap';
import Support from './components/Support';
import MentorAI from './components/MentorAI';
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

        {currentPage === 'resume-builder' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 lg:px-8">
            {guide ? (
              <ResumeBuilder careerGuide={guide} userSkills={''} userInterests={''} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-file-alt text-3xl text-blue-600"></i>
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
                    <i className="fas fa-microphone-alt text-3xl text-blue-600"></i>
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

        {currentPage === 'learning-roadmap' && (
          <div className="animate-fade-in w-full px-4 sm:px-6 lg:px-8">
            {guide ? (
              <LearningRoadmap guide={guide} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-book-open text-3xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">ပထမဦးစွာ အလုပ်လမ်းညွှန်ချက် ရယူပါ</h3>
                  <p className="text-slate-500">Learning Roadmap ကို အသုံးပြုရန် အရင်းအမြစ်များ လိုအပ်ပါသည်။</p>
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

        {currentPage === 'support' && (
          <div className="animate-fade-in w-full">
            <Support />
          </div>
        )}
      </main>

      <MentorAI />

      <footer className="bg-white border-t border-slate-200 w-full no-print mt-4 md:mt-6 text-slate-900">
        <div className="max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Brand Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-sm md:text-lg">M</div>
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MyanCareer AI</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                မြန်မာလူငယ်များအတွက် AI နည်းပညာဖြင့် အခမဲ့ လမ်းညွှန်ပေးနေသော Platform ဖြစ်ပါသည်။
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-sm md:text-base">Quick Links</h5>
              <ul className="space-y-2 text-xs md:text-sm">
                <li>
                  <button onClick={() => handleNav('home')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                    ပင်မစာမျက်နှာ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('assessment')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                    လမ်းညွှန်ချက်ရယူရန်
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('support')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
                    ပံ့ပိုးမှု
                  </button>
                </li>
              </ul>
            </div>

          

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

          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 my-4 md:my-6"></div>

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

