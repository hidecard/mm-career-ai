import React, { useState } from 'react';
import { CareerGuide, LearningPath, LearningResource, SkillGap } from '../types';

interface SkillGapAnalyzerProps {
  guide: CareerGuide;
  onLearningPathGenerated: (path: LearningPath) => void;
}

const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ guide, onLearningPathGenerated }) => {
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<'Essential' | 'Recommended' | 'Nice-to-have' | 'All'>('All');

  const handleAddSkill = () => {
    if (newSkill.trim() && !currentSkills.includes(newSkill.trim())) {
      setCurrentSkills([...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddSkill();
  };

  const analyzeSkillGaps = async () => {
    if (currentSkills.length === 0) {
      alert('လက်ရှိ ကျွမ်းကျင်မှုများကို ထည့်သွင်းပေးပါ။');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const gaps = generateSkillGaps(guide.requiredSkills, currentSkills);
      setSkillGaps(gaps);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateSkillGaps = (requiredSkills: string[], userSkills: string[]): SkillGap[] => {
    const gaps: SkillGap[] = [];
    requiredSkills.forEach((skill, index) => {
      const hasSkill = userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase()));
      if (!hasSkill) {
        const priorities: ('Essential' | 'Recommended' | 'Nice-to-have')[] = ['Essential', 'Recommended', 'Nice-to-have'];
        const priority = priorities[index % 3];
        gaps.push({
          skill,
          priority,
          currentLevel: 'None' as const,
          targetLevel: 'Intermediate' as const,
          gapDescription: `${skill} ကို မသင်ယူရသေးပါ။`,
          resources: generateMockResources(skill),
          estimatedTimeToLearn: getEstimatedTime(skill, priority),
          matchScore: 85 - index * 5
        });
      }
    });
    return gaps;
  };

  const generateMockResources = (skill: string): LearningResource[] => {
    const platforms = ['Coursera', 'edX', 'Udemy', 'YouTube'];
    const types: LearningResource['type'][] = ['Course', 'Tutorial', 'Video'];
    return types.map((type, index) => ({
      id: `${skill}-${index}`,
      title: `${skill} Complete ${type}`,
      type,
      platform: platforms[index],
      description: `${skill} သင်ယူရသော ${type}`,
      duration: `${4 + index * 2} hours`,
      level: 'Beginner' as const,
      price: index === 2 ? '$50' : 'Free',
      url: `https://example.com/${skill.toLowerCase().replace(/\s+/g, '-')}`,
      skills: [skill],
      rating: 4.2 + Math.random() * 0.6,
      matchScore: 90 - index * 5
    }));
  };

  const getEstimatedTime = (skill: string, priority: string): string => {
    const baseTime = 2;
    const multiplier = priority === 'Essential' ? 2 : priority === 'Recommended' ? 1.5 : 1;
    return `${Math.ceil(baseTime * multiplier)}-${Math.ceil(baseTime * multiplier * 2)} weeks`;
  };

  const filteredGaps = selectedPriority === 'All' ? skillGaps : skillGaps.filter(gap => gap.priority === selectedPriority);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Skill Gap Analyzer</h2>
          <p className="text-slate-600">သင့်ရဲ့ ကျွမ်းကျင်မှုများနှင့် လိုအပ်သော ကျွမ်းကျင်မှုများကို နှိုင်းယှဉ်ပါ။</p>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-2">သင့်ရဲ့ လက်ရှိ ကျွမ်းကျင်မှုများ</label>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="ကျွမ်းကျင်မှုအသစ် ထည့်သွင်းပါ..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
          <button 
            onClick={handleAddSkill} 
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            ထည့်သွင်းပါ
          </button>
        </div>
        {currentSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={analyzeSkillGaps} 
        disabled={isAnalyzing || currentSkills.length === 0}
        className={`w-full py-4 rounded-xl font-black text-lg transition-all ${isAnalyzing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'}`}
      >
        {isAnalyzing ? 'ခွဲခြားနေပါသည်...' : 'Skill Gaps များ ခွဲခြားပါ'}
      </button>

      {skillGaps.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">ရရှိသော အကြံပြုချက်များ</h3>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">အားလုံး ({skillGaps.length})</option>
              <option value="Essential">Essential</option>
              <option value="Recommended">Recommended</option>
              <option value="Nice-to-have">Nice-to-have</option>
            </select>
          </div>
          <div className="space-y-4">
            {filteredGaps.map((gap) => (
              <div key={gap.skill} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${gap.priority === 'Essential' ? 'bg-red-100 text-red-700' : gap.priority === 'Recommended' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {gap.priority}
                    </span>
                    <h4 className="font-bold text-slate-900">{gap.skill}</h4>
                    <p className="text-sm text-slate-600 mt-1">{gap.gapDescription}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{gap.matchScore}%</div>
                    <div className="text-xs text-slate-500">match</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {gap.estimatedTimeToLearn}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {gap.resources.length} resources
                  </span>
                </div>
                <div className="space-y-2">
                  {gap.resources.map((resource) => (
                    <a 
                      key={resource.id} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${resource.type === 'Course' ? 'bg-blue-100 text-blue-600' : resource.type === 'Video' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'}`}>
                        {resource.type === 'Course' && '📚'} 
                        {resource.type === 'Video' && '🎬'} 
                        {resource.type === 'Tutorial' && '📝'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600">{resource.title}</div>
                        <div className="text-xs text-slate-500">{resource.platform} • {resource.duration} • {resource.price}</div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span>★</span>
                          <span className="text-sm text-slate-600">{resource.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;

