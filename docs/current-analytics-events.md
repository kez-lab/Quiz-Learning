# 현재 구현된 Analytics 이벤트 목록

## 📋 실제 구현되어 있는 이벤트들

현재 Quiz Learning 프로젝트에서 **실제로 코드에 구현되어 있고** 호출되고 있는 이벤트들만 정리한 목록입니다.

## 🔗 실제 사용되는 이벤트

### **1. 인증 관련 이벤트**
- `user_logged_in` - 사용자 로그인 (page.tsx:77)
- `user_logged_out` - 사용자 로그아웃 (page.tsx:87)

### **2. 학습 플로우 이벤트**
- `quiz_list_viewed` - 퀴즈 목록 조회 (QuizList.tsx:20, page.tsx:78)
- `article_card_clicked` - 퀴즈 카드 클릭 (QuizList.tsx:46)
- `article_read_time` - 아티클 읽기 시간 (ArticleViewer.tsx:22)
- `article_link_opened` - 외부 아티클 링크 열기 (ArticleViewer.tsx:34)
- `quiz_started` - 퀴즈 시작 (ArticleViewer.tsx:40)

### **3. 퀴즈 플레이 관련 이벤트**
- `question_answered` - 문제 답변 (QuizPlayer.tsx:72)
- `explanation_viewed` - 해설 보기 (QuizPlayer.tsx:43)
- `quiz_completed` - 퀴즈 완료 (QuizPlayer.tsx:97)
- `quiz_abandoned` - 퀴즈 중도 포기 (QuizPlayer.tsx:120)

### **4. 실험용 핵심 이벤트** 🧪
- `start_quiz` - 퀴즈 시작 (QuizPlayer.tsx:47)
- `finish_quiz` - 퀴즈 완료 (QuizPlayer.tsx:115) 
- `view_explanation` - 해설 버튼 클릭 (QuizPlayer.tsx:259)
- `cta_click` - 결과 화면 CTA 클릭 (QuizResult.tsx:132, 145, 160, 173)

## 📊 이벤트별 상세 정보

### `user_logged_in`
**위치**: `src/app/page.tsx:77`  
**파라미터**:
```typescript
{
  event_category: 'authentication',
  event_label: isReturning ? 'returning_user' : 'new_user',
  user_id: userId
}
```

### `quiz_list_viewed`
**위치**: `src/components/QuizList.tsx:20`, `src/app/page.tsx:78`  
**파라미터**:
```typescript
{
  event_category: 'engagement',
  event_label: 'quiz_discovery',
  user_id?: userId,
  available_quiz_count?: number
}
```

### `article_card_clicked`
**위치**: `src/components/QuizList.tsx:46`  
**파라미터**:
```typescript
{
  event_category: 'engagement',
  quiz_id: number,
  quiz_title: string,
  event_label: 'quiz_selection'
}
```

### `article_read_time`
**위치**: `src/components/ArticleViewer.tsx:22`  
**파라미터**:
```typescript
{
  event_category: 'engagement',
  quiz_id: number,
  time_spent_seconds: number,
  event_label: 'article_engagement'
}
```

### `article_link_opened`
**위치**: `src/components/ArticleViewer.tsx:34`  
**파라미터**:
```typescript
{
  event_category: 'engagement',
  quiz_id: number,
  article_url: string,
  event_label: 'external_article_view'
}
```

### `quiz_started`
**위치**: `src/components/ArticleViewer.tsx:40`  
**파라미터**:
```typescript
{
  event_category: 'learning',
  quiz_id: number,
  quiz_title: string,
  event_label: 'quiz_begin'
}
```

### `question_answered`
**위치**: `src/components/QuizPlayer.tsx:72`  
**파라미터**:
```typescript
{
  event_category: 'learning',
  quiz_id: number,
  question_id: number,
  is_correct: boolean,
  time_taken_seconds: number,
  event_label: 'question_response'
}
```

### `explanation_viewed`
**위치**: `src/components/QuizPlayer.tsx:43`  
**파라미터**:
```typescript
{
  event_category: 'learning',
  quiz_id: number,
  question_id: number,
  event_label: 'explanation_engagement'
}
```

### `quiz_completed`
**위치**: `src/components/QuizPlayer.tsx:97`  
**파라미터**:
```typescript
{
  event_category: 'learning',
  quiz_id: number,
  score: number,
  total_questions: number,
  completion_time_seconds: number,
  success_rate: number,
  event_label: 'quiz_finish'
}
```

### `quiz_abandoned`
**위치**: `src/components/QuizPlayer.tsx:120`  
**파라미터**:
```typescript
{
  event_category: 'learning',
  quiz_id: number,
  questions_completed: number,
  event_label: 'quiz_dropout'
}
```

## 🧪 실험용 이벤트 상세 정보

### `start_quiz`
**위치**: `src/components/QuizPlayer.tsx:47`  
**파라미터**:
```typescript
{
  event_category: 'experiment',
  user_id: string,
  quiz_id: number,
  quiz_title: string,
  event_label: 'quiz_start'
}
```

### `finish_quiz`
**위치**: `src/components/QuizPlayer.tsx:115`  
**파라미터**:
```typescript
{
  event_category: 'experiment',
  user_id: string,
  quiz_id: number,
  score: number,
  total_questions: number,
  time_taken_seconds: number,
  accuracy: number,
  event_label: 'quiz_completion'
}
```

### `view_explanation`
**위치**: `src/components/QuizPlayer.tsx:259`  
**파라미터**:
```typescript
{
  event_category: 'experiment',
  user_id: string,
  quiz_id: number,
  question_id: number,
  is_wrong_answer: boolean,
  event_label: 'explanation_viewed'
}
```

### `cta_click`
**위치**: `src/components/QuizResult.tsx (여러 위치)`  
**파라미터**:
```typescript
{
  event_category: 'experiment',
  user_id: string,
  quiz_id: number,
  cta_type: 'retry' | 'more_quiz' | 'review_wrong' | 'back_to_list',
  user_score: number,
  event_label: 'post_quiz_action'
}
```

## ⚠️ 주의사항

- 위 이벤트들은 **실제로 코드에서 호출**되고 있는 이벤트들입니다
- `analytics.ts`에 정의되어 있지만 실제로 사용되지 않는 이벤트들은 제외했습니다
- 각 이벤트는 GA4로 전송되며, 개발 환경에서는 콘솔에도 로그가 출력됩니다

## 🎯 실험 핵심 지표 매핑

| 실험 목표 | 측정 이벤트 | 계산 방법 |
|-----------|-------------|----------|
| **퀴즈 완주율** | `start_quiz` vs `finish_quiz` | finish_quiz / start_quiz |
| **해설 조회율** | `view_explanation` / `finish_quiz` | 완료자 중 해설을 본 비율 |
| **CTA 클릭률** | `cta_click` / `finish_quiz` | 완료 후 추가 행동 비율 |
| **CTA 유형별 분석** | `cta_click.cta_type` | 어떤 버튼이 가장 클릭되는지 |

## 🚀 실험 준비 완료 ✅

실험에 필요한 모든 핵심 이벤트가 구현되었습니다:

1. ✅ **퀴즈 시작/완료 추적** - 완주율 측정 가능
2. ✅ **해설 조회 추적** - 학습 참여도 측정 가능  
3. ✅ **CTA 클릭 추적** - 재사용 의향 행동 측정 가능
4. ✅ **UI 개선** - "해설 보기" 버튼으로 명확한 의도 파악 가능

---

*마지막 업데이트: 2025-08-14*