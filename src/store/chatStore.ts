import { create } from 'zustand';
import type { AIMessage } from '../types/chat';

export interface ChatStore {
  // Chat state
  chatMessages: AIMessage[];
  isProcessing: boolean;
  currentInput: string;
  showSuggestions: boolean;
  suggestions: string[];
  currentField: string;
  isInitialLoad: boolean;

  // Actions
  addChatMessage: (message: AIMessage) => void;
  clearChatMessages: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCurrentInput: (input: string) => void;
  setShowSuggestions: (show: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
  setCurrentField: (field: string) => void;
  setIsInitialLoad: (isInitialLoad: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  chatMessages: [],
  isProcessing: false,
  currentInput: '',
  showSuggestions: false,
  suggestions: [],
  currentField: '',
  isInitialLoad: true,

  // Actions
  addChatMessage: (message: AIMessage) => {
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    }));
  },

  clearChatMessages: () => {
    set({
      chatMessages: [],
    });
  },

  setIsProcessing: (isProcessing: boolean) => {
    set({
      isProcessing,
    });
  },

  setCurrentInput: (input: string) => {
    set({
      currentInput: input,
    });
  },

  setShowSuggestions: (show: boolean) => {
    set({
      showSuggestions: show,
    });
  },

  setSuggestions: (suggestions: string[]) => {
    set({
      suggestions,
    });
  },

  setCurrentField: (field: string) => {
    set({
      currentField: field,
    });
  },

  setIsInitialLoad: (isInitialLoad: boolean) => {
    set({
      isInitialLoad,
    });
  },
}));
