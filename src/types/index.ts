export type Topic =
  | 'AI basics'
  | 'Machine learning'
  | 'LLMs and prompting'
  | 'AI tools'
  | 'Data and privacy'
  | 'Ethics and safety'
  | 'AI in the workplace';

export const TOPICS: Topic[] = [
  'AI basics',
  'Machine learning',
  'LLMs and prompting',
  'AI tools',
  'Data and privacy',
  'Ethics and safety',
  'AI in the workplace',
];

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export type QuestionType = 'multiple_choice' | 'true_false' | 'scenario';

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isCustom?: boolean;
  createdAt?: string;
}

export type ProficiencyLevel = 'Novice' | 'Learner' | 'Practitioner' | 'Expert';

export interface TopicPerformance {
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizAnswer {
  questionId: string;
  questionText: string;
  topic: Topic;
  difficulty: Difficulty;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  explanation: string;
  options: string[];
}

export interface QuizAttempt {
  id: string;
  learnerId: string;
  learnerName: string;
  timestamp: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  proficiencyLevel: ProficiencyLevel;
  timeTakenSeconds: number;
  topicBreakdown: Record<Topic, TopicPerformance>;
  answers: QuizAnswer[];
  mode: 'standard' | 'topic_focus' | 'review_mistakes';
  filterTopic?: Topic | 'all';
  filterDifficulty?: Difficulty | 'all';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'score' | 'streak' | 'topic';
  unlocked: boolean;
  earnedAt?: string;
}

export interface LearnerUser {
  id: string;
  name: string;
  pinOrPassword: string;
  createdAt: string;
  lastActive: string;
  streakDays: number;
  bestScore: number;
  totalAttempts: number;
  badges: Badge[];
  mistakeQuestionIds: string[];
}

export interface QuizSettings {
  questionCount: number;
  topic: Topic | 'all';
  difficulty: Difficulty | 'all';
  timerMode: 'untimed' | '30s_per_question' | '5m_total';
  instantFeedback: boolean;
}
