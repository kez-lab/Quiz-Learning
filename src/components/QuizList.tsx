'use client';

import { useState, useEffect } from 'react';
import { Quiz, UserProgress } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';
import { getProgress } from '@/utils/storage';

interface QuizListProps {
  onSelectQuiz: (quizId: number) => void;
}

export default function QuizList({ onSelectQuiz }: QuizListProps) {
  const quizzes = quizzesData as Quiz[];
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    setUserProgress(getProgress());
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.id);
          const isCompleted = !!progress;
          
          return (
            <div
              key={quiz.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 transform hover:scale-105 hover:-translate-y-1 ${
                isCompleted ? 'ring-2 ring-green-200 bg-gradient-to-br from-green-50 to-white' : 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
              }`}
              onClick={() => onSelectQuiz(quiz.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                  {getDifficultyText(quiz.difficulty)}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">
                    {quiz.questions.length}문제
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-green-600 font-semibold mt-1">
                      ✓ 완료 ({progress.score}/{quiz.questions.length})
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {quiz.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {quiz.description}
              </p>
              
              {quiz.articleUrl && (
                <div className="flex items-center text-xs text-blue-600 mb-3">
                  <span className="mr-1">📖</span>
                  <span>아티클 포함</span>
                </div>
              )}
              
              <button className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${
                isCompleted 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {isCompleted ? '다시 도전 →' : quiz.articleUrl ? '아티클 읽기 →' : '시작하기 →'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}