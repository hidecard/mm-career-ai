import React, { useState, useMemo } from 'react';

interface JobTemplate {
  id: string;
  title: string;
  skills: string[];
  description: string;
  salaryRange: string;
}

interface SkillFormProps {
  onSubmit: (skills: string, interests: string) => void;
  isLoading: boolean;
}

const TARGET_JOBS: JobTemplate[] = [
  { 
    id: 'backend', 
    title: 'Junior Backend Developer (Laravel)', 
    skills: ['PHP', 'Laravel', 'MySQL', 'REST API', 'Git', 'OOP', 'Docker', 'Postman', 'Authentication'],
    description: 'Server-side logic နှင့် Database စီမံခန့်ခွဲမှုများကို လုပ်ဆောင်ရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၈ သိန်း (ကျပ်)'
  },
  { 
    id: 'frontend', 
    title: 'Frontend Developer (React)', 
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Git', 'Redux', 'TypeScript', 'Responsive Design'],
    description: 'အသုံးပြုသူများ မြင်တွေ့ရမည့် Website Interface များကို ဖန်တီးရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၁၀ သိန်း (ကျပ်)'
  },
  { 
    id: 'fullstack', 
    title: 'Full Stack Developer (MERN)', 
    skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'REST API', 'Git', 'Deployment', 'JWT'],
    description: 'Frontend နှင့် Backend နှစ်ဖက်စလုံးကို ကျွမ်းကျင်စွာ ကိုင်တွယ်နိုင်ရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၆ သိန်း - ၁၅ သိန်း (ကျပ်)'
  },
  { 
    id: 'uiux', 
    title: 'UI/UX Designer', 
    skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Adobe XD', 'Color Theory', 'Typography', 'User Testing'],
    description: 'အသုံးပြုသူများအတွက် အဆင်ပြေချောမွေ့ပြီး လှပသော Design များကို ဖန်တီးရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၉ သိန်း (ကျပ်)'
  },
  { 
    id: 'graphic', 
    title: 'Graphic Designer', 
    skills: ['Photoshop', 'Illustrator', 'Branding', 'Layout Design', 'Logo Design', 'Canva', 'Print Design', 'Visual Identity'],
    description: 'ကုမ္ပဏီ၏ ကြော်ငြာနှင့် Branding ပိုင်းဆိုင်ရာ ရုပ်ပုံများကို ဖန်တီးရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၃ သိန်းခွဲ - ၇ သိန်း (ကျပ်)'
  },
  { 
    id: 'data_analyst', 
    title: 'Data Analyst', 
    skills: ['Python', 'SQL', 'Excel (Advanced)', 'Power BI', 'Tableau', 'Statistics', 'Data Cleaning', 'Data Visualization'],
    description: 'အချက်အလက်များကို ခွဲခြမ်းစိတ်ဖြာပြီး စီးပွားရေး ဆုံးဖြတ်ချက်များအတွက် ကူညီရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၅ သိန်း - ၁၂ သိန်း (ကျပ်)'
  },
  { 
    id: 'digital_marketing', 
    title: 'Digital Marketer', 
    skills: ['SEO', 'Content Strategy', 'Facebook Ads', 'Google Analytics', 'Copywriting', 'Email Marketing', 'Social Media Management'],
    description: 'Online မှတဆင့် ကုန်ပစ္စည်းနှင့် ဝန်ဆောင်မှုများကို ကြော်ငြာရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၃ သိန်းခွဲ - ၈ သိန်း (ကျပ်)'
  },
  { 
    id: 'mobile', 
    title: 'Mobile App Developer (Flutter)', 
    skills: ['Dart', 'Flutter', 'Firebase', 'State Management', 'Mobile UI', 'REST API', 'Native Integration', 'App Deployment'],
    description: 'Android နှင့် iOS နှစ်မျိုးလုံးတွင် အသုံးပြုနိုင်သော Application များ ဖန်တီးရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၅ သိန်း - ၁၂ သိန်း (ကျပ်)'
  },
  { 
    id: 'project_manager', 
    title: 'IT Project Manager', 
    skills: ['Agile', 'Scrum', 'JIRA', 'Trello', 'Team Leadership', 'Budgeting', 'Risk Management', 'Stakeholder Management', 'Planning'],
    description: 'ပရောဂျက်များကို အချိန်မီနှင့် စနစ်တကျ ပြီးမြောက်အောင် စီမံခန့်ခွဲရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၇ သိန်း - ၁၈ သိန်း (ကျပ်)'
  },
  { 
    id: 'qa_engineer', 
    title: 'QA / Software Tester', 
    skills: ['Manual Testing', 'Automation Testing', 'Selenium', 'Bug Tracking', 'Test Cases', 'JIRA', 'Regression Testing', 'API Testing'],
    description: 'Software များ၏ အရည်အသွေးကို စစ်ဆေးပြီး အမှားအယွင်းမရှိအောင် လုပ်ဆောင်ရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၉ သိန်း (ကျပ်)'
  },
  { 
    id: 'hr_generalist', 
    title: 'HR Generalist', 
    skills: ['Recruitment', 'Employee Relations', 'Myanmar Labor Law', 'Payroll Management', 'Performance Review', 'Training', 'Communication'],
    description: 'ဝန်ထမ်းရေးရာနှင့် ကုမ္ပဏီ၏ လူသားအရင်းအမြစ်များကို စီမံခန့်ခွဲရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၁၀ သိန်း (ကျပ်)'
  },
  { 
    id: 'accountant', 
    title: 'Accountant', 
    skills: ['QuickBooks', 'Excel (Advanced)', 'Tally', 'Financial Reporting', 'Taxation', 'Auditing', 'Bookkeeping', 'Financial Analysis'],
    description: 'ကုမ္ပဏီ၏ ငွေစာရင်းနှင့် ဘဏ္ဍာရေးဆိုင်ရာ ကိစ္စရပ်များကို တိကျစွာ မှတ်တမ်းတင်ရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၃ သိန်းခွဲ - ၉ သိန်း (ကျပ်)'
  },
  { 
    id: 'content_writer', 
    title: 'Content Writer / Copywriter', 
    skills: ['SEO Writing', 'Creative Writing', 'Storytelling', 'Myanmar Grammar', 'Proofreading', 'English Translation', 'Research'],
    description: 'ဆွဲဆောင်မှုရှိသော စာသားများနှင့် ဆောင်းပါးများကို ဖန်တီးရေးသားရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၃ သိန်း - ၇ သိန်း (ကျပ်)'
  },
  { 
    id: 'sales_bd', 
    title: 'Sales & Business Development', 
    skills: ['Negotiation', 'CRM', 'Market Research', 'Lead Generation', 'Presentation', 'Strategic Planning', 'Customer Relationship'],
    description: 'ကုမ္ပဏီ၏ အရောင်းမြှင့်တင်ရန်နှင့် စီးပွားရေးအခွင့်အလမ်းသစ်များ ရှာဖွေရန် ရာထူးဖြစ်သည်။',
    salaryRange: '၃ သိန်းခွဲ - ၁၀ သိန်း + Commission'
  },
  { 
    id: 'video_editor', 
    title: 'Video Editor & Motion Designer', 
    skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Sound Editing', 'Storyboarding', 'Motion Graphics', 'CapCut'],
    description: 'အရည်အသွေးမြင့် ဗီဒီယိုများနှင့် Motion Design များကို ဖန်တီးရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၄ သိန်း - ၁၀ သိန်း (ကျပ်)'
  },
  { 
    id: 'cybersecurity', 
    title: 'Junior Cybersecurity Analyst', 
    skills: ['Networking', 'Linux', 'Penetration Testing', 'Security Audit', 'Python', 'Firewall', 'Cryptographic Basics', 'Threat Analysis'],
    description: 'စနစ်များ၏ လုံခြုံရေးကို စောင့်ကြည့်ပြီး တိုက်ခိုက်မှုများကို ကာကွယ်ရမည့် ရာထူးဖြစ်သည်။',
    salaryRange: '၆ သိန်း - ၁၅ သိန်း (ကျပ်)'
  }
];

