export type QuestionCategory =
  | 'Lógica Numérica'
  | 'Reconocimiento de Patrones'
  | 'Deducción Verbal'
  | 'Razonamiento Espacial';

export type VisualType =
  | 'rotation-sequence'
  | 'shape-matrix'
  | 'number-triads'
  | 'polygon-progression'
  | 'cube-slice';

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: 'Base' | 'Intermedio' | 'Avanzado';
  weight: number;
  prompt: string;
  visual?: VisualType;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export type UserAnswers = Record<string, number>;

export interface CategoryScore {
  category: QuestionCategory;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuestionReview {
  questionId: string;
  prompt: string;
  category: QuestionCategory;
  selectedIndex: number | null;
  correctIndex: number;
  selectedText: string | null;
  correctText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizResult {
  correctCount: number;
  totalQuestions: number;
  answeredCount: number;
  rawPercentage: number;
  weightedPercentage: number;
  estimatedIQ: number;
  percentile: number;
  classification: string;
  personalizedMessage: string;
  recommendation: string;
  strongestCategory: QuestionCategory;
  weakestCategory: QuestionCategory;
  categoryBreakdown: CategoryScore[];
  questionReviews: QuestionReview[];
  elapsedSeconds: number;
}
