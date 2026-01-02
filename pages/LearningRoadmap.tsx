import React, { useState } from 'react';
import { CareerGuide, LearningPath, SkillGap, LearningMilestone, LearningResource } from '../types';

interface LearningRoadmapProps {
  guide: CareerGuide;
}

const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ guide }) => {
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'resources'>('overview');

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

  const generateLearningPath = async () => {
    if (currentSkills.length === 0) {
      alert('လက်ရှိ ကျွမ်းကျင်မှုများကို ထည့်သွင်းပေးပါ။');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const path = createMockLearningPath(guide, currentSkills);
      setLearningPath(path);
      setIsAnalyzing(false);
    }, 2000);
  };

  const createMockLearningPath = (guide: CareerGuide, userSkills: string[]): LearningPath => {
    const skillGaps = generateSkillGaps(guide.requiredSkills, userSkills);
    const milestones = generateMilestones(skillGaps);
    const totalTime = calculateTotalTime(milestones);
    
    return {
      id: `path-${Date.now()}`,
      jobTitle: guide.jobTitle,
      currentSkills: userSkills,
      targetSkills: guide.requiredSkills,
      skillGaps,
      milestones,
      totalEstimatedTime: totalTime,
      progressPercentage: 0,
      startedAt: new Date().toISOString()
    };
  };

  const getEstimatedTime = (skill: string, priority: string): string => {
    const baseTime = 2 + Math.floor(Math.random() * 3);
    const multiplier = priority === 'Essential' ? 2 : priority === 'Recommended' ? 1.5 : 1;
    return `${Math.ceil(baseTime * multiplier)}-${Math.ceil(baseTime * multiplier * 1.5)} weeks`;
  };

  const generateSkillGaps = (requiredSkills: string[], userSkills: string[]): SkillGap[] => {
    const skillLevels = [
      { level: 'Beginner', skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'Command Line', 'Basic Programming'] },
      { level: 'Intermediate', skills: ['React', 'Node.js', 'Database', 'API', 'Testing', 'Version Control'] },
      { level: 'Advanced', skills: ['TypeScript', 'System Design', 'DevOps', 'Security', 'Performance', 'Architecture'] }
    ];

    const gaps: SkillGap[] = [];
    skillLevels.forEach((levelData, levelIndex) => {
      levelData.skills.forEach((skill, skillIndex) => {
        // More flexible skill matching
        const hasSkill = userSkills.some(us => {
          const userSkill = us.toLowerCase().trim();
          const requiredSkill = skill.toLowerCase().trim();
          return userSkill.includes(requiredSkill) ||
                 requiredSkill.includes(userSkill) ||
                 // Check for common abbreviations
                 (requiredSkill === 'javascript' && (userSkill.includes('js') || userSkill.includes('java script'))) ||
                 (requiredSkill === 'html' && userSkill.includes('html')) ||
                 (requiredSkill === 'css' && userSkill.includes('css')) ||
                 (requiredSkill === 'react' && userSkill.includes('react')) ||
                 (requiredSkill === 'node.js' && (userSkill.includes('node') || userSkill.includes('nodejs'))) ||
                 (requiredSkill === 'typescript' && (userSkill.includes('ts') || userSkill.includes('type script')));
        });

        // Always include some skills for demonstration, or check if skill is relevant to the job
        const isRelevantSkill = requiredSkills.length === 0 ||
                               requiredSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase().split('.')[0])) ||
                               ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database', 'API'].includes(skill);

        if (!hasSkill && isRelevantSkill) {
          const priorities: ('Essential' | 'Recommended' | 'Nice-to-have')[] = ['Essential', 'Recommended', 'Nice-to-have'];
          const priority = priorities[Math.min(levelIndex, 2)];

          // Generate detailed description based on skill level
          const descriptions = {
            Beginner: `${skill} ကို အခြေခံမှ စတင်သင်ယူရမည်။ ဤအရာသည် သင့်ရဲ့ အခြေခံအားဖြစ်လာမည်။`,
            Intermediate: `${skill} ကို အလယ်အလတ်အဆင့်အထိ သင်ယူရမည်။ လက်တွေ့လုပ်ငန်းများတွင် အသုံးပြုနိုင်ရန် လိုအပ်သည်။`,
            Advanced: `${skill} ကို အဆင့်မြင့်အထိ သင်ယူရမည်။ ကျွမ်းကျင်သူများအတွက် အရေးကြီးသော ကျွမ်းကျင်မှုဖြစ်သည်။`
          };

          const prerequisites = {
            Beginner: [],
            Intermediate: ['HTML', 'CSS', 'JavaScript'],
            Advanced: ['React', 'Node.js', 'Database']
          };

          gaps.push({
            skill,
            priority,
            currentLevel: 'None',
            targetLevel: levelData.level as 'Beginner' | 'Intermediate' | 'Advanced',
            gapDescription: descriptions[levelData.level as keyof typeof descriptions],
            prerequisites: prerequisites[levelData.level as keyof typeof prerequisites],
            resources: generateMockResources(skill),
            estimatedTimeToLearn: getEstimatedTime(skill, priority),
            matchScore: Math.floor(70 + Math.random() * 25),
            level: levelData.level as 'Beginner' | 'Intermediate' | 'Advanced',
            order: levelIndex * 10 + skillIndex
          });
        }
      });
    });

    // Sort by level and order
    return gaps.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const generateMockResources = (skill: string): LearningResource[] => {
    const platformData = [
      { name: 'Coursera', baseUrl: 'https://www.coursera.org/courses', searchParam: 'query', type: 'Course' },
      { name: 'edX', baseUrl: 'https://www.edx.org/learn', searchParam: 'search_query', type: 'Course' },
      { name: 'Udemy', baseUrl: 'https://www.udemy.com/', searchPath: 'topic', type: 'Course' },
      { name: 'YouTube', baseUrl: 'https://www.youtube.com/results', searchParam: 'search_query', type: 'Video' },
      { name: 'FreeCodeCamp', baseUrl: 'https://www.freecodecamp.org/learn', type: 'Tutorial' },
      { name: 'Khan Academy', baseUrl: 'https://www.khanacademy.org/', type: 'Tutorial' },
      { name: 'MDN Web Docs', baseUrl: 'https://developer.mozilla.org/', type: 'Documentation' },
      { name: 'Codecademy', baseUrl: 'https://www.codecademy.com/', type: 'Tutorial' },
      { name: 'W3Schools', baseUrl: 'https://www.w3schools.com/', type: 'Tutorial' }
    ];

    const types: LearningResource['type'][] = ['Course', 'Tutorial', 'Video', 'Book', 'Workshop'];
    return types.slice(0, 3 + Math.floor(Math.random() * 3)).map((type, index) => {
      const platform = platformData.find(p => p.type === type) || platformData[index % platformData.length];

      // Clean the skill name for URL generation
      const cleanSkill = skill.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      let url = platform.baseUrl;
      if (platform.searchParam) {
        // For platforms that use query parameters
        const searchQuery = encodeURIComponent(cleanSkill);
        url = `${platform.baseUrl}?${platform.searchParam}=${searchQuery}`;
      } else if (platform.searchPath) {
        // For platforms that use path-based search (like Udemy)
        const searchSlug = cleanSkill.replace(/\s+/g, '-');
        url = `${platform.baseUrl}${platform.searchPath}/${searchSlug}/`;
      }
      // For platforms without search, just use the base URL

      return {
        id: `${skill}-${index}`,
        title: `${skill} ${type} - ${platform.name}`,
        type,
        platform: platform.name,
        description: `${skill} သင်ယူရသော ${type} (${platform.name})`,
        duration: `${Math.ceil(Math.random() * 10 + 2)} hours`,
        level: 'Beginner' as const,
        price: index > 1 ? 'Paid' : 'Free',
        url,
        skills: [skill],
        rating: 4 + Math.random(),
        matchScore: Math.floor(85 + Math.random() * 15)
      };
    });
  };

  const generateMilestones = (skillGaps: SkillGap[]): LearningMilestone[] => {
    const milestoneTitles = [
      'Foundation Building',
      'Core Skills Development',
      'Advanced Topics',
      'Practical Application',
      'Project Building',
      'Portfolio Development'
    ];

    return skillGaps.slice(0, 6).map((gap, index) => ({
      id: `milestone-${index}`,
      title: milestoneTitles[index] || `Skill: ${gap.skill}`,
      description: `${gap.skill} ကို အခြေခံမှ စတင်သင်ယူပြီး လက်တွေ့ကျင်းပန်းတိုင်အထိ သင်ယူရမည်။`,
      skills: [gap.skill],
      resources: gap.resources.slice(0, 2),
      duration: gap.estimatedTimeToLearn,
      order: index + 1,
      completed: false
    }));
  };

  const calculateTotalTime = (milestones: LearningMilestone[]): string => {
    const totalWeeks = milestones.length * 3;
    return `${totalWeeks}-${totalWeeks + 4} weeks`;
  };

  const toggleMilestoneCompletion = (milestoneId: string) => {
    if (!learningPath) return;
    
    const updatedMilestones = learningPath.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined } : m
    );
    
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);
    
    setLearningPath({
      ...learningPath,
      milestones: updatedMilestones,
      progressPercentage,
      completedAt: progressPercentage === 100 ? new Date().toISOString() : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">Learning Roadmap</h1>
            <p className="text-blue-100 text-sm sm:text-base break-words">{guide.jobTitle} အတွက် သင့်ရဲ့ စိတ်ကြိုက် သင်ယူမှုလမ်းပြမြေပုံ</p>
          </div>
        </div>

        {learningPath && (
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[120px]">
              <div className="text-xs sm:text-sm text-blue-100">Total Duration</div>
              <div className="font-bold text-sm sm:text-lg">{learningPath.totalEstimatedTime}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[120px]">
              <div className="text-xs sm:text-sm text-blue-100">Skills to Learn</div>
              <div className="font-bold text-sm sm:text-lg">{learningPath.skillGaps.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[120px]">
              <div className="text-xs sm:text-sm text-blue-100">Milestones</div>
              <div className="font-bold text-sm sm:text-lg">{learningPath.milestones.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[120px]">
              <div className="text-xs sm:text-sm text-blue-100 mb-1">Progress</div>
              <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                <div
                  className="bg-white h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${learningPath.progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-200 mt-1">{learningPath.progressPercentage}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Input Section */}
      {!learningPath && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">သင့်ရဲ့ လက်ရှိ ကျွမ်းကျင်မှုများ</h2>
              <p className="text-slate-600 text-sm sm:text-base">သင်သိထားပြီးသော ကျွမ်းကျင်မှုများကို ထည့်သွင်းပါ။</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ကျွမ်းကျင်မှုအသစ် ထည့်သွင်းပါ..."
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              ထည့်သွင်းပါ
            </button>
          </div>

          {currentSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {currentSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-green-50 text-green-700 rounded-full font-medium text-xs sm:text-sm max-w-full">
                  <span className="truncate max-w-[120px] sm:max-w-none">{skill}</span>
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-green-900 flex-shrink-0 ml-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={generateLearningPath}
            disabled={isAnalyzing || currentSkills.length === 0}
            className={`w-full py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg transition-all ${
              isAnalyzing || currentSkills.length === 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
            }`}
          >
            {isAnalyzing ? 'ဖန်တီးနေပါသည်...' : 'Learning Roadmap ဖန်တီးပါ'}
          </button>
        </div>
      )}

      {/* Learning Path Results */}
      {learningPath && (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b border-slate-200 pb-3 sm:pb-4">
            {(['overview', 'milestones', 'resources'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold transition-all text-xs sm:text-sm md:text-base whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'overview' && 'အပြည့်အစုံ'}
                {tab === 'milestones' && 'ကျင်းပန်းတိုင်များ'}
                {tab === 'resources' && 'အရင်းအမြစ်များ'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Skill Gaps Summary - Roadmap Style */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  သင်ယူရမည့် ကျွမ်းကျင်မှုများ (Roadmap)
                </h3>

                {/* Group skills by level */}
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
                  const levelSkills = learningPath.skillGaps.filter(gap => gap.level === level);
                  if (levelSkills.length === 0) return null;

                  return (
                    <div key={level} className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                          level === 'Beginner' ? 'bg-green-500' :
                          level === 'Intermediate' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <h4 className={`text-lg font-bold ${
                          level === 'Beginner' ? 'text-green-700' :
                          level === 'Intermediate' ? 'text-yellow-700' :
                          'text-red-700'
                        }`}>
                          {level === 'Beginner' ? 'အခြေခံအဆင့် (Beginner)' :
                           level === 'Intermediate' ? 'အလယ်အလတ်အဆင့် (Intermediate)' :
                           'အဆင့်မြင့်အဆင့် (Advanced)'}
                        </h4>
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {levelSkills.length} ခု
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {levelSkills.map((gap, index) => (
                          <div key={gap.skill} className="relative">
                            {/* Connection line for roadmap effect */}
                            {index < levelSkills.length - 1 && (
                              <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-slate-300 z-0" style={{ transform: 'translateX(16px)' }}></div>
                            )}

                            <div className="relative z-10 border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all bg-white">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    {gap.order}
                                  </span>
                                  <h5 className="font-bold text-slate-900">{gap.skill}</h5>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  gap.priority === 'Essential' ? 'bg-red-100 text-red-700' :
                                  gap.priority === 'Recommended' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {gap.priority}
                                </span>
                              </div>

                              <p className="text-sm text-slate-600 mb-3">{gap.gapDescription}</p>

                              {/* Prerequisites */}
                              {gap.prerequisites && gap.prerequisites.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs text-slate-500 mb-1">လိုအပ်သော အခြေခံဗဟုသုတ:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {gap.prerequisites.map((prereq) => (
                                      <span key={prereq} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1 text-slate-500">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {gap.estimatedTimeToLearn}
                                </span>
                                <span className="flex items-center gap-1 text-blue-600 font-bold">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                  {gap.matchScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-3 sm:space-y-4">
              {learningPath.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`border rounded-xl p-3 sm:p-4 transition-all ${
                    milestone.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleMilestoneCompletion(milestone.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                        milestone.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      {milestone.completed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="font-bold text-sm">{index + 1}</span>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Milestone {milestone.order}</span>
                        {milestone.completed && (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full whitespace-nowrap">ပြီးပါပြီ</span>
                        )}
                      </div>
                      <h4 className={`font-bold text-base sm:text-lg ${milestone.completed ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-slate-600 text-sm mt-1 line-clamp-2">{milestone.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{milestone.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="truncate">{milestone.skills.join(', ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4 sm:space-y-6">
              {learningPath.skillGaps.map((gap) => (
                <div key={gap.skill}>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="truncate">{gap.skill}</span>
                  </h3>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                    {gap.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          resource.type === 'Course' ? 'bg-blue-100 text-blue-600' :
                          resource.type === 'Video' ? 'bg-red-100 text-red-600' :
                          resource.type === 'Tutorial' ? 'bg-purple-100 text-purple-600' :
                          resource.type === 'Book' ? 'bg-green-100 text-green-600' :
                          resource.type === 'Certification' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {resource.type === 'Course' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                            {resource.type === 'Video' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                            {resource.type === 'Tutorial' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                            {resource.type === 'Book' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                            {resource.type === 'Certification' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />}
                            {resource.type === 'Workshop' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 text-sm sm:text-base line-clamp-2">{resource.title}</div>
                          <div className="text-xs sm:text-sm text-slate-500 truncate">
                            {resource.platform} • {resource.duration} • {resource.price}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                            <span className="flex items-center gap-1 text-yellow-500 text-xs sm:text-sm">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              <span>{resource.rating.toFixed(1)}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                              {resource.matchScore}% match
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={() => setLearningPath(null)}
            className="mt-4 sm:mt-6 w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm sm:text-base"
          >
            ပြန်လည်စတင်ပါ
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmap;
