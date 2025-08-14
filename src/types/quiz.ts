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
  userId: string; // 이 퀴즈와 매칭된 사용자 ID
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

export interface UserData {
  userId: string;
  availableQuizzes: number[];
  progress: UserProgress[];
  createdAt: Date;
  lastLoginAt: Date;
}