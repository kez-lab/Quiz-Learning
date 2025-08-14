'use client';

import { Quiz, Question } from '@/types/quiz';
import { gtagEvent } from '@/utils/analytics';
import { trackCtaClick } from '@/utils/analytics';
import { getCurrentUser } from '@/utils/storage';

interface QuizResultProps {
  quiz: Quiz;
  userAnswers: number[];
  score: number;
  timeTaken: number;
  onBack: () => void;
  onRetry?: () => void;
}

interface QuestionResult {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
  questionIndex: number;
}

export default function QuizResult({ 
  quiz, 
  userAnswers, 
  score, 
  timeTaken, 
  onBack, 
  onRetry 
}: QuizResultProps) {
  const totalQuestions = quiz.questions.length;
  const accuracy = Math.round((score / totalQuestions) * 100);
  
  // 문제별 결과 분석
  const questionResults: QuestionResult[] = quiz.questions.map((question, index) => ({
    question,
    userAnswer: userAnswers[index],
    isCorrect: userAnswers[index] === question.correct,
    questionIndex: index
  }));
  
  const wrongAnswers = questionResults.filter(result => !result.isCorrect);
  
  // 성과 메시지 생성
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "완벽한 이해! 🎉", color: "text-emerald-600", bg: "from-emerald-50 to-green-50" };
    if (accuracy >= 80) return { message: "훌륭한 성과! 👏", color: "text-blue-600", bg: "from-blue-50 to-indigo-50" };
    if (accuracy >= 70) return { message: "좋은 시작! 💪", color: "text-purple-600", bg: "from-purple-50 to-pink-50" };
    if (accuracy >= 60) return { message: "더 학습해보세요! 📚", color: "text-orange-600", bg: "from-orange-50 to-yellow-50" };
    return { message: "다시 도전해보세요! 🔄", color: "text-red-600", bg: "from-red-50 to-pink-50" };
  };
  
  const performance = getPerformanceMessage();
  
  // 핵심 학습 내용 요약
  const getLearningPoints = () => {
    const topics = new Set<string>();
    
    // 틀린 문제들의 해설에서 핵심 키워드 추출
    wrongAnswers.forEach(result => {
      const explanation = result.question.explanation;
      // 간단한 키워드 추출 로직 (실제로는 더 정교할 수 있음)
      if (explanation.includes('LifecycleOwner')) topics.add('컴포저블 생명주기 관리');
      if (explanation.includes('코루틴') || explanation.includes('Coroutine')) topics.add('코루틴 동작 원리');
      if (explanation.includes('suspend') || explanation.includes('중단 함수')) topics.add('중단 함수와 CPS');
      if (explanation.includes('Dispatcher')) topics.add('코루틴 디스패처');
      if (explanation.includes('Context') || explanation.includes('컨텍스트')) topics.add('코루틴 컨텍스트');
      if (explanation.includes('Scope')) topics.add('코루틴 스코프');
    });
    
    return Array.from(topics);
  };
  
  const learningPoints = getLearningPoints();

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-6">
        <div className={`bg-gradient-to-r ${performance.bg} dark:from-gray-800 dark:to-gray-700 p-8`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">
                {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              퀴즈 완료!
            </h1>
            <p className={`text-xl font-semibold ${performance.color} dark:text-gray-200`}>
              {performance.message}
            </p>
          </div>
        </div>

        {/* 성과 요약 */}
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {score}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">정답 수</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">정답률</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">소요 시간</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {totalQuestions - score}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">오답 수</div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                const userId = getCurrentUser();
                if (userId) {
                  trackCtaClick(userId, quiz.id, 'back_to_list', score);
                }
                onBack();
              }}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              목록으로 돌아가기
            </button>
            {onRetry && (
              <button
                onClick={() => {
                  const userId = getCurrentUser();
                  if (userId) {
                    trackCtaClick(userId, quiz.id, 'retry', score);
                  }
                  onRetry();
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                다시 도전하기
              </button>
            )}
            
            {/* 실험용 추가 CTA 버튼들 */}
            <button
              onClick={() => {
                const userId = getCurrentUser();
                if (userId) {
                  trackCtaClick(userId, quiz.id, 'review_wrong', score);
                }
                alert('틀린 문제 복습 기능 준비 중입니다! 🚀');
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              틀린 문제 복습하기
            </button>
            
            <button
              onClick={() => {
                const userId = getCurrentUser();
                if (userId) {
                  trackCtaClick(userId, quiz.id, 'more_quiz', score);
                }
                window.open('https://forms.google.com/your-form-link', '_blank');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              문제 더 풀기
            </button>
            
            {quiz.articleUrl && (
              <a
                href={quiz.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  gtagEvent('article_link_opened', {
                    quiz_id: quiz.id,
                    quiz_title: quiz.title,
                    source: 'quiz_result'
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                원문 다시 보기
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 학습 요약 */}
      {learningPoints.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            주요 학습 포인트
          </h2>
          <div className="grid gap-4">
            {learningPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 문제별 상세 결과 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          문제별 상세 결과
        </h2>
        
        <div className="space-y-6">
          {questionResults.map((result, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border-2 ${
                result.isCorrect
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    result.isCorrect
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className={`text-2xl ${result.isCorrect ? '✅' : '❌'}`}></div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.isCorrect
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {result.isCorrect ? '정답' : '오답'}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-lg leading-relaxed">
                {result.question.question}
              </h3>
              
              <div className="space-y-2 mb-4">
                {result.question.options.map((option, optionIndex) => {
                  const isUserAnswer = optionIndex === result.userAnswer;
                  const isCorrectAnswer = optionIndex === result.question.correct;
                  
                  return (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border flex items-center space-x-3 ${
                        isCorrectAnswer
                          ? 'border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30'
                          : isUserAnswer && !result.isCorrect
                          ? 'border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900/30'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCorrectAnswer
                          ? 'bg-emerald-500 text-white'
                          : isUserAnswer && !result.isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span className={`flex-1 ${
                        isCorrectAnswer
                          ? 'text-emerald-800 dark:text-emerald-200 font-medium'
                          : isUserAnswer && !result.isCorrect
                          ? 'text-red-800 dark:text-red-200'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {option}
                      </span>
                      {isCorrectAnswer && (
                        <span className="text-emerald-600 font-bold">✓ 정답</span>
                      )}
                      {isUserAnswer && !result.isCorrect && (
                        <span className="text-red-600 font-bold">✗ 선택</span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* 해설은 틀린 문제만 표시 */}
              {!result.isCorrect && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                    <span className="mr-2">💡</span>
                    해설
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                    {result.question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 격려 메시지 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">🌟 학습을 완료했습니다!</h3>
        <p className="text-blue-100 mb-6 text-lg">
          {accuracy >= 80 
            ? '뛰어난 이해도를 보여주셨네요! 다른 퀴즈도 도전해보세요.'
            : accuracy >= 60
            ? '좋은 시작입니다! 틀린 부분을 다시 학습하면 더 좋은 결과를 얻을 수 있어요.'
            : '포기하지 마세요! 다시 도전하면 분명 더 좋은 결과가 있을 거예요.'
          }
        </p>
        <div className="text-sm text-blue-200">
          AI와 함께하는 스마트한 학습이 성공의 열쇠입니다 💪
        </div>
      </div>
    </div>
  );
}