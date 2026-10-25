import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  BarChart3,
  Flame,
  FileSpreadsheet,
  Lock,
  Layers,
  ChevronRight,
  HelpCircle,
  Play,
} from 'lucide-react';
import {
  LearnerUser,
  ProficiencyLevel,
  Question,
  QuizAttempt,
  QuizSettings,
  Topic,
  TOPICS,
} from './types';
import {
  clearCurrentSession,
  computeLearnerStats,
  getCurrentSession,
  getStoredAttempts,
  getStoredLearners,
  getStoredQuestions,
  getStoredTheme,
  saveAttempt,
  saveCurrentSession,
  saveStoredTheme,
} from './utils/storage';
import { TopBar } from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import {
  getStoredLanguage,
  saveStoredLanguage,
  translate,
  translateTopic,
  translateDifficulty,
  translateProficiency,
} from './utils/i18n';
import { QuizSetup } from './components/QuizSetup';
import { QuizEngine } from './components/QuizEngine';
import { QuizResults } from './components/QuizResults';
import { LearnerDashboard } from './components/LearnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { StudyGuideView } from './components/StudyGuideView';
import {
  subscribeToCloudLearners,
  subscribeToCloudAttempts,
  subscribeToCloudQuestions,
} from './firebase';
import { STARTER_QUESTIONS } from './data/starterQuestions';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [currentLang, setCurrentLang] = useState<string>(() => getStoredLanguage());
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'admin' | 'learner' | null>(null);
  const [currentLearner, setCurrentLearner] = useState<LearnerUser | null>(null);
  const [activeView, setActiveView] = useState<string>('home');

  // Cloud & local synchronized datasets
  const [learners, setLearners] = useState<LearnerUser[]>(() => getStoredLearners());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getStoredAttempts());
  const [questions, setQuestions] = useState<Question[]>(() => getStoredQuestions());

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup' | 'admin'>('signin');

  // Certificate modal
  const [certificateData, setCertificateData] = useState<{
    isOpen: boolean;
    learnerName: string;
    percentage: number;
    proficiencyLevel: ProficiencyLevel;
  }>({
    isOpen: false,
    learnerName: '',
    percentage: 0,
    proficiencyLevel: 'Novice',
  });

  // Quiz state
  const [activeSettings, setActiveSettings] = useState<QuizSettings>({
    questionCount: 10,
    topic: 'all',
    difficulty: 'all',
    timerMode: 'untimed',
    instantFeedback: true,
  });
  const [quizMode, setQuizMode] = useState<'standard' | 'topic_focus' | 'review_mistakes'>('standard');
  const [reviewMistakeIds, setReviewMistakeIds] = useState<string[]>([]);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    saveStoredTheme(theme);
  }, [theme]);

  // Restore session
  useEffect(() => {
    const session = getCurrentSession();
    if (session.type === 'admin') {
      setCurrentRole('admin');
    } else if (session.type === 'learner' && session.learnerId) {
      const match = learners.find((l) => l.id === session.learnerId);
      if (match) {
        setCurrentRole('learner');
        setCurrentLearner(match);
      }
    }
  }, []);

  // Real-time Cloud Firestore synchronization across devices
  useEffect(() => {
    const unsubLearners = subscribeToCloudLearners((cloudLearners) => {
      if (cloudLearners && Array.isArray(cloudLearners)) {
        setLearners(cloudLearners);
        localStorage.setItem('ai_quiz_learners_v1', JSON.stringify(cloudLearners));
        // Keep current learner in sync
        if (currentLearner) {
          const match = cloudLearners.find((l) => l.id === currentLearner.id);
          if (match) setCurrentLearner(match);
        }
      }
    });

    const unsubAttempts = subscribeToCloudAttempts((cloudAttempts) => {
      if (cloudAttempts && Array.isArray(cloudAttempts)) {
        setAttempts(cloudAttempts);
        localStorage.setItem('ai_quiz_attempts_v1', JSON.stringify(cloudAttempts));
      }
    });

    const unsubQuestions = subscribeToCloudQuestions((cloudCustom) => {
      if (cloudCustom && cloudCustom.length > 0) {
        const combined = [
          ...cloudCustom,
          ...STARTER_QUESTIONS.filter((sq) => !cloudCustom.some((cq) => cq.id === sq.id)),
        ];
        setQuestions(combined);
      }
    });

    return () => {
      unsubLearners();
      unsubAttempts();
      unsubQuestions();
    };
  }, [currentLearner?.id]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  const handleSetTheme = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  const handleSelectLanguage = (langId: string) => {
    setCurrentLang(langId);
    saveStoredLanguage(langId);
  };

  const handleOpenAuth = (initialTab: 'signin' | 'signup' | 'admin') => {
    setAuthInitialTab(initialTab);
    setIsAuthOpen(true);
  };

  const handleAdminSuccess = () => {
    setCurrentRole('admin');
    setCurrentLearner(null);
    saveCurrentSession({ type: 'admin' });
    setActiveView('admin-dashboard');
  };

  const handleLearnerSuccess = (learner: LearnerUser) => {
    setCurrentRole('learner');
    setCurrentLearner(learner);
    saveCurrentSession({ type: 'learner', learnerId: learner.id });
    setActiveView('learner-dashboard');
  };

  const handleSignOut = () => {
    setCurrentRole(null);
    setCurrentLearner(null);
    clearCurrentSession();
    setActiveView('home');
  };

  const handleStartStandardQuiz = (settings: QuizSettings) => {
    setActiveSettings(settings);
    setQuizMode('standard');
    setReviewMistakeIds([]);
    setActiveView('quiz-active');
  };

  const handleStartReviewMistakes = (mistakeIds: string[]) => {
    setReviewMistakeIds(mistakeIds);
    setQuizMode('review_mistakes');
    setActiveSettings({
      questionCount: Math.min(10, mistakeIds.length),
      topic: 'all',
      difficulty: 'all',
      timerMode: 'untimed',
      instantFeedback: true,
    });
    setActiveView('quiz-active');
  };

  const handleStartTopicFocusQuiz = (topic: Topic) => {
    setActiveSettings({
      questionCount: 10,
      topic,
      difficulty: 'all',
      timerMode: 'untimed',
      instantFeedback: true,
    });
    setQuizMode('topic_focus');
    setActiveView('quiz-active');
  };

  const handleQuizCompleted = (attempt: QuizAttempt) => {
    saveAttempt(attempt);
    setLastAttempt(attempt);

    // Refresh stored learner state
    if (currentLearner) {
      const refreshed = getStoredLearners().find((l) => l.id === currentLearner.id);
      if (refreshed) setCurrentLearner(refreshed);
    }

    setActiveView('quiz-results');
  };

  const handleOpenCertificate = (attempt?: QuizAttempt | null) => {
    const att = attempt || lastAttempt;
    const name = att ? att.learnerName : currentLearner ? currentLearner.name : 'Learner';
    const pct = att ? att.percentage : currentLearner ? currentLearner.bestScore : 85;
    const level = att ? att.proficiencyLevel : 'Expert';

    setCertificateData({
      isOpen: true,
      learnerName: name,
      percentage: pct,
      proficiencyLevel: level,
    });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        currentRole={currentRole}
        currentLearner={currentLearner}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        theme={theme}
        onSetTheme={handleSetTheme}
        currentLang={currentLang}
        onOpenLanguageSelector={() => setIsLangModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW: HOME / LANDING */}
        {activeView === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{translate('hero_badge', currentLang, 'Standardized AI Learning Assessment')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {translate('hero_title_1', currentLang, 'Evaluate your true')}{' '}
                <br className="hidden sm:inline" />
                <span className="text-indigo-600 dark:text-indigo-400">
                  {translate('hero_title_accent', currentLang, 'AI Proficiency')}
                </span>{' '}
                {translate('hero_title_2', currentLang, 'with precision.')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                {translate('hero_desc', currentLang, 'A rigorous, fair assessment covering machine learning paradigms, LLM prompting techniques, enterprise data privacy, safety alignment, and workplace AI adoption.')}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setActiveView('quiz-setup')}
                  className="px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{translate('start_quiz_btn', currentLang, 'Take 10-Question Assessment')}</span>
                </button>

                {currentRole === 'learner' ? (
                  <button
                    onClick={() => setActiveView('learner-dashboard')}
                    className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{translate('hero_view_progress', currentLang, 'View My Progress & History')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAuth('signup')}
                    className="px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{translate('hero_create_profile', currentLang, 'Create Learner Profile')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span>30+ Curated Questions</span>
                <span aria-hidden="true">·</span>
                <span>Randomized Options</span>
                <span aria-hidden="true">·</span>
                <span>Downloadable Certificates</span>
              </div>
            </section>

            {/* 4 Proficiency Tiers */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLang === 'hi' ? 'दक्षता मानक श्रेणियां' : 'Assessment Proficiency Standards'}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentLang === 'hi'
                    ? 'व्यावहारिक क्षमता के अनुसार निष्पक्ष व वस्तुनिष्ठ स्कोर बैंड।'
                    : 'Fair, objective score bands benchmarked to practical competence.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {translateProficiency('Novice', currentLang)} Tier
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      &lt; 50%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentLang === 'hi'
                      ? 'मूल शब्दावली और बुनियादी एआई अवधारणाओं से प्रारंभिक परिचय।'
                      : 'Developing familiarity with fundamental terminology and basic AI concepts.'}
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {translateProficiency('Learner', currentLang)} Tier
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      50% - 69%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentLang === 'hi'
                      ? 'मशीन लर्निंग सिद्धांतों की ठोस समझ, प्रॉम्प्टिंग और गोपनीयता में सुधार की गुंजाइश।'
                      : 'Solid grounding in machine learning principles with room to expand in prompting and privacy.'}
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-500/5 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    {translateProficiency('Practitioner', currentLang)} Tier
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      70% - 84%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentLang === 'hi'
                      ? 'एआई टूल्स को लागू करने और संरचित प्रॉम्प्ट लिखने की मजबूत क्षमता।'
                      : 'Strong capability applying AI tools, constructing structured prompts, and verifying outputs.'}
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {translateProficiency('Expert', currentLang)} Tier
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      85% - 100%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentLang === 'hi'
                      ? 'उन्नत संरचनाओं, संरेखण सिद्धांत, नैतिक शासन और रणनीतिक वर्कफ़्लो पर महारत।'
                      : 'Mastery of advanced architectures, alignment theory, ethical governance, and strategic workflows.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Assessment Topics Strip */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentLang === 'hi' ? '7 मुख्य मूल्यांकन आयाम' : '7 Core Assessment Dimensions'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentLang === 'hi'
                      ? 'बिना किसी अस्पष्टता के सटीक प्रतिक्रिया प्रदान करने के लिए सत्यापित।'
                      : 'Carefully verified to ensure no ambiguity and accurate feedback.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('study-guide')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{translate('nav_study_guide', currentLang, 'Explore full study curriculum')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOPICS.map((topic, idx) => (
                  <div
                    key={topic}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                        0{idx + 1}.
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {translateTopic(topic, currentLang)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {currentLang === 'hi'
                          ? 'शुरुआती, मध्यम और उन्नत प्रश्नों सहित वास्तविक कार्यस्थल परिदृश्यों में ज्ञान का परीक्षण।'
                          : 'Evaluates knowledge across Beginner, Intermediate, and Advanced questions including real workplace scenarios.'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartTopicFocusQuiz(topic)}
                      className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-left cursor-pointer"
                    >
                      <span>{currentLang === 'hi' ? 'विषयवार अभ्यास करें' : 'Take focused practice'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Administration & Enterprise Reporting Feature Highlight */}
            <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'प्रशासनिक नियंत्रण' : 'Administrative Oversight'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentLang === 'hi' ? 'व्यापक शिक्षार्थी विश्लेषण और एक्सेल निर्यात' : 'Comprehensive Learner Analytics & Excel Exports'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'व्यवस्थापक वास्तविक समय में क्विज़ गतिविधि ट्रैक कर सकते हैं, ताकत व कमजोरियों का विश्लेषण देख सकते हैं, और देशी एक्सेल (.xls) या CSV में रिपोर्ट निर्यात कर सकते हैं।'
                    : 'Administrators can track real-time quiz activity, inspect individual strength and weakness breakdowns across all topics, manage questions, and export complete reports in native Excel (.xls) or RFC-compliant CSV.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {currentRole === 'admin' ? (
                  <button
                    onClick={() => setActiveView('admin-dashboard')}
                    className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{translate('nav_admin_console', currentLang, 'Open Admin Console')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAuth('admin')}
                    className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-slate-800" />
                    <span>{translate('nav_admin_console', currentLang, 'Admin Sign In')}</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW: QUIZ SETUP */}
        {activeView === 'quiz-setup' && (
          <QuizSetup
            onStartQuiz={handleStartStandardQuiz}
            availableQuestionCount={questions.length}
            currentLang={currentLang}
          />
        )}

        {/* VIEW: ACTIVE QUIZ */}
        {activeView === 'quiz-active' && (
          <QuizEngine
            questions={questions}
            learnerId={currentLearner ? currentLearner.id : 'guest-learner'}
            learnerName={currentLearner ? currentLearner.name : 'Guest Learner'}
            settings={activeSettings}
            mode={quizMode}
            targetQuestionIds={reviewMistakeIds}
            onComplete={handleQuizCompleted}
            onCancel={() => setActiveView('home')}
            currentLang={currentLang}
          />
        )}

        {/* VIEW: QUIZ RESULTS */}
        {activeView === 'quiz-results' && lastAttempt && (
          <QuizResults
            attempt={lastAttempt}
            onRetake={() => setActiveView('quiz-active')}
            onReviewMistakes={(mistakeIds) => handleStartReviewMistakes(mistakeIds)}
            onViewCertificate={() => handleOpenCertificate(lastAttempt)}
            onGoToDashboard={() => {
              if (currentLearner) {
                setActiveView('learner-dashboard');
              } else {
                handleOpenAuth('signup');
              }
            }}
            currentLang={currentLang}
          />
        )}

        {/* VIEW: LEARNER DASHBOARD */}
        {activeView === 'learner-dashboard' && currentLearner && (
          <LearnerDashboard
            learner={currentLearner}
            attempts={attempts}
            onStartQuiz={() => setActiveView('quiz-setup')}
            onStartReviewMistakes={handleStartReviewMistakes}
            onViewCertificate={handleOpenCertificate}
            theme={theme}
            onSetTheme={handleSetTheme}
            currentLang={currentLang}
            onOpenLanguageSelector={() => setIsLangModalOpen(true)}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {activeView === 'admin-dashboard' && currentRole === 'admin' && (
          <AdminDashboard
            onSignOut={handleSignOut}
            learners={learners}
            attempts={attempts}
            questions={questions}
            onUpdateQuestions={(q) => setQuestions(q)}
            theme={theme}
            onSetTheme={handleSetTheme}
            currentLang={currentLang}
            onOpenLanguageSelector={() => setIsLangModalOpen(true)}
          />
        )}

        {/* VIEW: LEADERBOARD */}
        {activeView === 'leaderboard' && (
          <LeaderboardView
            onStartQuiz={() => setActiveView('quiz-setup')}
            learners={learners}
            attempts={attempts}
            currentLang={currentLang}
          />
        )}

        {/* VIEW: STUDY GUIDE */}
        {activeView === 'study-guide' && (
          <StudyGuideView
            onStartTopicQuiz={handleStartTopicFocusQuiz}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">AI Proficiency Quizzer</span>
            <span aria-hidden="true">·</span>
            <span>Standardized Assessment Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveView('study-guide')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {translate('nav_study_guide', currentLang, 'Study Topics')}
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {translate('nav_leaderboard', currentLang, 'Leaderboard')}
            </button>
            <button
              onClick={() => handleOpenAuth('admin')}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              {translate('nav_admin_console', currentLang, 'Admin Portal')}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
        onAdminSuccess={handleAdminSuccess}
        onLearnerSuccess={handleLearnerSuccess}
        currentLang={currentLang}
      />

      <CertificateModal
        isOpen={certificateData.isOpen}
        onClose={() => setCertificateData((prev) => ({ ...prev, isOpen: false }))}
        learnerName={certificateData.learnerName}
        percentage={certificateData.percentage}
        proficiencyLevel={certificateData.proficiencyLevel}
        currentLang={currentLang}
      />

      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        onSelectLang={handleSelectLanguage}
      />
    </div>
  );
}
