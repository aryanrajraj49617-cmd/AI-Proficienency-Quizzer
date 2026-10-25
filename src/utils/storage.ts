import {
  Difficulty,
  LearnerUser,
  ProficiencyLevel,
  Question,
  QuizAttempt,
  Topic,
  TOPICS,
} from '../types';
import { INITIAL_BADGES, STARTER_QUESTIONS } from '../data/starterQuestions';
import { syncLearnerToCloud, syncAttemptToCloud, syncQuestionToCloud } from '../firebase';

// Configurable Admin Access Code - demo level security constant
export const ADMIN_ACCESS_CODE = '6789';

const STORAGE_KEYS = {
  QUESTIONS: 'ai_quiz_questions_v1',
  LEARNERS: 'ai_quiz_learners_v1',
  ATTEMPTS: 'ai_quiz_attempts_v1',
  SESSION: 'ai_quiz_current_session_v1',
  THEME: 'ai_quiz_theme_v1',
};

export function calculateProficiencyLevel(percentage: number): ProficiencyLevel {
  if (percentage >= 85) return 'Expert';
  if (percentage >= 70) return 'Practitioner';
  if (percentage >= 50) return 'Learner';
  return 'Novice';
}

export function getProficiencyColor(level: ProficiencyLevel): {
  badgeBg: string;
  badgeText: string;
  border: string;
  fill: string;
} {
  switch (level) {
    case 'Expert':
      return {
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        badgeText: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        fill: '#10b981',
      };
    case 'Practitioner':
      return {
        badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        badgeText: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800',
        fill: '#6366f1',
      };
    case 'Learner':
      return {
        badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
        badgeText: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        fill: '#f59e0b',
      };
    case 'Novice':
    default:
      return {
        badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
        badgeText: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-800',
        fill: '#64748b',
      };
  }
}

export const STUDY_RECOMMENDATIONS: Record<Topic, { focus: string; tips: string[] }> = {
  'AI basics': {
    focus: 'Core AI taxonomy, Narrow vs General AI, and fundamental neural network concepts.',
    tips: [
      'Learn how neural loss functions and backpropagation optimize model weights.',
      'Study the difference between statistical pattern recognition and genuine cognitive understanding.',
      'Review overfitting signatures and how training vs test loss curves reveal model variance.',
    ],
  },
  'Machine learning': {
    focus: 'Supervised vs unsupervised learning, data splitting protocols, and evaluation metrics.',
    tips: [
      'Understand why raw accuracy is misleading on class-imbalanced datasets and when to use PR-AUC.',
      'Practice partitioning datasets into strict train, validation, and test splits.',
      'Explore reinforcement learning loops involving state, action, and reward signals.',
    ],
  },
  'LLMs and prompting': {
    focus: 'Prompt engineering techniques, temperature sampling, and Retrieval-Augmented Generation (RAG).',
    tips: [
      'Experiment with few-shot demonstration exemplars and strict JSON output schemas.',
      'Understand how temperature alters sampling distributions from deterministic to exploratory.',
      'Learn how vector database embeddings ground LLM responses to prevent hallucinations.',
    ],
  },
  'AI tools': {
    focus: 'Autonomous AI agents, diffusion models, and software engineering with AI assistance.',
    tips: [
      'Examine how agents plan multi-step actions and invoke external tool APIs.',
      'Practice code verification: always run unit tests and license scans on AI-generated code.',
      'Understand how vector embeddings cluster semantically similar information in high-dimensional space.',
    ],
  },
  'Data and privacy': {
    focus: 'Corporate data protection, re-identification risks, federated learning, and differential privacy.',
    tips: [
      'Understand how public consumer AI tools can ingest user prompts into future model training sets.',
      'Recognize linkage attacks: why simple name removal is not true data anonymization.',
      'Study federated learning workflows for keeping sensitive records on localized devices.',
    ],
  },
  'Ethics and safety': {
    focus: 'Algorithmic bias mitigation, deepfake risks, and the AI alignment problem.',
    tips: [
      'Analyze how training data imbalances propagate historical societal biases into automated decisions.',
      'Learn how fairness audits and proxy feature identification prevent disparate impact.',
      'Study the alignment problem: ensuring powerful AI systems reliably adhere to human values.',
    ],
  },
  'AI in the workplace': {
    focus: 'Human-in-the-loop workflows, acceptable use policies, and commercial licensing diligence.',
    tips: [
      'Implement human review checkpoints for customer-facing or high-stakes AI outputs.',
      'Create an organizational AI Acceptable Use Policy covering copyright and confidentiality.',
      'Verify commercial licensing terms and copyright clearances before deploying AI assets.',
    ],
  },
};

// Real learners list - initialized empty; no mock users
export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(STARTER_QUESTIONS));
      return STARTER_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return STARTER_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function resetQuestionsToDefault(): Question[] {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(STARTER_QUESTIONS));
  return STARTER_QUESTIONS;
}

