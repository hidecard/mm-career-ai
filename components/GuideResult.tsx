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
    answer: "ကျွန်ုပ်တို့၏ AI သည် နောက်ဆုံးပေါ် အလုပ်အကိုင် ဈေးကွက်ဒေတာများနှင့် နည်းပညာတိုးတက်မှုများကို အခြေခံ၍ တွက်ချက်ပေးခြင်းဖြစ်သည်။"
  },
  {
    question: "ဒီ Roadmap အတိုင်း လေ့လာပြီးရင် အလုပ်တန်းရနိုင်သလား?",
    answer: "Roadmap တွင် ဖော်ပြထားသော Skills များနှင့် Project များကို ပိုင်နိုင်စွာ လုပ်ဆောင်နိုင်ပါက အလုပ်ရရှိရန် အခွင့်အလမ်း အလွန်များပါသည်။"
  },
  {
    question: "Career Mentor AI ကို ဘယ်လို အသုံးချရမလဲ?",
    answer: "သင်နားမလည်သော နည်းပညာပိုင်းဆိုင်ရာ မေးခွန်းများနှင့် အင်တာဗျူးအတွက် ပြင်ဆင်ပုံများကို Mentor AI ကို မေးမြန်းနိုင်ပါသည်။"
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
    const textToCopy = `${step.title}\n\n${step.description}\n\nခန့်မှန်းကြာချိန်: ${step.estimatedTime}`;
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
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "ဆောရီးပါ၊ ထပ်ကြိုးစားကြည့်ပေးပါ။" }] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSearchJobs = async () => {
    setIsSearchingJobs(true);
    try {
      const result = await searchJobsInMyanmar(guide.jobTitle);
      setJobSearchResults(result.jobs || []);
      alert(`အလုပ်အကိုင် ${result.jobs?.length || 0} ခု ရှာဖွေပြီးပါပြီ။`);
    } catch (err) {
      alert("အလုပ်အကိုင် ရှာဖွေရာတွင် အမှားဖြစ်ပေါ်ခဲ့ပါသည်။");
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
    <div className="w-full space-y-6 pb-16 animate-fade-in px-4 sm:px-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 sticky top-20 z-40 shadow-sm">
        <button onClick={onReset} className="text-slate-600 flex items-center gap-2 hover:text-blue-600 transition-colors font-black px-4 py-2.5 text-sm rounded-lg hover:bg-slate-50">
          အသစ်ပြန်စစ်မည်
        </button>
        <button onClick={() => setIsChatOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-bold text-sm">
          Mentor AI
        </button>
      </div>

      <div ref={printRef} className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold border border-white/20">
                AI Career Strategy
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-400/30">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-bold">Match: {guide.matchScore}%</span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">{guide.jobTitle}</h2>
            <p className="text-blue-100 text-sm leading-relaxed">{guide.summary}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {(guide.requiredSkills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/15 text-white rounded-lg text-xs font-bold border border-white/25">{skill}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/15 p-4 rounded-xl border border-white/25">
                <p className="text-xs text-blue-200 uppercase font-black tracking-widest mb-1">လစာ</p>
                <p className="font-black text-base">{guide.salaryRange}</p>
              </div>
              <div className="bg-white/15 p-4 rounded-xl border border-white/25">
                <p className="text-xs text-blue-200 uppercase font-black tracking-widest mb-1">ဝယ်လိုအား</p>
                <p className="font-black text-sm">{guide.marketDemand}</p>
              </div>
              {guide.requiredExperience && (
                <div className="bg-white/15 p-4 rounded-xl border border-white/25">
                  <p className="text-xs text-blue-200 uppercase font-black tracking-widest mb-1">လုပ်သက်</p>
                  <p className="font-black text-sm">{guide.requiredExperience}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
          <div className="p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Soft Skills</h4>
            <div className="flex flex-wrap gap-2">
              {guide.softSkills.map((s, i) => <span key={i} className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold">{s}</span>)}
            </div>
          </div>
          <div className="p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Certifications</h4>
            <ul className="text-xs text-slate-700 space-y-1 font-bold">
              {guide.recommendedCertifications.slice(0, 3).map((c, i) => <li key={i}>• {c}</li>)}
            </ul>
          </div>
          <div className="p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Match Score</h4>
            <div className="w-full bg-slate-100 h-3 rounded-full">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${guide.matchScore}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-bold">{guide.matchScore}% ကိုက်ညီမှု</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 bg-slate-50/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl md:text-2xl font-black text-slate-900">Career Roadmap</h3>
            <button onClick={handleSearchJobs} disabled={isSearchingJobs} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">
              {isSearchingJobs ? 'ရှာဖွေနေသည်...' : 'အလုပ်ရှာဖွေမည်'}
            </button>
          </div>

          <div className="space-y-4">
            {guide.roadmap.map((step, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5 hover:border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">{index+1}</div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{step.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          step.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 
                          step.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>{step.difficulty}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{step.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleCopyStep(step, index)} className="text-slate-400 hover:text-blue-600 text-xs font-black">
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4 font-medium">{step.description}</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Skills & Tools</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {step.skillsToAcquire.concat(step.toolsToMaster).map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Resources</h5>
                    <div className="space-y-1">
                      {step.resources.slice(0, 2).map((res, idx) => (
                        <a key={idx} href={ensureAbsoluteUrl(res.url)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50">
                          <span className="truncate pr-2">{res.title}</span>
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900">ဆက်စပ်အလုပ်အကိုင်များ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.relatedJobs.map((job, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-300">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{job.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {jobSearchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900">ရှာဖွေထားသော အလုပ်များ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobSearchResults.map((job, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-5 rounded-xl">
                    <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                    <p className="text-emerald-600 font-bold text-sm">{job.company}</p>
                    <p className="text-slate-600 text-sm mt-2">{job.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">{job.location}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <h4 className="text-xl font-black mb-4 flex items-center gap-3">
              <span className="p-2 bg-blue-600 rounded-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></span>
              Mentorship Advice
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{guide.mentorshipAdvice}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.interviewTips.slice(0, 4).map((tip, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-3">
                  <span className="text-2xl font-black text-blue-500/40">{i+1}</span>
                  <p className="text-sm text-slate-200 font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 no-print">
        <h3 className="text-xl font-black text-slate-900">FAQ</h3>
        <div className="space-y-2">
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50">
                <span className="font-bold text-slate-800 text-sm pr-4">{faq.question}</span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              <div className={`overflow-hidden transition-all ${openFaqIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-6 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-full sm:w-[380px] h-[500px] bg-white shadow-xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <p className="font-bold">Career Mentor AI</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatHistory.length === 0 && <div className="text-center py-10 opacity-60 text-sm text-slate-500">မေးခွန်းများမေးမြန်းနိုင်ပါတယ်။</div>}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>{msg.parts[0].text}</div>
                </div>
              ))}
              {isChatLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-xl border border-slate-200 flex gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div></div></div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
              <div className="flex gap-2 items-center bg-slate-100 rounded-xl px-3 py-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="မေးခွန်းရိုက်ထည့်ပါ..." className="flex-1 bg-transparent text-sm outline-none" />
                <button type="submit" disabled={isChatLoading} className="p-2 bg-blue-600 text-white rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></button>
              </div>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isChatOpen ? 'bg-slate-800' : 'bg-blue-600'} text-white`}>
          {isChatOpen ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>}
        </button>
      </div>
    </div>
  );
};

export default GuideResult;
