import React, { useState } from 'react';
import {
  Award,
  Flame,
  RotateCcw,
  Play,
  CheckCircle2,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { LearnerUser, QuizAttempt, Topic, TOPICS } from '../types';
import {
  computeLearnerStats,
  getProficiencyColor,
  getStoredAttempts,
} from '../utils/storage';

import { ThemeAdjuster } from './ThemeAdjuster';
import { translate, translateTopic, translateProficiency, SUPPORTED_LANGUAGES } from '../utils/i18n';
import { Globe } from 'lucide-react';

interface LearnerDashboardProps {
  learner: LearnerUser;
  attempts?: QuizAttempt[];
  onStartQuiz: () => void;
  onStartReviewMistakes: (questionIds: string[]) => void;
  onViewCertificate: (attempt: QuizAttempt) => void;
  theme?: 'light' | 'dark';
  onSetTheme?: (t: 'light' | 'dark') => void;
  currentLang?: string;
  onOpenLanguageSelector?: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  learner,
  attempts: propAttempts,
  onStartQuiz,
  onStartReviewMistakes,
  onViewCertificate,
  theme = 'light',
  onSetTheme,
  currentLang = 'en',
  onOpenLanguageSelector,
}) => {
  const [selectedAttemptForReview, setSelectedAttemptForReview] = useState<QuizAttempt | null>(null);

  const allAttempts = (propAttempts || getStoredAttempts()).filter((a) => a.learnerId === learner.id);
  const stats = computeLearnerStats(learner.id, allAttempts);
  const colorMeta = getProficiencyColor(stats.proficiencyLevel);
  const qualifyingAttemptForCertificate = allAttempts.find((a) => a.percentage >= 80);

  const mistakeCount = learner.mistakeQuestionIds?.length || 0;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Streak Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Learner Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 dark:text-indigo-400">Personal Assessment Record</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {learner.name}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your progress across machine learning paradigms, prompt design, and data ethics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Dashboard Theme Adjuster */}
          {onSetTheme && (
            <div className="flex items-center gap-1.5">
              <ThemeAdjuster
                theme={theme}
                onSetTheme={onSetTheme}
                lang={currentLang}
                compact={false}
              />
            </div>
          )}

          {/* Screen Language Selector */}
          {onOpenLanguageSelector && (
            <button
              onClick={onOpenLanguageSelector}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/60"
              title={`${translate('select_language', currentLang)} (${translate('applied_screen_only', currentLang)})`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{currentLangObj.nativeName}</span>
            </button>
          )}

          {/* Active Streak */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{learner.streakDays} Day Active Streak</span>
          </div>

          {/* Quick Quiz Action */}
          <button
            onClick={onStartQuiz}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start New 10-Question Quiz</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Proficiency Level */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">
            {translate('current_level', currentLang, 'Current Level')}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {translateProficiency(stats.proficiencyLevel, currentLang)}
            </span>
          </div>
          <span className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded ${colorMeta.badgeBg} ${colorMeta.badgeText}`}>
            {currentLang === 'hi' ? `शीर्ष स्कोर ${stats.bestScore}% पर आधारित` : `Based on ${stats.bestScore}% peak`}
          </span>
        </div>

        {/* KPI 2: Best Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">
            {translate('highest_score', currentLang, 'Highest Score')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {stats.bestScore}
            </span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {stats.bestScore >= 80
              ? currentLang === 'hi' ? 'सत्यापित सम्मान स्कोर' : 'Verified honors score'
              : currentLang === 'hi' ? 'प्रमाणपत्र के लिए 80%+ का लक्ष्य रखें' : 'Aim for 80%+ to earn certificate'}
          </span>
        </div>

        {/* KPI 3: Average Accuracy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">
            {translate('average_score', currentLang, 'Average Score')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {stats.averageScore}
            </span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {currentLang === 'hi'
              ? `${stats.totalQuizzes} पूर्ण किए गए क्विज़ में`
              : `Across ${stats.totalQuizzes} completed attempts`}
          </span>
        </div>

        {/* KPI 4: Pending Mistakes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">Questions to Review</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {mistakeCount}
            </span>
            <span className="text-slate-400 text-xs">items</span>
          </div>
          {mistakeCount > 0 ? (
            <button
              onClick={() => onStartReviewMistakes(learner.mistakeQuestionIds)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-1 block"
            >
              Practice mistakes now →
            </button>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
              All concepts mastered!
            </span>
          )}
        </div>
      </div>

      {/* Certificate of Completion Spotlight (if earned) */}
      {qualifyingAttemptForCertificate && (
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Official Certificate of AI Competency Earned
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Qualified with an assessment score of {qualifyingAttemptForCertificate.percentage}% (
                {qualifyingAttemptForCertificate.proficiencyLevel} level).
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewCertificate(qualifyingAttemptForCertificate)}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-2"
          >
            <span>Open Certificate & Print</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Topic Mastery Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topic Mastery Progress Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Topic Mastery Analytics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your cumulative accuracy across all 7 assessment dimensions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {TOPICS.map((topic) => {
              const perf = stats.topicStats[topic] || { correct: 0, total: 0, percentage: 0 };
              return (
                <div key={topic} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {translateTopic(topic, currentLang)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs">
                        {perf.correct} of {perf.total} correct
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums w-12 text-right">
                        {perf.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        perf.percentage >= 80
                          ? 'bg-emerald-500'
                          : perf.percentage >= 65
                          ? 'bg-indigo-500'
                          : perf.percentage >= 45
                          ? 'bg-amber-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${perf.total > 0 ? perf.percentage : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges & Achievements Showcase (1 Column) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Earned Badges
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Milestones unlocked through continuous study.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
              {learner.badges?.filter((b) => b.unlocked).length || 0} / {learner.badges?.length || 8}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {learner.badges?.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  badge.unlocked
                    ? 'border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {badge.name}
                    </h4>
                    {badge.unlocked && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Attempt History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Assessment History
        </h3>

        {allAttempts.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No quiz attempts recorded yet
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Take your first 10-question evaluation to populate your performance metrics.
            </p>
            <button
              onClick={onStartQuiz}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Start First Quiz
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                  <th className="pb-3 pr-4">Date & Time</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Proficiency</th>
                  <th className="pb-3 px-4">Duration</th>
                  <th className="pb-3 px-4">Mode</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {allAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {new Date(attempt.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {attempt.percentage}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {attempt.proficiencyLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono tabular-nums">
                      {attempt.timeTakenSeconds}s
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 capitalize">
                      {attempt.mode.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {attempt.percentage >= 80 && (
                          <button
                            onClick={() => onViewCertificate(attempt)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded transition-colors"
                          >
                            Certificate
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAttemptForReview(attempt)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal for past attempt */}
      {selectedAttemptForReview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Attempt Review: {selectedAttemptForReview.percentage}% ({selectedAttemptForReview.proficiencyLevel})
                </h3>
                <p className="text-xs text-slate-500">
                  {new Date(selectedAttemptForReview.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttemptForReview(null)}
                className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {selectedAttemptForReview.answers.length === 0 ? (
                <p className="text-sm text-slate-500">No question breakdown recorded for this legacy attempt.</p>
              ) : (
                selectedAttemptForReview.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      ans.isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20'
                        : 'border-red-200 dark:border-red-900/40 bg-red-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>Q{idx + 1}. {ans.topic}</span>
                      <span className={ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                        {ans.isCorrect ? 'Correct' : 'Missed'}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{ans.questionText}</p>
                    <p className="text-slate-500 italic">"{ans.explanation}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
