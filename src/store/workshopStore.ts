import { create } from 'zustand';
import type { WorkshopData, Pain } from '../types/workshop';
import type { AIMessage, ChatSuggestion } from '../types/chat';
import { AIService } from '../services/aiService';
import { STEP_QUESTIONS } from '../services/aiService';
import { OpenAIService } from '../services/openai';
import { BrainstormService, BrainstormContext, BrainstormIdea } from '../services/brainstormService';
import { SparkyService } from '../services/sparkyService';
import { PainParsingService } from '../services/painParsingService';
import { saveWorkshopSession, loadWorkshopSession, updateWorkshopStep } from '../services/supabase';

export interface WorkshopStore {
  // Session state
  sessionId: string | null;
  currentStep: number;
  isSaving: boolean;
  isAiLoading: boolean;
  validationErrors: boolean;
  isInitialized: boolean;
  lastUpdateTimestamp?: number;

  // Workshop data
  workshopData: WorkshopData;
  currentSuggestion: ChatSuggestion | null;

  // Brainstorming state
  brainstormIdeas: BrainstormIdea[];
  isBrainstorming: boolean;

  // Painstorming modal state
  isPainstormingModalOpen: boolean;
  painstormingOutput: string | null;
  focusedProblems: string[];

  // Pain parsing state
  isPainParsingModalOpen: boolean;
  parsedPains: {
    buyerSegmentPains: {
      [buyerSegment: string]: Pain[];
    };
    overlappingPains: Pain[];
  } | null;
  isParsing: boolean;
  rawPainstormingInput: string;

  // Sparky Chat Modal state
  isSparkyModalOpen: boolean;
  sparkyModalConfig: {
    stepNumber: number | null;
    exerciseKey: string | null;
    exerciseTitle: string | null;
    initialContext: Record<string, any>;
    systemPromptKey?: string;
  } | null;
  currentModalChatMessages: AIMessage[];

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
  setCurrentSuggestion: (suggestion: ChatSuggestion | null) => void;
  handleUserMessage: (step: number, userMessage: string) => Promise<void>;
  generateStepSuggestion: (step: number) => Promise<void>;
  acceptSuggestion: (step: number) => void;
  answerFollowUpQuestion: (step: number, question: string) => Promise<void>;

  // Sparky Modal actions
  openSparkyModal: (config: WorkshopStore['sparkyModalConfig']) => void;
  closeSparkyModal: () => void;
  sendSparkyModalMessage: (userMessage: string) => Promise<void>;
  clearSparkyModalMessages: () => void;

  // Brainstorming actions
  brainstormBigIdeasWithContext: (context: BrainstormContext) => Promise<void>;
  refineBigIdea: (initialIdea: string, userFeedback: string) => Promise<void>;
  useBrainstormIdea: (idea: BrainstormIdea) => void;

  // Painstorming modal actions
  openPainstormingModal: (output: string) => void;
  closePainstormingModal: () => void;
  setFocusedProblems: (problems: string[]) => void;
  generatePainstormingSuggestions: () => Promise<void>;

  // Pain parsing actions
  setRawPainstormingInput: (text: string) => void;
  parseAndSavePains: (text: string) => Promise<void>;
  openPainParsingModal: () => void;
  closePainParsingModal: () => void;
  saveParsedPains: (pains: Pain[]) => void;
}

const initialWorkshopData: WorkshopData = {
  bigIdea: {
    description: '',
    version: 'initial'
  },
  underlyingGoal: {
    businessGoal: ''
  },
  triggerEvents: [],
  jobs: [],
  targetBuyers: [],
  pains: [],
  problemUp: {
    selectedPains: [],
    selectedBuyers: [],
    relevantTriggerIds: [],
    targetMoment: '',
    notes: ''
  },
  targetMarketProfile: {
    name: '',
    commonTraits: [],
    commonTriggers: [],
    coreTransformation: ''
  },
  refinedIdea: {
    description: '',
    targetCustomers: '',
    version: 'refined'
  },
  offer: {
    id: '',
    name: '',
    description: '',
    format: '',
    targetBuyers: [],
    painsSolved: [],
    version: 'refined'
  },
  nextSteps: {
    preSellPlan: '',
    workshopReflections: '',
    preSellPlanItems: [],
    workshopReflectionItems: []
  },
  stepChats: {},
  reflections: {
    keyInsights: '',
    nextSteps: '',
    personalReflection: ''
  }
};

// Helper function to check if a step is complete
const isStepComplete = (_step: number, _data: WorkshopData): boolean => {
  // Always return true to allow navigation regardless of completion status
  return true;

  /* Original validation logic for reference:
  switch (step) {
    case 1: // Intro
      return true; // Always allow proceeding from intro
    case 2: // Big Idea
      return data.bigIdea?.description.trim().length > 0; // Target customers field removed from Step 2
    case 3: // Underlying Goal
      return data.underlyingGoal?.businessGoal.trim().length > 0; // Constraints field removed
    case 4: // Trigger Events
      return (data.triggerEvents ?? []).length > 0;
    case 5: // Jobs
      return (data.jobs ?? []).length > 0;
    case 6: // Target Buyers
      return (data.targetBuyers ?? []).length > 0;
    case 7: // Painstorming
      return (data.pains ?? []).length > 0;
    case 8: // Problem Up
      return (data.problemUp?.selectedPains.length ?? 0) > 0 && (data.problemUp?.selectedBuyers.length ?? 0) > 0;
    case 9: // Refine Idea
      return data.refinedIdea?.description.trim().length > 0 && data.refinedIdea?.targetCustomers.trim().length > 0;
    case 10: // Summary
      return true;
    default:
      return true;
  }
  */
};

