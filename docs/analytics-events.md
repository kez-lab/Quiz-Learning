# 📊 Quiz Learning 분석 이벤트 정의서

> 사용자 행동 분석을 위한 Google Analytics 4 이벤트 목록 및 매개변수 정의

## 🎯 이벤트 카테고리

### 📚 학습 플로우 분석 (Engagement)
사용자의 탐색 및 참여 행동을 추적하는 이벤트들

### 🧠 학습 성과 측정 (Learning)
실제 학습 활동과 성과를 측정하는 이벤트들

---

## 📋 이벤트 상세 정의

### 1. 사용자 여정 분석

#### `quiz_list_viewed`
**설명**: 홈페이지 방문 시 퀴즈 목록 조회
**카테고리**: engagement
**트리거**: QuizList 컴포넌트 마운트 시
**매개변수**: 
- `event_category`: "engagement"
- `event_label`: "quiz_discovery"

**활용**: 홈페이지 방문율, 퀴즈 탐색 시작점 분석

---

#### `article_card_clicked`
**설명**: 특정 퀴즈 카드 클릭
**카테고리**: engagement
**트리거**: 퀴즈 카드 클릭 시
**매개변수**:
- `event_category`: "engagement"
- `quiz_id`: number (퀴즈 고유 ID)
- `quiz_title`: string (퀴즈 제목)
- `event_label`: "quiz_selection"

**활용**: 인기 퀴즈 순위, 사용자 선호도 분석

---

#### `article_link_opened`
**설명**: 외부 아티클 링크 클릭
**카테고리**: engagement
**트리거**: 아티클 URL 클릭 시
**매개변수**:
- `event_category`: "engagement"
- `quiz_id`: number
- `article_url`: string (외부 아티클 URL)
- `event_label`: "external_article_view"

**활용**: 외부 링크 클릭률, 아티클 참조 패턴 분석

---

#### `article_read_time`
**설명**: 아티클 페이지 체류시간 측정
**카테고리**: engagement
**트리거**: 아티클 뷰어 언마운트 시
**매개변수**:
- `event_category`: "engagement"
- `quiz_id`: number
- `time_spent_seconds`: number (초 단위 체류시간)
- `event_label`: "article_engagement"

**활용**: 아티클 몰입도, 콘텐츠 품질 평가

---

### 2. 학습 성과 측정

#### `quiz_started`
**설명**: 퀴즈 시작
**카테고리**: learning
**트리거**: QuizPlayer 컴포넌트 마운트 시
**매개변수**:
- `event_category`: "learning"
- `quiz_id`: number
- `quiz_title`: string
- `event_label`: "quiz_begin"

**활용**: 퀴즈 시작율, 전환율 분석

---

#### `question_answered`
**설명**: 개별 문제 답변 제출
**카테고리**: learning
**트리거**: 답안 제출 버튼 클릭 시
**매개변수**:
- `event_category`: "learning"
- `quiz_id`: number
- `question_id`: number (문제 고유 ID)
- `is_correct`: boolean (정답 여부)
- `time_taken_seconds`: number (문제 풀이 소요시간)
- `event_label`: "question_response"

**활용**: 문제별 정답률, 난이도 분석, 풀이시간 패턴

---

#### `explanation_viewed`
**설명**: 문제 해설 확인
**카테고리**: learning
**트리거**: 해설이 화면에 표시될 때 (useEffect)
**매개변수**:
- `event_category`: "learning"
- `quiz_id`: number
- `question_id`: number
- `event_label`: "explanation_engagement"

**활용**: 해설 확인율, 학습 참여도 분석

---

#### `quiz_completed`
**설명**: 퀴즈 완료
**카테고리**: learning
**트리거**: 마지막 문제 완료 시
**매개변수**:
- `event_category`: "learning"
- `quiz_id`: number
- `score`: number (맞힌 문제 수)
- `total_questions`: number (전체 문제 수)
- `completion_time_seconds`: number (총 소요시간)
- `success_rate`: number (정답률 백분율)
- `event_label`: "quiz_finish"

**활용**: 완주율, 평균 점수, 학습 성과 분석

---

#### `quiz_abandoned`
**설명**: 퀴즈 중도 포기
**카테고리**: learning
**트리거**: 뒤로가기 버튼 클릭 시
**매개변수**:
- `event_category`: "learning"
- `quiz_id`: number
- `questions_completed`: number (완료한 문제 수)
- `event_label`: "quiz_dropout"

**활용**: 이탈 지점 분석, 난이도 조정 근거

---

#### `retry_quiz`
**설명**: 퀴즈 재도전
**카테고리**: engagement
**트리거**: 완료된 퀴즈를 다시 시작할 때
**매개변수**:
- `event_category`: "engagement"
- `quiz_id`: number
- `attempt_number`: number (도전 횟수)
- `event_label`: "quiz_retry"

**활용**: 재도전율, 학습 동기 분석

---

## 🛠️ 기술적 구현

### 이벤트 전송 함수
```typescript
// 기본 이벤트 전송 함수
export const gtagEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}
```

### 개발 환경 디버깅
```typescript
// 개발 환경에서만 콘솔 로그 출력
if (process.env.NODE_ENV === 'development') {
  console.log('GA4 Event:', eventName, parameters);
}
```

---

## 📈 분석 활용 방안

### 1. 사용자 여정 분석
- `quiz_list_viewed` → `article_card_clicked` → `quiz_started` → `quiz_completed`
- 각 단계별 전환율 및 이탈률 측정

### 2. 콘텐츠 성과 분석
- 퀴즈별 인기도 (`article_card_clicked` 빈도)
- 완주율 (`quiz_completed` / `quiz_started`)
- 평균 점수 및 정답률 트렌드

### 3. 학습 행동 패턴
- 해설 확인율 (`explanation_viewed` / `question_answered`)
- 재도전 패턴 (`retry_quiz` 분석)
- 문제별 소요시간 및 난이도 분석

### 4. UX 최적화 지표
- 이탈 지점 분석 (`quiz_abandoned`)
- 아티클 체류시간 (`article_read_time`)
- 외부 링크 클릭률 (`article_link_opened`)

---

## 🔄 이벤트 확장 가이드

새로운 이벤트 추가 시 고려사항:
1. **명확한 목적**: 어떤 비즈니스 질문에 답하기 위한 이벤트인가?
2. **적절한 카테고리**: engagement vs learning 분류
3. **필수 매개변수**: quiz_id, event_category, event_label 포함
4. **트리거 타이밍**: 정확한 사용자 행동 시점에 발생
5. **데이터 타입**: number, string, boolean 명확히 정의

---

## 📝 변경 이력

- **2025-08-02**: 초기 이벤트 정의 및 GA4 직접 연동 구현
- **2025-08-02**: 해설 보기 이벤트 트리거 타이밍 수정 (답변 시점 → 실제 표시 시점)
- **2025-08-02**: GTM에서 직접 GA4로 전환하여 성능 최적화