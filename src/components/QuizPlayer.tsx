'use client';

import { useState, useEffect } from 'react';
import { Quiz, QuizState } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';
import { saveProgress } from '@/utils/storage';
import { 
  trackQuestionAnswered, 
  trackQuizCompleted, 
  trackQuizAbandoned, 
  trackExplanationViewed,
  trackStartQuiz,
  trackFinishQuiz,
  trackViewExplanation
} from '@/utils/analytics';
import { getCurrentUser } from '@/utils/storage';

interface QuizPlayerProps {
  quizId: number;
  onComplete: (userAnswers: number[], score: number, timeTaken: number) => void;
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
    
    // 퀴즈 시작 이벤트 트래킹
    if (foundQuiz) {
      const userId = getCurrentUser();
      if (userId) {
        trackStartQuiz(userId, quizId, foundQuiz.title);
      }
    }
  }, [quizId]);

  // 해설이 표시될 때 이벤트 추적
  useEffect(() => {
    if (quizState.showExplanation && quiz) {
      const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
      trackExplanationViewed(quizId, currentQuestion.id);
      
      // 실험용 view_explanation 이벤트
      const userId = getCurrentUser();
      const isWrong = quizState.selectedAnswer !== currentQuestion.correct;
      if (userId) {
        trackViewExplanation(userId, quizId, currentQuestion.id, isWrong);
      }
    }
  }, [quizState.showExplanation, quizState.currentQuestionIndex, quizId, quiz, quizState.selectedAnswer]);

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
      const finalUserAnswers = quizState.userAnswers; // 이미 handleSubmitAnswer에서 추가됨
      const finalScore = quizState.score; // 이미 handleSubmitAnswer에서 계산됨
      
      const progress = {
        quizId: quizId,
        completedQuestions: Array.from({ length: quiz!.questions.length }, (_, i) => i),
        score: finalScore,
        completedAt: new Date(),
      };
      
      // 이벤트 트래킹
      trackQuizCompleted(quizId, finalScore, quiz!.questions.length, completionTime);
      
      // 실험용 finish_quiz 이벤트
      const userId = getCurrentUser();
      if (userId) {
        trackFinishQuiz(userId, quizId, finalScore, quiz!.questions.length, completionTime);
      }
      
      saveProgress(progress);
      onComplete(finalUserAnswers, finalScore, completionTime);
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


  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                trackQuizAbandoned(quizId, quizState.currentQuestionIndex);
                onBack();
              }}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors font-medium"
            >
              <span>←</span>
              <span>나가기</span>
            </button>
            <div className="text-white">
              <div className="text-sm opacity-80">진행률</div>
              <div className="text-lg font-bold">
                {quizState.currentQuestionIndex + 1} / {quiz.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{
                width: `${((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
              }}
            ></div>
          </div>
          
          {/* Quiz Title */}
          <div className="mt-4">
            <h1 className="text-white font-bold text-lg opacity-90">{quiz.title}</h1>
          </div>
        </div>


        {/* Question Section */}
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                Q{quizState.currentQuestionIndex + 1}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentQuestion.type === 'multiple_choice' ? '객관식' : 'OX 문제'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = quizState.selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const isWrong = quizState.showExplanation && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-5 text-left rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 font-medium text-lg relative overflow-hidden group ${
                    quizState.showExplanation
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 shadow-lg'
                        : isWrong
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      : isSelected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-25 dark:hover:bg-blue-950/20'
                  }`}
                  disabled={quizState.showExplanation}
                >
                  {/* Option Letter */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                      quizState.showExplanation
                        ? isCorrect
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isWrong
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                        : isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 group-hover:border-blue-400 group-hover:text-blue-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {quizState.showExplanation && isCorrect && (
                      <div className="text-emerald-500 font-bold text-xl">✓</div>
                    )}
                    {quizState.showExplanation && isWrong && (
                      <div className="text-red-500 font-bold text-xl">✗</div>
                    )}
                  </div>
                  
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 transition-all duration-300 rounded-xl"></div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {quizState.showExplanation && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl animate-in slide-in-from-top-4 duration-500 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3 text-lg">해설</h3>
                  <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-base">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!quizState.showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={quizState.selectedAnswer === null}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl font-bold text-lg"
              >
                <span className="flex items-center space-x-2">
                  <span>📝</span>
                  <span>답안 제출</span>
                </span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl animate-in fade-in duration-500 font-bold text-lg"
              >
                <span className="flex items-center space-x-2">
                  {isLastQuestion ? (
                    <>
                      <span>🎉</span>
                      <span>완료</span>
                    </>
                  ) : (
                    <>
                      <span>➡️</span>
                      <span>다음 문제</span>
                    </>
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Score Display */}
          {quizState.showExplanation && (
            <div className="mt-6 flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {quizState.score}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">정답</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {quizState.userAnswers.length - quizState.score}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">오답</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {quizState.userAnswers.length > 0 ? Math.round((quizState.score / quizState.userAnswers.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">정답률</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}