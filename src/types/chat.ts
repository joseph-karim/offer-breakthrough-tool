export interface AIMessage {
  id: string;
  content: string | Record<string, unknown>;
  role: 'user' | 'assistant';
  suggestions?: ChatSuggestion[];
  timestamp: string;
}

export interface StepChat {
  messages: AIMessage[];
  currentQuestionIndex?: number;
  isComplete?: boolean;
}

export interface StepChats {
  [step: number]: StepChat;
}

export interface ChatSuggestion {
  step: number;
  content: Record<string, unknown>;
  rawResponse: string | Record<string, unknown>;
}

export interface StepQuestion {
  id: string;
  text: string;
  context: string;
  requirements: string;
}

export interface StepQuestions {
  [step: number]: StepQuestion[];
}

// Define the specialized assistant types for the Buyer Breakthrough Toolkit
export type AssistantType = 
  'default' | 
  'business-analyzer' | 
  'anti-goal-generator' | 
  'job-statement-refiner' | 
  'problem-expander' | 
  'capability-analyzer' | 
  'market-evaluator' | 
  'research-designer';  