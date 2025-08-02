export interface Question {
  id: number;
  type: 'multiple_choice' | 'true_false';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  articleUrl?: string;
  questions: Question[];
}

export interface UserProgress {
  quizId: number;
  completedQuestions: number[];
  score: number;
  completedAt?: Date;
}

export interface QuizState {
  currentQuizId: number | null;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  userAnswers: number[];
  score: number;
}