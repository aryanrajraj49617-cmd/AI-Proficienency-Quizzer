import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Difficulty, Question, QuestionType, Topic, TOPICS, DIFFICULTIES } from '../types';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionToEdit?: Question | null;
  onSave: (question: Question) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  questionToEdit,
  onSave,
}) => {
  const [topic, setTopic] = useState<Topic>('AI basics');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [type, setType] = useState<QuestionType>('multiple_choice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questionToEdit) {
      setTopic(questionToEdit.topic);
      setDifficulty(questionToEdit.difficulty);
      setType(questionToEdit.type);
      setQuestionText(questionToEdit.question);
      setOptions([...questionToEdit.options]);
      setCorrectIndex(questionToEdit.correctIndex);
      setExplanation(questionToEdit.explanation);
    } else {
      setTopic('AI basics');
      setDifficulty('Beginner');
      setType('multiple_choice');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      setExplanation('');
    }
    setError(null);
  }, [questionToEdit, isOpen]);

  // Handle type change (True/False vs Multiple Choice)
  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'true_false') {
      setOptions(['True', 'False']);
      setCorrectIndex(0);
    } else {
      if (options.length < 4) {
        setOptions(['', '', '', '']);
      }
    }
  };

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedQ = questionText.trim();
    if (!trimmedQ) {
      setError('Please provide the question prompt.');
      return;
    }

    if (type === 'multiple_choice' || type === 'scenario') {
      const emptyOptIndex = options.findIndex((opt) => !opt.trim());
      if (emptyOptIndex !== -1) {
        setError(`Please fill in option ${String.fromCharCode(65 + emptyOptIndex)}.`);
        return;
      }
    }

    const trimmedExp = explanation.trim();
    if (!trimmedExp) {
      setError('Please enter a one-sentence educational explanation.');
      return;
    }

    const newQuestion: Question = {
      id: questionToEdit ? questionToEdit.id : `custom-q-${Date.now()}`,
      topic,
      difficulty,
      type,
      question: trimmedQ,
      options: options.map((o) => o.trim()),
      correctIndex,
      explanation: trimmedExp,
      isCustom: true,
      createdAt: questionToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(newQuestion);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {questionToEdit ? 'Edit Assessment Question' : 'Create New Assessment Question'}
            </h3>
            <p className="text-xs text-slate-500">
              Provide fair, unambiguous questions with concise educational feedback.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Question Type
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="multiple_choice">Multiple Choice (4 Options)</option>
                <option value="true_false">True / False</option>
                <option value="scenario">Workplace Scenario</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Question Prompt
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. In the context of LLMs, what is prompt injection?"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Answer Options & Correct Choice
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Select the radio button next to the option that represents the verified correct answer.
            </p>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-slate-500 w-4">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    required
                    disabled={type === 'true_false'}
                    placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              One-Sentence Explanation
            </label>
            <input
              type="text"
              required
              placeholder="Shown immediately after answering to explain why the correct option is right."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              {questionToEdit ? 'Save Changes' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