// Create API key for OpenAI services
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

// Create OpenAI service
const openaiService = new OpenAIService({
  apiKey: apiKey
});

// Create AI service instance
const aiService = new AIService({
  apiKey: apiKey
});

// Create Brainstorm service instance
const brainstormService = new BrainstormService({
  openaiService: openaiService,
  model: 'gpt-4.1-2025-04-14'
});

// Create Pain Parsing service instance
const painParsingService = new PainParsingService(
  openaiService,
  'gpt-4.1-2025-04-14'
);

// Helper function to extract relevant context for a step
function getStepContext(step: number, workshopData: WorkshopData): string {
  let context = '';

  // Add relevant data based on the step
  switch (step) {
    case 1: // Intro
      context = `
        Workshop Progress: Step 1 - Introduction

        This is the start of the Buyer Breakthrough Workshop.
      `;
      break;

    case 2: // Big Idea
      context = `
        Workshop Progress: Step 2 - Your Big Idea

        The user is defining their initial product or service idea.
      `;
      break;

    case 3: // Underlying Goal
      context = `
        Workshop Progress: Step 3 - Underlying Goal

        Previous inputs:
        ${workshopData.bigIdea ? `Big Idea: ${workshopData.bigIdea.description}` : ''}
        ${workshopData.bigIdea ? `Target Customers: ${workshopData.bigIdea.targetCustomers}` : ''}
      `;
      break;

    case 4: // Trigger Events
      context = `
        Workshop Progress: Step 4 - Trigger Events

        Previous inputs:
        ${workshopData.bigIdea ? `Big Idea: ${workshopData.bigIdea.description}` : ''}

        Underlying Goal:
        ${workshopData.underlyingGoal ? `Business Goal: ${workshopData.underlyingGoal.businessGoal}` : ''}
      `;
      break;

    case 5: // Jobs
      context = `
        Workshop Progress: Step 5 - Jobs to be Done

        Previous inputs:
        ${workshopData.bigIdea ? `Big Idea: ${workshopData.bigIdea.description}` : ''}

        Trigger Events:
        ${workshopData.triggerEvents
          .map(event => `- ${event.description}`)
          .join('\n')}
      `;
      break;

    case 6: // Target Buyers
      context = `
        Workshop Progress: Step 6 - Target Buyers

        Previous inputs:
        Jobs to be Done:
        ${workshopData.jobs
          .map(job => `- ${job.description}`)
          .join('\n')}

        Trigger Events:
        ${workshopData.triggerEvents
          .map(event => `- ${event.description}`)
          .join('\n')}
      `;
      break;

    case 7: // Painstorming
      context = `
        Workshop Progress: Step 7 - Painstorming

        Previous inputs:
        Target Buyers:
        ${workshopData.targetBuyers
          .map(buyer => `- ${buyer.description}`)
          .join('\n')}

        Jobs to be Done:
        ${workshopData.jobs
          .map(job => `- ${job.description}`)
          .join('\n')}
      `;
      break;

    case 8: // Problem Up
      context = `
        Workshop Progress: Step 8 - Problem Up

        Target Buyers:
        ${workshopData.targetBuyers
          .map(buyer => `- ${buyer.description} (ID: ${buyer.id})`)
          .join('\n')}

        Pains Identified:
        ${workshopData.pains
          .map(pain => `- ${pain.description} (${pain.type}${pain.isFire ? ', FIRE' : ''}, ID: ${pain.id})`)
          .join('\n')}

        Selected Pains:
        ${workshopData.problemUp?.selectedPains.map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? `- ${pain.description} (ID: ${pain.id})` : `- Unknown pain (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Selected Buyers:
        ${workshopData.problemUp?.selectedBuyers.map(id => {
          const buyer = workshopData.targetBuyers.find(b => b.id === id);
          return buyer ? `- ${buyer.description} (ID: ${buyer.id})` : `- Unknown buyer (ID: ${id})`;
        }).join('\n') || 'None selected'}
      `;
      break;

    case 9: // Target Market Profile
      context = `
        Workshop Progress: Step 9 - Define Your Focused Target Market

        Primary Buyer:
        ${workshopData.problemUp?.selectedBuyers.map(id => {
          const buyer = workshopData.targetBuyers.find(b => b.id === id);
          return buyer ? `- ${buyer.description}` : `- Unknown buyer (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Primary Pain:
        ${workshopData.problemUp?.selectedPains.map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? `- ${pain.description}` : `- Unknown pain (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Target Moment:
        ${workshopData.problemUp ? workshopData.problemUp.targetMoment : ''}

        Overarching Job:
        ${workshopData.jobs.find(job => job.isOverarching)?.description || 'No overarching job defined'}
      `;
      break;

    case 10: // Plan Next Steps
      context = `
        Workshop Progress: Step 10 - Plan Next Steps

        Refined Idea:
        ${workshopData.refinedIdea ? `${workshopData.refinedIdea.description}` : ''}
        ${workshopData.refinedIdea ? `Target Customers: ${workshopData.refinedIdea.targetCustomers}` : ''}
        ${workshopData.offer ? `Offer Name: ${workshopData.offer.name}` : ''}
        ${workshopData.offer ? `Offer Format: ${workshopData.offer.format}` : ''}

        Selected Pains:
        ${workshopData.problemUp?.selectedPains.map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? `- ${pain.description}` : `- Unknown pain (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Selected Buyers:
        ${workshopData.problemUp?.selectedBuyers.map(id => {
          const buyer = workshopData.targetBuyers.find(b => b.id === id);
          return buyer ? `- ${buyer.description}` : `- Unknown buyer (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Target Moment:
        ${workshopData.problemUp ? workshopData.problemUp.targetMoment : ''}

        Target Market Profile:
        ${workshopData.targetMarketProfile ? `Name: ${workshopData.targetMarketProfile.name}` : ''}
        ${workshopData.targetMarketProfile ? `Core Transformation: ${workshopData.targetMarketProfile.coreTransformation}` : ''}
      `;
      break;

    case 11: // Summary
      context = `
        Workshop Summary:

        Initial Big Idea:
        ${workshopData.bigIdea ? `${workshopData.bigIdea.description}` : ''}

        Underlying Goal:
        ${workshopData.underlyingGoal ? `Business Goal: ${workshopData.underlyingGoal.businessGoal}` : ''}

        Trigger Events:
        ${workshopData.triggerEvents
          .map(event => `- ${event.description}`)
          .join('\n')}

        Jobs to be Done:
        ${workshopData.jobs
          .map(job => `- ${job.description}${job.isOverarching ? ' (Overarching)' : ''}${job.selected ? ' (Selected)' : ''}`)
          .join('\n')}

        Target Buyers:
        ${workshopData.problemUp?.selectedBuyers.map(id => {
          const buyer = workshopData.targetBuyers.find(b => b.id === id);
          return buyer ? `- ${buyer.description}` : `- Unknown buyer (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Key Pains:
        ${workshopData.problemUp?.selectedPains.map(id => {
          const pain = workshopData.pains.find(p => p.id === id);
          return pain ? `- ${pain.description}` : `- Unknown pain (ID: ${id})`;
        }).join('\n') || 'None selected'}

        Target Problems:
        ${(workshopData.targetProblems || []).filter(problem => problem.selected).map(problem =>
          `- ${problem.description}`
        ).join('\n') || 'None selected'}

        Target Moment:
        ${workshopData.problemUp ? workshopData.problemUp.targetMoment : ''}

        Target Market Profile:
        ${workshopData.targetMarketProfile ? `Name: ${workshopData.targetMarketProfile.name}` : ''}
        ${workshopData.targetMarketProfile?.commonTraits && workshopData.targetMarketProfile.commonTraits.length > 0 ?
          `Common Traits:\n${workshopData.targetMarketProfile.commonTraits.map(trait => `- ${trait}`).join('\n')}` : ''}
        ${workshopData.targetMarketProfile?.commonTriggers && workshopData.targetMarketProfile.commonTriggers.length > 0 ?
          `Common Triggers:\n${workshopData.targetMarketProfile.commonTriggers.map(trigger => `- ${trigger}`).join('\n')}` : ''}
        ${workshopData.targetMarketProfile ? `Core Transformation: ${workshopData.targetMarketProfile.coreTransformation}` : ''}

        Refined Offer:
        ${workshopData.refinedIdea ? `Name: ${workshopData.refinedIdea.name || workshopData.offer?.name || ''}` : ''}
        ${workshopData.refinedIdea ? `Format: ${workshopData.refinedIdea.format || workshopData.offer?.format || ''}` : ''}
        ${workshopData.refinedIdea ? `Description: ${workshopData.refinedIdea.description}` : ''}

        Next Steps:
        ${workshopData.nextSteps?.preSellPlan ? `Pre-Sell Plan: ${workshopData.nextSteps.preSellPlan}` : ''}
        ${workshopData.nextSteps?.workshopReflections ? `Workshop Reflections: ${workshopData.nextSteps.workshopReflections}` : ''}

        Reflections:
        ${workshopData.reflections ? `Key Insights: ${workshopData.reflections.keyInsights}` : ''}
        ${workshopData.reflections ? `Next Steps: ${workshopData.reflections.nextSteps}` : ''}
        ${workshopData.reflections ? `Personal Reflection: ${workshopData.reflections.personalReflection || ''}` : ''}
      `;
      break;

    default:
      context = `Workshop Progress: Step ${step}`;
  }

  return context;
}

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  // Session state
  sessionId: null,
  currentStep: 0, // 0 for intro page, 1-10 for actual steps
  isSaving: false,
  isAiLoading: false,
  validationErrors: false,
  isInitialized: false,

  // Workshop data
  workshopData: initialWorkshopData,
  currentSuggestion: null,

  // Brainstorming state
  brainstormIdeas: [],
  isBrainstorming: false,

  // Painstorming modal state
  isPainstormingModalOpen: false,
  painstormingOutput: null,
  focusedProblems: [],

  // Pain parsing state
  isPainParsingModalOpen: false,
  parsedPains: null,
  isParsing: false,
  rawPainstormingInput: '',

  // Sparky Chat Modal state
  isSparkyModalOpen: false,
  sparkyModalConfig: null,
  currentModalChatMessages: [],

  // Actions
  initializeSession: async () => {
    const newSessionId = `session_${Date.now()}`;
    set({
      sessionId: newSessionId,
      currentStep: 0, // 0 for intro page
      workshopData: { ...initialWorkshopData },
      isInitialized: true
    });

    // Save the new session to Supabase
    try {
      await saveWorkshopSession(
        newSessionId,
        initialWorkshopData,
        0,
        'Untitled Workshop'
      );
    } catch (error) {
      console.error('Failed to save new session:', error);
    }
  },

  loadSession: async (sessionId: string) => {
    set({ isSaving: true });
    try {
      // Load session from Supabase
      const sessionData = await loadWorkshopSession(sessionId);

      if (sessionData) {
        set({
          sessionId: sessionData.session_id,
          currentStep: sessionData.current_step,
          workshopData: sessionData.workshop_data,
          isInitialized: true
        });
      } else {
        throw new Error('Session not found');
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      // Initialize a new session if loading fails
      const { initializeSession } = get();
      await initializeSession();
    } finally {
      set({ isSaving: false });
    }
  },

  saveSession: async () => {
    const { sessionId, currentStep, workshopData } = get();
    if (!sessionId) {
      console.error('Cannot save session: No sessionId available');
      return;
    }

    set({ isSaving: true });
    try {
      // Make a deep copy of the workshop data to avoid any reference issues
      const workshopDataCopy = JSON.parse(JSON.stringify(workshopData));

      // Save session to Supabase
      console.log('Saving session with data:', {
        sessionId,
        currentStep,
        dataKeys: Object.keys(workshopDataCopy)
      });

      await saveWorkshopSession(sessionId, workshopDataCopy, currentStep);
      console.log('Session saved successfully:', { sessionId, currentStep });
    } catch (error) {
      console.error('Failed to save session:', error);
      // Alert the user about the save failure
      alert('Failed to save your progress. Please check your connection and try again.');
    } finally {
      set({ isSaving: false });
    }
  },

  setCurrentStep: (step: number) => {
    if (step >= 0 && step <= 11) {
      set({ currentStep: step });

      // Initialize step chat if it doesn't exist
      const { workshopData, sessionId } = get();
      if (step > 0 && !workshopData.stepChats[step]) {
        set(state => ({
          workshopData: {
            ...state.workshopData,
            stepChats: {
              ...state.workshopData.stepChats,
              [step]: { messages: [] }
            }
          }
        }));
      }

      // Update the step in Supabase
      if (sessionId) {
        console.log('Updating current step to:', step);

        // First update just the step number for quick navigation
        // This is a lightweight operation that doesn't update the whole session
        updateWorkshopStep(sessionId, step).catch(error => {
          console.error('Failed to update workshop step:', error);
        });

        // Only save the full session if we're not already saving
        const { saveSession, isSaving } = get();
        if (!isSaving) {
          // Use a longer delay for step changes to avoid conflicts with other saves
          setTimeout(() => {
            // Only proceed if we're still not saving
            if (!get().isSaving) {
              console.log('Saving full session after step change');
              saveSession().catch(error => {
                console.error('Failed to save session after step change:', error);
              });
            }
          }, 1500); // 1.5 seconds
        }
      } else {
        console.error('Cannot update step: No sessionId available');
      }
    }
  },

  updateWorkshopData: (data: Partial<WorkshopData>) => {
    // Store the current timestamp to debounce save operations
    const updateTimestamp = Date.now();

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
        lastUpdateTimestamp: updateTimestamp,
      };
    });

    // Debounce save operations to prevent too many API calls
    const { saveSession, isSaving } = get();

    // Only save if we're not already saving
    if (!isSaving) {
      // Use setTimeout to ensure the state is updated before saving
      // and to debounce multiple rapid updates
      const debounceTime = 1000; // 1 second debounce

      setTimeout(() => {
        // Check if this is still the most recent update
        if (get().lastUpdateTimestamp === updateTimestamp) {
          console.log('Auto-saving after updateWorkshopData');
          saveSession().catch(error => {
            console.error('Auto-save failed:', error);
            // Don't show alert for auto-save failures to avoid annoying the user
          });
        }
      }, debounceTime);
    }
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
      // Create a copy of the existing state
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

    // Save session after adding a message
    const { saveSession } = get();
    saveSession();
  },

  setCurrentSuggestion: (suggestion: ChatSuggestion | null) => {
    set({ currentSuggestion: suggestion });
  },

  handleUserMessage: async (step: number, userMessage: string) => {
    const { addChatMessage, workshopData, generateStepSuggestion } = get();

    // Add user message to chat
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };
    addChatMessage(step, userMsg);

    // Get current step chat history
    const stepChat = workshopData.stepChats?.[step] || { messages: [] };
    const messages = stepChat.messages || [];

    // Count how many user responses we have (excluding the one we just added)
    const userResponses = messages.filter(
      msg => msg.role === 'user'
    ).length - 1;

    // If we've answered all predefined questions, generate a suggestion
    if (userResponses >= (STEP_QUESTIONS[step]?.length || 0)) {
      // We've answered all the questions, generate a suggestion
      await generateStepSuggestion(step);
    } else {
      // We have more predefined questions to ask
      set({ isAiLoading: true });

      try {
        // Get next question
        const nextQuestion = STEP_QUESTIONS[step]?.[userResponses];

        // First, generate a response to the user's message
        const responseMsg = await aiService.answerFollowUpQuestion(
          step,
          userMessage,
          getStepContext(step, workshopData)
        );
        addChatMessage(step, responseMsg);

        // Then, after a short delay, ask the next question if it exists
        if (nextQuestion) {
          setTimeout(() => {
            const questionMsg: AIMessage = {
              id: Date.now().toString(),
              content: nextQuestion.text,
              role: 'assistant',
              timestamp: new Date().toISOString(),
            };
            addChatMessage(step, questionMsg);
            set({ isAiLoading: false });
          }, 1500);
        } else {
          set({ isAiLoading: false });
        }
      } catch (error) {
        console.error('Error handling user message:', error);
        set({ isAiLoading: false });

        // Add error message
        const errorMessage: AIMessage = {
          id: Date.now().toString(),
          content: "I'm sorry, I encountered an error processing your message. Please try again.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        addChatMessage(step, errorMessage);
      }
    }
  },

  generateStepSuggestion: async (step: number) => {
    const { setCurrentSuggestion, workshopData, addChatMessage } = get();

    set({ isAiLoading: true });

    try {
      const suggestion = await aiService.getStepSuggestion(
        step,
        getStepContext(step, workshopData)
      );

      setCurrentSuggestion(suggestion);

      // Add a message indicating a suggestion is ready
      const message: AIMessage = {
        id: Date.now().toString(),
        content: "I've prepared some suggestions based on our conversation. You can review and accept them below.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      addChatMessage(step, message);
    } catch (error) {
      console.error('Error generating suggestion:', error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I had trouble generating suggestions. Please try again or proceed manually.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      addChatMessage(step, errorMessage);
    } finally {
      set({ isAiLoading: false });
    }
  },

  acceptSuggestion: (step: number) => {
    const { currentSuggestion, updateWorkshopData, workshopData } = get();

    if (!currentSuggestion) return;

    // Apply the suggestion based on the step
    switch (step) {
      case 2: // Big Idea
        if (currentSuggestion.content?.bigIdea) {
          updateWorkshopData({
            bigIdea: {
              description: typeof currentSuggestion.content === 'object' && currentSuggestion.content.bigIdea && typeof currentSuggestion.content.bigIdea === 'object' ? (currentSuggestion.content.bigIdea as any).description || '' : '',
              version: 'initial'
            }
          });
        }
        break;

      case 3: // Underlying Goal
        if (currentSuggestion.content?.underlyingGoal) {
          updateWorkshopData({
            underlyingGoal: {
              businessGoal: typeof currentSuggestion.content === 'object' && currentSuggestion.content.underlyingGoal && typeof currentSuggestion.content.underlyingGoal === 'object' ? (currentSuggestion.content.underlyingGoal as any).businessGoal || '' : ''
            }
          });
        }
        break;

      case 4: // Trigger Events
        if (currentSuggestion.content?.triggerEvents) {
          // Get existing trigger events and append new ones
          const existingEvents = workshopData.triggerEvents || [];
          const newEvents = (currentSuggestion.content.triggerEvents as any[]).map((event) => ({
            ...event,
            source: 'assistant' as const, // Mark as coming from assistant
          }));

          updateWorkshopData({
            triggerEvents: [...existingEvents, ...newEvents],
          });
        }
        break;

      case 5: // Jobs
        if (currentSuggestion.content?.jobs) {
          // Get existing jobs and append new ones
          const existingJobs = workshopData.jobs || [];
          const newJobs = (currentSuggestion.content.jobs as any[]).map((job) => ({
            ...job,
            source: 'assistant' as const, // Mark as coming from assistant
          }));

          updateWorkshopData({
            jobs: [...existingJobs, ...newJobs],
          });
        }
        break;

      case 6: // Target Buyers
        if (currentSuggestion.content?.targetBuyers) {
          // Get existing target buyers and append new ones
          const existingBuyers = workshopData.targetBuyers || [];
          const newBuyers = (currentSuggestion.content.targetBuyers as any[]).map((buyer) => ({
            ...buyer,
            source: 'assistant' as const, // Mark as coming from assistant
          }));

          updateWorkshopData({
            targetBuyers: [...existingBuyers, ...newBuyers],
          });
        }
        break;

      case 7: // Painstorming
        if (currentSuggestion.content?.pains) {
          // Get existing pains and append new ones
          const existingPains = workshopData.pains || [];
          const newPains = (currentSuggestion.content.pains as any[]).map((pain, index: number) => ({
            ...pain,
            id: `ai_${Date.now()}_${index}`,
            source: 'assistant' as const,
          }));

          updateWorkshopData({
            pains: [...existingPains, ...newPains],
          });
        }
        break;

      case 8: // Problem Up
        if (currentSuggestion.content?.problemUp) {
          const problemUp = currentSuggestion.content.problemUp as any;

          updateWorkshopData({
            problemUp: {
              selectedPains: problemUp.selectedPains || [],
              selectedBuyers: problemUp.selectedBuyers || [],
              relevantTriggerIds: problemUp.relevantTriggerIds || [],
              targetMoment: problemUp.targetMoment || '',
              notes: problemUp.notes || ''
            }
          });

          // Update selected status on target buyers
          if (problemUp.selectedBuyers && problemUp.selectedBuyers.length > 0) {
            const updatedBuyers = workshopData.targetBuyers.map(buyer => ({
              ...buyer,
              selected: problemUp.selectedBuyers.includes(buyer.id)
            }));

            updateWorkshopData({
              targetBuyers: updatedBuyers
            });
          }
        }
        break;

      case 9: // Refine Idea
        if (currentSuggestion.content?.refinedIdea) {
          updateWorkshopData({
            refinedIdea: {
              description: typeof currentSuggestion.content === 'object' && currentSuggestion.content.refinedIdea && typeof currentSuggestion.content.refinedIdea === 'object' ? (currentSuggestion.content.refinedIdea as any).description || '' : '',
              targetCustomers: typeof currentSuggestion.content === 'object' && currentSuggestion.content.refinedIdea && typeof currentSuggestion.content.refinedIdea === 'object' ? (currentSuggestion.content.refinedIdea as any).targetCustomers || '' : '',
              version: 'refined'
            },
            offer: {
              id: `offer_${Date.now()}`,
              name: typeof currentSuggestion.content === 'object' && currentSuggestion.content.refinedIdea && typeof currentSuggestion.content.refinedIdea === 'object' ? (currentSuggestion.content.refinedIdea as any).name || 'New Offer' : 'New Offer',
              description: typeof currentSuggestion.content === 'object' && currentSuggestion.content.refinedIdea && typeof currentSuggestion.content.refinedIdea === 'object' ? (currentSuggestion.content.refinedIdea as any).description || '' : '',
              format: typeof currentSuggestion.content === 'object' && currentSuggestion.content.refinedIdea && typeof currentSuggestion.content.refinedIdea === 'object' ? (currentSuggestion.content.refinedIdea as any).format || '' : '',
              targetBuyers: workshopData.problemUp?.selectedBuyers || [],
              painsSolved: workshopData.problemUp?.selectedPains || [],
              version: 'refined'
            }
          });
        }
        break;

      case 10: // Summary
        if (currentSuggestion.content?.reflections) {
          const reflections = currentSuggestion.content.reflections as Record<string, any>;
          const nextSteps = currentSuggestion.content.nextSteps as Array<{action: string, priority: string}> || [];

          updateWorkshopData({
            reflections: {
              keyInsights: reflections.keyInsights || '',
              nextSteps: Array.isArray(nextSteps) ? nextSteps.map(step =>
                `- ${step.action} (${step.priority} priority)`
              ).join('\n') : '',
            },
          });
        }
        break;
    }

    // Clear the current suggestion
    set({ currentSuggestion: null });
  },

  answerFollowUpQuestion: async (step: number, question: string) => {
    const { addChatMessage, workshopData } = get();

    // Add user message to chat
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      content: question,
      role: 'user',
      timestamp: new Date().toISOString(),
      step
    };
    addChatMessage(step, userMsg);

    set({ isAiLoading: true });

    try {
      // Generate AI response
      const response = await aiService.answerFollowUpQuestion(
        step,
        question,
        getStepContext(step, workshopData)
      );

      addChatMessage(step, response);

      // Optionally generate a suggestion based on the conversation
      const { generateStepSuggestion } = get();
      await generateStepSuggestion(step);
    } catch (error) {
      console.error('Error answering follow-up question:', error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error processing your question. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step
      };

      addChatMessage(step, errorMessage);
    } finally {
      set({ isAiLoading: false });
    }
  },

  // Sparky Modal actions
  openSparkyModal: (config) => {
    const { workshopData } = get();
    const stepNumber = config?.stepNumber || get().currentStep;

    // Get existing messages for this step if available
    const existingMessages = workshopData.stepChats[stepNumber]?.messages || [];

    set({
      isSparkyModalOpen: true,
      sparkyModalConfig: config,
      currentModalChatMessages: [...existingMessages]
    });

    // If there are no messages yet, add an initial assistant message
    if (existingMessages.length === 0 && config?.initialContext) {
      let initialContent = `I'm here to help you with ${config.exerciseTitle}. Let's get started!`;

      // Special handling for trigger events brainstorming - using exact script provided
      if (config.exerciseKey === 'triggerBrainstorm') {
        initialContent = "Let's explore Buying Triggers for your potential new offer! These are the specific events or 'final straw' moments that make someone realize they need *a* solution.\n\nSince you're already in business, to start, could you briefly describe the main solution (product or service) you *currently* offer and the typical customers or businesses you provide it to?";
      }

      const initialMessage: AIMessage = {
        id: Date.now().toString(),
        content: initialContent,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      set(state => ({
        currentModalChatMessages: [...state.currentModalChatMessages, initialMessage]
      }));

      // Also add to the step chat for persistence
      const { addChatMessage } = get();
      addChatMessage(stepNumber, initialMessage);
    }
  },

  closeSparkyModal: () => {
    set({
      isSparkyModalOpen: false,
      sparkyModalConfig: null
    });
  },

  sendSparkyModalMessage: async (userMessage: string) => {
    const { sparkyModalConfig, addChatMessage } = get();
    const stepNumber = sparkyModalConfig?.stepNumber || get().currentStep;
    const { workshopData } = get();

    // Create user message
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add to modal messages
    set(state => ({
      currentModalChatMessages: [...state.currentModalChatMessages, userMsg]
    }));

    // Add to step chat for persistence
    addChatMessage(stepNumber, userMsg);

    set({ isAiLoading: true });

    try {
      // Create a new SparkyService instance with mock responses enabled
      const mockSparkyService = new SparkyService(openaiService, 'gpt-4.1-2025-04-14', true);

      // Pass the current chat history to maintain conversation state
      const currentChatHistory = get().currentModalChatMessages;

      // Generate a mock response directly using the SparkyService
      const assistantMessage = await mockSparkyService.generateResponse(
        userMessage,
        stepNumber,
        workshopData,
        currentChatHistory
      );

      // Add the assistant message to the chat
      addChatMessage(stepNumber, assistantMessage);

      // Add to modal messages
      set(state => ({
        currentModalChatMessages: [...state.currentModalChatMessages, assistantMessage]
      }));
    } catch (error) {
      console.error('Error sending modal message:', error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      // Add to modal messages
      set(state => ({
        currentModalChatMessages: [...state.currentModalChatMessages, errorMessage]
      }));

      // Add to step chat for persistence
      addChatMessage(stepNumber, errorMessage);
    } finally {
      set({ isAiLoading: false });
    }
  },

  clearSparkyModalMessages: () => {
    set({ currentModalChatMessages: [] });
  },

  // Painstorming modal actions
  openPainstormingModal: (output: string) => set({
    painstormingOutput: output,
    isPainstormingModalOpen: true
  }),

  closePainstormingModal: () => set({
    isPainstormingModalOpen: false,
    painstormingOutput: null
  }),

  setFocusedProblems: (problems: string[]) => {
    set(state => {
      // Create a new problemUp object with the existing values plus the new notes
      const updatedProblemUp = {
        selectedPains: state.workshopData.problemUp?.selectedPains || [],
        selectedBuyers: state.workshopData.problemUp?.selectedBuyers || [],
        relevantTriggerIds: state.workshopData.problemUp?.relevantTriggerIds || [],
        targetMoment: state.workshopData.problemUp?.targetMoment || '',
        notes: `Selected problems from Painstorming analysis:\n${problems.map(p => `- ${p}`).join('\n')}`
      };

      return {
        focusedProblems: problems,
        workshopData: {
          ...state.workshopData,
          problemUp: updatedProblemUp
        }
      };
    });
  },

  // Brainstorming actions
  brainstormBigIdeasWithContext: async (context: BrainstormContext) => {
    const { addChatMessage } = get();

    set({ isAiLoading: true, isBrainstorming: true, brainstormIdeas: [] });

    // Add a message to indicate we're processing
    const processingMessage: AIMessage = {
      id: Date.now().toString(),
      content: context.contextType === 'url'
        ? `I'll analyze the content from ${context.contextValue} to help brainstorm ideas...`
        : "I'll analyze your background information to help brainstorm ideas...",
      role: 'assistant',
      timestamp: new Date().toISOString(),
      step: 2
    };

    addChatMessage(2, processingMessage);

    try {
      // Generate ideas based on the context
      const result = await brainstormService.generateBigIdeaSuggestions(context);

      // Store the ideas
      set({ brainstormIdeas: result.ideas });

      // First, add the summary message to provide context and analysis
      const summaryMessage: AIMessage = {
        id: Date.now().toString(),
        content: result.summary,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, summaryMessage);

      // Create a message with the ideas
      let ideasContent = "Based on this analysis, here are some scalable offer ideas for you to consider:\n\n";

      result.ideas.forEach((idea) => {
        ideasContent += `**${idea.conceptName}**\n${idea.description}\n\n`;
      });

      ideasContent += "You can click 'Use this idea' on any suggestion that resonates with you, or ask me to refine one further.";

      const ideasMessage: AIMessage = {
        id: Date.now().toString(),
        content: ideasContent,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, ideasMessage);
    } catch (error) {
      console.error("Error generating brainstorm ideas:", error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while brainstorming ideas. Let me provide some general examples instead.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, errorMessage);

      // Add fallback examples
      const fallbackMessage: AIMessage = {
        id: Date.now().toString(),
        content: "Here are some example Big Idea statements:\n\n1. A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.\n\n2. A template pack that helps consultants quickly create high-converting proposals.\n\n3. A productized service that provides SEO audits specifically for e-commerce stores.\n\n4. A membership community that provides ongoing support and resources for freelance designers.\n\n5. A course that teaches small business owners how to use AI tools to streamline their operations.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, fallbackMessage);
    } finally {
      set({ isAiLoading: false, isBrainstorming: false });
    }
  },

  refineBigIdea: async (initialIdea: string, userFeedback: string) => {
    const { addChatMessage } = get();

    set({ isAiLoading: true, isBrainstorming: true, brainstormIdeas: [] });

    // Add a message to indicate we're processing
    const processingMessage: AIMessage = {
      id: Date.now().toString(),
      content: `I'll refine the idea based on your feedback...`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      step: 2
    };

    addChatMessage(2, processingMessage);

    try {
      // Generate refined ideas
      const result = await brainstormService.refineBigIdea(initialIdea, userFeedback);

      // Store the ideas
      set({ brainstormIdeas: result.ideas });

      // First, add the summary message to provide context and analysis
      const summaryMessage: AIMessage = {
        id: Date.now().toString(),
        content: result.summary,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, summaryMessage);

      // Create a message with the ideas
      let ideasContent = "Here are some refined versions of your idea:\n\n";

      result.ideas.forEach((idea) => {
        ideasContent += `**${idea.conceptName}**\n${idea.description}\n\n`;
      });

      ideasContent += "You can click 'Use this idea' on any suggestion that resonates with you.";

      const ideasMessage: AIMessage = {
        id: Date.now().toString(),
        content: ideasContent,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, ideasMessage);
    } catch (error) {
      console.error("Error refining big idea:", error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while refining your idea. Let's try a different approach.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
        step: 2
      };

      addChatMessage(2, errorMessage);
    } finally {
      set({ isAiLoading: false, isBrainstorming: false });
    }
  },

  useBrainstormIdea: (idea: BrainstormIdea) => {
    const { updateWorkshopData, addChatMessage } = get();

    // Update the big idea with the selected idea
    updateWorkshopData({
      bigIdea: {
        description: idea.description,
        version: 'initial'
      }
    });

    // Add a confirmation message
    const confirmationMessage: AIMessage = {
      id: Date.now().toString(),
      content: `✅ I've added "${idea.conceptName}" to your workshop.`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      step: 2
    };

    addChatMessage(2, confirmationMessage);

    // Clear the brainstorm ideas
    set({ brainstormIdeas: [] });
  },

  generatePainstormingSuggestions: async () => {
    const { workshopData, openPainstormingModal, addChatMessage } = get();

    // Find the selected job statement
    const selectedJob = workshopData.jobs.find(job => job.selected);
    const chosenJobStatement = selectedJob ? selectedJob.description : '';

    // Get top 3 buyer segments
    const topBuyerSegments = workshopData.targetBuyers
      .slice(0, 3)
      .map(buyer => buyer.description);

    // Get big idea statement
    const bigIdeaStatement = workshopData.bigIdea?.description || '';

    // Basic validation
    if (!chosenJobStatement || topBuyerSegments.length === 0 || !bigIdeaStatement) {
      console.error("Missing context for Painstorming");
      addChatMessage(6, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I need your Job Statement and Target Buyer Segments first! Please make sure you've completed the previous steps.",
        timestamp: new Date().toISOString(),
        step: 6
      });
      return;
    }

    set({ isAiLoading: true });
    addChatMessage(6, {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Okay, analyzing pains for your job and target segments... This might take a moment.",
      timestamp: new Date().toISOString(),
      step: 6
    });

    try {
      const painstormingMarkdown = await aiService.getPainstormingAnalysis(
        chosenJobStatement,
        topBuyerSegments,
        bigIdeaStatement
      );

      if (painstormingMarkdown) {
        openPainstormingModal(painstormingMarkdown);

        // Add a chat message indicating the modal is open
        addChatMessage(6, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I've generated a detailed Painstorming analysis. Please review it in the detailed view that just opened and select the key problems you want to focus on.",
          timestamp: new Date().toISOString(),
          step: 6
        });
      } else {
        throw new Error("Received empty response from AI service.");
      }
    } catch (error) {
      console.error("Error generating Painstorming suggestions:", error);
      addChatMessage(6, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error while generating the Painstorming analysis. Please try again.",
        timestamp: new Date().toISOString(),
        step: 6
      });
    } finally {
      set({ isAiLoading: false });
    }
  },

  // Pain parsing actions
  setRawPainstormingInput: (text: string) => {
    set({ rawPainstormingInput: text });
  },

  parseAndSavePains: async (text: string) => {
    const { workshopData, addChatMessage } = get();
    set({ isParsing: true });

    try {
      // Get the selected job statement
      const chosenJobStatement = workshopData.jobs.find(job => job.isOverarching || job.selected)?.description || '';

      // Get the top 3 buyer segments
      const topBuyerSegments = workshopData.targetBuyers
        .filter(buyer => buyer.isTopThree)
        .map(buyer => buyer.description);

      // Save the raw input
      set({ rawPainstormingInput: text });

      // Parse the text using the PainParsingService
      const parsedResult = await painParsingService.parsePainstormingText(
        text,
        chosenJobStatement,
        topBuyerSegments
      );

      // Save the parsed pains
      set({
        parsedPains: {
          buyerSegmentPains: parsedResult.buyerSegmentPains,
          overlappingPains: parsedResult.overlappingPains
        }
      });

      // Open the modal to let the user select which pains to save
      set({ isPainParsingModalOpen: true });

      // Add a chat message indicating the parsing was successful
      addChatMessage(6, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've parsed your painstorming text and extracted the pain points. Please review and select the ones you want to save.",
        timestamp: new Date().toISOString(),
        step: 6
      });

    } catch (error) {
      console.error("Error parsing painstorming text:", error);

      // Add error message to chat
      addChatMessage(6, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while parsing the painstorming text. Please try again or add pains manually.",
        timestamp: new Date().toISOString(),
        step: 6
      });
    } finally {
      set({ isParsing: false });
    }
  },

  openPainParsingModal: () => {
    set({ isPainParsingModalOpen: true });
  },

  closePainParsingModal: () => {
    set({ isPainParsingModalOpen: false });
  },

  saveParsedPains: (pains: Pain[]) => {
    const { workshopData } = get();

    // Update the workshop data with the selected pains
    set({
      workshopData: {
        ...workshopData,
        pains: [...workshopData.pains, ...pains]
      }
    });

    // Close the modal
    set({ isPainParsingModalOpen: false });
  },
}));