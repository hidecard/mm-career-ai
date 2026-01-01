
import React, { useRef, useState, useEffect } from 'react';
import { CareerGuide } from '../types';
import { chatWithMentor, searchJobsInMyanmar } from '../services/geminiService';

interface GuideResultProps {
  guide: CareerGuide;
  onReset?: () => void;
}

const FAQ_DATA = [
  {
    question: "MyanCareer AI က ပေးတဲ့ Roadmap က ဘယ်လောက်အထိ ယုံကြည်စိတ်ချရသလဲ?",
    answer: "ကျွန်ုပ်တို့၏ AI သည် နောက်ဆုံးပေါ် အလုပ်အကိုင် ဈေးကွက်ဒေတာများနှင့် နည်းပညာတိုးတက်မှုများကို အခြေခံ၍ တွက်ချက်ပေးခြင်းဖြစ်သည်။ သို့သော် နည်းပညာနယ်ပယ်သည် အမြဲပြောင်းလဲနေသောကြောင့် ဤ Roadmap ကို အခြေခံလမ်းညွှန်အဖြစ် အသုံးပြုပြီး လက်တွေ့နယ်ပယ်မှ ကျွမ်းကျင်သူများနှင့်လည်း ဆွေးနွေးတိုင်ပင်ရန် အကြံပြုလိုပါသည်။"
  },
  {
    question: "ဒီ Roadmap အတိုင်း လေ့လာပြီးရင် အလုပ်တန်းရနိုင်သလား?",
    answer: "Roadmap တွင် ဖော်ပြထားသော Skills များနှင့် Project များကို ပိုင်နိုင်စွာ လုပ်ဆောင်နိုင်ပါက အလုပ်ရရှိရန် အခွင့်အလမ်း အလွန်များပါသည်။ သို့သော် အလုပ်ခန့်အပ်ခြင်းသည် ကုမ္ပဏီတစ်ခုချင်းစီ၏ သတ်မှတ်ချက်နှင့် သင့်၏ လူတွေ့စစ်ဆေးမှု (Interview) အောင်မြင်မှုအပေါ်တွင်လည်း မူတည်ပါသည်။"
  },
  {
    question: "Roadmap ထဲက သင်ခန်းစာအရင်းအမြစ် (Resources) တွေက အခမဲ့လား?",
    answer: "ကျွန်ုပ်တို့၏ AI သည် တတ်နိုင်သမျှ အခမဲ့လေ့လာနိုင်သော YouTube, Coursera (Audit), နှင့် Documentation လင့်ခ်များကို ဦးစားပေး ရှာဖွေပေးပါသည်။ အချို့သော အဆင့်မြင့် သင်တန်းများအတွက်သာ အခပေးရန် လိုအပ်နိုင်ပါသည်။"
  },
  {
    question: "Career Mentor AI ကို ဘယ်လို အကျိုးရှိရှိ အသုံးချရမလဲ?",
    answer: "သင်နားမလည်သော နည်းပညာပိုင်းဆိုင်ရာ မေးခွန်းများ၊ အင်တာဗျူးအတွက် ပြင်ဆင်ပုံများ သို့မဟုတ် Roadmap ထဲက အဆင့်တစ်ခုခုမှာ အခက်အခဲရှိပါက Mentor AI ကို အသေးစိတ် မေးမြန်းနိုင်ပါသည်။ သူသည် သင့်အတွက် ၂၄ နာရီရှိနေမည့် ကိုယ်ပိုင်အကြံပေးတစ်ဦး ဖြစ်ပါသည်။"
  }
];

