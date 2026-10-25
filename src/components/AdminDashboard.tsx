import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  ShieldAlert,
  ArrowUpDown,
  FileSpreadsheet,
  Layers,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { Difficulty, LearnerUser, ProficiencyLevel, Question, QuizAttempt, Topic, TOPICS } from '../types';
import {
  computeLearnerStats,
  downloadFile,
  generateLearnersCSV,
  generateLearnersExcelXML,
  getProficiencyColor,
  getStoredAttempts,
  getStoredLearners,
  getStoredQuestions,
  resetQuestionsToDefault,
  saveLearners,
  saveQuestions,
} from '../utils/storage';
import { QuestionModal } from './QuestionModal';

import { deleteQuestionFromCloud, syncQuestionToCloud } from '../firebase';

import { ThemeAdjuster } from './ThemeAdjuster';
import { translate, translateTopic, translateProficiency, SUPPORTED_LANGUAGES } from '../utils/i18n';
import { Globe } from 'lucide-react';

interface AdminDashboardProps {
  onSignOut: () => void;
  learners?: LearnerUser[];
  attempts?: QuizAttempt[];
  questions?: Question[];
  onUpdateQuestions?: (questions: Question[]) => void;
  theme?: 'light' | 'dark';
  onSetTheme?: (t: 'light' | 'dark') => void;
  currentLang?: string;
  onOpenLanguageSelector?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSignOut,
  learners: propLearners,
  attempts: propAttempts,
  questions: propQuestions,
  onUpdateQuestions,
  theme = 'light',
  onSetTheme,
  currentLang = 'en',
  onOpenLanguageSelector,
}) => {
  const [activeTab, setActiveTab] = useState<'learners' | 'analytics' | 'questions' | 'activity'>('learners');
  const [internalLearners, setInternalLearners] = useState<LearnerUser[]>(() => getStoredLearners());
  const [internalQuestions, setInternalQuestions] = useState<Question[]>(() => getStoredQuestions());
  const [internalAttempts, setInternalAttempts] = useState<QuizAttempt[]>(() => getStoredAttempts());

  const learners = propLearners !== undefined ? propLearners : internalLearners;
  const attempts = propAttempts !== undefined ? propAttempts : internalAttempts;
  const questions = propQuestions !== undefined ? propQuestions : internalQuestions;

  // Search & Filter state for Learners
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | ProficiencyLevel>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'attempts' | 'recent'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLearnerDetail, setSelectedLearnerDetail] = useState<LearnerUser | null>(null);

  // Question Management state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [questionTopicFilter, setQuestionTopicFilter] = useState<Topic | 'all'>('all');
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState<Difficulty | 'all'>('all');

  // Reload data
  const refreshData = () => {
    setInternalLearners(getStoredLearners());
    setInternalQuestions(getStoredQuestions());
    setInternalAttempts(getStoredAttempts());
  };

  // Filter & Sort Learners
  const filteredLearners = learners
    .filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (levelFilter === 'all') return true;
      const stats = computeLearnerStats(l.id);
      return stats.proficiencyLevel === levelFilter;
    })
    .sort((a, b) => {
      const statsA = computeLearnerStats(a.id);
      const statsB = computeLearnerStats(b.id);
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'score') {
        comparison = statsA.bestScore - statsB.bestScore;
      } else if (sortBy === 'attempts') {
        comparison = statsA.totalQuizzes - statsB.totalQuizzes;
      } else if (sortBy === 'recent') {
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Calculate Overall Platform KPIs
  const totalLearners = learners.length;
  const totalAttempts = attempts.length;
  const avgPlatformScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0;

  // Compute platform topic averages
  const platformTopicAverages = TOPICS.map((topic) => {
    let correct = 0;
    let total = 0;
    attempts.forEach((att) => {
      const perf = att.topicBreakdown[topic];
      if (perf) {
        correct += perf.correct;
        total += perf.total;
      }
    });
    return {
      topic,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      totalQuestionsAnswered: total,
    };
  });

  const topChallengingTopic = [...platformTopicAverages].sort((a, b) => a.accuracy - b.accuracy)[0];

  // Export handlers
  const handleExportCSV = () => {
    const csvContent = generateLearnersCSV(learners);
    downloadFile(csvContent, `AI_Proficiency_Learner_Report_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportExcel = () => {
    const xmlContent = generateLearnersExcelXML(learners);
    downloadFile(xmlContent, `AI_Proficiency_Learner_Report_${new Date().toISOString().split('T')[0]}.xls`, 'application/vnd.ms-excel');
  };

  // Question Actions
  const handleSaveQuestion = (savedQ: Question) => {
    let updated: Question[];
    const exists = questions.some((q) => q.id === savedQ.id);
    if (exists) {
      updated = questions.map((q) => (q.id === savedQ.id ? savedQ : q));
    } else {
      updated = [savedQ, ...questions];
    }
    saveQuestions(updated);
    setInternalQuestions(updated);
    syncQuestionToCloud(savedQ).catch(() => {});
    if (onUpdateQuestions) onUpdateQuestions(updated);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question from the assessment bank?')) {
      const updated = questions.filter((q) => q.id !== id);
      saveQuestions(updated);
      setInternalQuestions(updated);
      deleteQuestionFromCloud(id).catch(() => {});
      if (onUpdateQuestions) onUpdateQuestions(updated);
    }
  };

  const handleResetQuestions = () => {
    if (confirm('Reset question bank back to the standard 30 starter questions? Custom added questions will be removed.')) {
      const reset = resetQuestionsToDefault();
      setInternalQuestions(reset);
      if (onUpdateQuestions) onUpdateQuestions(reset);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (questionTopicFilter !== 'all' && q.topic !== questionTopicFilter) return false;
    if (questionDifficultyFilter !== 'all' && q.difficulty !== questionDifficultyFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Admin Header with Security Notice */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>System Administrator Console</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Database Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              AI Assessment Command Center
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onSetTheme && (
              <ThemeAdjuster
                theme={theme}
                onSetTheme={onSetTheme}
                lang={currentLang}
                compact={false}
              />
            )}

            {onOpenLanguageSelector && (
              <button
                onClick={onOpenLanguageSelector}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                title={`${translate('select_language', currentLang)} (${translate('applied_screen_only', currentLang)})`}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)?.nativeName || 'Language'}</span>
              </button>
            )}

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors shadow-sm"
              title="Download formatted Excel (.xls) file with styles and formulas"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{translate('export_excel', currentLang)}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-sm"
              title="Download RFC 4180 CSV with UTF-8 BOM"
            >
              <Download className="w-4 h-4" />
              <span>{translate('export_csv', currentLang)}</span>
            </button>
          </div>
        </div>

        {/* Mandatory Security Transparency Callout */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-amber-900 dark:text-amber-200">
              Demo-Level Security Architecture Note:
            </strong>{' '}
            Authentication in this assessment demo relies on client-side state and code validation. A true production
            enterprise assessment system requires server-side RBAC, salted Argon2/bcrypt password hashing, signed HTTP-only
            session tokens, rate limiting against brute-force attacks, and immutable audit logs.
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">Registered Learners</span>
          <span className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums block">
            {totalLearners}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Active user profiles</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">Total Quizzes Completed</span>
          <span className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums block">
            {totalAttempts}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">10-question evaluation runs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">Platform Average Score</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {avgPlatformScore}
            </span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative test accuracy</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="block text-xs font-medium text-slate-500">Most Challenging Topic</span>
          <span className="mt-2 text-base font-bold text-amber-600 dark:text-amber-400 block truncate">
            {topChallengingTopic ? topChallengingTopic.topic : 'N/A'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {topChallengingTopic ? `${topChallengingTopic.accuracy}% avg accuracy` : ''}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('learners')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'learners'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Learner Management ({filteredLearners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Data Visualizations</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Question Bank ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Real-Time Activity ({attempts.length})</span>
        </button>
      </div>

      {/* TAB 1: Learner Management Table */}
      {activeTab === 'learners' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Search, Filter, Sort Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search learners by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Level Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Level:</span>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Levels</option>
                  <option value="Expert">Expert (85%+)</option>
                  <option value="Practitioner">Practitioner (70-84%)</option>
                  <option value="Learner">Learner (50-69%)</option>
                  <option value="Novice">Novice (&lt;50%)</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="score">Peak Score</option>
                  <option value="name">Learner Name</option>
                  <option value="attempts">Quizzes Taken</option>
                  <option value="recent">Last Active</option>
                </select>
                <button
                  onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  aria-label="Toggle sort order"
                  className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                  <th className="pb-3 pr-4">{currentLang === 'hi' ? 'शिक्षार्थी' : 'Learner Name'}</th>
                  <th className="pb-3 px-4">{translate('current_level', currentLang, 'Level')}</th>
                  <th className="pb-3 px-4">{translate('highest_score', currentLang, 'Peak Score')}</th>
                  <th className="pb-3 px-4">{translate('average_score', currentLang, 'Avg Score')}</th>
                  <th className="pb-3 px-4">{translate('quizzes_completed', currentLang, 'Quizzes')}</th>
                  <th className="pb-3 px-4">{translate('active_streak', currentLang, 'Streak')}</th>
                  <th className="pb-3 px-4">{currentLang === 'hi' ? 'शीर्ष ताकत' : 'Top Strength'}</th>
                  <th className="pb-3 px-4">{currentLang === 'hi' ? 'कमजोर विषय' : 'Focus Area'}</th>
                  <th className="pb-3 pl-4 text-right">{currentLang === 'hi' ? 'विवरण' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {filteredLearners.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <Users className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {translate('no_learners_yet', currentLang, 'No learners registered yet')}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        {currentLang === 'hi'
                          ? 'जब उपयोगकर्ता किसी भी ब्राउज़र या डिवाइस पर खाता बनाएंगे या क्विज़ देंगे, उनका डेटा यहां वास्तविक समय में दिखाई देगा।'
                          : 'When users create a learner account or take an assessment on any desktop, browser, or Google account, their profile and verified scores will synchronize here in real time.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLearners.map((learner) => {
                    const stats = computeLearnerStats(learner.id, attempts);
                    const color = getProficiencyColor(stats.proficiencyLevel);

                    return (
                      <tr
                        key={learner.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3.5 pr-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                              {learner.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span>{learner.name}</span>
                              <span className="block text-[11px] text-slate-400">
                                {currentLang === 'hi' ? 'शामिल हुए' : 'Joined'} {new Date(learner.createdAt).toISOString().split('T')[0]}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color.badgeBg} ${color.badgeText}`}
                          >
                            {translateProficiency(stats.proficiencyLevel, currentLang)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {stats.bestScore}%
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                          {stats.averageScore}%
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {stats.totalQuizzes}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                          {learner.streakDays}d
                        </td>

                        <td className="py-3.5 px-4 text-xs text-emerald-600 dark:text-emerald-400 max-w-[130px] truncate">
                          {stats.strengths.length > 0
                            ? translateTopic(stats.strengths[0], currentLang)
                            : currentLang === 'hi' ? 'प्रगति में' : 'In progress'}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-amber-600 dark:text-amber-400 max-w-[130px] truncate">
                          {stats.weaknesses.length > 0
                            ? translateTopic(stats.weaknesses[0], currentLang)
                            : currentLang === 'hi' ? 'कोई नहीं' : 'None'}
                        </td>

                        <td className="py-3.5 pl-4 text-right">
                          <button
                            onClick={() => setSelectedLearnerDetail(learner)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            {currentLang === 'hi' ? 'विश्लेषण देखें' : 'View Breakdown'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Analytics & Visualizations */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Average Accuracy by Topic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Accuracy by Topic
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated accuracy across all evaluated quiz answers.
              </p>
            </div>

            <div className="space-y-4">
              {platformTopicAverages.map((item) => (
                <div key={item.topic} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.topic}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.accuracy}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.accuracy >= 80
                          ? 'bg-emerald-500'
                          : item.accuracy >= 65
                          ? 'bg-indigo-500'
                          : item.accuracy >= 45
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Proficiency Tier Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Learner Proficiency Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of active learners by their verified tier.
              </p>
            </div>

            <div className="space-y-4">
              {(['Expert', 'Practitioner', 'Learner', 'Novice'] as ProficiencyLevel[]).map((level) => {
                const count = learners.filter((l) => computeLearnerStats(l.id).proficiencyLevel === level).length;
                const pct = totalLearners > 0 ? Math.round((count / totalLearners) * 100) : 0;
                const color = getProficiencyColor(level);

                return (
                  <div key={level} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${color.badgeBg}`} style={{ backgroundColor: color.fill }} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{level}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        {count} learners ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Question Bank Management */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Topic Filter */}
              <select
                value={questionTopicFilter}
                onChange={(e) => setQuestionTopicFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Topics ({questions.length})</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={questionDifficultyFilter}
                onChange={(e) => setQuestionDifficultyFilter(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuestions}
                className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                title="Restore original 30 starter questions"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Starter 30</span>
              </button>

              <button
                onClick={() => {
                  setQuestionToEdit(null);
                  setIsQuestionModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">#{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-700 dark:text-slate-300">{q.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        q.difficulty === 'Beginner'
                          ? 'text-emerald-600'
                          : q.difficulty === 'Intermediate'
                          ? 'text-indigo-600'
                          : 'text-amber-600'
                      }
                    >
                      {q.difficulty}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.type.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setQuestionToEdit(q);
                        setIsQuestionModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                      title="Edit question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        optIdx === q.correctIndex
                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                      <span className="truncate">{opt}</span>
                      {optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-700 dark:text-slate-300 not-italic">Explanation: </strong>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Real-Time Activity Tracking */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Real-Time Quiz Submissions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live chronological stream of learner assessment submissions.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attempts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No assessment activity yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When learners submit quizzes from any browser or desktop, their completion times and scores will appear here in real time.
                </p>
              </div>
            ) : (
              attempts.map((att) => (
                <div key={att.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {att.learnerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {att.learnerName}
                      </h4>
                      <span className="text-xs text-slate-400">
                        Completed 10-question evaluation · {att.timeTakenSeconds}s
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {att.percentage}%
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                          att.percentage >= 85
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : att.percentage >= 70
                            ? 'bg-indigo-500/10 text-indigo-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {att.proficiencyLevel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Learner */}
      {selectedLearnerDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Learner Dossier: {selectedLearnerDetail.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed competencies and per-topic mastery metrics.
                </p>
              </div>
              <button
                onClick={() => setSelectedLearnerDetail(null)}
                className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {(() => {
                const detailStats = computeLearnerStats(selectedLearnerDetail.id);
                return (
                  <>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[11px] text-slate-400 block uppercase">Peak Score</span>
                        <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                          {detailStats.bestScore}%
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[11px] text-slate-400 block uppercase">Avg Score</span>
                        <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                          {detailStats.averageScore}%
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[11px] text-slate-400 block uppercase">Quizzes Taken</span>
                        <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                          {detailStats.totalQuizzes}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Topic Competencies
                      </h4>
                      {TOPICS.map((topic) => {
                        const perf = detailStats.topicStats[topic];
                        return (
                          <div key={topic} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {topic}
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {perf.percentage}% ({perf.correct}/{perf.total})
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${perf.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Question Add/Edit Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        questionToEdit={questionToEdit}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};
