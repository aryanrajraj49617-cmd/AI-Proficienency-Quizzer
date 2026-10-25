import React from 'react';
import { LogOut, Globe, Sparkles } from 'lucide-react';
import { LearnerUser } from '../types';
import { translate, SUPPORTED_LANGUAGES } from '../utils/i18n';
import { ThemeAdjuster } from './ThemeAdjuster';

interface TopBarProps {
  currentRole: 'admin' | 'learner' | null;
  currentLearner: LearnerUser | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (initialTab: 'signin' | 'signup' | 'admin') => void;
  onSignOut: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  currentLang: string;
  onOpenLanguageSelector: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRole,
  currentLearner,
  activeView,
  onNavigate,
  onOpenAuth,
  onSignOut,
  theme,
  onSetTheme,
  currentLang,
  onOpenLanguageSelector,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white font-bold text-base sm:text-lg tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI Proficiency Quizzer</span>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('quiz-setup')}
            className={`whitespace-nowrap transition-colors hover:text-slate-950 dark:hover:text-white ${
              activeView === 'quiz-setup' || activeView === 'quiz-active'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : ''
            }`}
          >
            {translate('nav_take_quiz', currentLang)}
          </button>

          {currentRole === 'learner' && (
            <button
              onClick={() => onNavigate('learner-dashboard')}
              className={`whitespace-nowrap transition-colors hover:text-slate-950 dark:hover:text-white ${
                activeView === 'learner-dashboard'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              {translate('nav_dashboard', currentLang)}
            </button>
          )}

          <button
            onClick={() => onNavigate('study-guide')}
            className={`whitespace-nowrap transition-colors hover:text-slate-950 dark:hover:text-white ${
              activeView === 'study-guide'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : ''
            }`}
          >
            {translate('nav_study_guide', currentLang)}
          </button>

          <button
            onClick={() => onNavigate('leaderboard')}
            className={`whitespace-nowrap transition-colors hover:text-slate-950 dark:hover:text-white ${
              activeView === 'leaderboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : ''
            }`}
          >
            {translate('nav_leaderboard', currentLang)}
          </button>

          {currentRole === 'admin' ? (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`whitespace-nowrap transition-colors hover:text-slate-950 dark:hover:text-white ${
                activeView === 'admin-dashboard'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : ''
              }`}
            >
              {translate('nav_admin_console', currentLang)}
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('admin')}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 whitespace-nowrap transition-colors"
            >
              Admin Sign In
            </button>
          )}
        </nav>

        {/* Zone 3: Language Selector + Theme Adjuster + User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector Button */}
          <button
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/80 dark:border-slate-700/60"
            title={`${translate('select_language', currentLang)} (${translate('applied_screen_only', currentLang)})`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
            <span className="sm:hidden uppercase font-mono">{currentLangObj.code}</span>
          </button>

          {/* Theme Adjuster Component */}
          <ThemeAdjuster
            theme={theme}
            onSetTheme={onSetTheme}
            lang={currentLang}
            compact={true}
          />

          {currentRole === 'admin' ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-900/50">
                Admin
              </span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{translate('sign_out', currentLang)}</span>
              </button>
            </div>
          ) : currentRole === 'learner' && currentLearner ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('learner-dashboard')}
                className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                  {currentLearner.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{currentLearner.name}</span>
              </button>
              <button
                onClick={onSignOut}
                aria-label={translate('sign_out', currentLang)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title={translate('sign_out', currentLang)}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                {translate('sign_in', currentLang)}
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
