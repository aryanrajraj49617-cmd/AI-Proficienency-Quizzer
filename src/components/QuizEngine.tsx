import React, { useState, useEffect, useRef } from 'react';
import {
  Difficulty,
  Question,
  QuizAnswer,
  QuizAttempt,
  QuizSettings,
  Topic,
  TOPICS,
} from '../types';
import { calculateProficiencyLevel } from '../utils/storage';
import { translate, translateTopic, translateDifficulty } from '../utils/i18n';
import { localizeQuestion } from '../utils/questionTranslations';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

interface PreparedQuestion {
  original: Question;
  shuffledOptions: string[];
  newCorrectIndex: number;
}

interface QuizEngineProps {
  questions: Question[];
  learnerId: string;
  learnerName: string;
  settings: QuizSettings;
  mode?: 'standard' | 'topic_focus' | 'review_mistakes';
  targetQuestionIds?: string[];
  onComplete: (attempt: QuizAttempt) => void;
  onCancel: () => void;
  currentLang?: string;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  learnerId,
  learnerName,
  settings,
  mode = 'standard',
  targetQuestionIds,
  onComplete,
  onCancel,
  currentLang = 'en',
}) => {
  const [preparedQuiz, setPreparedQuiz] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Prepare & randomize questions on mount
  useEffect(() => {
    let pool = [...questions];

    if (mode === 'review_mistakes' && targetQuestionIds && targetQuestionIds.length > 0) {
      pool = pool.filter((q) => targetQuestionIds.includes(q.id));
    } else {
      if (settings.topic !== 'all') {
        pool = pool.filter((q) => q.topic === settings.topic);
      }
      if (settings.difficulty !== 'all') {
        pool = pool.filter((q) => q.difficulty === settings.difficulty);
      }
    }

    if (pool.length === 0) {
      pool = [...questions]; // fallback if filter is empty
    }

    // Shuffle question order (Fisher-Yates)
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffledPool.slice(0, Math.min(settings.questionCount, shuffledPool.length));

    // Shuffle options for each question after applying language localization
    const prepared: PreparedQuestion[] = selected.map((rawQ) => {
      const q = localizeQuestion(rawQ, currentLang);
      const indexedOptions = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correctIndex }));
      // For True/False keep True/False order for readability; for others shuffle
      if (q.type !== 'true_false') {
        indexedOptions.sort(() => Math.random() - 0.5);
      }

      return {
        original: q,
        shuffledOptions: indexedOptions.map((item) => item.opt),
        newCorrectIndex: indexedOptions.findIndex((item) => item.isCorrect),
      };
    });

    setPreparedQuiz(prepared);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmittedCurrent(false);
    setRecordedAnswers([]);

    // Initialize timer
    if (settings.timerMode === '30s_per_question') {
      setSecondsRemaining(30);
    } else if (settings.timerMode === '5m_total') {
      setSecondsRemaining(300);
    } else {
      setSecondsRemaining(null);
    }
  }, [questions, settings, mode, targetQuestionIds, currentLang]);

  // Handle countdown timer tick
  useEffect(() => {
    if (secondsRemaining === null) return;

    if (secondsRemaining <= 0) {
      if (!hasSubmittedCurrent) {
        handleAnswerSubmit(true);
      } else {
        handleNextQuestion();
      }
      return;
    }

    timerRef.current = setTimeout(() => {
      setSecondsRemaining((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [secondsRemaining, hasSubmittedCurrent]);

  const currentItem = preparedQuiz[currentIndex];
  const totalQuestions = preparedQuiz.length;

  if (!currentItem) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <p className="text-sm text-slate-500">Preparing assessment...</p>
      </div>
    );
  }

  const handleAnswerSubmit = (isTimeOut = false) => {
    if (hasSubmittedCurrent) return;

    const chosen = selectedOption;
    const isCorrect = !isTimeOut && chosen === currentItem.newCorrectIndex;

    const answerRecord: QuizAnswer = {
      questionId: currentItem.original.id,
      questionText: currentItem.original.question,
      topic: currentItem.original.topic,
      difficulty: currentItem.original.difficulty,
      selectedOption: chosen !== null ? chosen : -1,
      correctOption: currentItem.newCorrectIndex,
      isCorrect,
      explanation: currentItem.original.explanation,
      options: currentItem.shuffledOptions,
    };

    const nextAnswers = [...recordedAnswers, answerRecord];
    setRecordedAnswers(nextAnswers);
    setHasSubmittedCurrent(true);

    if (!settings.instantFeedback) {
      proceedToNextOrFinish(nextAnswers);
    }
  };

  const handleNextQuestion = () => {
    proceedToNextOrFinish(recordedAnswers);
  };

  const proceedToNextOrFinish = (answersSoFar: QuizAnswer[]) => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmittedCurrent(false);
      if (settings.timerMode === '30s_per_question') {
        setSecondsRemaining(30);
      }
    } else {
      finishQuiz(answersSoFar);
    }
  };

  const finishQuiz = (finalAnswers: QuizAnswer[]) => {
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const proficiencyLevel = calculateProficiencyLevel(percentage);
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    const topicBreakdown = TOPICS.reduce((acc, t) => {
      const topicAnswers = finalAnswers.filter((a) => a.topic === t);
      const total = topicAnswers.length;
      const correct = topicAnswers.filter((a) => a.isCorrect).length;
      acc[t] = {
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
      return acc;
    }, {} as Record<Topic, { correct: number; total: number; percentage: number }>);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      learnerId,
      learnerName,
      timestamp: new Date().toISOString(),
      totalQuestions,
      correctCount,
      percentage,
      proficiencyLevel,
      timeTakenSeconds: totalTimeSeconds,
      topicBreakdown,
      answers: finalAnswers,
      mode,
      filterTopic: settings.topic,
      filterDifficulty: settings.difficulty,
    };

    onComplete(attempt);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top HUD: Progress, Topic, Timer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          {/* Question Index & Metadata */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold">
              {currentIndex + 1} / {totalQuestions}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {translateTopic(currentItem.original.topic, currentLang)}
            </span>
            <span aria-hidden="true">·</span>
            <span
              className={
                currentItem.original.difficulty === 'Beginner'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : currentItem.original.difficulty === 'Intermediate'
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {translateDifficulty(currentItem.original.difficulty, currentLang)}
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-3">
            {secondsRemaining !== null && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold tabular-nums border ${
                  secondsRemaining <= 10
                    ? 'bg-red-500/10 border-red-300 text-red-600 dark:text-red-400 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {currentLang === 'hi' ? 'बाहर निकलें' : 'Exit'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Scenario tag if applicable */}
        {currentItem.original.type === 'scenario' && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'व्यावहारिक परिदृश्य' : 'Practical Scenario'}</span>
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentItem.original.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3" role="radiogroup" aria-label="Answer options">
          {currentItem.shuffledOptions.map((optionText, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentItem.newCorrectIndex;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70';

            if (!hasSubmittedCurrent) {
              if (isSelected) {
                optionStyle =
                  'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20';
              }
            } else {
              // After submit feedback styling
              if (isCorrect) {
                optionStyle =
                  'border-emerald-500 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              } else if (isSelected && !isCorrect) {
                optionStyle =
                  'border-red-500 dark:border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-900 dark:text-red-100';
              } else {
                optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmittedCurrent}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    !hasSubmittedCurrent
                      ? isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {letter}
                </div>

                <div className="flex-1 text-sm sm:text-base leading-snug">
                  {optionText}
                </div>

                {hasSubmittedCurrent && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasSubmittedCurrent && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Box (One-Sentence Explanation) */}
        {hasSubmittedCurrent && (
          <div
            className={`mt-6 p-4 rounded-xl border animate-in fade-in duration-200 ${
              selectedOption === currentItem.newCorrectIndex
                ? 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-500/10 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {selectedOption === currentItem.newCorrectIndex ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider">
                  {selectedOption === currentItem.newCorrectIndex
                    ? translate('correct_feedback', currentLang, 'Correct Answer!')
                    : translate('explanation_label', currentLang, 'Explanation & Key Learning')}
                </p>
                <p className="text-sm leading-relaxed">{currentItem.original.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="hidden sm:block text-xs text-slate-400">
            {hasSubmittedCurrent
              ? currentLang === 'hi' ? 'आगे बढ़ने के लिए क्लिक करें' : 'Click to continue'
              : currentLang === 'hi' ? 'विकल्प चुनें और उत्तर जमा करें' : 'Select an option and submit'}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {!hasSubmittedCurrent ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={() => handleAnswerSubmit(false)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{translate('submit_answer', currentLang, 'Submit Answer')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < totalQuestions
                    ? translate('next_question', currentLang, 'Next Question')
                    : translate('finish_quiz', currentLang, 'Finish & View Results')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