export function getStoredLearners(): LearnerUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEARNERS);
    if (!raw) {
      return [];
    }
    const list: LearnerUser[] = JSON.parse(raw);
    // Strip any mock/seed learners if previously cached in localStorage
    const filtered = list.filter(
      (l) =>
        l.id !== 'learner-elena' &&
        l.id !== 'learner-marcus' &&
        l.id !== 'learner-sarah' &&
        l.id !== 'learner-devon' &&
        l.id !== 'learner-priya'
    );
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.LEARNERS, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export function saveLearners(learners: LearnerUser[]): void {
  localStorage.setItem(STORAGE_KEYS.LEARNERS, JSON.stringify(learners));
  // Background sync to cloud
  learners.forEach((l) => {
    syncLearnerToCloud(l).catch(() => {});
  });
}

export function getStoredAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) {
      return [];
    }
    const list: QuizAttempt[] = JSON.parse(raw);
    const filtered = list.filter(
      (a) =>
        a.id !== 'attempt-priya-01' &&
        a.id !== 'attempt-elena-01' &&
        a.id !== 'attempt-marcus-01' &&
        a.id !== 'attempt-sarah-01' &&
        a.id !== 'attempt-devon-01'
    );
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: QuizAttempt): void {
  const attempts = getStoredAttempts();
  const updatedAttempts = [attempt, ...attempts];
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updatedAttempts));

  // Sync attempt to Cloud Firestore
  syncAttemptToCloud(attempt).catch(() => {});

  // Update learner metrics
  const learners = getStoredLearners();
  const index = learners.findIndex((l) => l.id === attempt.learnerId);
  if (index !== -1) {
    const learner = learners[index];
    const newBest = Math.max(learner.bestScore, attempt.percentage);
    const newTotalAttempts = learner.totalAttempts + 1;
    const newLastActive = attempt.timestamp;

    // Update mistake question IDs
    const currentMistakes = new Set(learner.mistakeQuestionIds || []);
    attempt.answers.forEach((ans) => {
      if (ans.isCorrect) {
        currentMistakes.delete(ans.questionId);
      } else {
        currentMistakes.add(ans.questionId);
      }
    });

    // Evaluate badges
    const updatedBadges = evaluateBadges(learner, attempt, newBest, newTotalAttempts);

    const updatedLearner: LearnerUser = {
      ...learner,
      bestScore: newBest,
      totalAttempts: newTotalAttempts,
      lastActive: newLastActive,
      mistakeQuestionIds: Array.from(currentMistakes),
      badges: updatedBadges,
      streakDays: learner.streakDays + 1,
    };
    learners[index] = updatedLearner;
    saveLearners(learners);
    syncLearnerToCloud(updatedLearner).catch(() => {});
  }
}

function evaluateBadges(
  learner: LearnerUser,
  attempt: QuizAttempt,
  bestScore: number,
  totalAttempts: number
) {
  const badges = learner.badges && learner.badges.length > 0 ? [...learner.badges] : [...INITIAL_BADGES];

  return badges.map((badge) => {
    if (badge.unlocked) return badge;

    let shouldUnlock = false;
    if (badge.id === 'badge-first-quiz' && totalAttempts >= 1) shouldUnlock = true;
    if (badge.id === 'badge-high-score' && attempt.percentage >= 80) shouldUnlock = true;
    if (badge.id === 'badge-expert' && attempt.percentage >= 85) shouldUnlock = true;
    if (badge.id === 'badge-perfect' && attempt.percentage === 100) shouldUnlock = true;
    if (badge.id === 'badge-streak-3' && (learner.streakDays + 1) >= 3) shouldUnlock = true;
    if (badge.id === 'badge-speed-demon' && attempt.timeTakenSeconds <= 120 && attempt.percentage >= 70) shouldUnlock = true;

    if (badge.id === 'badge-prompt-master') {
      const promptStats = attempt.topicBreakdown['LLMs and prompting'];
      if (promptStats && promptStats.total > 0 && promptStats.percentage === 100) shouldUnlock = true;
    }
    if (badge.id === 'badge-ethical-mind') {
      const ethicsStats = attempt.topicBreakdown['Ethics and safety'];
      if (ethicsStats && ethicsStats.total > 0 && ethicsStats.percentage === 100) shouldUnlock = true;
    }

    if (shouldUnlock) {
      return {
        ...badge,
        unlocked: true,
        earnedAt: new Date().toISOString(),
      };
    }
    return badge;
  });
}

export function getCurrentSession(): { type: 'admin' | 'learner' | null; learnerId?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return { type: null };
    return JSON.parse(raw);
  } catch {
    return { type: null };
  }
}

export function saveCurrentSession(session: { type: 'admin' | 'learner' | null; learnerId?: string }): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearCurrentSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getStoredTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
}

