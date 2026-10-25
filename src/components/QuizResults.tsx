import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { QuizAttempt, Topic, TOPICS } from '../types';
import { getProficiencyColor, STUDY_RECOMMENDATIONS } from '../utils/storage';
import { translate, translateTopic, translateProficiency } from '../utils/i18n';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onReviewMistakes: (mistakeIds: string[]) => void;
  onViewCertificate: () => void;
  onGoToDashboard: () => void;
  currentLang?: string;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  attempt,
  onRetake,
  onReviewMistakes,
  onViewCertificate,
  onGoToDashboard,
  currentLang = 'en',
}) => {
  const [showDetailedAnswers, setShowDetailedAnswers] = React.useState(false);
  const colorMeta = getProficiencyColor(attempt.proficiencyLevel);

  // Trigger celebratory confetti for 80%+ scores
  useEffect(() => {
    if (attempt.percentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback if blocked
      }
    }
  }, [attempt.percentage]);

  const mistakes = attempt.answers.filter((a) => !a.isCorrect);
  const mistakeIds = mistakes.map((m) => m.questionId);

  // Identify weak topics (< 70% or lowest)
  const weakTopics = TOPICS.filter((t) => {
    const perf = attempt.topicBreakdown[t];
    return perf && perf.total > 0 && perf.percentage < 70;
  });

  const primaryStudyTopic =
    weakTopics.length > 0
      ? weakTopics[0]
      : (Object.entries(attempt.topicBreakdown)
          .filter(([_, perf]) => perf.total > 0)
          .sort(([_, a], [__, b]) => a.percentage - b.percentage)[0]?.[0] as Topic | undefined);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Score Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: colorMeta.fill }}
        />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span>{currentLang === 'hi' ? 'मूल्यांकन संपन्न' : 'Assessment Complete'}</span>
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl sm:text-7xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {attempt.percentage}%
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {currentLang === 'hi' ? (
              <>
                आपने <strong className="text-slate-900 dark:text-white">{attempt.correctCount}</strong> /{' '}
                <strong className="text-slate-900 dark:text-white">{attempt.totalQuestions}</strong> प्रश्न सही किए ({attempt.timeTakenSeconds}s)।
              </>
            ) : (
              <>
                You answered <strong className="text-slate-900 dark:text-white">{attempt.correctCount}</strong> out of{' '}
                <strong className="text-slate-900 dark:text-white">{attempt.totalQuestions}</strong> questions correctly in{' '}
                <strong className="text-slate-900 dark:text-white">{attempt.timeTakenSeconds}s</strong>.
              </>
            )}
          </p>

          {/* Proficiency Level Banner */}
          <div className="pt-2">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border ${colorMeta.badgeBg} ${colorMeta.badgeText} ${colorMeta.border}`}
            >
              <Award className="w-5 h-5" />
              <div className="text-left">
                <span className="block text-[11px] uppercase font-bold tracking-wider opacity-80">
                  {translate('current_level', currentLang, 'Proficiency Tier')}
                </span>
                <span className="text-base font-bold">
                  {translateProficiency(attempt.proficiencyLevel, currentLang)}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Unlock Prompt */}
          {attempt.percentage >= 80 && (
            <div className="pt-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-left flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
                    {translate('certificate_title', currentLang, 'Certificate of Completion Unlocked!')}
                  </h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {currentLang === 'hi'
                      ? 'आपका स्कोर 80%+ की न्यूनतम सीमा को पार कर चुका है।'
                      : 'Your score satisfies the 80%+ threshold for official credential generation.'}
                  </p>
                  <button
                    onClick={onViewCertificate}
                    className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>{currentLang === 'hi' ? 'प्रमाण पत्र देखें व प्रिंट करें' : 'View & Print Certificate'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{translate('retake_quiz', currentLang, 'Retake Quiz')}</span>
            </button>

            {mistakeIds.length > 0 && (
              <button
                onClick={() => onReviewMistakes(mistakeIds)}
                className="px-4 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>
                  {currentLang === 'hi'
                    ? `${mistakeIds.length} गलत प्रश्नों का पुनः अभ्यास करें`
                    : `Focus Practice on ${mistakeIds.length} Missed Question${mistakeIds.length > 1 ? 's' : ''}`}
                </span>
              </button>
            )}

            <button
              onClick={onGoToDashboard}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{translate('nav_dashboard', currentLang, 'View Full Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Per-Topic Breakdown Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>{currentLang === 'hi' ? 'विषयवार दक्षता विभाजन' : 'Topic Mastery Breakdown'}</span>
        </h3>

        <div className="space-y-4">
          {TOPICS.map((topic) => {
            const perf = attempt.topicBreakdown[topic];
            if (!perf || perf.total === 0) return null;

            return (
              <div key={topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {translateTopic(topic, currentLang)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">
                      {perf.correct}/{perf.total} {currentLang === 'hi' ? 'सही' : 'correct'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums w-12 text-right">
                      {perf.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      perf.percentage >= 80
                        ? 'bg-emerald-500'
                        : perf.percentage >= 60
                        ? 'bg-indigo-500'
                        : perf.percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${perf.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What to Study Next Card */}
      {primaryStudyTopic && STUDY_RECOMMENDATIONS[primaryStudyTopic] && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentLang === 'hi'
                  ? `व्यक्तिगत सुझाव: अगला अध्ययन ${translateTopic(primaryStudyTopic, currentLang)} करें`
                  : `Personalized Recommendation: Study ${translateTopic(primaryStudyTopic, currentLang)} Next`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {STUDY_RECOMMENDATIONS[primaryStudyTopic].focus}
              </p>

              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {currentLang === 'hi' ? 'लक्षित शिक्षण उद्देश्य:' : 'Targeted Learning Objectives:'}
                </p>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {STUDY_RECOMMENDATIONS[primaryStudyTopic].tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accordion: Review All Answers & Explanations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <button
          onClick={() => setShowDetailedAnswers((prev) => !prev)}
          className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentLang === 'hi' ? 'प्रश्नों का विस्तृत विवरण और स्पष्टीकरण देखें' : 'Review Question Details & Explanations'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentLang === 'hi'
                ? 'प्रत्येक प्रश्न, आपका चुना हुआ उत्तर, और सही व्याख्या देखें।'
                : 'Inspect each question, your chosen option, the verified answer, and reasoning.'}
            </p>
          </div>
          <div className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            {showDetailedAnswers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showDetailedAnswers && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
            {attempt.answers.map((ans, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-xl border ${
                  ans.isCorrect
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                    : 'border-amber-200 dark:border-amber-900/60 bg-amber-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {idx + 1} · {translateTopic(ans.topic, currentLang)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {ans.isCorrect ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> {currentLang === 'hi' ? 'सही' : 'Correct'}
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {currentLang === 'hi' ? 'गलत' : 'Missed'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  {ans.questionText}
                </p>

                {/* Options display */}
                <div className="space-y-1.5 text-xs mb-3">
                  {ans.options.map((opt, optIdx) => {
                    const isChosen = optIdx === ans.selectedOption;
                    const isTheCorrectOne = optIdx === ans.correctOption;

                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg flex items-center gap-2 ${
                          isTheCorrectOne
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold'
                            : isChosen
                            ? 'bg-red-500/10 text-red-800 dark:text-red-200'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="w-4 font-mono font-bold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                        {isTheCorrectOne && (
                          <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                            {currentLang === 'hi' ? 'सही उत्तर' : 'Verified Answer'}
                          </span>
                        )}
                        {isChosen && !isTheCorrectOne && (
                          <span className="ml-auto text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                            {currentLang === 'hi' ? 'आपकी पसंद' : 'Your Choice'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">
                    {translate('explanation_label', currentLang, 'Explanation')}:{' '}
                  </strong>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
