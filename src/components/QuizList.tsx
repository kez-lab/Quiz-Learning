'use client';

import { useState, useEffect } from 'react';
import { Quiz, UserProgress } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';
import { getProgress } from '@/utils/storage';
import { trackQuizListViewed, trackArticleCardClicked } from '@/utils/analytics';

interface QuizListProps {
  onSelectQuiz: (quizId: number) => void;
}

export default function QuizList({ onSelectQuiz }: QuizListProps) {
  const quizzes = quizzesData as Quiz[];
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    setUserProgress(getProgress());
    trackQuizListViewed();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:bg-gradient-to-r dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700';
      case 'intermediate': return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-yellow-900/40 dark:text-amber-200 border border-amber-200 dark:border-amber-700';
      case 'advanced': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:bg-gradient-to-r dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-200 border border-red-200 dark:border-red-700';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:bg-gradient-to-r dark:from-gray-800 dark:to-slate-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return difficulty;
    }
  };

  const getQuizProgress = (quizId: number) => {
    return userProgress.find(p => p.quizId === quizId);
  };

  const handleQuizClick = (quiz: Quiz) => {
    trackArticleCardClicked(quiz.id, quiz.title);
    onSelectQuiz(quiz.id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.id);
          const isCompleted = !!progress;
          const completionRate = isCompleted ? (progress.score / quiz.questions.length) * 100 : 0;
          
          return (
            <div
              key={quiz.id}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 transform hover:scale-[1.02] hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
                isCompleted 
                  ? 'ring-2 ring-emerald-200 dark:ring-emerald-700 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950 dark:via-gray-800 dark:to-blue-950' 
                  : 'hover:bg-gradient-to-br hover:from-blue-50 hover:via-white hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:via-gray-800 dark:hover:to-indigo-950'
              }`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400 to-blue-500 rounded-full transform -translate-x-12 translate-y-12"></div>
              </div>
              
              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
              )}
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getDifficultyColor(quiz.difficulty)}`}>
                    {getDifficultyText(quiz.difficulty)}
                  </span>
                  {quiz.articleUrl && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      📖 아티클
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {quiz.questions.length}문제
                  </span>
                  {isCompleted && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      {progress.score}/{quiz.questions.length} ({Math.round(completionRate)}%)
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative z-10 mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {quiz.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {quiz.description}
                </p>
                
                {/* Progress Bar for completed quizzes */}
                {isCompleted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>진행률</span>
                      <span>{Math.round(completionRate)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className={`relative z-10 w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuizClick(quiz);
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  {isCompleted ? (
                    <>
                      <span>🔄</span>
                      <span>다시 도전</span>
                    </>
                  ) : quiz.articleUrl ? (
                    <>
                      <span>📖</span>
                      <span>아티클 읽기</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>시작하기</span>
                    </>
                  )}
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Stats Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-200/50 dark:border-gray-600/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">📊 학습 현황</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quizzes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">전체 퀴즈</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{userProgress.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">완료한 퀴즈</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {userProgress.reduce((sum, p) => sum + p.score, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 점수</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {userProgress.length > 0 ? Math.round((userProgress.length / quizzes.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">진행률</div>
          </div>
        </div>
      </div>
    </div>
  );
}