// Google Tag Manager 이벤트 전송 유틸리티

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const gtmEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
    console.log('GTM Event:', eventName, parameters);
  }
};

// 학습 플로우 이벤트들
export const trackQuizListViewed = () => {
  gtmEvent('quiz_list_viewed', {
    event_category: 'engagement',
    event_label: 'quiz_discovery'
  });
};

export const trackArticleCardClicked = (quizId: number, quizTitle: string) => {
  gtmEvent('article_card_clicked', {
    event_category: 'engagement',
    quiz_id: quizId,
    quiz_title: quizTitle,
    event_label: 'quiz_selection'
  });
};

export const trackArticleLinkOpened = (quizId: number, articleUrl: string) => {
  gtmEvent('article_link_opened', {
    event_category: 'engagement',
    quiz_id: quizId,
    article_url: articleUrl,
    event_label: 'external_article_view'
  });
};

export const trackArticleReadTime = (quizId: number, timeSpent: number) => {
  gtmEvent('article_read_time', {
    event_category: 'engagement',
    quiz_id: quizId,
    time_spent_seconds: timeSpent,
    event_label: 'article_engagement'
  });
};

export const trackQuizStarted = (quizId: number, quizTitle: string) => {
  gtmEvent('quiz_started', {
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
  gtmEvent('question_answered', {
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
  gtmEvent('quiz_completed', {
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
  gtmEvent('quiz_abandoned', {
    event_category: 'learning',
    quiz_id: quizId,
    questions_completed: questionIndex,
    event_label: 'quiz_dropout'
  });
};

export const trackExplanationViewed = (quizId: number, questionId: number) => {
  gtmEvent('explanation_viewed', {
    event_category: 'learning',
    quiz_id: quizId,
    question_id: questionId,
    event_label: 'explanation_engagement'
  });
};

export const trackRetryQuiz = (quizId: number, attemptNumber: number) => {
  gtmEvent('retry_quiz', {
    event_category: 'engagement',
    quiz_id: quizId,
    attempt_number: attemptNumber,
    event_label: 'quiz_retry'
  });
};