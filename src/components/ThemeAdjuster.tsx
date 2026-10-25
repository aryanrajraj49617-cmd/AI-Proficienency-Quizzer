import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { translate } from '../utils/i18n';

interface ThemeAdjusterProps {
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  lang?: string;
  compact?: boolean;
}

export const ThemeAdjuster: React.FC<ThemeAdjusterProps> = ({
  theme,
  onSetTheme,
  lang = 'en',
  compact = false,
}) => {
  return (
    <div
      role="group"
      aria-label="Theme adjuster"
      className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
    >
      <button
        type="button"
        onClick={() => onSetTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          theme === 'light'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
        title={translate('theme_light', lang)}
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        {!compact && <span>{translate('theme_light', lang)}</span>}
      </button>

      <button
        type="button"
        onClick={() => onSetTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-700'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
        title={translate('theme_dark', lang)}
      >
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
        {!compact && <span>{translate('theme_dark', lang)}</span>}
      </button>
    </div>
  );
};
