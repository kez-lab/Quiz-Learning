import { UserProgress, UserData } from '@/types/quiz';

const STORAGE_KEY = 'quiz_progress';
const USER_DATA_KEY = 'user_data';
const CURRENT_USER_KEY = 'current_user';

export const getProgress = (): UserProgress[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reading progress from localStorage:', error);
    }
    return [];
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const allProgress = getProgress();
    const existingIndex = allProgress.findIndex(p => p.quizId === progress.quizId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving progress to localStorage:', error);
    }
  }
};

export const getQuizProgress = (quizId: number): UserProgress | null => {
  const allProgress = getProgress();
  return allProgress.find(p => p.quizId === quizId) || null;
};

export const clearAllProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error clearing progress from localStorage:', error);
    }  
  }
};

// 사용자 데이터 관리 함수들
export const saveUserData = (userData: UserData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.userId === userData.userId);
    
    if (existingIndex >= 0) {
      allUsers[existingIndex] = {
        ...userData,
        lastLoginAt: new Date()
      };
    } else {
      allUsers.push(userData);
    }
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(allUsers));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving user data to localStorage:', error);
    }
  }
};

export const getUserData = (userId: string): UserData | null => {
  const allUsers = getAllUsers();
  return allUsers.find(u => u.userId === userId) || null;
};

export const getAllUsers = (): UserData[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reading user data from localStorage:', error);
    }
    return [];
  }
};

export const setCurrentUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error setting current user in localStorage:', error);
    }
  }
};

export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting current user from localStorage:', error);
    }
    return null;
  }
};

export const clearCurrentUser = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error clearing current user from localStorage:', error);
    }
  }
};

// 사용자별 진도 관리
export const getUserProgress = (userId: string, quizId: number): UserProgress | null => {
  const userData = getUserData(userId);
  if (!userData) return null;
  
  return userData.progress.find(p => p.quizId === quizId) || null;
};

export const saveUserProgress = (userId: string, progress: UserProgress): void => {
  const userData = getUserData(userId);
  if (!userData) return;
  
  const existingIndex = userData.progress.findIndex(p => p.quizId === progress.quizId);
  
  if (existingIndex >= 0) {
    userData.progress[existingIndex] = progress;
  } else {
    userData.progress.push(progress);
  }
  
  saveUserData(userData);
};