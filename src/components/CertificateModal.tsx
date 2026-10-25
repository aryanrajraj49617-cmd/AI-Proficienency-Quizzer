import React from 'react';
import { X, Printer, Award, ShieldCheck } from 'lucide-react';
import { ProficiencyLevel } from '../types';
import { translate, translateProficiency } from '../utils/i18n';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  percentage: number;
  proficiencyLevel: ProficiencyLevel;
  dateStr?: string;
  certificateId?: string;
  currentLang?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  learnerName,
  percentage,
  proficiencyLevel,
  dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = `CERT-AIQ-${Math.floor(100000 + Math.random() * 900000)}`,
  currentLang = 'en',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Action Header (hidden in print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-sm">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{translate('certificate_title', currentLang, 'Official Certificate of AI Competency')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'प्रिंट / पीडीएफ के रूप में सहेजें' : 'Print / Save as PDF'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close certificate"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div
          id="printable-certificate"
          className="relative bg-white text-slate-900 border-8 border-double border-slate-800 rounded-xl p-8 sm:p-12 text-center shadow-inner"
        >
          {/* Subtle Corner Accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-slate-700" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-slate-700" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-slate-700" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-slate-700" />

          {/* Badge & Title */}
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-800 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-indigo-700" />
          </div>

          <p className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase mb-2">
            AI Proficiency Assessment Board
          </p>
          <h2 id="cert-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            {translate('certificate_title', currentLang, 'Certificate of Accomplishment')}
          </h2>

          <p className="text-sm text-slate-600 mt-4 italic">
            {currentLang === 'hi' ? 'यह प्रमाणित किया जाता है कि' : 'This document certifies that'}
          </p>

          {/* Learner Name */}
          <div className="my-4 py-2 border-b-2 border-slate-300 max-w-md mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
              {learnerName}
            </h3>
          </div>

          <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
            {currentLang === 'hi'
              ? 'ने कृत्रिम बुद्धिमत्ता के मूल सिद्धांतों, मशीन लर्निंग, प्रॉम्प्टिंग और नैतिक मानकों पर आधारित व्यापक मूल्यांकन को सफलतापूर्वक उत्तीर्ण किया है।'
              : 'has successfully passed the comprehensive assessment demonstrating verified proficiency across artificial intelligence fundamentals, machine learning paradigms, prompt engineering, data privacy, and ethical deployment standards.'}
          </p>

          {/* Results Badge */}
          <div className="mt-6 inline-flex items-center gap-6 px-6 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold">
            <div>
              <span className="block text-[11px] font-normal text-slate-500 uppercase">
                {currentLang === 'hi' ? 'मूल्यांकन स्कोर' : 'Assessment Score'}
              </span>
              <span className="text-lg font-bold text-indigo-700 tabular-nums">{percentage}%</span>
            </div>
            <div className="w-px h-8 bg-slate-300" />
            <div>
              <span className="block text-[11px] font-normal text-slate-500 uppercase">
                {translate('current_level', currentLang, 'Awarded Level')}
              </span>
              <span className="text-lg font-bold text-slate-900">
                {translateProficiency(proficiencyLevel, currentLang)}
              </span>
            </div>
          </div>

          {/* Signatures & Verification Meta */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-left text-xs text-slate-600">
            <div>
              <div className="h-9 flex items-end">
                <span className="font-serif italic text-base text-slate-800 font-bold">
                  AI Assessment Directorate
                </span>
              </div>
              <div className="w-36 h-0.5 bg-slate-400 mt-1 mb-1" />
              <p className="text-[11px] text-slate-500">Board Examiner</p>
              <p className="text-[11px] text-slate-500">{dateStr}</p>
            </div>

            <div className="text-right">
              <span className="block text-[11px] uppercase font-semibold text-slate-500">Credential ID</span>
              <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                {certificateId}
              </span>
              <p className="text-[10px] text-slate-400 mt-2">
                Digitally verified via AI Proficiency Quizzer framework
              </p>
            </div>
          </div>
        </div>

        {/* Footer info (screen only) */}
        <p className="text-center text-xs text-slate-400 mt-4">
          {currentLang === 'hi'
            ? 'आप अपने ब्राउज़र से सीधे इस प्रमाण पत्र को प्रिंट या पीडीएफ के रूप में सहेज सकते हैं।'
            : 'You can print or save this certificate as a PDF directly from your browser.'}
        </p>
      </div>
    </div>
  );
};
