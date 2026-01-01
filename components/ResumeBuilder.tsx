import React, { useState, useEffect } from 'react';
import { Resume, CareerGuide, Job, LearningResource } from '../types';
import { generateResumeSuggestions, searchJobOpportunities, findLearningResources } from '../services/geminiService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeBuilderProps {
  careerGuide: CareerGuide;
  userSkills: string;
  userInterests: string;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ careerGuide, userSkills, userInterests }) => {
  const [resume, setResume] = useState<Resume>({
    id: Math.random().toString(36).substring(2, 11),
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [suggestions, setSuggestions] = useState<{
    summary: string;
    skills: string[];
    experience: string[];
    keywords: string[];
  } | null>(null);
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingLearningResources, setLoadingLearningResources] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadSuggestions();
    loadJobs();
    loadLearningResources();
  }, [careerGuide]);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const result = await generateResumeSuggestions(careerGuide, resume);
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const result = await searchJobOpportunities(careerGuide, resume.personalInfo.location || 'ရန်ကင်း');
      setJobs(result);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadLearningResources = async () => {
    setLoadingLearningResources(true);
    try {
      const result = await findLearningResources(careerGuide, resume.skills);
      setLearningResources(result);
    } catch (error) {
      console.error('Failed to load learning resources:', error);
    } finally {
      setLoadingLearningResources(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
      updatedAt: new Date().toISOString()
    }));
  };

  const updateSummary = (value: string) => {
    setResume(prev => ({ ...prev, summary: value, updatedAt: new Date().toISOString() }));
  };

  const addSkill = (skill: string) => {
    if (skill && !resume.skills.includes(skill)) {
      setResume(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        updatedAt: new Date().toISOString()
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const exportToPDF = async () => {
    try {
      // Create a temporary div for PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '210mm'; // A4 width
      pdfContent.style.padding = '20mm';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.color = 'black';
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '-9999px';
      pdfContent.style.zIndex = '-1';

      // Add resume content to PDF
      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1e40af; margin: 0;">${resume.personalInfo.fullName || 'အမည် မသိရှိရသေးပါ'}</h1>
          <div style="margin-top: 10px; font-size: 14px; color: #6b7280;">
            ${resume.personalInfo.email || ''} ${resume.personalInfo.email && resume.personalInfo.phone ? '|' : ''} ${resume.personalInfo.phone || ''}
            ${resume.personalInfo.location ? `| ${resume.personalInfo.location}` : ''}
          </div>
        </div>

        ${resume.summary ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">ကိုယ်ရေးဖော်ပြချက်</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #374151;">${resume.summary}</p>
          </div>
        ` : ''}

        ${resume.skills.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">ကျွမ်းကျင်မှုများ</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${resume.skills.map(skill => `<span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${careerGuide ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">ပန်းတိုင် အလုပ်အကိုင်</h2>
            <p style="font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 5px;">${careerGuide.jobTitle}</p>
            <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">${careerGuide.summary}</p>
            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
              <p>လစာအပြင်: ${careerGuide.salaryRange}</p>
              <p>ဈေးကွက်လိုအပ်ချက်: ${careerGuide.marketDemand}</p>
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af;">
          <p>MyanCareer AI ဖြင့် ဖန်တီးထားသော Resume</p>
          <p>Generated on ${new Date().toLocaleDateString('my-MM')}</p>
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(pdfContent);

      // Generate PDF
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary element
      document.body.removeChild(pdfContent);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`resume-${resume.personalInfo.fullName || 'unnamed'}.pdf`);

      alert('PDF ထုတ်ယူမှု အောင်မြင်ပါသည်!');

    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF ထုတ်ယူရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။ ထပ်ကြိုးစားကြည့်ပါ။');
    }
  };

  if (!careerGuide) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">ပထမဦးစွာ အလုပ်လမ်းညွှန်ချက် ရယူပါ</h3>
          <p className="text-slate-500">သင့်အတွက် သင့်စာရွက်စာတမ်း ဖန်တီးရန် အရင်းအမြစ်များ လိုအပ်ပါသည်။</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">AI Resume Builder</h2>
            <p className="text-blue-100 font-medium">သင့်အတွက် ကိုယ်ရေးအချက်အလက်များဖြည့်သွင်းပါ</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
            ပန်းတိုင်: {careerGuide.jobTitle}
          </span>
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
            Match Score: {careerGuide.matchScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              ကိုယ်ရေးအချက်အလက်
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">အမည်</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="သင့်အမည်"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">အီးမေးလ်</label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">ဖုန်နံပါတ်</label>
                <input
                  type="tel"
                  value={resume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="09xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">တည်နေရာ</label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="ရန်ကင်း/မန်းနီးတို့"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              ကိုယ်ရေးဖော်ပြချက်
            </h3>
            <textarea
              value={resume.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="သင့်အတွေ့အကြုံနှင့် ကျွမ်းကျင်မှုများကို အကျဉ်းချုပ်ရေသားပါ..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            />
            
            {/* AI Suggestions */}
            {suggestions && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-bold text-blue-700">AI အကြံပြုချက်</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{suggestions.summary}</p>
                <button
                  onClick={() => updateSummary(suggestions.summary)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  အသုံးပြုမည်
                </button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </span>
              ကျွမ်းကျင်မှုများ
            </h3>
            
            {/* Current Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg text-sm font-bold flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              {resume.skills.length === 0 && (
                <p className="text-slate-400 text-sm italic">ကျွမ်းကျင်မှုများ ထည့်သွင်းပါ</p>
              )}
            </div>

            {/* Add Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="ကျွမ်းကျင်မှု ထည့်သွင်းရန်"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                ထည့်မည်
              </button>
            </div>

            {/* AI Suggested Skills */}
            {suggestions && suggestions.skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-600 mb-2">AI အကြံပြု ကျွမ်းကျင်မှုများ:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.skills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => addSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        resume.skills.includes(skill)
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                      }`}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Keywords */}
          {suggestions && suggestions.keywords.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="text-lg font-black text-amber-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </span>
                အလုပ်ရှာဖွေရာတွင် အသုံးဝင်သော Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white text-amber-700 rounded-lg text-sm font-bold border border-amber-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={exportToPDF}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF အဖြစ် ထုတ်ယူမည်
          </button>
        </div>

        {/* Job Opportunities & Learning Resources Sidebar */}
        <div className="space-y-6">
          {/* Job Opportunities */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                </svg>
              </span>
              အလုပ်အကိုင် အခွင့်အလမ်းများ
            </h3>

            {loadingJobs ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-green-200 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{job.title}</h4>
                        <p className="text-sm text-slate-600 truncate">{job.company}</p>
                        <p className="text-xs text-slate-500 truncate">{job.location}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
                          job.type === 'Part-time' ? 'bg-blue-100 text-blue-700' :
                          job.type === 'Contract' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {job.type}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {job.matchScore}% ကိုက်ညီမှု
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{job.salary}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 2).map((req, i) => (
                          <span key={i} className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-medium">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">
                အလုပ်အကိုင် အခွင့်အလမ်းများ ရှာဖွေနေပါပြီ...
              </p>
            )}
          </div>

          {/* Learning Resources */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              သင်ယူရန် အရင်းအမြစ်များ
            </h3>

            {loadingLearningResources ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : learningResources.length > 0 ? (
              <div className="space-y-4">
                {learningResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{resource.title}</h4>
                        <p className="text-sm text-slate-600 truncate">{resource.platform}</p>
                        <p className="text-xs text-slate-500 truncate">{resource.type} • {resource.level}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-blue-600">
                          {resource.matchScore}% ကိုက်ညီမှု
                        </span>
                        <span className="text-xs text-slate-600">
                          ⭐ {resource.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{resource.duration} • {resource.price}</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">
                သင်ယူရန် အရင်းအမြစ်များ ရှာဖွေနေပါပြီ...
              </p>
            )}
          </div>

          {/* Target Job Info */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              ပန်းတိုင် အလုပ်
            </h3>
            <h4 className="text-xl font-black mb-2">{careerGuide.jobTitle}</h4>
            <p className="text-blue-100 text-sm mb-4">{careerGuide.summary}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">လစာအပြင်</span>
                <span className="font-bold">{careerGuide.salaryRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">ဈေးကွက်လိုအပ်ချက်</span>
                <span className={`font-bold ${
                  careerGuide.marketDemand === 'High' ? 'text-green-300' :
                  careerGuide.marketDemand === 'Medium' ? 'text-yellow-300' : 'text-red-300'
                }`}>
                  {careerGuide.marketDemand}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              AI အကြံပြုချက်
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-200 mt-0.5">•</span>
                <span>သင့် Resume ကို အလုပ်လျှောက်တဲ့ ကုမ္ပဏီနှင့် ကိုက်ညီအောင် စိတ်ကြိုက်ပြင်ဆင်ပါ။</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-200 mt-0.5">•</span>
                <span>Cover Letter တစ်စောင် ရေးသားပါ။ အရင်းအမြစ်များ ကိုယ်တိုင် ဖန်တီးပါ။</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-200 mt-0.5">•</span>
                <span>LinkedIn Profile ကို အပြည့်အစုံ ဖြည့်သွင်းပါ။</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-200 mt-0.5">•</span>
                <span>အင်တာဗျူးအတွက် သင့်ရဲ့ ပရောဂျက်များကို ပြင်ဆင်ထားပါ။</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
