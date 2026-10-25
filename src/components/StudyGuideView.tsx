import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lightbulb, Play } from 'lucide-react';
import { Topic, TOPICS } from '../types';
import { STUDY_RECOMMENDATIONS } from '../utils/storage';
import { translate, translateTopic } from '../utils/i18n';

interface StudyGuideViewProps {
  onStartTopicQuiz: (topic: Topic) => void;
  currentLang?: string;
}

const TOPIC_DETAILS: Record<
  Topic,
  {
    summary: string;
    keyTerms: { term: string; def: string }[];
    practicalRule: string;
  }
> = {
  'AI basics': {
    summary:
      'Artificial intelligence systems recognize statistical patterns and mathematical correlations in data to solve complex tasks. Narrow AI performs specialized operations like image classification or speech recognition, distinct from hypothetical AGI.',
    keyTerms: [
      { term: 'Narrow AI', def: 'Algorithms trained for bounded, specialized tasks (e.g. computer vision, translation).' },
      { term: 'Loss Function', def: 'Mathematical formula calculating error between model predictions and ground-truth values.' },
      { term: 'Overfitting', def: 'When a model memorizes training noise and fails to generalize to fresh real-world data.' },
    ],
    practicalRule: 'Always evaluate models on a strictly held-out test split that the algorithm has never seen during training.',
  },
  'Machine learning': {
    summary:
      'Machine learning trains algorithms to improve from data rather than hardcoded rules. Paradigms include supervised learning with labeled data, unsupervised clustering, and reinforcement learning guided by rewards.',
    keyTerms: [
      { term: 'Supervised Learning', def: 'Training on labeled input-output example pairs.' },
      { term: 'Reinforcement Learning', def: 'Optimizing agent policies through trial-and-error environmental rewards.' },
      { term: 'Precision & Recall', def: 'Critical metrics for evaluating heavily skewed or imbalanced datasets.' },
    ],
    practicalRule: 'Never rely solely on raw accuracy when dealing with rare events or imbalanced classes.',
  },
  'LLMs and prompting': {
    summary:
      'Large Language Models predict token sequences using self-attention transformer architectures. Prompt engineering techniques like few-shot examples, system role specification, and temperature modulation control output quality.',
    keyTerms: [
      { term: 'Hallucination', def: 'Confident generation of plausible-sounding but factually ungrounded claims.' },
      { term: 'Few-Shot Prompting', def: 'Providing one or more input-output examples directly in the context window.' },
      { term: 'RAG', def: 'Retrieval-Augmented Generation that fetches external verified documents to ground answers.' },
    ],
    practicalRule: 'Combine strict schema constraints (like JSON) with retrieved enterprise documents to minimize hallucinations.',
  },
  'AI tools': {
    summary:
      'Modern AI toolchains include autonomous agents that can plan multi-step workflows and invoke external APIs, diffusion models for media generation, and vector embeddings for high-dimensional semantic search.',
    keyTerms: [
      { term: 'AI Agents', def: 'Autonomous systems capable of planning, tool use, and environmental interaction.' },
      { term: 'Diffusion Models', def: 'Generative models that synthesize media by iteratively denoising random latent patterns.' },
      { term: 'Vector Embeddings', def: 'Dense numeric arrays that place semantically similar content near each other in geometric space.' },
    ],
    practicalRule: 'Always perform human code review, automated testing, and license scanning on AI-generated software code.',
  },
  'Data and privacy': {
    summary:
      'Data stewardship is vital when developing AI systems. Public consumer AI tools can ingest user prompts into future training datasets, and naive pseudonymization often fails against auxiliary linkage attacks.',
    keyTerms: [
      { term: 'Federated Learning', def: 'Collaborative model training across decentralized devices without sharing raw data.' },
      { term: 'Differential Privacy', def: 'Provable mathematical framework injecting calibrated noise to obscure individual records.' },
      { term: 'Linkage Attack', def: 'Re-identifying anonymized individuals by matching auxiliary demographic attributes.' },
    ],
    practicalRule: 'Never paste proprietary customer records or trade secrets into public consumer AI portals without enterprise guarantees.',
  },
  'Ethics and safety': {
    summary:
      'Algorithmic bias occurs when models absorb and reinforce historical inequities present in training data. Safe deployment requires proactive fairness auditing, deepfake awareness, and addressing the AI alignment challenge.',
    keyTerms: [
      { term: 'Algorithmic Bias', def: 'Systematic disparities in decision outputs reflecting skewed historical data.' },
      { term: 'Deepfake Media', def: 'Synthetically manipulated media falsely portraying real human actions or speech.' },
      { term: 'Alignment Problem', def: 'The scientific challenge of ensuring autonomous systems reliably pursue human values.' },
    ],
    practicalRule: 'Regularly audit decision engines for disparate impact and eliminate discriminatory proxy features.',
  },
  'AI in the workplace': {
    summary:
      'Successful organizational AI adoption centers on cognitive augmentation through Human-in-the-Loop workflows, clear internal acceptable use policies, and careful copyright and commercial license diligence.',
    keyTerms: [
      { term: 'Human-in-the-Loop (HITL)', def: 'Keeping human experts as the final verification checkpoint for critical decisions.' },
      { term: 'Acceptable Use Policy', def: 'Corporate guidelines defining permissible AI tools, data handling, and verification standards.' },
      { term: 'Commercial Clearance', def: 'Verifying intellectual property, likeness rights, and vendor terms before publishing.' },
    ],
    practicalRule: 'Pair AI speed with human empathy and judgment for all high-stakes customer-facing operations.',
  },
};

