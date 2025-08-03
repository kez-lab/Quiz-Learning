'use client';

import { useState } from 'react';
import QuizList from '@/components/QuizList';
import QuizPlayer from '@/components/QuizPlayer';
import ArticleViewer from '@/components/ArticleViewer';
import ThemeToggle from '@/components/ThemeToggle';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-xl font-bold text-white">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  QuizDev
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  개발자를 위한 학습 플랫폼
                </p>
              </div>
            </div>
            
            {/* Navigation & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {currentView !== 'list' && (
                <button
                  onClick={handleBackToList}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">홈으로</span>
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - only show on list view */}
        {currentView === 'list' && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">
              📚 개발자 아티클 퀴즈
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              최신 기술 아티클을 읽고 퀴즈로 실력을 검증해보세요
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>실무 중심</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>즉시 피드백</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>진도 추적</span>
              </div>
            </div>
          </div>
        )}

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