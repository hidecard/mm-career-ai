import React, { useState, useEffect } from 'react';
import { CareerGuide, InterviewQuestion, InterviewAnswer } from '../types';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../services/geminiService';

interface InterviewPrepProps {
  careerGuide: CareerGuide;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ careerGuide }) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadQuestions();
  }, [careerGuide]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const generatedQuestions = await generateInterviewQuestions(careerGuide);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;

    setLoading(true);
    try {
      const evaluation = await evaluateInterviewAnswer(currentQuestion, userAnswer);
      setAnswers(prev => [...prev, evaluation]);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
      // Fallback evaluation
      const basicEvaluation: InterviewAnswer = {
        questionId: currentQuestion.id,
        userAnswer: userAnswer,
        suggestedAnswer: currentQuestion.sampleAnswer || "ပိုမိုကောင်းအောင် ပြုပြင်ပါ။",
        improvementTips: ["ပိုမိုအသေးစိတ်ရေးသားပါ"],
        score: Math.min(100, userAnswer.length * 2),
        feedback: userAnswer.length > 50 ? "ကောင်းမွန်ပါသည်။" : "ပိုမိုအသေးစိတ် ဖြေကြားပါ။"
      };
      setAnswers(prev => [...prev, basicEvaluation]);
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setShowResult(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setUserAnswer('');
    setShowResult(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'bg-blue-100 text-blue-700';
      case 'technical': return 'bg-purple-100 text-purple-700';
      case 'situational': return 'bg-orange-100 text-orange-700';
      case 'general': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!careerGuide) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">ပထမဦးစွာ အလုပ်လမ်းညွှန်ချက် ရယူပါ</h3>
          <p className="text-slate-500">အင်တာဗျူး ပြင်ဆင်ရန် အရင်းအမြစ်များ လိုအပ်ပါသည်။</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black">AI Interview Coach</h2>
            <p className="text-blue-100 font-medium">အင်တာဗျူးအတွက် ပြင်ဆင်လိုက်ပါ</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
            ပန်းတိုင်: {careerGuide.jobTitle}
          </span>
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
            မေးခွန်းပေါင်း: {questions.length}
          </span>
          <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
            ဖြေပြီး: {answers.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question List Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              မေးခွန်းစာရင်း
            </h3>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'general', 'behavioral', 'technical', 'situational'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'အားလုံး' : cat}
                </button>
              ))}
            </div>

            {loadingQuestions ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(questions.indexOf(q));
                      setUserAnswer('');
                      setShowResult(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      questions.indexOf(q) === currentQuestionIndex
                        ? 'bg-blue-600 text-white shadow-lg'
                        : answers.find(a => a.questionId === q.id)
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        questions.indexOf(q) === currentQuestionIndex
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {questions.indexOf(q) + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{q.question}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getCategoryColor(q.category)}`}>
                            {q.category}
                          </span>
                          {answers.find(a => a.questionId === q.id) && (
                            <span className="text-green-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white mt-4">
            <h4 className="font-bold mb-2">လုပ်ဆောင်မှု အခြေအနေ</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ဖြေပြီး:</span>
                <span className="font-bold">{answers.length} / {questions.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${questions.length > 0 ? (answers.length / questions.length) * 100 : 0}%` }}
                ></div>
              </div>
              {answers.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>ပျမ်းမျှ ရမှတ်:</span>
                  <span className="font-bold">
                    {Math.round(answers.reduce((acc, a) => acc + a.score, 0) / answers.length)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          {loadingQuestions ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">မေးခွန်းများ ဖန်တီးနေပါသည်...</p>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              {/* Question Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(currentQuestion.category)}`}>
                    {currentQuestion.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h3>

                {/* Tips */}
                {currentQuestion.tips && currentQuestion.tips.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      အကြံပြုချက်
                    </h4>
                    <ul className="space-y-1">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-blue-600 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Points */}
                {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-bold text-green-700 mb-2">အဓိက အချက်များ:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.keyPoints.map((point, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Input */}
              {!showResult ? (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    သင့်အဖြေ
                  </h4>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="ဤနေရာတွင် သင့်အဖြေကို ရေးသားပါ..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                        currentQuestionIndex === 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      နောက်သို့
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || loading}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${
                        !userAnswer.trim() || loading
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          စစ်ဆေးနေပါသည်...
                        </span>
                      ) : (
                        'အဖြေပေးမည်'
                      )}
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                        currentQuestionIndex === questions.length - 1
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      ရှေ့သို့
                    </button>
                  </div>
                </div>
              ) : (
                /* Result Display */
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                  {(() => {
                    const result = answers[answers.length - 1];
                    return (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            အကဲဖြတ်ချက်
                          </h4>
                          <div className={`px-4 py-2 rounded-xl font-bold ${
                            result.score >= 80 ? 'bg-green-100 text-green-700' :
                            result.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {result.score}%
                          </div>
                        </div>

                        {/* Score Bar */}
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">ရမှတ်</span>
                            <span className="font-bold">{result.score}/100</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${
                                result.score >= 80 ? 'bg-green-500' :
                                result.score >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${result.score}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Feedback */}
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <p className="text-blue-700">{result.feedback}</p>
                        </div>

                        {/* Improvement Tips */}
                        {result.improvementTips && result.improvementTips.length > 0 && (
                          <div className="bg-amber-50 rounded-xl p-4 mb-4">
                            <h5 className="font-bold text-amber-700 mb-2">ပြုပြင်ရန် အကြံပြုချက်များ:</h5>
                            <ul className="space-y-1">
                              {result.improvementTips.map((tip, i) => (
                                <li key={i} className="text-sm text-amber-600 flex items-start gap-2">
                                  <span className="text-amber-400 mt-1">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggested Answer */}
                        {result.suggestedAnswer && (
                          <div className="bg-green-50 rounded-xl p-4">
                            <h5 className="font-bold text-green-700 mb-2">အကောင်းဆုံး ဖြေကြားချက်:</h5>
                            <p className="text-green-600 text-sm">{result.suggestedAnswer}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                              currentQuestionIndex === 0
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            နောက်သို့
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setUserAnswer('');
                                setShowResult(false);
                              }}
                              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            >
                              ပြန်ဖြေမည်
                            </button>
                            <button
                              onClick={handleNextQuestion}
                              disabled={currentQuestionIndex === questions.length - 1}
                              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                                currentQuestionIndex === questions.length - 1
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                              }`}
                            >
                              {currentQuestionIndex === questions.length - 1 ? 'ပြီးပါပြီ' : 'ရှေ့သို့'}
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Tips Section */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  အင်တာဗျူးအတွက် အထွေထွေ အကြံပြုချက်များ
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200 mt-1">•</span>
                    <span>သင့်အဖြေများကို STAR method ဖြင့် တင်ပြပါ။ (Situation, Task, Action, Result)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200 mt-1">•</span>
                    <span>ကိုယ်တိုင် ကိုယ်ကျ အတွေ့အကြုံများကို ဥပမာပေး၍ ရှင်းပြပါ။</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200 mt-1">•</span>
                    <span>မေးခွန်းကို နားထောင်ပြီး သေချာစွာ စဉ်းစားပြီးမှ ဖြေကြားပါ။</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-200 mt-1">•</span>
                    <span>ယောင်ဆိုးခြင်းမရှိဘဲ တည်ငြိမ်စွာ ပြောဆိုပါ။</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
              <p className="text-slate-500">မေးခွန်းများ မရရှိနိုင်ပါ။ နောက်မှ ပြန်လည် ကြိုးစားပါ။</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;