// Compute aggregate metrics for a learner
export function computeLearnerStats(learnerId: string, customAttempts?: QuizAttempt[]) {
  const allAttempts = customAttempts || getStoredAttempts();
  const attempts = allAttempts.filter((a) => a.learnerId === learnerId);
  const totalQuizzes = attempts.length;
  if (totalQuizzes === 0) {
    return {
      totalQuizzes: 0,
      bestScore: 0,
      averageScore: 0,
      proficiencyLevel: 'Novice' as ProficiencyLevel,
      topicStats: TOPICS.reduce((acc, topic) => {
        acc[topic] = { correct: 0, total: 0, percentage: 0 };
        return acc;
      }, {} as Record<Topic, { correct: number; total: number; percentage: number }>),
      strengths: [] as Topic[],
      weaknesses: [] as Topic[],
    };
  }

  const scores = attempts.map((a) => a.percentage);
  const bestScore = Math.max(...scores);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const proficiencyLevel = calculateProficiencyLevel(bestScore);

  const topicTotals: Record<Topic, { correct: number; total: number }> = TOPICS.reduce((acc, t) => {
    acc[t] = { correct: 0, total: 0 };
    return acc;
  }, {} as Record<Topic, { correct: number; total: number }>);

  attempts.forEach((att) => {
    Object.entries(att.topicBreakdown || {}).forEach(([topic, perf]) => {
      const t = topic as Topic;
      if (topicTotals[t]) {
        topicTotals[t].correct += perf.correct;
        topicTotals[t].total += perf.total;
      }
    });
  });

  const topicStats = TOPICS.reduce((acc, t) => {
    const { correct, total } = topicTotals[t];
    acc[t] = {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
    return acc;
  }, {} as Record<Topic, { correct: number; total: number; percentage: number }>);

  const evaluatedTopics = TOPICS.filter((t) => topicStats[t].total > 0).sort(
    (a, b) => topicStats[b].percentage - topicStats[a].percentage
  );

  const strengths = evaluatedTopics.filter((t) => topicStats[t].percentage >= 75);
  const weaknesses = evaluatedTopics.filter((t) => topicStats[t].percentage < 60);

  return {
    totalQuizzes,
    bestScore,
    averageScore,
    proficiencyLevel,
    topicStats,
    strengths,
    weaknesses,
  };
}

// Generate CSV Export with BOM
export function generateLearnersCSV(learners: LearnerUser[]): string {
  const attempts = getStoredAttempts();
  const headers = [
    'Learner ID',
    'Learner Name',
    'Created At',
    'Last Active',
    'Total Quizzes',
    'Best Score (%)',
    'Average Score (%)',
    'Current Level',
    'Streak (Days)',
    'Pending Mistakes',
    ...TOPICS.map((t) => `${t} (%)`),
  ];

  const rows = learners.map((learner) => {
    const stats = computeLearnerStats(learner.id);
    const row = [
      learner.id,
      `"${learner.name.replace(/"/g, '""')}"`,
      new Date(learner.createdAt).toISOString().split('T')[0],
      new Date(learner.lastActive).toISOString().split('T')[0],
      stats.totalQuizzes,
      stats.bestScore,
      stats.averageScore,
      stats.proficiencyLevel,
      learner.streakDays,
      learner.mistakeQuestionIds?.length || 0,
      ...TOPICS.map((t) => stats.topicStats[t].percentage),
    ];
    return row.join(',');
  });

  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

// Generate Excel XML Spreadsheet (.xls) with formatting and styles
export function generateLearnersExcelXML(learners: LearnerUser[]): string {
  const attempts = getStoredAttempts();

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="16" ss:Color="#0F172A" ss:Bold="1"/>
  </Style>
  <Style ss:ID="PercentStyle">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="0&quot;%&quot;"/>
  </Style>
  <Style ss:ID="CenterStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Learner Proficiency Report">
  <Table>
   <Column ss:Width="160"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="80"/>
   ${TOPICS.map(() => '<Column ss:Width="120"/>').join('\n   ')}
   <Row ss:Height="30">
    <Cell ss:StyleID="TitleStyle"><Data ss:Type="String">AI Proficiency Quizzer - Comprehensive Assessment Report</Data></Cell>
   </Row>
   <Row ss:Height="15"/>
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Learner Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Join Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Last Active</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Quizzes Taken</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Best Score</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Average Score</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Proficiency Level</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Active Streak</Data></Cell>
    ${TOPICS.map((t) => `<Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${t} (%)</Data></Cell>`).join('\n    ')}
   </Row>`;

  learners.forEach((learner) => {
    const stats = computeLearnerStats(learner.id);
    xml += `
   <Row ss:Height="20">
    <Cell><Data ss:Type="String">${escapeXml(learner.name)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${new Date(learner.createdAt).toISOString().split('T')[0]}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${new Date(learner.lastActive).toISOString().split('T')[0]}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${stats.totalQuizzes}</Data></Cell>
    <Cell ss:StyleID="PercentStyle"><Data ss:Type="Number">${stats.bestScore}</Data></Cell>
    <Cell ss:StyleID="PercentStyle"><Data ss:Type="Number">${stats.averageScore}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${stats.proficiencyLevel}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${learner.streakDays}</Data></Cell>
    ${TOPICS.map((t) => `<Cell ss:StyleID="PercentStyle"><Data ss:Type="Number">${stats.topicStats[t].percentage}</Data></Cell>`).join('\n    ')}
   </Row>`;
  });

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

// Download helper trigger
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