export const StudyGuideView: React.FC<StudyGuideViewProps> = ({
  onStartTopicQuiz,
  currentLang = 'en',
}) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('AI basics');
  const details = TOPIC_DETAILS[selectedTopic];
  const recommendations = STUDY_RECOMMENDATIONS[selectedTopic];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{translate('nav_study_guide', currentLang, 'Study Guide')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {currentLang === 'hi' ? 'एआई दक्षता अध्ययन गाइड' : 'AI Proficiency Study Guide'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          {currentLang === 'hi'
            ? 'मूल्यांकन से पहले प्रमुख अवधारणाओं, शब्दावली और व्यावहारिक नियमों की समीक्षा करें।'
            : 'Review core foundational concepts, essential terminology, and practical rules before taking your assessment.'}
        </p>
      </div>

      {/* Topic Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTopic(t)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedTopic === t
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {translateTopic(t, currentLang)}
          </button>
        ))}
      </div>

      {/* Selected Topic Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {translateTopic(selectedTopic, currentLang)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {details.summary}
            </p>
          </div>

          <button
            onClick={() => onStartTopicQuiz(selectedTopic)}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>
              {currentLang === 'hi'
                ? `${translateTopic(selectedTopic, currentLang)} का अभ्यास करें`
                : `Practice ${translateTopic(selectedTopic, currentLang)}`}
            </span>
          </button>
        </div>

        {/* Key Terminology */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {currentLang === 'hi' ? 'प्रमुख शब्दावली एवं मूल अवधारणाएं' : 'Key Terminology & Foundational Concepts'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {details.keyTerms.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-1.5"
              >
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 block">
                  {item.term}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.def}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Rule */}
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-indigo-950 dark:text-indigo-200 block uppercase tracking-wider text-[11px]">
              {currentLang === 'hi' ? 'व्यावहारिक नियम' : 'Field Rule of Thumb'}
            </span>
            <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed">
              {details.practicalRule}
            </p>
          </div>
        </div>

        {/* Study Tips */}
        {recommendations && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {currentLang === 'hi' ? 'परीक्षा की तैयारी हेतु सुझाव' : 'Exam Preparation Tips'}
            </h4>
            <div className="space-y-2">
              {recommendations.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
