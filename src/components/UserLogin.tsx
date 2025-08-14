'use client';

import { useState, useEffect } from 'react';
import { gtagEvent } from '@/utils/analytics';

interface UserLoginProps {
  onLogin: (userId: string) => void;
}

export default function UserLogin({ onLogin }: UserLoginProps) {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    gtagEvent('user_login_viewed', {
      page_title: 'User Login',
      page_location: window.location.href
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsLoading(true);
      
      gtagEvent('user_login_attempted', {
        user_id: userId.trim()
      });

      // 간단한 로딩 효과
      setTimeout(() => {
        onLogin(userId.trim());
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 mx-auto mb-4">
              <span className="text-3xl font-bold text-white">Q</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              QuizDev
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              개발자를 위한 학습 플랫폼
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                환영합니다! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                학습을 시작하기 위해 아이디를 입력해주세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  아이디
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!userId.trim() || isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <span>학습 시작하기</span>
                    <span className="text-lg">🚀</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                아이디는 학습 진도를 저장하는 데 사용됩니다
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm">📚</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">실무 중심</p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm">⚡</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">즉시 피드백</p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm">📈</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">진도 추적</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}