const GuideResult: React.FC<GuideResultProps> = ({ guide, onReset }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [jobSearchResults, setJobSearchResults] = useState<{title: string, company: string, location: string, salary: string, description: string, source: string}[]>([]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen, isChatLoading]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCopyStep = (step: any, index: number) => {
    const textToCopy = `${step.title}\n\n${step.description}\n\nခန့်မှန်းကြာချိန်: ${step.estimatedTime}\nခက်ခဲမှု: ${step.difficulty}\n\nလိုအပ်သောစွမ်းရည်များ: ${step.skillsToAcquire.join(', ')}\nအသုံးပြုရမည့်ကိရိယာများ: ${step.toolsToMaster.join(', ')}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

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
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "ဆောရီးပါ၊ တစ်ခုခုမှားယွင်းနေပါတယ်။ ခဏနေမှ ထပ်ကြိုးစားကြည့်ပေးပါ။" }] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSearchJobs = async () => {
    setIsSearchingJobs(true);
    try {
      const result = await searchJobsInMyanmar(guide.jobTitle);
      setJobSearchResults(result.jobs || []);
      if (result.jobs && result.jobs.length > 0) {
        alert(`အလုပ်အကိုင် ${result.jobs.length} ခု ရှာဖွေပြီးပါပြီ။ အောက်တွင် ကြည့်ရှုနိုင်ပါသည်။`);
      } else {
        alert("အလုပ်အကိုင်များ မရှိသေးပါ။ Mentor AI နှင့် အသေးစိတ် ဆွေးနွေးနိုင်ပါသည်။");
      }
    } catch (err) {
      console.error(err);
      alert("အလုပ်အကိုင် ရှာဖွေရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    const trimmed = url.trim();
    return (trimmed.startsWith('http://') || trimmed.startsWith('https://')) ? trimmed : `https://${trimmed}`;
  };



  return (
    <div className="w-full space-y-8 md:space-y-10 pb-16 md:pb-20 animate-fade-in px-4 sm:px-6 lg:px-8 relative">
      {/* Action Bar with Layout Toggle */}
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 sticky top-16 md:top-20 z-40 shadow-sm transition-all no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button onClick={onReset} className="text-slate-600 flex items-center gap-2 hover:text-blue-600 transition-colors font-black px-4 py-2.5 text-sm rounded-lg hover:bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">အသစ်ပြန်စစ်မည်</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-bold transition-all border border-indigo-100 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              <span className="hidden sm:inline">Mentor AI</span>
              <span className="sm:hidden">AI Chat</span>
            </button>

          </div>
        </div>


      </div>

      {/* MAIN EXPORTABLE AREA */}
      <div ref={printRef} className="print-container bg-white rounded-[2rem] md:rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        {/* PDF Branding Header */}
        <div className="hidden print:flex items-center justify-between p-10 border-b-2 border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-2xl">M</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-none">MyanCareer AI</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mt-2">Professional Career Strategy</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ထုတ်ဝေသည့်ရက်စွဲ</p>
            <p className="text-base font-black text-slate-900">{new Date().toLocaleDateString('my-MM')}</p>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 md:p-10 lg:p-14 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-40 md:-translate-y-48 translate-x-40 md:translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 md:w-80 md:h-80 bg-indigo-500/10 rounded-full blur-3xl translate-y-36 md:translate-y-40 -translate-x-36 md:-translate-x-40"></div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-10 relative z-10">
            <div className="flex-1 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-[11px] px-4 py-2 rounded-full font-bold uppercase tracking-wider border border-white/20 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  AI Career Strategy
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-emerald-400/30 backdrop-blur-sm shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm animate-pulse"></div>
                  <span className="text-[12px] font-bold text-emerald-50">Match Score: {guide.matchScore}%</span>
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-tight print:text-2xl">{guide.jobTitle}</h2>
              <p className="text-blue-100 text-sm md:text-base max-w-3xl leading-relaxed font-medium print:text-sm">{guide.summary}</p>

              {/* REQUIRED SKILLS DISPLAY - PROMINENT */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">Core Required Skills</p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {(guide.requiredSkills || []).map((skill, i) => (
                    <span key={i} className="px-3 md:px-4 py-2 bg-white/15 text-white rounded-xl border border-white/25 text-[11px] font-bold backdrop-blur-sm shadow-sm hover:bg-white/20 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 md:gap-6 shrink-0 w-full lg:w-auto print:grid-cols-1 print:w-48">
              <div className="bg-white/15 backdrop-blur-sm p-5 rounded-2xl border border-white/25 shadow-lg hover:bg-white/20 transition-all print:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest">လစာ (ခန့်မှန်း)</p>
                </div>
                <p className="font-black text-base md:text-lg whitespace-nowrap text-white leading-tight">{guide.salaryRange}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm p-5 rounded-2xl border border-white/25 shadow-lg hover:bg-white/20 transition-all print:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest">ဝယ်လိုအား</p>
                </div>
                <p className="font-black text-sm md:text-base text-white leading-tight">{guide.marketDemand}</p>
              </div>
              {guide.requiredExperience && (
                <div className="bg-white/15 backdrop-blur-sm p-5 rounded-2xl border border-white/25 shadow-lg hover:bg-white/20 transition-all print:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest">လုပ်သက်</p>
                  </div>
                  <p className="font-black text-sm md:text-base text-white leading-tight">{guide.requiredExperience}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Essential Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 print:divide-x print:grid-cols-3">
          <div className="p-8 md:p-10 sub-grid-item">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Soft Skills</h4>
            <div className="flex flex-wrap gap-2">
              {guide.softSkills.map((s, i) => <span key={i} className="text-[11px] bg-slate-100 px-3 py-1.5 rounded-lg font-bold border border-slate-200">{s}</span>)}
            </div>
          </div>
          <div className="p-8 md:p-10 sub-grid-item">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Certification Path</h4>
            <ul className="text-[12px] text-slate-700 space-y-3 font-bold">
              {guide.recommendedCertifications.slice(0, 3).map((c, i) => <li key={i} className="flex items-start gap-2.5"><span className="text-blue-500 mt-1">•</span> {c}</li>)}
            </ul>
          </div>
          <div className="p-8 md:p-10 sub-grid-item">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5">Match Analysis</h4>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
              <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${guide.matchScore}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 font-bold italic">သင့်အရည်အချင်းနှင့် {guide.matchScore}% ကိုက်ညီမှုရှိပါသည်။</p>
          </div>
        </div>

        {/* Roadmap Steps */}
        <div className="p-6 md:p-16 space-y-10 bg-slate-50/30 print:bg-white print:p-10">
          <div className="flex items-center justify-between gap-6 mb-6">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight print:text-3xl">Career Roadmap</h3>
            <button onClick={handleSearchJobs} disabled={isSearchingJobs} className="no-print flex items-center gap-2.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm active:scale-95">
              {isSearchingJobs ? 'ရှာဖွေနေသည်...' : 'အလုပ်အကိုင်များရှာဖွေမည်'}
            </button>
          </div>

          <div className="space-y-10 md:space-y-14">
            {guide.roadmap.map((step, index) => (
              <div key={index} className="roadmap-step bg-white border border-slate-200 rounded-2xl md:rounded-[2.5rem] shadow-sm overflow-hidden p-6 md:p-8 lg:p-12 transition-all hover:border-blue-200 print:shadow-none print:p-8 print:border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 print:flex-row">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 lg:w-16 md:h-12 lg:h-16 rounded-xl md:rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center font-black text-lg md:text-xl lg:text-3xl shrink-0 shadow-lg shadow-blue-500/20">{index+1}</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg md:text-xl lg:text-3xl font-black text-slate-900 print:text-2xl leading-tight">{step.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-1.5">
                        <span className={`text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-wider ${step.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : step.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{step.difficulty}</span>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{step.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleCopyStep(step, index)} className="no-print text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 text-[11px] font-black shrink-0">
                    {copiedIndex === index ? 'Copied!' : 'Copy Step'}
                  </button>
                </div>

                <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-medium print:text-sm print:mb-6">{step.description}</p>

                <div className="grid lg:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-slate-100 print:grid-cols-2 print:gap-10">
                  <div className="space-y-10 sub-grid-item">
                    <div className="space-y-4">
                       <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">စွမ်းရည်နှင့် ကိရိယာများ</h5>
                       <div className="flex flex-wrap gap-2">
                         {step.skillsToAcquire.concat(step.toolsToMaster).map((item, idx) => (
                           <span key={idx} className="px-3 py-2 bg-blue-50 text-blue-700 text-[11px] font-black rounded-xl border border-blue-100">{item}</span>
                         ))}
                       </div>
                    </div>
                    
                    {step.projectIdea && (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 print:p-5">
                        <h6 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3">Project Idea</h6>
                        <p className="text-xs md:text-sm text-slate-700 font-medium italic leading-relaxed">{step.projectIdea}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-10 sub-grid-item">
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">လေ့လာရန် အရင်းအမြစ်များ</h5>
                      <div className="space-y-3">
                        {step.resources.map((res, idx) => (
                          <a key={idx} href={ensureAbsoluteUrl(res.url)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-800 hover:bg-slate-50 hover:border-blue-300 transition-all print:p-3">
                            <span className="truncate pr-4">{res.title}</span>
                            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            ))}
          </div>

          {/* RELATED JOBS SECTION */}
          <div className="space-y-8 pt-10 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ဆက်စပ်အလုပ်အကိုင်များ (Related Jobs)</h3>
              <p className="text-slate-500 font-bold text-sm">သင့်အရည်အချင်းနှင့် ကိုက်ညီနိုင်သော အခြားအခွင့်အလမ်းများ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.relatedJobs.map((job, idx) => (
                <div key={idx} className="related-job-card bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:border-blue-300 transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{job.title}</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{job.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JOB SEARCH RESULTS SECTION */}
          {jobSearchResults.length > 0 && (
            <div className="space-y-10 pt-12 border-t border-slate-100">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ရှာဖွေထားသော အလုပ်အကိုင်များ (Found Jobs)</h3>
                <p className="text-slate-500 font-bold text-sm">မြန်မာနိုင်ငံတွင် သင့်အလုပ်နှင့် ဆက်စပ်သော အခွင့်အလမ်းများ</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobSearchResults.map((job, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm hover:border-emerald-300 transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 leading-tight">{job.title}</h4>
                        <p className="text-emerald-600 font-bold text-sm">{job.company}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{job.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">{job.location}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">{job.salary}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source: {job.source}</span>
                      <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm">အသေးစိတ် →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="roadmap-step bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl print:bg-slate-900 print:p-12 print:mt-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>
            <h4 className="text-2xl md:text-4xl font-black mb-10 flex items-center gap-5 relative z-10">
              <span className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </span> 
              Mentorship Advice
            </h4>
            <p className="text-slate-300 text-base md:text-xl leading-relaxed mb-12 relative z-10 print:text-base">{guide.mentorshipAdvice}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10 print:grid-cols-2">
              {guide.interviewTips.slice(0, 4).map((tip, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 flex gap-5 hover:bg-white/10 transition-colors sub-grid-item print:p-6">
                  <span className="text-3xl font-black text-blue-500/40">{i+1}</span>
                  <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="hidden print:block text-center p-14 border-t border-slate-100 bg-slate-50/50">
           <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] mb-3">MyanCareer AI Professional Platform</p>
           <div className="flex justify-center gap-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
             <span>ai.myancareer.com</span>
             <span>•</span>
             <span>Empowering Myanmar Youth</span>
             <span>•</span>
             <span>2024 Strategy Document</span>
           </div>
        </div>
      </div>

      {/* FAQ Section - Interactive but excluded from PDF printing typically unless included in printable area */}
      <div className="no-print space-y-6">
        <h3 className="text-2xl font-black text-slate-900 px-4">သိလိုသည်များကို မေးမြန်းပါ (FAQ)</h3>
        <div className="space-y-3 px-2 sm:px-0">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors group"
              >
                <span className="font-bold text-slate-800 text-sm md:text-base pr-4">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-500'}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                </svg>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 pt-0 text-slate-600 text-xs md:text-sm leading-relaxed border-t border-slate-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className="no-print fixed bottom-8 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-full sm:w-[400px] h-[600px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-slate-200 flex flex-col animate-slide-up overflow-hidden ring-1 ring-slate-100">
            <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <div>
                  <p className="font-black text-base">Career Mentor AI</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] font-bold opacity-80 uppercase tracking-wider">Online Now</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2.5 hover:bg-white/20 rounded-full transition-colors"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {chatHistory.length === 0 && (
                <div className="text-center py-16 opacity-60 space-y-6">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div>
                  <p className="text-sm font-black leading-relaxed px-10 text-slate-600">မင်္ဂလာပါ! Roadmap နဲ့ပတ်သက်ပြီး သိလိုသည်များကို မေးမြန်းနိုင်ပါတယ်။</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>{msg.parts[0].text}</div>
                  <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest px-1">{msg.role === 'user' ? 'သင်' : 'Mentor AI'}</span>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
              <div className="flex gap-3 items-center bg-slate-100 rounded-[1.5rem] px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="မေးခွန်းများမေးမြန်းပါ..." className="flex-1 bg-transparent border-none rounded-none px-2 py-4 text-sm focus:ring-0 outline-none font-medium" />
                <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-md active:scale-90 shrink-0"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
              </div>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${isChatOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-blue-600 text-white'}`}>
          {isChatOpen ? <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> : <div className="relative"><svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div>}
        </button>
      </div>
    </div>
  );
};

export default GuideResult;
