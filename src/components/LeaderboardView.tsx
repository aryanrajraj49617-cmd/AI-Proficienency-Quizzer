import React from 'react';
import { Trophy, Flame, ArrowRight } from 'lucide-react';
import { computeLearnerStats, getProficiencyColor, getStoredLearners } from '../utils/storage';
import { LearnerUser, QuizAttempt } from '../types';
import { translate, translateProficiency } from '../utils/i18n';

interface LeaderboardViewProps {
  onStartQuiz: () => void;
  learners?: LearnerUser[];
  attempts?: QuizAttempt[];
  currentLang?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onStartQuiz,
  learners: propLearners,
  attempts,
  currentLang = 'en',
}) => {
  const learners = propLearners !== undefined ? propLearners : getStoredLearners();

  const ranked = learners
    .map((l) => ({
      learner: l,
      stats: computeLearnerStats(l.id, attempts),
    }))
    .sort((a, b) => {
      if (b.stats.bestScore !== a.stats.bestScore) {
        return b.stats.bestScore - a.stats.bestScore;
      }
      return b.stats.totalQuizzes - a.stats.totalQuizzes;
    });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>{translate('nav_leaderboard', currentLang, 'Leaderboard')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {currentLang === 'hi' ? 'एआई दक्षता लीडरबोर्ड' : 'AI Proficiency Honor Roll'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {currentLang === 'hi'
            ? 'मशीन लर्निंग, प्रॉम्प्टिंग और नैतिक एआई में महारत हासिल करने वाले शिक्षार्थी।'
            : 'Recognizing scholars who demonstrated mastery in machine learning, prompting, and ethical AI deployment.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                <th className="pb-3 pr-4">{currentLang === 'hi' ? 'रैंक' : 'Rank'}</th>
                <th className="pb-3 px-4">{currentLang === 'hi' ? 'शिक्षार्थी' : 'Learner'}</th>
                <th className="pb-3 px-4">{translate('current_level', currentLang, 'Proficiency')}</th>
                <th className="pb-3 px-4">{translate('highest_score', currentLang, 'Highest Score')}</th>
                <th className="pb-3 px-4">{translate('quizzes_completed', currentLang, 'Quizzes')}</th>
                <th className="pb-3 pl-4 text-right">{translate('active_streak', currentLang, 'Streak')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {ranked.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {translate('no_learners_yet', currentLang, 'No leaderboard scores recorded yet')}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {currentLang === 'hi'
                        ? 'क्विज पूरा करने वाले और #1 रैंक हासिल करने वाले पहले व्यक्ति बनें!'
                        : 'Be the first scholar to complete an AI proficiency evaluation and claim the #1 rank!'}
                    </p>
                  </td>
                </tr>
              ) : (
                ranked.map((item, idx) => {
                  const color = getProficiencyColor(item.stats.proficiencyLevel);

                  return (
                    <tr
                      key={item.learner.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 pr-4 font-mono font-bold text-slate-500">
                        {idx === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold inline-flex items-center justify-center text-xs">
                            1
                          </span>
                        ) : idx === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold inline-flex items-center justify-center text-xs">
                            2
                          </span>
                        ) : idx === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700/10 text-amber-800 font-bold inline-flex items-center justify-center text-xs">
                            3
                          </span>
                        ) : (
                          `#${idx + 1}`
                        )}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                            {item.learner.name.charAt(0)}
                          </div>
                          <span>{item.learner.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${color.badgeBg} ${color.badgeText}`}
                        >
                          {translateProficiency(item.stats.proficiencyLevel, currentLang)}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {item.stats.bestScore}%
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-500 tabular-nums">
                        {item.stats.totalQuizzes}
                      </td>

                      <td className="py-4 pl-4 text-right">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Flame className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-mono tabular-nums">{item.learner.streakDays}d</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onStartQuiz}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{translate('start_quiz_btn', currentLang, 'Take a Quiz to Climb the Board')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
