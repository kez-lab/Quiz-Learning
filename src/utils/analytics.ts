// Google Analytics 4 이벤트 전송 유틸리티

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const gtagEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    
    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 Event:', eventName, parameters);
    }
  }
};

// 학습 플로우 이벤트들
export const trackQuizListViewed = () => {
  gtagEvent('quiz_list_viewed', {
    event_category: 'engagement',
    event_label: 'quiz_discovery'
  });
};

export const trackArticleCardClicked = (quizId: number, quizTitle: string) => {
  gtagEvent('article_card_clicked', {
    event_category: 'engagement',
    quiz_id: quizId,
    quiz_title: quizTitle,
    event_label: 'quiz_selection'
  });
};

export const trackArticleLinkOpened = (quizId: number, articleUrl: string) => {
  gtagEvent('article_link_opened', {
    event_category: 'engagement',
    quiz_id: quizId,
    article_url: articleUrl,
    event_label: 'external_article_view'
  });
};

export const trackArticleReadTime = (quizId: number, timeSpent: number) => {
  gtagEvent('article_read_time', {
    event_category: 'engagement',
    quiz_id: quizId,
    time_spent_seconds: timeSpent,
    event_label: 'article_engagement'
  });
};

export const trackQuizStarted = (quizId: number, quizTitle: string) => {
  gtagEvent('quiz_started', {
    event_category: 'learning',
    quiz_id: quizId,
    quiz_title: quizTitle,
    event_label: 'quiz_begin'
  });
};

export const trackQuestionAnswered = (
  quizId: number, 
  questionId: number, 
  isCorrect: boolean, 
  timeTaken: number
) => {
  gtagEvent('question_answered', {
    event_category: 'learning',
    quiz_id: quizId,
    question_id: questionId,
    is_correct: isCorrect,
    time_taken_seconds: timeTaken,
    event_label: 'question_response'
  });
};

export const trackQuizCompleted = (
  quizId: number, 
  score: number, 
  totalQuestions: number,
  completionTime: number
) => {
  gtagEvent('quiz_completed', {
    event_category: 'learning',
    quiz_id: quizId,
    score: score,
    total_questions: totalQuestions,
    completion_time_seconds: completionTime,
    success_rate: (score / totalQuestions) * 100,
    event_label: 'quiz_finish'
  });
};

export const trackQuizAbandoned = (quizId: number, questionIndex: number) => {
  gtagEvent('quiz_abandoned', {
    event_category: 'learning',
    quiz_id: quizId,
    questions_completed: questionIndex,
    event_label: 'quiz_dropout'
  });
};

export const trackExplanationViewed = (quizId: number, questionId: number) => {
  gtagEvent('explanation_viewed', {
    event_category: 'learning',
    quiz_id: quizId,
    question_id: questionId,
    event_label: 'explanation_engagement'
  });
};

export const trackRetryQuiz = (quizId: number, attemptNumber: number) => {
  gtagEvent('retry_quiz', {
    event_category: 'engagement',
    quiz_id: quizId,
    attempt_number: attemptNumber,
    event_label: 'quiz_retry'
  });
};