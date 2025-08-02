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
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.id);
          const isCompleted = !!progress;
          
          return (
            <div
              key={quiz.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 hover:-translate-y-1 ${
                isCompleted ? 'ring-2 ring-green-200 dark:ring-green-700 bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-800' : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-white dark:hover:from-blue-950 dark:hover:to-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                  {getDifficultyText(quiz.difficulty)}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {quiz.questions.length}문제
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      ✓ 완료 ({progress.score}/{quiz.questions.length})
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {quiz.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>
              
              {quiz.articleUrl && (
                <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mb-3">
                  <span className="mr-1">📖</span>
                  <span>아티클 포함</span>
                </div>
              )}
              
              <button 
                className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${
                  isCompleted 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuizClick(quiz);
                }}
              >
                {isCompleted ? '다시 도전 →' : quiz.articleUrl ? '아티클 읽기 →' : '시작하기 →'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}