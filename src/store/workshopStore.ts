import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WorkshopData, WorkshopSession } from '../types/workshop';
import { loadWorkshopSession, saveWorkshopSession, updateWorkshopStep } from '../services/supabase';

interface WorkshopStore {
  sessionId: string | null;
  currentStep: number;
  isSaving: boolean;
  workshopData: WorkshopData | null;
  botStates: {
    [key: string]: {
      isLoading: boolean;
      error: Error | null;
      response: any;
    };
  };
  // Actions
  initializeSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  setCurrentStep: (step: number) => Promise<void>;
  updateWorkshopData: (data: Partial<WorkshopData>) => void;
  setBotLoading: (botId: string, isLoading: boolean) => void;
  setBotError: (botId: string, error: Error | null) => void;
  setBotResponse: (botId: string, response: any) => void;
}

const INITIAL_WORKSHOP_DATA: WorkshopData = {
  antiGoals: {
    market: '',
    offer: '',
    delivery: '',
    lifestyle: '',
    values: '',
  },
  triggerEvents: [],
  jobs: [],
  markets: [],
  problems: [],
};

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  sessionId: null,
  currentStep: 1,
  isSaving: false,
  workshopData: null,
  botStates: {},

  initializeSession: async () => {
    const storedSessionId = localStorage.getItem('workshopSessionId');
    if (storedSessionId) {
      await get().loadSession(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('workshopSessionId', newSessionId);
      set({
        sessionId: newSessionId,
        workshopData: INITIAL_WORKSHOP_DATA,
      });
      await saveWorkshopSession(newSessionId, INITIAL_WORKSHOP_DATA, 1);
    }
  },

  loadSession: async (sessionId: string) => {
    try {
      const session = await loadWorkshopSession(sessionId);
      set({
        sessionId,
        currentStep: session.current_step,
        workshopData: session.workshop_data,
      });
    } catch (error) {
      console.error('Failed to load session:', error);
      // If loading fails, initialize a new session
      localStorage.removeItem('workshopSessionId');
      await get().initializeSession();
    }
  },

  saveSession: async () => {
    const { sessionId, workshopData, currentStep, isSaving } = get();
    if (!sessionId || !workshopData || isSaving) return;

    set({ isSaving: true });
    try {
      await saveWorkshopSession(sessionId, workshopData, currentStep);
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setCurrentStep: async (step: number) => {
    const { sessionId } = get();
    if (!sessionId) return;

    set({ currentStep: step });
    try {
      await updateWorkshopStep(sessionId, step);
    } catch (error) {
      console.error('Failed to update step:', error);
    }
  },

  updateWorkshopData: (data: Partial<WorkshopData>) => {
    set((state) => ({
      workshopData: state.workshopData
        ? { ...state.workshopData, ...data }
        : { ...INITIAL_WORKSHOP_DATA, ...data },
    }));
    get().saveSession();
  },

  setBotLoading: (botId: string, isLoading: boolean) =>
    set((state) => ({
      botStates: {
        ...state.botStates,
        [botId]: {
          ...state.botStates[botId],
          isLoading,
        },
      },
    })),

  setBotError: (botId: string, error: Error | null) =>
    set((state) => ({
      botStates: {
        ...state.botStates,
        [botId]: {
          ...state.botStates[botId],
          error,
        },
      },
    })),

  setBotResponse: (botId: string, response: any) =>
    set((state) => ({
      botStates: {
        ...state.botStates,
        [botId]: {
          ...state.botStates[botId],
          response,
        },
      },
    })),
})); 