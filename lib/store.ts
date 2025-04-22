import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  points: number;
  studyStreak: number;
  totalStudyTime: number;
  completedQuizzes: number;
  achievements: string[];
  subjectProgress: {
    [key: string]: {
      progress: number;
      chaptersDone: number;
      totalChapters: number;
    };
  };
}

interface UserStore {
  progress: UserProgress;
  updatePoints: (points: number) => void;
  updateStudyStreak: (streak: number) => void;
  updateStudyTime: (minutes: number) => void;
  completeQuiz: (subject: string, score: number) => void;
  addAchievement: (achievement: string) => void;
  updateSubjectProgress: (subject: string, progress: number, chaptersDone: number) => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  points: 0,
  studyStreak: 0,
  totalStudyTime: 0,
  completedQuizzes: 0,
  achievements: [],
  subjectProgress: {
    Mathematics: { progress: 0, chaptersDone: 0, totalChapters: 12 },
    Physics: { progress: 0, chaptersDone: 0, totalChapters: 12 },
    Chemistry: { progress: 0, chaptersDone: 0, totalChapters: 12 },
    Biology: { progress: 0, chaptersDone: 0, totalChapters: 12 },
    English: { progress: 0, chaptersDone: 0, totalChapters: 12 },
  },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      progress: initialProgress,
      updatePoints: (points) =>
        set((state) => ({
          progress: { ...state.progress, points: state.progress.points + points },
        })),
      updateStudyStreak: (streak) =>
        set((state) => ({
          progress: { ...state.progress, studyStreak: streak },
        })),
      updateStudyTime: (minutes) =>
        set((state) => ({
          progress: {
            ...state.progress,
            totalStudyTime: state.progress.totalStudyTime + minutes,
          },
        })),
      completeQuiz: (subject, score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedQuizzes: state.progress.completedQuizzes + 1,
            points: state.progress.points + Math.floor(score * 10),
          },
        })),
      addAchievement: (achievement) =>
        set((state) => ({
          progress: {
            ...state.progress,
            achievements: [...state.progress.achievements, achievement],
            points: state.progress.points + 50, // Bonus points for achievements
          },
        })),
      updateSubjectProgress: (subject, progress, chaptersDone) =>
        set((state) => ({
          progress: {
            ...state.progress,
            subjectProgress: {
              ...state.progress.subjectProgress,
              [subject]: {
                ...state.progress.subjectProgress[subject],
                progress,
                chaptersDone,
              },
            },
          },
        })),
      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: 'user-progress',
    }
  )
);