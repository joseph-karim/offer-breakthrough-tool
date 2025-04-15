import { create } from 'zustand';
import type { WorkshopData, AntiGoals, TriggerEvent, Job, Market, Problem, Pricing } from '../types/workshop';
import type { AIMessage, ChatSuggestion } from '../types/chat';
import { AIService } from '../services/aiService';
import { STEP_QUESTIONS } from '../services/aiService';

export interface WorkshopStore {
  // Session state
  sessionId: string | null;
  currentStep: number;
  isSaving: boolean;
  isAiLoading: boolean;
  validationErrors: boolean;

  // Workshop data
  workshopData: WorkshopData;
  currentSuggestion: ChatSuggestion | null;

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
  pricing: {
    strategy: '',
    justification: ''
  },
};

// Helper function to check if a step is complete
const isStepComplete = (_step: number, _data: WorkshopData): boolean => {
  // Always return true to allow navigation regardless of completion status
  return true;
  
  /* Original validation logic for reference:
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
  */
};

// Create AI service instance
const aiService = new AIService({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
});

// Helper function to extract relevant context for a step
function getStepContext(step: number, workshopData: WorkshopData): string {
  let context = '';
  
  // Add relevant data based on the step
  switch (step) {
    case 3: // Anti-Goals
      context = `
        Workshop Progress: Step 3 - Anti-Goals
        
        Previous inputs:
        ${workshopData.marketDemandAnalysis ? `Market Demand Analysis: ${workshopData.marketDemandAnalysis}` : ''}
      `;
      break;
      
    case 4: // Trigger Events
      context = `
        Workshop Progress: Step 4 - Trigger Events
        
        Previous inputs:
        ${workshopData.marketDemandAnalysis ? `Market Demand Analysis: ${workshopData.marketDemandAnalysis}` : ''}
        
        Anti-Goals:
        ${Object.entries(workshopData.antiGoals)
          .filter(([, value]) => value.trim())
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n')}
      `;
      break;
      
    case 5: // Jobs
      context = `
        Workshop Progress: Step 5 - Jobs to be Done
        
        Previous inputs:
        Market Demand: ${workshopData.marketDemandAnalysis}
        
        Trigger Events:
        ${workshopData.triggerEvents
          .map(event => `- ${event.description}`)
          .join('\n')}
      `;
      break;
      
    case 6: // Markets
      context = `
        Workshop Progress: Step 6 - Target Markets
        
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
      
    case 7: // Problems
      context = `
        Workshop Progress: Step 7 - Key Problems
        
        Previous inputs:
        Markets:
        ${workshopData.markets
          .map(market => `- ${market.description}`)
          .join('\n')}
          
        Jobs to be Done:
        ${workshopData.jobs
          .map(job => `- ${job.description}`)
          .join('\n')}
      `;
      break;
      
    case 8: // Market Evaluation
      context = `
        Workshop Progress: Step 8 - Market Evaluation
        
        Markets to Evaluate:
        ${workshopData.markets
          .map(market => `- ${market.description}`)
          .join('\n')}
          
        Problems Identified:
        ${workshopData.problems
          .map(problem => `- ${problem.description}`)
          .join('\n')}
      `;
      break;
      
    case 9: // Value Proposition
      context = `
        Workshop Progress: Step 9 - Value Proposition
        
        Selected Market:
        ${workshopData.markets
          .filter(market => market.selected)
          .map(market => `- ${market.description}`)
          .join('\n')}
          
        Key Problems:
        ${workshopData.problems
          .map(problem => `- ${problem.description}`)
          .join('\n')}
      `;
      break;
      
    case 10: // Pricing
      context = `
        Workshop Progress: Step 10 - Pricing Strategy
        
        Value Proposition:
        Unique Value: ${workshopData.valueProposition.uniqueValue}
        Pain Points: ${workshopData.valueProposition.painPoints}
        Benefits: ${workshopData.valueProposition.benefits}
        Differentiators: ${workshopData.valueProposition.differentiators}
        
        Selected Market:
        ${workshopData.markets
          .filter(market => market.selected)
          .map(market => `- ${market.description}`)
          .join('\n')}
      `;
      break;
      
    case 11: // Summary
      context = `
        Workshop Summary:
        
        Market Demand Analysis:
        ${workshopData.marketDemandAnalysis}
        
        Anti-Goals:
        ${Object.entries(workshopData.antiGoals)
          .filter(([, value]) => value.trim())
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n')}
        
        Trigger Events:
        ${workshopData.triggerEvents
          .map(event => `- ${event.description}`)
          .join('\n')}
        
        Jobs to be Done:
        ${workshopData.jobs
          .map(job => `- ${job.description}`)
          .join('\n')}
        
        Target Market:
        ${workshopData.markets
          .filter(market => market.selected)
          .map(market => `- ${market.description}`)
          .join('\n')}
        
        Key Problems:
        ${workshopData.problems
          .map(problem => `- ${problem.description}`)
          .join('\n')}
        
        Value Proposition:
        ${workshopData.valueProposition ? `
          Unique Value: ${workshopData.valueProposition.uniqueValue}
          Pain Points: ${workshopData.valueProposition.painPoints}
          Benefits: ${workshopData.valueProposition.benefits}
          Differentiators: ${workshopData.valueProposition.differentiators}
        ` : ''}
        
        Pricing:
        ${workshopData.pricing ? `
          Strategy: ${workshopData.pricing.strategy}
          Justification: ${workshopData.pricing.justification}
        ` : ''}
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
      case 3: // Anti-Goals
        if (currentSuggestion.content?.antiGoals) {
          updateWorkshopData({
            antiGoals: currentSuggestion.content.antiGoals as AntiGoals,
          });
        }
        break;
        
      case 4: // Trigger Events
        if (currentSuggestion.content?.triggerEvents) {
          // Get existing trigger events and append new ones
          const existingEvents = workshopData.triggerEvents || [];
          const newEvents = (currentSuggestion.content.triggerEvents as TriggerEvent[]).map((event) => ({
            ...event,
            source: 'assistant' as const, // Mark as coming from assistant
          }));
          
          updateWorkshopData({
            triggerEvents: [...existingEvents, ...newEvents] as TriggerEvent[],
          });
        }
        break;
        
      case 5: // Jobs
        if (currentSuggestion.content?.jobs) {
          // Get existing jobs and append new ones
          const existingJobs = workshopData.jobs || [];
          const newJobs = (currentSuggestion.content.jobs as Job[]).map((job) => ({
            ...job,
            source: 'assistant' as const, // Mark as coming from assistant
          }));
          
          updateWorkshopData({
            jobs: [...existingJobs, ...newJobs] as Job[],
          });
        }
        break;
        
      case 6: // Markets
        if (currentSuggestion.content?.markets) {
          // Get existing markets and append new ones
          const existingMarkets = workshopData.markets || [];
          const newMarkets = (currentSuggestion.content.markets as Market[]).map((market) => ({
            ...market,
            source: 'assistant' as const, // Mark as coming from assistant
          }));
          
          updateWorkshopData({
            markets: [...existingMarkets, ...newMarkets] as Market[],
          });
        }
        break;
        
      case 7: // Problems
        if (currentSuggestion.content?.problems) {
          // Get existing problems and append new ones
          const existingProblems = workshopData.problems || [];
          const newProblems = (currentSuggestion.content.problems as Problem[]).map((problem, index: number) => ({
            ...problem,
            id: `ai_${Date.now()}_${index}`,
            ranking: existingProblems.length + index + 1,
            selected: false,
          }));
          
          updateWorkshopData({
            problems: [...existingProblems, ...newProblems],
          });
        }
        break;
        
      case 8: // Market Evaluation
        if (currentSuggestion.content?.marketScores && currentSuggestion.content.recommendedMarket) {
          // Update market evaluations with scores
          const marketEvaluations = { ...(workshopData.marketEvaluations || {}) };
          
          interface MarketScore {
            marketDescription: string;
            scores: {
              size: number;
              urgency: number;
              competition: number;
              accessibility: number;
              willingness: number;
            };
          }
          
          (currentSuggestion.content.marketScores as MarketScore[]).forEach((marketScore) => {
            // Find matching market by description
            const market = workshopData.markets.find(
              m => m.description === marketScore.marketDescription
            );
            
            if (market) {
              marketEvaluations[market.id] = {
                marketSize: marketScore.scores.size,
                growthPotential: marketScore.scores.urgency,
                competitionLevel: marketScore.scores.competition,
                accessibilityToMarket: marketScore.scores.accessibility,
                profitPotential: marketScore.scores.willingness,
              };
            }
          });
          
          // Select recommended market
          const recommendedMarket = workshopData.markets.find(
            m => m.description === currentSuggestion.content.recommendedMarket
          );
          
          const updatedMarkets = workshopData.markets.map(market => ({
            ...market,
            selected: market.id === recommendedMarket?.id,
          }));
          
          updateWorkshopData({
            markets: updatedMarkets,
            marketEvaluations,
          });
        }
        break;
        
      case 9: // Value Proposition
        if (currentSuggestion.content?.offers && Array.isArray(currentSuggestion.content.offers) && currentSuggestion.content.offers.length > 0) {
          const offer = currentSuggestion.content.offers[0] as Record<string, any>;
          
          updateWorkshopData({
            valueProposition: {
              uniqueValue: offer.description || '',
              painPoints: Array.isArray(offer.problemsSolved) ? offer.problemsSolved.join("\n\n") : '',
              benefits: Array.isArray(offer.benefits) ? offer.benefits.join("\n\n") : '',
              differentiators: `Format: ${offer.format || ''}\n\n${offer.name || ''}`,
            },
          });
        }
        break;
        
      case 10: // Pricing
        if (currentSuggestion.content?.pricingStrategy) {
          const pricing = currentSuggestion.content.pricingStrategy as Record<string, any>;
          const positioning = currentSuggestion.content.positioning as Record<string, any> || {};
          
          updateWorkshopData({
            pricing: {
              strategy: pricing.pricingModel || '',
              justification: `
                Value Metrics:
                ${Array.isArray(pricing.valueMetrics) ? pricing.valueMetrics.join('\n') : ''}
                
                Price Points:
                ${Array.isArray(pricing.pricePoints) ? pricing.pricePoints.map((pp: { tier: string; price: string | number }) => `- ${pp.tier}: ${pp.price}`).join('\n') : ''}
                
                Positioning:
                ${positioning?.statement || ''}
                
                Differentiators:
                ${Array.isArray(positioning?.differentiators) ? positioning?.differentiators.join('\n') : ''}
              `,
            },
          });
        }
        break;
        
      case 11: // Reflections
        if (currentSuggestion.content?.analysis && currentSuggestion.content?.nextSteps) {
          const analysis = currentSuggestion.content.analysis as Record<string, any>;
          const nextSteps = currentSuggestion.content.nextSteps as Array<{action: string, priority: string}>;
          
          updateWorkshopData({
            reflections: {
              keyInsights: `
                Strengths:
                ${Array.isArray(analysis.strengths) ? analysis.strengths.join('\n') : ''}
                
                Risks:
                ${Array.isArray(analysis.risks) ? analysis.risks.join('\n') : ''}
                
                Opportunities:
                ${Array.isArray(analysis.opportunities) ? analysis.opportunities.join('\n') : ''}
              `,
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
}));                