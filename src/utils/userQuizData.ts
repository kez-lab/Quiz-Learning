import { Quiz, UserData } from '@/types/quiz';
import quizzesData from '@/data/quizzes.json';

const allQuizzes = quizzesData as Quiz[];

// 사용자별 퀴즈 할당 로직 (JSON 기반)
const getUserQuizzes = (userId: string): number[] => {
  // 사용자 ID와 매칭되는 퀴즈들을 필터링
  const userQuizzes = allQuizzes.filter(quiz => 
    quiz.userId === userId.toLowerCase()
  );

  // 매칭된 퀴즈가 없으면 모든 퀴즈 할당 (임시)
  if (userQuizzes.length === 0) {
    return allQuizzes.map(quiz => quiz.id);
  }

  return userQuizzes.map(quiz => quiz.id);
};

// 사용자 데이터 초기화
export const initializeUserData = (userId: string): UserData => {
  const availableQuizzes = getUserQuizzes(userId);
  
  return {
    userId,
    availableQuizzes,
    progress: [],
    createdAt: new Date(),
    lastLoginAt: new Date()
  };
};

// 사용자의 이용 가능한 퀴즈 목록 가져오기
export const getUserAvailableQuizzes = (userData: UserData): Quiz[] => {
  return allQuizzes.filter(quiz => userData.availableQuizzes.includes(quiz.id));
};

// 사용자별 퀴즈 할당 정보 표시용
export const getQuizAssignmentInfo = (userId: string) => {
  const availableQuizzes = getUserQuizzes(userId);
  const assignedQuizzes = allQuizzes.filter(quiz => availableQuizzes.includes(quiz.id));
  
  return {
    userId,
    totalAvailable: availableQuizzes.length,
    totalPossible: allQuizzes.length,
    assignedTitles: assignedQuizzes.map(quiz => quiz.title),
    assignmentRatio: `${availableQuizzes.length}/${allQuizzes.length}`,
    isDirectlyAssigned: assignedQuizzes.some(quiz => quiz.userId === userId.toLowerCase())
  };
};

// 특별한 사용자 권한 확인
export const isSpecialUser = (userId: string): boolean => {
  const specialUsers = ['admin', 'teacher', 'instructor'];
  return specialUsers.includes(userId.toLowerCase());
};

// 사용자가 특정 퀴즈에 접근 가능한지 확인
export const canUserAccessQuiz = (userId: string, quizId: number): boolean => {
  const quiz = allQuizzes.find(q => q.id === quizId);
  if (!quiz) return false;
  
  return quiz.userId === userId.toLowerCase();
};

// 모든 사용자 ID 목록 가져오기 (관리자용)
export const getAllUserIds = (): string[] => {
  const allUserIds = new Set<string>();
  
  allQuizzes.forEach(quiz => {
    allUserIds.add(quiz.userId);
  });
  
  return Array.from(allUserIds).sort();
};