const RELATED_SKILLS_MAP: Record<string, string[]> = {
  'html': ['CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS'],
  'css': ['HTML', 'Sass', 'Tailwind CSS', 'Responsive Design'],
  'javascript': ['React', 'Node.js', 'TypeScript', 'Next.js', 'Vue.js'],
  'php': ['Laravel', 'MySQL', 'API Design', 'WordPress', 'Docker'],
  'laravel': ['PHP', 'MySQL', 'Vue.js', 'Inertia.js', 'Redis'],
  'python': ['Django', 'Flask', 'Pandas', 'Data Science', 'SQL'],
  'react': ['Redux', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand'],
  'photoshop': ['Illustrator', 'Lightroom', 'UI Design', 'Canva', 'Figma'],
  'illustrator': ['Photoshop', 'Typography', 'Vector Art', 'Logo Design', 'Figma'],
  'marketing': ['SEO', 'Content Strategy', 'Google Ads', 'Analytics', 'Copywriting'],
  'seo': ['Content Writing', 'Keyword Research', 'Backlinking', 'Google Search Console'],
  'design': ['UI/UX', 'Figma', 'Prototyping', 'Color Theory', 'User Research'],
  'sql': ['MySQL', 'PostgreSQL', 'Python', 'Excel', 'Data Analysis'],
  'flutter': ['Dart', 'Firebase', 'State Management', 'Mobile UI'],
  'networking': ['Cybersecurity', 'Linux', 'Firewall', 'Cloud Basics'],
  'agile': ['Scrum', 'Project Management', 'JIRA', 'Leadership'],
  'recruitment': ['HR', 'Interviewing', 'Onboarding', 'Labor Law'],
  'financial': ['Accounting', 'QuickBooks', 'Audit', 'Taxation']
};

const suggestedSkills = ["HTML/CSS", "JavaScript", "Graphic Design", "Python", "Data Entry", "Digital Marketing", "Video Editing", "Communication", "PHP", "Laravel", "Photoshop", "SEO", "SQL", "Figma", "Excel", "React", "Project Management", "Recruitment", "Accounting"];
const suggestedInterests = ["Web Development", "Artificial Intelligence", "E-commerce", "Mobile Apps", "Cybersecurity", "Gaming", "Content Creation", "Data Analysis", "UI/UX Design", "Business Management", "Human Resources", "Finance & Tax"];

const SkillForm: React.FC<SkillFormProps> = ({ onSubmit, isLoading }) => {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [targetJobId, setTargetJobId] = useState('');
  const [errors, setErrors] = useState<{ skills?: string; interests?: string }>({});

  const validate = () => {
    const newErrors: { skills?: string; interests?: string } = {};
    if (!skills.trim()) newErrors.skills = 'လက်ရှိ တတ်မြောက်ထားသည့် စွမ်းရည်များကို ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။';
    if (!interests.trim()) newErrors.interests = 'သင် စိတ်ဝင်စားသည့် နယ်ပယ်ကို ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(skills, interests);
  };

  const addTag = (field: 'skills' | 'interests', tag: string) => {
    if (field === 'skills') {
      const currentSkills = skills.split(',').map(s => s.trim().toLowerCase());
      if (!currentSkills.includes(tag.toLowerCase())) {
        setSkills(prev => prev ? `${prev}, ${tag}` : tag);
      }
    } else {
      const currentInterests = interests.split(',').map(s => s.trim().toLowerCase());
      if (!currentInterests.includes(tag.toLowerCase())) {
        setInterests(prev => prev ? `${prev}, ${tag}` : tag);
      }
    }
  };

  const relatedSuggestions = useMemo(() => {
    const userSkills = skills.toLowerCase();
    const suggestionsSet = new Set<string>();
    
    Object.keys(RELATED_SKILLS_MAP).forEach(keyword => {
      if (userSkills.includes(keyword)) {
        RELATED_SKILLS_MAP[keyword].forEach(suggestion => {
          if (!userSkills.includes(suggestion.toLowerCase())) {
            suggestionsSet.add(suggestion);
          }
        });
      }
    });

    return Array.from(suggestionsSet).slice(0, 8);
  }, [skills]);

  const selectedJobData = useMemo(() => {
    return TARGET_JOBS.find(j => j.id === targetJobId) || null;
  }, [targetJobId]);

  const gapAnalysis = useMemo(() => {
    if (!selectedJobData) return null;

    const userSkillList = skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== "");
    const matching = selectedJobData.skills.filter(s => userSkillList.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    const missing = selectedJobData.skills.filter(s => !userSkillList.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us)));
    
    const readiness = Math.round((matching.length / selectedJobData.skills.length) * 100);

    return { matching, missing, readiness, total: selectedJobData.skills.length };
  }, [skills, selectedJobData]);

  return (
    <div className="w-full p-6 md:p-8 lg:p-10 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl md:rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm animate-fade-in mb-8 md:mb-12 lg:mb-16 max-w-5xl mx-auto">
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-2">စတင်ဆန်းစစ်ကြည့်ရအောင်</h2>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl font-medium">သင့်အကြောင်းကို AI က သိရှိနိုင်ဖို့ အောက်ပါအချက်အလက်တွေကို ဖြည့်စွက်ပေးပါ။</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
        <div className="space-y-4">
          <label className={`block text-sm md:text-base font-black transition-colors ${errors.skills ? 'text-rose-600' : 'text-slate-900'}`}>
            💼 လက်ရှိ တတ်မြောက်ထားသည့် စွမ်းရည်များ (Skills)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedSkills.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => addTag('skills', s)}
                className="text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2.5 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                +{s}
              </button>
            ))}
          </div>
          <textarea
            className={`w-full p-4 md:p-5 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all min-h-[120px] md:min-h-[140px] text-sm md:text-base resize-none leading-relaxed font-medium shadow-sm focus:shadow-md ${errors.skills ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 bg-white'}`}
            placeholder="ဥပမာ - HTML, CSS, Photoshop, Python..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            disabled={isLoading}
          />
          
          {relatedSuggestions.length > 0 && (
            <div className="animate-fade-in space-y-3 p-4 md:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/60 shadow-sm">
              <p className="text-xs md:text-sm font-black text-blue-700 uppercase tracking-wider">✨ ဒါတွေကိုလည်း ထပ်ထည့်ကြည့်ပါ -</p>
              <div className="flex flex-wrap gap-2">
                {relatedSuggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addTag('skills', s)}
                    className="text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2.5 bg-white hover:bg-blue-600 hover:text-white border-2 border-blue-300 hover:border-blue-600 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.skills && <p className="text-rose-600 text-xs md:text-sm font-black flex items-center gap-2 mt-2">❌ {errors.skills}</p>}
        </div>

        <div className="p-6 md:p-8 bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border-2 border-slate-300/40 space-y-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1">🎯 Skill Gap Analyzer</h3>
              <p className="text-xs md:text-sm text-slate-600 font-medium">ရည်မှန်းထားတဲ့ အလုပ်နဲ့ သင့်အရည်အချင်းကို နှိုင်းယှဉ်ကြည့်ပါ</p>
            </div>
            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full md:w-auto bg-white border-2 border-slate-300 rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-bold outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-md transition-all"
            >
              <option value="">ရည်မှန်းထားသော အလုပ်ကို ရွေးချယ်ပါ</option>
              {TARGET_JOBS.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          {selectedJobData && gapAnalysis ? (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-white to-blue-50/30 p-5 md:p-6 rounded-2xl border-2 border-blue-200/50 shadow-md">
                  <p className="text-xs md:text-sm text-slate-600 uppercase font-black tracking-wider mb-2">📋 အလုပ်အကိုင် အနှစ်ချုပ်</p>
                  <p className="text-sm md:text-base text-slate-800 leading-relaxed font-medium">{selectedJobData.description}</p>
                </div>
                <div className="bg-gradient-to-br from-white to-emerald-50/30 p-5 md:p-6 rounded-2xl border-2 border-emerald-200/50 shadow-md">
                  <p className="text-xs md:text-sm text-slate-600 uppercase font-black tracking-wider mb-2">💰 ခန့်မှန်းလစာ</p>
                  <p className="text-lg md:text-2xl font-black text-emerald-600">{selectedJobData.salaryRange}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs md:text-sm font-black text-blue-700 uppercase tracking-wider">📊 Readiness Score</span>
                  <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{gapAnalysis.readiness}%</span>
                </div>
                <div className="w-full bg-slate-300/50 h-3 md:h-4 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                  <div
                    className={`h-full transition-all duration-700 ease-out rounded-full ${gapAnalysis.readiness > 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30' : gapAnalysis.readiness > 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30' : 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30'}`}
                    style={{ width: `${gapAnalysis.readiness}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-sm md:text-base font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></span>
                    ✅ ပိုင်နိုင်သော စွမ်းရည်များ ({gapAnalysis.matching.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gapAnalysis.matching.length > 0 ? gapAnalysis.matching.map(s => (
                      <span key={s} className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 border border-emerald-200/50 shadow-sm">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                        {s}
                      </span>
                    )) : <p className="text-sm text-slate-500 italic font-medium">ကိုက်ညီမှု မရှိသေးပါ</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm md:text-base font-black text-rose-700 uppercase tracking-wider flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500"></span>
                    ⚠️ လိုအပ်နေသော စွမ်းရည်များ ({gapAnalysis.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gapAnalysis.missing.length > 0 ? gapAnalysis.missing.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addTag('skills', s)}
                        className="px-4 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 text-xs md:text-sm font-bold rounded-xl flex items-center gap-2 hover:from-rose-100 hover:to-pink-100 transition-all duration-200 border border-rose-200/50 hover:border-rose-300/50 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        {s}
                      </button>
                    )) : <p className="text-sm text-emerald-600 font-black">🎉 ဂုဏ်ယူပါတယ်! လိုအပ်ချက်များ ပြည့်စုံနေပါပြီ</p>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
              <p className="text-xs text-slate-400 font-medium">နှိုင်းယှဉ်ချက်ကြည့်ရန် အလုပ်အကိုင်တစ်ခုကို ရွေးချယ်ပါ</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className={`block text-sm md:text-base font-black transition-colors ${errors.interests ? 'text-rose-600' : 'text-slate-900'}`}>
            🎨 သင် စိတ်ဝင်စားသည့် နယ်ပယ် သို့မဟုတ် ဝါသနာ
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedInterests.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => addTag('interests', i)}
                className="text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                +{i}
              </button>
            ))}
          </div>
          <textarea
            className={`w-full p-4 md:p-5 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all min-h-[120px] md:min-h-[140px] text-sm md:text-base resize-none leading-relaxed font-medium shadow-sm focus:shadow-md ${errors.interests ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 bg-white'}`}
            placeholder="ဥပမာ - Website ရေးရတာကို စိတ်ဝင်စားတယ်, Mobile App Development..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            disabled={isLoading}
          />
          {errors.interests && <p className="text-rose-600 text-xs md:text-sm font-black flex items-center gap-2 mt-2">❌ {errors.interests}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 md:py-5 px-6 rounded-xl md:rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 text-base md:text-lg transform hover:scale-[1.02] ${isLoading ? 'bg-slate-500 cursor-not-allowed opacity-80' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>AI က တွက်ချက်နေပါသည်...</span>
            </div>
          ) : '✨ အနာဂတ် လမ်းညွှန်ချက် ရယူမယ်'}
        </button>
      </form>
    </div>
  );
};

export default SkillForm;
