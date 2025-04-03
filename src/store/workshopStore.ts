import { create } from 'zustand';
import type { WorkshopData } from '../types/workshop';
import type { AIMessage } from '../types/chat';

export interface WorkshopStore {
  // Session state
  sessionId: string | null;
  currentStep: number;
  isSaving: boolean;
  isAiLoading: boolean;
  validationErrors: boolean;

  // Workshop data
  workshopData: WorkshopData;
  currentSuggestion: any | null;

  // Actions
  initializeSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  saveSession: () => Promise<void>;
  setCurrentStep: (step: number) => void;
  updateWorkshopData: (data: Partial<WorkshopData>) => void;
  canProceedToNextStep: () => boolean;
  setValidationErrors: (show: boolean) => void;
  
  // Chat actions
  addChatMessage: (step: number, message: AIMessage) => void;
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
  marketDemandAnalysis: '',
  stepChats: {},
  valueProposition: {
    uniqueValue: '',
    painPoints: '',
    benefits: '',
    differentiators: ''
  },
};

// Helper function to check if a step is complete
const isStepComplete = (step: number, data: WorkshopData): boolean => {
  switch (step) {
    case 1: // Intro
      return true; // Always allow proceeding from intro
    case 2: // Market Demand
      return (data.marketDemandAnalysis ?? '').trim().length > 0;
    case 3: // Anti-Goals
      return Object.values(data.antiGoals).some(value => value.trim().length > 0);
    case 4: // Trigger Events
      return (data.triggerEvents ?? []).length > 0;
    case 5: // Jobs
      return (data.jobs ?? []).length > 0;
    case 6: // Markets
      return (data.markets ?? []).length > 0;
    case 7: // Problems
      return (data.problems ?? []).length > 0;
    case 8: // Market Evaluation
      return (data.markets ?? []).some(market => market.selected);
    case 9: // Offer Exploration
      return Object.values(data.valueProposition).some(value => (value || '').trim().length > 0);
    case 10: // Pricing
      return (data.pricing?.strategy ?? '').length > 0;
    default:
      return true;
  }
};

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  // Session state
  sessionId: null,
  currentStep: 1,
  isSaving: false,
  isAiLoading: false,
  validationErrors: false,

  // Workshop data
  workshopData: initialWorkshopData,
  currentSuggestion: null,

  // Actions
  initializeSession: async () => {
    const newSessionId = `session_${Date.now()}`;
    set({
      sessionId: newSessionId,
      currentStep: 1,
      workshopData: { ...initialWorkshopData },
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
    const { sessionId, currentStep } = get();
    if (!sessionId) return;

    set({ isSaving: true });
    try {
      // TODO: Implement actual session saving
      console.log('Saving session:', { sessionId, currentStep });
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  setCurrentStep: (step: number) => {
    if (step >= 1 && step <= 11) {
      set({ currentStep: step });
    }
  },

  updateWorkshopData: (data: Partial<WorkshopData>) => {
    set(state => {
      // Create a new workshopData object with the updates
      const updatedData = {
        ...state.workshopData,
        ...data,
      };

      // Ensure all required fields exist
      if (!updatedData.stepChats) {
        updatedData.stepChats = {};
      }

      return {
        workshopData: updatedData,
      };
    });
  },

  canProceedToNextStep: () => {
    const { currentStep, workshopData } = get();
    return isStepComplete(currentStep, workshopData);
  },

  setValidationErrors: (show: boolean) => {
    set({ validationErrors: show });
  },

  // Chat actions
  addChatMessage: (step: number, message: AIMessage) => {
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
    const { currentSuggestion } = get();
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
    }

    // Clear the current suggestion after accepting
    set({ currentSuggestion: null });
  },
})); 