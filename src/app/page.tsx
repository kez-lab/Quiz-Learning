'use client';

import { useState, useEffect } from 'react';
import QuizList from '@/components/QuizList';
import QuizPlayer from '@/components/QuizPlayer';
import ArticleViewer from '@/components/ArticleViewer';
import QuizResult from '@/components/QuizResult';
import ThemeToggle from '@/components/ThemeToggle';
import UserLogin from '@/components/UserLogin';
import { Quiz, UserData } from '@/types/quiz';
import { 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser, 
  getUserData, 
  saveUserData 
} from '@/utils/storage';
import { 
  initializeUserData, 
  getUserAvailableQuizzes
} from '@/utils/userQuizData';
import { 
  trackUserLoggedIn, 
  trackUserLoggedOut, 
  trackQuizListViewed 
} from '@/utils/analytics';

type ViewState = 'login' | 'list' | 'article' | 'quiz' | 'result';

export default function Home() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [currentUser, setCurrentUserState] = useState<UserData | null>(null);
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [quizResult, setQuizResult] = useState<{
    userAnswers: number[];
    score: number;
    timeTaken: number;
  } | null>(null);

  // 초기화: 로그인된 사용자 확인
  useEffect(() => {
    const savedUserId = getCurrentUser();
    if (savedUserId) {
      handleUserLogin(savedUserId);
    }
  }, []);

  const selectedQuiz = selectedQuizId && userQuizzes.length > 0 
    ? userQuizzes.find(q => q.id === selectedQuizId) 
    : null;

  // 사용자 로그인 처리
  const handleUserLogin = (userId: string) => {
    let userData = getUserData(userId);
    const isReturning = !!userData;
    
    if (!userData) {
      // 새 사용자 데이터 초기화
      userData = initializeUserData(userId);
      saveUserData(userData);
    } else {
      // 기존 사용자 마지막 로그인 시간 업데이트
      userData.lastLoginAt = new Date();
      saveUserData(userData);
    }
    
    const availableQuizzes = getUserAvailableQuizzes(userData);
    
    setCurrentUser(userId);
    setCurrentUserState(userData);
    setUserQuizzes(availableQuizzes);
    setCurrentView('list');
    
    // Analytics 이벤트 전송
    trackUserLoggedIn(userId, isReturning);
    trackQuizListViewed(userId, availableQuizzes.length);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    const userId = currentUser?.userId;
    
    clearCurrentUser();
    setCurrentUserState(null);
    setUserQuizzes([]);
    setSelectedQuizId(null);
    setCurrentView('login');
    
    // Analytics 이벤트 전송
    if (userId) {
      trackUserLoggedOut(userId);
    }
  };

  const handleSelectQuiz = (quizId: number) => {
    setSelectedQuizId(quizId);
    const quiz = userQuizzes.find(q => q.id === quizId);
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

  const handleQuizComplete = (userAnswers: number[], score: number, timeTaken: number) => {
    setQuizResult({ userAnswers, score, timeTaken });
    setCurrentView('result');
  };

  const handleRetryQuiz = () => {
    setQuizResult(null);
    setCurrentView('quiz');
  };

  // 로그인 화면 표시
  if (currentView === 'login') {
    return <UserLogin onLogin={handleUserLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-xl font-bold text-white">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  QuizAI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  AI 기반 퀴즈 학습 플랫폼
                </p>
              </div>
            </div>
            
            {/* Navigation & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {currentUser && (
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">안녕하세요,</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{currentUser.userId}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {userQuizzes.length}개 퀴즈
                  </span>
                </div>
              )}
              
              {currentView !== 'list' && (
                <button
                  onClick={handleBackToList}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">홈으로</span>
                </button>
              )}
              
              {/* Logout Button */}
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  로그아웃
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
              🤖 AI 퀴즈 학습 플랫폼
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              AI가 생성한 맞춤형 퀴즈로 효과적인 학습을 경험해보세요
            </p>
            
            {/* User-specific info */}
            {currentUser && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{currentUser.userId}</span>님을 위한 
                  <span className="font-medium text-indigo-600 dark:text-indigo-400"> {userQuizzes.length}개</span>의 퀴즈가 준비되어 있습니다
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  마지막 로그인: {currentUser.lastLoginAt.toLocaleString('ko-KR')}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>맞춤형 학습</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>즉시 피드백</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>AI 분석</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'list' && (
          <QuizList 
            onSelectQuiz={handleSelectQuiz} 
            availableQuizzes={userQuizzes}
          />
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
        
        {currentView === 'result' && selectedQuiz && quizResult && (
          <QuizResult 
            quiz={selectedQuiz}
            userAnswers={quizResult.userAnswers}
            score={quizResult.score}
            timeTaken={quizResult.timeTaken}
            onBack={handleBackToList}
            onRetry={handleRetryQuiz}
          />
        )}
      </div>
    </div>
  );
}