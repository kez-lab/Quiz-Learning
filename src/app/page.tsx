'use client';

import { useState } from 'react';
import QuizList from '@/components/QuizList';
import QuizPlayer from '@/components/QuizPlayer';
import ArticleViewer from '@/components/ArticleViewer';
import { Quiz } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';

type ViewState = 'list' | 'article' | 'quiz';

export default function Home() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('list');
  
  const quizzes = quizzesData as Quiz[];
  const selectedQuiz = selectedQuizId ? quizzes.find(q => q.id === selectedQuizId) : null;

  const handleSelectQuiz = (quizId: number) => {
    setSelectedQuizId(quizId);
    const quiz = quizzes.find(q => q.id === quizId);
    // 아티클 URL이 있으면 아티클 뷰로, 없으면 바로 퀴즈로
    setCurrentView(quiz?.articleUrl ? 'article' : 'quiz');
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleBackToList = () => {
    setSelectedQuizId(null);
    setCurrentView('list');
  };

  const handleQuizComplete = () => {
    setCurrentView('list');
    setSelectedQuizId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            📚 개발자 아티클 퀴즈
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            아티클을 읽고 퀴즈로 학습하는 개발 지식 플랫폼
          </p>
        </header>

        {currentView === 'list' && (
          <QuizList onSelectQuiz={handleSelectQuiz} />
        )}
        
        {currentView === 'article' && selectedQuiz && (
          <ArticleViewer 
            quiz={selectedQuiz}
            onStartQuiz={handleStartQuiz}
            onBack={handleBackToList}
          />
        )}
        
        {currentView === 'quiz' && selectedQuizId && (
          <QuizPlayer 
            quizId={selectedQuizId} 
            onComplete={handleQuizComplete}
            onBack={() => setCurrentView(selectedQuiz?.articleUrl ? 'article' : 'list')}
          />
        )}
      </div>
    </div>
  );
}