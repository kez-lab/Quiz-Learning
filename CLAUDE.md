# Quiz Learning - AI 개발 가이드

## 📋 프로젝트 개요

Quiz Learning은 Android Compose와 관련된 기술 아티클 기반의 퀴즈 학습 플랫폼입니다. 사용자는 외부 기술 아티클을 읽고 관련 퀴즈를 풀며 학습할 수 있습니다.

### 🛠 기술 스택
- **Frontend**: Next.js 15.4.5, React 19, TypeScript
- **Styling**: Tailwind CSS 3.4.17
- **Analytics**: Google Analytics 4 (직접 연동)
- **Package Manager**: Yarn 4.9.2

## 📁 프로젝트 구조

```
quiz-learning/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # 홈페이지 (퀴즈 목록)
│   │   ├── layout.tsx      # 레이아웃 및 GA 설정
│   │   └── globals.css     # 전역 스타일
│   ├── components/         # React 컴포넌트
│   │   ├── QuizList.tsx    # 퀴즈 목록 컴포넌트
│   │   ├── QuizPlayer.tsx  # 퀴즈 플레이어
│   │   ├── ArticleViewer.tsx # 외부 아티클 뷰어
│   │   └── ThemeToggle.tsx # 다크모드 토글
│   ├── data/
│   │   └── quizzes.json    # 퀴즈 데이터
│   ├── types/
│   │   └── quiz.ts         # TypeScript 타입 정의
│   └── utils/
│       ├── analytics.ts    # GA4 분석 함수
│       └── storage.ts      # 로컬스토리지 유틸
├── docs/
│   └── analytics-events.md # GA4 이벤트 정의서
└── public/                 # 정적 파일
```

## 📊 데이터 구조

### Quiz 타입 정의 (src/types/quiz.ts)
```typescript
interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  articleUrl?: string;      // 외부 아티클 URL
  questions: Question[];
}

interface Question {
  id: number;
  type: 'multiple_choice' | 'true_false';
  question: string;
  options: string[];
  correct: number;          // 정답 인덱스
  explanation: string;
}
```

## 🚀 개발 명령어

```bash
# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 린팅 검사
yarn lint

# 프로덕션 서버 시작
yarn start
```

## 📈 분석 및 이벤트 추적

### GA4 이벤트 시스템
- **위치**: `src/utils/analytics.ts`
- **설정**: Google Analytics 4 직접 연동 (GTM 제거)
- **상세 문서**: `docs/analytics-events.md`

### 주요 추적 이벤트
- `quiz_list_viewed`: 홈페이지 방문
- `article_card_clicked`: 퀴즈 선택
- `quiz_started`: 퀴즈 시작
- `question_answered`: 문제 답변
- `quiz_completed`: 퀴즈 완료
- `article_link_opened`: 외부 아티클 링크 클릭

## 💾 로컬 스토리지 관리

### 사용자 진행상황 저장 (src/utils/storage.ts)
```typescript
interface UserProgress {
  quizId: number;
  completedQuestions: number[];
  score: number;
  completedAt?: Date;
}
```

## 🎨 UI/UX 특징

### 다크모드 지원
- **컴포넌트**: `src/components/ThemeToggle.tsx`
- **설정**: Tailwind CSS 다크모드 클래스 사용

### 반응형 디자인
- **모바일 우선**: Tailwind CSS 반응형 유틸리티 사용
- **주요 브레이크포인트**: sm, md, lg, xl

## 🔧 개발 시 주의사항

### 새로운 퀴즈 추가
1. `src/data/quizzes.json`에 퀴즈 데이터 추가
2. `quiz.ts` 타입 정의 준수
3. 필요시 analytics 이벤트 추가

### 컴포넌트 개발 가이드라인
- **타입 안전성**: TypeScript 엄격 모드 준수
- **성능**: React.memo, useCallback 적절히 활용
- **접근성**: semantic HTML, ARIA 속성 고려
- **분석**: 사용자 행동 추적 이벤트 추가

### 스타일링 규칙
- **Tailwind CSS 우선**: 인라인 클래스 사용
- **커스텀 CSS**: globals.css에 최소한으로 추가
- **일관성**: 기존 컴포넌트 스타일 패턴 따르기

## 📝 코드 컨벤션

### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: QuizPlayer.tsx)
- **유틸리티**: camelCase (예: analytics.ts)
- **타입 파일**: 소문자 + .ts (예: quiz.ts)

### 임포트 순서
```typescript
// 1. React/Next.js
import React from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
// (현재 없음)

// 3. 내부 컴포넌트/유틸
import { Quiz } from '@/types/quiz';
import { gtagEvent } from '@/utils/analytics';
```

## 🐛 디버깅 및 테스팅

### 개발 환경 디버깅
- **Analytics**: 콘솔에서 GA4 이벤트 확인
- **Storage**: 브라우저 개발자도구 → Application → Local Storage
- **API**: Next.js 개발 서버 로그 확인

### 빌드 검증
```bash
# TypeScript 타입 체크
yarn build

# ESLint 규칙 검사
yarn lint
```

## 🚨 보안 고려사항

### 외부 링크 처리
- **iframe 사용**: `ArticleViewer.tsx`에서 sandbox 속성 적용
- **CSP**: 필요시 Content Security Policy 설정 고려

### 분석 데이터
- **개인정보**: GA4에서 개인식별정보 제외
- **GDPR**: 필요시 쿠키 동의 배너 추가 고려

## 📅 최근 주요 변경사항

- **2025-08-02**: GTM에서 GA4 직접 연동으로 전환
- **2025-08-02**: 해설 보기 이벤트 트리거 최적화
- **2025-08-02**: analytics-events.md 문서 작성

## 🎯 향후 개발 방향

### 우선순위 높음
- [ ] 사용자 계정 시스템 (선택사항)
- [ ] 퀴즈 난이도별 필터링
- [ ] 학습 진도 시각화

### 우선순위 중간
- [ ] 퀴즈 공유 기능
- [ ] 오답노트 기능
- [ ] 퀴즈 카테고리 확장

### 기술적 개선
- [ ] 퀴즈 데이터 CMS 연동
- [ ] PWA 기능 추가
- [ ] 성능 최적화 (이미지 최적화, 코드 스플리팅)