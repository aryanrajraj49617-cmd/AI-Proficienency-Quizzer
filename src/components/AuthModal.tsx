import React, { useState } from 'react';
import { X, Lock, User, ShieldAlert, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { LearnerUser } from '../types';
import { ADMIN_ACCESS_CODE, getStoredLearners, saveLearners } from '../utils/storage';
import { INITIAL_BADGES } from '../data/starterQuestions';
import { translate } from '../utils/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'admin';
  onAdminSuccess: () => void;
  onLearnerSuccess: (learner: LearnerUser) => void;
  currentLang?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onAdminSuccess,
  onLearnerSuccess,
  currentLang = 'en',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'admin'>(initialTab);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLearnerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName || !pin) {
      setError(currentLang === 'hi' ? 'कृपया अपना नाम और पिन या पासवर्ड दर्ज करें।' : 'Please provide both your name and PIN or password.');
      return;
    }

    const learners = getStoredLearners();
    const existing = learners.find(
      (l) => l.name.toLowerCase() === trimmedName.toLowerCase() && l.pinOrPassword === pin
    );

    if (!existing) {
      setError(currentLang === 'hi' ? 'इस नाम और पिन के साथ कोई प्रोफाइल नहीं मिली।' : 'No matching learner found with that name and PIN/password combination.');
      return;
    }

    onLearnerSuccess(existing);
    onClose();
  };

  const handleLearnerSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(currentLang === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name or nickname.');
      return;
    }
    if (trimmedName.length < 2) {
      setError(currentLang === 'hi' ? 'नाम कम से कम 2 अक्षरों का होना चाहिए।' : 'Name must be at least 2 characters long.');
      return;
    }
    if (!pin || pin.length < 4) {
      setError(currentLang === 'hi' ? 'पिन कम से कम 4 अक्षरों का होना चाहिए।' : 'PIN or password must be at least 4 characters long.');
      return;
    }

    const learners = getStoredLearners();
    const existing = learners.find((l) => l.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      setError(currentLang === 'hi' ? 'इस नाम से प्रोफाइल पहले से मौजूद है। कृपया साइन इन करें।' : 'A learner profile with that name already exists. Please sign in or use a distinct name.');
      return;
    }

    const newLearner: LearnerUser = {
      id: `learner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      pinOrPassword: pin,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      streakDays: 1,
      bestScore: 0,
      totalAttempts: 0,
      mistakeQuestionIds: [],
      badges: INITIAL_BADGES.map((b) => ({ ...b })),
    };

    saveLearners([newLearner, ...learners]);
    onLearnerSuccess(newLearner);
    onClose();
  };

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (adminCode.trim() !== ADMIN_ACCESS_CODE) {
      setError(currentLang === 'hi' ? 'अमान्य एडमिन कोड।' : 'Invalid admin access code. Access is restricted.');
      return;
    }

    onAdminSuccess();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              tab === 'signin'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {translate('sign_in', currentLang, 'Learner Sign In')}
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              tab === 'signup'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {currentLang === 'hi' ? 'नया खाता' : 'Sign Up'}
          </button>
          <button
            onClick={() => {
              setTab('admin');
              setError(null);
            }}
            className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              tab === 'admin'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {translate('nav_admin_console', currentLang, 'Admin Access')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Learner Sign In */}
        {tab === 'signin' && (
          <form onSubmit={handleLearnerSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? 'आपका नाम' : 'Your Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? 'पिन या पासवर्ड' : 'PIN or Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder={currentLang === 'hi' ? 'अपना गुप्त पिन दर्ज करें' : 'Enter your secret PIN'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentLang === 'hi' ? 'साइन इन करें और आगे बढ़ें' : 'Sign In & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Learner Sign Up */}
        {tab === 'signup' && (
          <form onSubmit={handleLearnerSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? 'आपका पूरा नाम' : 'Your Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? '4+ अंकों का पिन या पासवर्ड सेट करें' : 'Set a 4+ digit PIN or Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="e.g. 1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {currentLang === 'hi' ? 'आपकी प्रगति को सुरक्षित रखने के लिए आवश्यक।' : 'Used to safely restore your quiz streak and certificates.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{translate('hero_create_profile', currentLang, 'Create Learner Profile')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 3: Admin Sign In */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {currentLang === 'hi' ? 'एडमिन पासवर्ड कोड' : 'Admin Access Passcode'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder={currentLang === 'hi' ? 'एडमिन कोड दर्ज करें' : 'Enter administrator code'}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentLang === 'hi' ? 'व्यवस्थापक के रूप में प्रमाणित करें' : 'Authenticate as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo-level Security Notice */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{currentLang === 'hi' ? 'सुरक्षा सूचना: डेमो वातावरण' : 'Security Notice: Demonstration Environment'}</span>
              </div>
              <p className="leading-relaxed">
                {currentLang === 'hi'
                  ? 'यह व्यवस्थापक लॉगिन मूल्यांकन उद्देश्यों के लिए क्लाइंट-साइड एक्सेस कोड (6789) सत्यापित करता है।'
                  : 'This administrator login verifies the configurable access code client-side for demonstration and assessment purposes.'}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
