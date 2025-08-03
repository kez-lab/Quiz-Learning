'use client';

import { useEffect, useState } from 'react';
import { Quiz } from '@/types/quiz';
import { trackArticleLinkOpened, trackArticleReadTime, trackQuizStarted } from '@/utils/analytics';

interface ArticleViewerProps {
  quiz: Quiz;
  onStartQuiz: () => void;
  onBack: () => void;
}

export default function ArticleViewer({ quiz, onStartQuiz, onBack }: ArticleViewerProps) {
  const [startTime] = useState(Date.now());

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 체류 시간 측정
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackArticleReadTime(quiz.id, timeSpent);
    };
  }, [quiz.id, startTime]);

  const handleOpenArticle = () => {
    if (quiz.articleUrl) {
      trackArticleLinkOpened(quiz.id, quiz.articleUrl);
      window.open(quiz.articleUrl, '_blank');
    }
  };

  const handleStartQuiz = () => {
    trackQuizStarted(quiz.id, quiz.title);
    onStartQuiz();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors font-medium"
            >
              <span>←</span>
              <span>나가기</span>
            </button>
            <div className="text-white text-right">
              <div className="text-sm opacity-80">다음 단계</div>
              <div className="text-lg font-bold">
                {quiz.questions.length}문제 퀴즈
              </div>
            </div>
          </div>
          
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              📖 {quiz.title}
            </h1>
            <p className="text-white/90 text-lg">
              {quiz.description}
            </p>
          </div>
        </div>

        <div className="p-8">
          {/* Difficulty Badge */}
          <div className="flex justify-center mb-8">
            <span className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg ${
              quiz.difficulty === 'beginner' ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:bg-gradient-to-r dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700' :
              quiz.difficulty === 'intermediate' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-yellow-900/40 dark:text-amber-200 border border-amber-200 dark:border-amber-700' :
              'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:bg-gradient-to-r dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-200 border border-red-200 dark:border-red-700'
            }`}>
              🏆 {quiz.difficulty === 'beginner' ? '초급' :
               quiz.difficulty === 'intermediate' ? '중급' : '고급'} 난이도
            </span>
          </div>

          {/* Learning Flow */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 mb-8 border border-blue-200/50 dark:border-blue-800/50">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              🎯 학습 플로우
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">📖 아티클 읽기</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">원문 아티클을 자세히 읽고 이해해보세요</p>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="text-3xl text-blue-400 dark:text-blue-500 animate-pulse">→</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">🧠 퀴즈 도전</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">이해한 내용을 바탕으로 퀴즈에 도전해보세요</p>
              </div>
            </div>
          </div>

          {/* Article Link */}
          {quiz.articleUrl && (
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl text-white">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  원문 아티클
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  아래 아티클을 먼저 읽고 퀴즈에 도전해보세요!
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleOpenArticle}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold text-lg shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🔗</span>
                    <span>아티클 읽으러 가기</span>
                    <span>↗️</span>
                  </span>
                </button>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">문서 URL:</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-mono break-all">{quiz.articleUrl}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Start Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8 mb-8 border border-emerald-200 dark:border-emerald-800">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">🚀</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                퀴즈에 도전해보세요!
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{quiz.questions.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">문제 수</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.ceil(quiz.questions.length * 1.5)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">예상 시간(분)</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">도전 횟수</div>
                </div>
              </div>
              
              <button
                onClick={handleStartQuiz}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl font-bold text-lg"
              >
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>퀴즈 시작하기</span>
                </span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-4">
              <span className="text-2xl">💡</span>
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">학습 가이드</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span className="text-gray-600 dark:text-gray-300">아티클을 충분히 읽고 이해한 후 퀴즈에 도전하세요</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span className="text-gray-600 dark:text-gray-300">각 문제마다 자세한 정답 해설이 제공됩니다</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span className="text-gray-600 dark:text-gray-300">진도는 자동 저장되어 언제든 다시 도전할 수 있습니다</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span className="text-gray-600 dark:text-gray-300">완료한 퀴즈는 언제든 반복 학습이 가능합니다</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}