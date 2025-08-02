'use client';

import { useState, useEffect } from 'react';
import { Quiz, QuizState } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';
import { saveProgress } from '@/utils/storage';
import { 
  trackQuestionAnswered, 
  trackQuizCompleted, 
  trackQuizAbandoned, 
  trackExplanationViewed 
} from '@/utils/analytics';

interface QuizPlayerProps {
  quizId: number;
  onComplete: () => void;
  onBack: () => void;
}

export default function QuizPlayer({ quizId, onComplete, onBack }: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuizId: quizId,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    showExplanation: false,
    userAnswers: [],
    score: 0,
  });
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizStartTime] = useState(Date.now());

  useEffect(() => {
    const quizzes = quizzesData as Quiz[];
    const foundQuiz = quizzes.find(q => q.id === quizId);
    setQuiz(foundQuiz || null);
  }, [quizId]);

  if (!quiz) {
    return <div>퀴즈를 찾을 수 없습니다.</div>;
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
    }));
  };

  const handleSubmitAnswer = () => {
    if (quizState.selectedAnswer === null) return;

    const isCorrect = quizState.selectedAnswer === currentQuestion.correct;
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    const newUserAnswers = [...quizState.userAnswers, quizState.selectedAnswer];
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    // 이벤트 트래킹
    trackQuestionAnswered(quizId, currentQuestion.id, isCorrect, timeTaken);
    trackExplanationViewed(quizId, currentQuestion.id);

    setQuizState(prev => ({
      ...prev,
      showExplanation: true,
      score: newScore,
      userAnswers: newUserAnswers,
    }));
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // 퀴즈 완료 시 진도 저장
      const completionTime = Math.floor((Date.now() - quizStartTime) / 1000);
      const progress = {
        quizId: quizId,
        completedQuestions: Array.from({ length: quiz!.questions.length }, (_, i) => i),
        score: quizState.score,
        completedAt: new Date(),
      };
      
      // 이벤트 트래킹
      trackQuizCompleted(quizId, quizState.score, quiz!.questions.length, completionTime);
      
      saveProgress(progress);
      onComplete();
      return;
    }

    // 다음 문제로 이동 시 시간 리셋
    setQuestionStartTime(Date.now());
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      selectedAnswer: null,
      showExplanation: false,
    }));
  };

  const getOptionButtonClass = (optionIndex: number) => {
    let baseClass = 'w-full p-4 text-left border-2 rounded-lg transition-colors font-medium ';
    
    if (!quizState.showExplanation) {
      if (quizState.selectedAnswer === optionIndex) {
        baseClass += 'border-blue-500 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-100';
      } else {
        baseClass += 'border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-800';
      }
    } else {
      if (optionIndex === currentQuestion.correct) {
        baseClass += 'border-green-500 bg-green-100 text-green-900 dark:border-green-400 dark:bg-green-900/30 dark:text-green-100';
      } else if (quizState.selectedAnswer === optionIndex && optionIndex !== currentQuestion.correct) {
        baseClass += 'border-red-500 bg-red-100 text-red-900 dark:border-red-400 dark:bg-red-900/30 dark:text-red-100';
      } else {
        baseClass += 'border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400';
      }
    }
    
    return baseClass;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              trackQuizAbandoned(quizId, quizState.currentQuestionIndex);
              onBack();
            }}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
          >
            ← 뒤로가기
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {quizState.currentQuestionIndex + 1} / {quiz.questions.length}
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
            }}
          ></div>
        </div>

        {/* 질문 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 선택지 */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`${getOptionButtonClass(index)} transform transition-all duration-200 hover:scale-102 active:scale-98`}
              disabled={quizState.showExplanation}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 설명 */}
        {quizState.showExplanation && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-in slide-in-from-top-2 duration-300">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 설명</h3>
            <p className="text-blue-700 dark:text-blue-300">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex justify-center">
          {!quizState.showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={quizState.selectedAnswer === null}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              답안 제출
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg animate-in fade-in duration-300"
            >
              {isLastQuestion ? '🎉 완료' : '다음 문제 →'}
            </button>
          )}
        </div>

        {/* 점수 표시 */}
        {quizState.showExplanation && (
          <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
            현재 점수: {quizState.score} / {quizState.currentQuestionIndex + 1}
          </div>
        )}
      </div>
    </div>
  );
}