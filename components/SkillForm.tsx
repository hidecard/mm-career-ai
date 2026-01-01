import React, { useState, useMemo } from 'react';

interface SkillFormProps {
  onSubmit: (skills: string, interests: string) => void;
  isLoading: boolean;
}

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

  return (
    <div className="w-full p-6 md:p-8 lg:p-10 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl md:rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm animate-fade-in mb-8 md:mb-12 lg:mb-16 max-w-5xl mx-auto">
      <div className="mb-10 md:mb-12 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4">စတင်ဆန်းစစ်ကြည့်ရအောင်</h2>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl font-medium">သင့်အကြောင်းကို AI က သိရှိနိုင်ဖို့ အောက်ပါအချက်အလက်တွေကို ဖြည့်စွက်ပေးပါ။</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
        <div className="space-y-4">
          <label className={`block text-base md:text-lg font-black transition-colors ${errors.skills ? 'text-rose-600' : 'text-slate-900'}`}>
            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
            </svg>
            လက်ရှိ တတ်မြောက်ထားသည့် စွမ်းရည်များ (Skills)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedSkills.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addTag('skills', s)}
              className="text-sm md:text-base font-bold px-4 md:px-5 py-2.5 md:py-3 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              +{s}
            </button>
            ))}
          </div>
          <textarea
            className={`w-full p-5 md:p-6 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all min-h-[140px] md:min-h-[160px] text-base md:text-lg resize-none leading-relaxed font-medium shadow-sm focus:shadow-md ${errors.skills ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 bg-white'}`}
            placeholder="ဥပမာ - HTML, CSS, Photoshop, Python..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            disabled={isLoading}
          />
          
          {relatedSuggestions.length > 0 && (
            <div className="animate-fade-in space-y-3 p-4 md:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200/60 shadow-sm">
              <p className="text-xs md:text-sm font-black text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ဒါတွေကိုလည်း ထပ်ထည့်ကြည့်ပါ -
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedSuggestions.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => addTag('skills', s)}
              className="text-sm md:text-base font-bold px-4 md:px-5 py-2.5 md:py-3 bg-white hover:bg-blue-600 hover:text-white border-2 border-blue-300 hover:border-blue-600 rounded-xl transition-all duration-200 shadow-sm"
            >
              + {s}
            </button>
                ))}
              </div>
            </div>
          )}

          {errors.skills && <p className="text-rose-600 text-xs md:text-sm font-black flex items-center gap-2 mt-2">❌ {errors.skills}</p>}
        </div>

        <div className="space-y-4">
          <label className={`block text-base md:text-lg font-black transition-colors ${errors.interests ? 'text-rose-600' : 'text-slate-900'}`}>
            သင် စိတ်ဝင်စားသည့် နယ်ပယ် သို့မဟုတ် ဝါသနာ
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
          {errors.interests && <p className="text-rose-600 text-xs md:text-sm font-black flex items-center gap-2 mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {errors.interests}
          </p>}
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
          ) : ' အနာဂတ် လမ်းညွှန်ချက် ရယူမယ်'}
        </button>
      </form>
    </div>
  );
};

export default SkillForm;

