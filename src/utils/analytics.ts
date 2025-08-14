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

// 사용자 인증 이벤트들
export const trackUserLoginViewed = () => {
  gtagEvent('user_login_viewed', {
    event_category: 'authentication',
    event_label: 'login_screen'
  });
};

export const trackUserLoginAttempted = (userId: string) => {
  gtagEvent('user_login_attempted', {
    event_category: 'authentication',
    event_label: 'login_attempt',
    user_id: userId
  });
};

export const trackUserLoggedIn = (userId: string, isReturning: boolean) => {
  gtagEvent('user_logged_in', {
    event_category: 'authentication',
    event_label: isReturning ? 'returning_user' : 'new_user',
    user_id: userId
  });
};

export const trackUserLoggedOut = (userId: string) => {
  gtagEvent('user_logged_out', {
    event_category: 'authentication',
    event_label: 'logout',
    user_id: userId
  });
};

// 학습 플로우 이벤트들
export const trackQuizListViewed = (userId?: string, availableQuizCount?: number) => {
  gtagEvent('quiz_list_viewed', {
    event_category: 'engagement',
    event_label: 'quiz_discovery',
    user_id: userId,
    available_quiz_count: availableQuizCount
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

// =============================================================================
// 🧪 실험 전용 이벤트 트래킹 (Experiment Tracking)
// =============================================================================

// 실험 핵심 이벤트 - 간단하고 명확한 이벤트명
export const trackStartQuiz = (userId: string, quizId: number, quizTitle: string) => {
  gtagEvent('start_quiz', {
    event_category: 'experiment',
    user_id: userId,
    quiz_id: quizId,
    quiz_title: quizTitle,
    event_label: 'quiz_start'
  });
};

export const trackFinishQuiz = (userId: string, quizId: number, score: number, totalQuestions: number, timeTaken: number) => {
  gtagEvent('finish_quiz', {
    event_category: 'experiment',
    user_id: userId,
    quiz_id: quizId,
    score: score,
    total_questions: totalQuestions,
    time_taken_seconds: timeTaken,
    accuracy: Math.round((score / totalQuestions) * 100),
    event_label: 'quiz_completion'
  });
};

export const trackViewExplanation = (userId: string, quizId: number, questionId: number, isWrongAnswer: boolean) => {
  gtagEvent('view_explanation', {
    event_category: 'experiment',
    user_id: userId,
    quiz_id: quizId,
    question_id: questionId,
    is_wrong_answer: isWrongAnswer,
    event_label: 'explanation_viewed'
  });
};

export const trackCtaClick = (userId: string, quizId: number, ctaType: 'retry' | 'more_quiz' | 'review_wrong' | 'back_to_list', score: number) => {
  gtagEvent('cta_click', {
    event_category: 'experiment',
    user_id: userId,
    quiz_id: quizId,
    cta_type: ctaType,
    user_score: score,
    event_label: 'post_quiz_action'
  });
};

// 1. 아티클 읽기 행동 추적
export const trackArticleStartReading = (userId: string, quizId: number, articleUrl: string) => {
  gtagEvent('experiment_article_start_reading', {
    event_category: 'experiment_flow',
    user_id: userId,
    quiz_id: quizId,
    article_url: articleUrl,
    event_label: 'article_reading_started',
    timestamp: Date.now()
  });
};

export const trackArticleAbandoned = (userId: string, quizId: number, timeSpent: number) => {
  gtagEvent('experiment_article_abandoned', {
    event_category: 'experiment_flow',
    user_id: userId,
    quiz_id: quizId,
    time_spent_seconds: timeSpent,
    event_label: 'article_reading_abandoned'
  });
};

export const trackArticleCompleted = (userId: string, quizId: number, readingTime: number) => {
  gtagEvent('experiment_article_completed', {
    event_category: 'experiment_flow',
    user_id: userId,
    quiz_id: quizId,
    reading_time_seconds: readingTime,
    event_label: 'article_reading_finished'
  });
};

// 2. 퀴즈 전환율 추적
export const trackQuizTransition = (userId: string, quizId: number, fromArticle: boolean) => {
  gtagEvent('experiment_quiz_transition', {
    event_category: 'experiment_flow',
    user_id: userId,
    quiz_id: quizId,
    from_article: fromArticle,
    event_label: 'article_to_quiz_conversion'
  });
};

// 3. 실험 핵심 지표: CTA 클릭 추적
export const trackExperimentCTA = (userId: string, quizId: number, ctaType: 'review_wrong' | 'more_quiz', score: number, accuracy: number) => {
  gtagEvent('experiment_cta_clicked', {
    event_category: 'experiment_conversion',
    user_id: userId,
    quiz_id: quizId,
    cta_type: ctaType,
    user_score: score,
    user_accuracy: accuracy,
    event_label: 'post_quiz_action'
  });
};