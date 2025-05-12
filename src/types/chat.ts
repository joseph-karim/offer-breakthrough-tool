export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  suggestions?: ChatSuggestion[];
  timestamp: string;
  step?: number; // The step this message is associated with
  field?: string; // The field this message is related to
  stepContext?: number; // For compatibility with SparkyMessage
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
  'big-idea-generator' |
  'underlying-goal-advisor' |
  'trigger-event-finder' |
  'job-statement-refiner' |
  'target-buyer-analyzer' |
  'painstorming-helper' |
  'problem-up-advisor' |
  'idea-refiner' |
  'workshop-summarizer' |
  'capability-analyzer';