import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Difficulty, QuizSettings, Topic, TOPICS, DIFFICULTIES } from '../types';
import { translate, translateTopic, translateDifficulty } from '../utils/i18n';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
  availableQuestionCount: number;
  currentLang?: string;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({
  onStartQuiz,
  availableQuestionCount,
  currentLang = 'en',
}) => {
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [timerMode, setTimerMode] = useState<'untimed' | '30s_per_question' | '5m_total'>('untimed');
  const [instantFeedback, setInstantFeedback] = useState(true);

  const handleLaunch = () => {
    onStartQuiz({
      questionCount: 10,
      topic,
      difficulty,
      timerMode,
      instantFeedback,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{translate('hero_badge', currentLang, 'Interactive Knowledge Check')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {translate('setup_title', currentLang, 'Configure Your Assessment')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {translate('setup_subtitle', currentLang, 'Every quiz dynamically draws 10 questions with randomized options and balanced topics.')}
        </p>
      </div>

      {/* Configuration Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Topic Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {translate('setup_focus_area', currentLang, 'Assessment Focus Area')}
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value as any)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">
              {currentLang === 'hi' ? 'व्यापक (सभी 7 विषय संतुलित)' : 'Comprehensive (All 7 Topics Balanced)'}
            </option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {translateTopic(t, currentLang)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {translate('setup_difficulty', currentLang, 'Target Difficulty Level')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setDifficulty('all')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                difficulty === 'all'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {currentLang === 'hi' ? 'सभी स्तर' : 'All Tiers'}
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  difficulty === d
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {translateDifficulty(d, currentLang)}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            {translate('setup_timer', currentLang, 'Timer Configuration')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTimerMode('untimed')}
              className={`p-3 text-left rounded-xl border transition-all ${
                timerMode === 'untimed'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-xs font-bold">
                {currentLang === 'hi' ? 'असीमित समय' : 'Untimed'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {currentLang === 'hi' ? 'आराम से सीखने की गति' : 'Relaxed pace'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTimerMode('30s_per_question')}
              className={`p-3 text-left rounded-xl border transition-all ${
                timerMode === '30s_per_question'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-xs font-bold">30s / Q</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {currentLang === 'hi' ? 'तेज गति' : 'Quick reflexes'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTimerMode('5m_total')}
              className={`p-3 text-left rounded-xl border transition-all ${
                timerMode === '5m_total'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-xs font-bold">
                {currentLang === 'hi' ? '5 मिनट कुल' : '5 Min Exam'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {currentLang === 'hi' ? 'सर्टिफिकेशन स्प्रिंट' : 'Certification sprint'}
              </span>
            </button>
          </div>
        </div>

        {/* Instant Explanation Toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              {currentLang === 'hi' ? 'तत्काल प्रश्न प्रतिक्रिया' : 'Immediate Question Feedback'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {currentLang === 'hi'
                ? 'प्रत्येक उत्तर के तुरंत बाद शैक्षिक व्याख्या देखें।'
                : 'Reveal educational explanation immediately after each answer.'}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={instantFeedback}
            onClick={() => setInstantFeedback((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              instantFeedback ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                instantFeedback ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={handleLaunch}
          className="w-full py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          <span>{translate('start_quiz_btn', currentLang, 'Begin 10-Question Assessment')}</span>
        </button>

        <p className="text-center text-xs text-slate-400">
          {availableQuestionCount} {currentLang === 'hi' ? 'सत्यापित प्रश्न उपलब्ध' : 'verified questions available in the pool.'}
        </p>
      </div>
    </div>
  );
};
