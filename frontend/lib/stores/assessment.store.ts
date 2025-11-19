import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Module, Question } from '../api/module.api';

export interface Answer {
  questionId: string;
  value: any; // Can be boolean, string, number, object (for file upload)
  answeredAt: Date;
}

interface AssessmentState {
  // Assessment context
  assessmentId: string | null;
  businessProfileId: string | null;

  // Current state
  currentModuleIndex: number;
  currentQuestionIndex: number;

  // Data
  modules: Module[];
  questionsByModule: Record<string, Question[]>;
  answers: Record<string, Answer>;

  // Progress
  startedAt: Date | null;
  lastSavedAt: Date | null;

  // Actions
  initializeAssessment: (
    assessmentId: string,
    businessProfileId: string,
    modules: Module[]
  ) => void;
  setQuestionsForModule: (moduleId: string, questions: Question[]) => void;
  setAnswer: (questionId: string, value: any) => void;
  clearAnswer: (questionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToModule: (moduleIndex: number) => void;
  getCurrentModule: () => Module | null;
  getCurrentQuestion: () => Question | null;
  getProgress: () => {
    totalQuestions: number;
    answeredQuestions: number;
    percentage: number;
  };
  getModuleProgress: (moduleId: string) => {
    totalQuestions: number;
    answeredQuestions: number;
    percentage: number;
  };
  resetAssessment: () => void;
  markSaved: () => void;
}

const initialState = {
  assessmentId: null,
  businessProfileId: null,
  currentModuleIndex: 0,
  currentQuestionIndex: 0,
  modules: [],
  questionsByModule: {},
  answers: {},
  startedAt: null,
  lastSavedAt: null,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeAssessment: (assessmentId, businessProfileId, modules) => {
        set({
          assessmentId,
          businessProfileId,
          modules,
          currentModuleIndex: 0,
          currentQuestionIndex: 0,
          startedAt: new Date(),
          answers: {},
          questionsByModule: {},
        });
      },

      setQuestionsForModule: (moduleId, questions) => {
        set((state) => ({
          questionsByModule: {
            ...state.questionsByModule,
            [moduleId]: questions,
          },
        }));
      },

      setAnswer: (questionId, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              value,
              answeredAt: new Date(),
            },
          },
        }));
      },

      clearAnswer: (questionId) => {
        set((state) => {
          const newAnswers = { ...state.answers };
          delete newAnswers[questionId];
          return { answers: newAnswers };
        });
      },

      nextQuestion: () => {
        const state = get();
        const currentModule = state.modules[state.currentModuleIndex];
        if (!currentModule) return;

        const currentQuestions = state.questionsByModule[currentModule.id] || [];

        // If not at the end of current module questions
        if (state.currentQuestionIndex < currentQuestions.length - 1) {
          set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
        }
        // Move to next module
        else if (state.currentModuleIndex < state.modules.length - 1) {
          set({
            currentModuleIndex: state.currentModuleIndex + 1,
            currentQuestionIndex: 0,
          });
        }
      },

      previousQuestion: () => {
        const state = get();

        // If not at the start of current module questions
        if (state.currentQuestionIndex > 0) {
          set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
        }
        // Move to previous module (last question)
        else if (state.currentModuleIndex > 0) {
          const previousModuleIndex = state.currentModuleIndex - 1;
          const previousModule = state.modules[previousModuleIndex];
          const previousQuestions = state.questionsByModule[previousModule.id] || [];

          set({
            currentModuleIndex: previousModuleIndex,
            currentQuestionIndex: Math.max(0, previousQuestions.length - 1),
          });
        }
      },

      goToModule: (moduleIndex) => {
        if (moduleIndex >= 0 && moduleIndex < get().modules.length) {
          set({
            currentModuleIndex: moduleIndex,
            currentQuestionIndex: 0,
          });
        }
      },

      getCurrentModule: () => {
        const state = get();
        return state.modules[state.currentModuleIndex] || null;
      },

      getCurrentQuestion: () => {
        const state = get();
        const currentModule = state.modules[state.currentModuleIndex];
        if (!currentModule) return null;

        const questions = state.questionsByModule[currentModule.id] || [];
        return questions[state.currentQuestionIndex] || null;
      },

      getProgress: () => {
        const state = get();
        let totalQuestions = 0;
        let answeredQuestions = 0;

        state.modules.forEach((module) => {
          const questions = state.questionsByModule[module.id] || [];
          totalQuestions += questions.length;

          questions.forEach((question) => {
            if (state.answers[question.id]) {
              answeredQuestions++;
            }
          });
        });

        const percentage =
          totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

        return { totalQuestions, answeredQuestions, percentage };
      },

      getModuleProgress: (moduleId) => {
        const state = get();
        const questions = state.questionsByModule[moduleId] || [];
        const totalQuestions = questions.length;

        const answeredQuestions = questions.filter(
          (question) => state.answers[question.id]
        ).length;

        const percentage =
          totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

        return { totalQuestions, answeredQuestions, percentage };
      },

      resetAssessment: () => {
        set(initialState);
      },

      markSaved: () => {
        set({ lastSavedAt: new Date() });
      },
    }),
    {
      name: 'assessment-storage',
      partialize: (state) => ({
        assessmentId: state.assessmentId,
        businessProfileId: state.businessProfileId,
        currentModuleIndex: state.currentModuleIndex,
        currentQuestionIndex: state.currentQuestionIndex,
        modules: state.modules,
        questionsByModule: state.questionsByModule,
        answers: state.answers,
        startedAt: state.startedAt,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
