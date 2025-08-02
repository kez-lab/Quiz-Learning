'use client';

import { Quiz } from '@/types/quiz';

interface ArticleViewerProps {
  quiz: Quiz;
  onStartQuiz: () => void;
  onBack: () => void;
}

export default function ArticleViewer({ quiz, onStartQuiz, onBack }: ArticleViewerProps) {
  const handleOpenArticle = () => {
    if (quiz.articleUrl) {
      window.open(quiz.articleUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 flex items-center transition-colors"
          >
            ← 뒤로가기
          </button>
          <span className="text-sm text-gray-500">
            {quiz.questions.length}문제 준비됨
          </span>
        </div>

        {/* 제목과 설명 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📖 {quiz.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {quiz.description}
          </p>
          
          {/* 난이도 표시 */}
          <div className="flex justify-center mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quiz.difficulty === 'beginner' ? '초급' :
               quiz.difficulty === 'intermediate' ? '중급' : '고급'}
            </span>
          </div>
        </div>

        {/* 학습 플로우 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🎯 학습 플로우
          </h2>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="text-gray-700">아티클 읽기</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-gray-700">퀴즈 도전</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-gray-700">학습 완료</span>
            </div>
          </div>
        </div>

        {/* 아티클 링크 */}
        {quiz.articleUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📝 원문 아티클
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              아래 아티클을 먼저 읽고 퀴즈에 도전해보세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenArticle}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                🔗 아티클 읽으러 가기
              </button>
              <div className="flex-1 text-xs text-gray-500 bg-white p-3 rounded-lg border overflow-hidden">
                <div className="truncate">{quiz.articleUrl}</div>
              </div>
            </div>
          </div>
        )}

        {/* 퀴즈 시작 */}
        <div className="text-center">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              아티클을 읽었다면 퀴즈에 도전해보세요!
            </p>
            <p className="text-sm text-gray-500">
              총 {quiz.questions.length}문제 | 예상 소요시간: {Math.ceil(quiz.questions.length * 1.5)}분
            </p>
          </div>
          
          <button
            onClick={onStartQuiz}
            className="bg-green-600 text-white py-4 px-8 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg font-semibold text-lg"
          >
            🚀 퀴즈 시작하기
          </button>
        </div>

        {/* 도움말 */}
        <div className="mt-8 text-center">
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 transition-colors">
              💡 도움말
            </summary>
            <div className="mt-3 text-left bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li>• 아티클을 충분히 읽고 이해한 후 퀴즈에 도전하세요</li>
                <li>• 각 문제마다 정답 해설이 제공됩니다</li>
                <li>• 진도는 자동으로 저장되어 나중에 다시 도전할 수 있습니다</li>
                <li>• 모든 문제를 완료하면 다음 아티클이 해제됩니다</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}