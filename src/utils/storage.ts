import { UserProgress } from '@/types/quiz';

const STORAGE_KEY = 'quiz_progress';

export const getProgress = (): UserProgress[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
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
    console.error('Error saving progress to localStorage:', error);
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
    console.error('Error clearing progress from localStorage:', error);
  }
};