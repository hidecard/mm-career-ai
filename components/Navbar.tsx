import React, { useState } from 'react';

interface NavbarProps {
  onNav: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNav, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'ပင်မစာမျက်နှာ' },
    { id: 'assessment', label: 'ဆန်းစစ်ချက်' },
    { id: 'trends', label: 'အလုပ်အကိုင်ရေစီးကြောင်း' },
    { id: 'resume-builder', label: 'Resume Builder' },
    { id: 'interview-prep', label: 'Interview Prep' },
    { id: 'learning-roadmap', label: 'Learning Roadmap' }
  ];

  const handleNavClick = (id: string) => {
    onNav(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-md no-print transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('home')} role="button" tabIndex={0}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-110">
              <span className="text-white font-black text-base md:text-lg">M</span>
            </div>
            <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              MyanCareer AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm md:text-base font-bold transition-all duration-300 relative py-2 px-4 rounded-xl ${
                  currentPage === item.id
                  ? 'text-blue-600 bg-blue-50/80 border border-blue-200/50 shadow-md'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50/60'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t"></span>
                )}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 p-2.5 hover:bg-slate-100/80 rounded-xl transition-all duration-300"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100/50 animate-fade-in shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                  currentPage === item.id
                  ? 'bg-blue-50/80 text-blue-600 border border-blue-200/50 shadow-md'
                  : 'text-slate-700 hover:bg-slate-50/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
