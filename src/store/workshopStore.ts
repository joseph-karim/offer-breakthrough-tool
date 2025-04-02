import { create } from 'zustand';
import type { WorkshopData, WorkshopSession, TriggerEvent, Job, Market, Problem, Offer } from '../types/workshop';
import type { StepChats } from '../types/chat';

interface WorkshopStore {
  // Session state
  sessionId: string | null;
  currentStep: number;
  isSaving: boolean;
  isAiLoading: boolean;

  // Workshop data
  workshopData: WorkshopData;
  currentSuggestion: any | null;

  // Actions
  initializeSession: () => void;
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  updateWorkshopData: (data: Partial<WorkshopData>) => void;
  
  // Chat actions
  addChatMessage: (step: number, message: any) => void;
  setCurrentSuggestion: (suggestion: any) => void;
  acceptSuggestion: (step: number) => void;
}

const initialWorkshopData: WorkshopData = {
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
  stepChats: {},
};

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  // Session state
  sessionId: null,
  currentStep: 1,
  isSaving: false,
  isAiLoading: false,

  // Workshop data
  workshopData: initialWorkshopData,
  currentSuggestion: null,

  // Actions
  initializeSession: () => {
    set({
      sessionId: `session_${Date.now()}`,
      currentStep: 1,
      workshopData: initialWorkshopData,
    });
  },

  loadSession: async (sessionId: string) => {
    set({ isSaving: true });
    try {
      // TODO: Implement actual session loading
      set({ sessionId });
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  saveSession: async () => {
    const { sessionId, workshopData, currentStep } = get();
    if (!sessionId) return;

    set({ isSaving: true });
    try {
      // TODO: Implement actual session saving
      console.log('Saving session:', { sessionId, currentStep, workshopData });
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  updateWorkshopData: (data: Partial<WorkshopData>) => {
    set(state => ({
      workshopData: {
        ...state.workshopData,
        ...data,
      },
    }));
  },

  // Chat actions
  addChatMessage: (step: number, message: any) => {
    set(state => {
      const stepChats = state.workshopData.stepChats || {};
      const stepChat = stepChats[step] || { messages: [] };

      return {
        workshopData: {
          ...state.workshopData,
          stepChats: {
            ...stepChats,
            [step]: {
              ...stepChat,
              messages: [...stepChat.messages, message],
            },
          },
        },
      };
    });
  },

  setCurrentSuggestion: (suggestion: any) => {
    set({ currentSuggestion: suggestion });
  },

  acceptSuggestion: (step: number) => {
    const { currentSuggestion, workshopData } = get();
    if (!currentSuggestion) return;

    switch (step) {
      case 3: // Anti-Goals
        if (currentSuggestion.antiGoals) {
          set(state => ({
            workshopData: {
              ...state.workshopData,
              antiGoals: currentSuggestion.antiGoals,
            },
          }));
        }
        break;

      case 4: // Trigger Events
        if (currentSuggestion.triggerEvents) {
          set(state => ({
            workshopData: {
              ...state.workshopData,
              triggerEvents: [
                ...state.workshopData.triggerEvents,
                ...currentSuggestion.triggerEvents,
              ],
            },
          }));
        }
        break;

      case 5: // Jobs
        if (currentSuggestion.jobs) {
          set(state => ({
            workshopData: {
              ...state.workshopData,
              jobs: [
                ...state.workshopData.jobs,
                ...currentSuggestion.jobs,
              ],
            },
          }));
        }
        break;

      case 6: // Markets
        if (currentSuggestion.markets) {
          set(state => ({
            workshopData: {
              ...state.workshopData,
              markets: [
                ...state.workshopData.markets,
                ...currentSuggestion.markets,
              ],
            },
          }));
        }
        break;

      case 7: // Problems
        if (currentSuggestion.problems) {
          set(state => ({
            workshopData: {
              ...state.workshopData,
              problems: [
                ...state.workshopData.problems,
                ...currentSuggestion.problems,
              ],
            },
          }));
        }
        break;

      case 8: // Market Evaluation
        if (currentSuggestion.marketScores && currentSuggestion.recommendedMarket) {
          // Update market scores and select recommended market
          set(state => ({
            workshopData: {
              ...state.workshopData,
              markets: state.workshopData.markets.map(market => ({
                ...market,
                selected: market.description === currentSuggestion.recommendedMarket,
              })),
            },
          }));
        }
        break;

      case 9: // Offer Exploration
        if (currentSuggestion.offers?.length > 0) {
          const [firstOffer] = currentSuggestion.offers;
          set(state => ({
            workshopData: {
              ...state.workshopData,
              selectedOffer: {
                id: Date.now().toString(),
                ...firstOffer,
                selected: true,
              },
            },
          }));
        }
        break;

      case 11: // Summary & Action Plan
        // No need to update state for analysis suggestions
        break;
    }

    // Clear the current suggestion after accepting
    set({ currentSuggestion: null });
  },
})); 