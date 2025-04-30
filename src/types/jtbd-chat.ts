/**
 * Types for the JTBD Chat System
 */

// Input collection types
export interface JTBDInput {
  productService: string;
  desiredOutcomes: string;
  triggerEvents: string;
}

// Output types
export interface JTBDOutput {
  overarchingJobStatement: string;
  supportingJobStatements: string[];
}

// Chat message types
export interface JTBDMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  messageType?: JTBDMessageType;
}

export type JTBDMessageType = 
  'welcome' | 
  'product-service-question' | 
  'product-service-input' |
  'desired-outcomes-question' | 
  'desired-outcomes-input' |
  'trigger-events-question' | 
  'trigger-events-input' |
  'processing' |
  'result' |
  'refinement-suggestion' |
  'implementation-guidance';

// Chat state
export interface JTBDChatState {
  messages: JTBDMessage[];
  input: JTBDInput;
  output?: JTBDOutput;
  currentScreen: JTBDScreen;
  isProcessing: boolean;
  error?: string;
}

export type JTBDScreen = 
  'welcome' | 
  'product-service' | 
  'desired-outcomes' | 
  'trigger-events' | 
  'processing' | 
  'results' | 
  'refinement' | 
  'implementation' | 
  'export';

// Suggestion types
export interface JTBDSuggestion {
  id: string;
  content: string;
  type: JTBDSuggestionType;
  score?: number;
  metadata?: Record<string, any>;
}

export type JTBDSuggestionType = 
  'overarching-job-statement' | 
  'supporting-job-statement' | 
  'product-service-improvement' | 
  'desired-outcomes-improvement' | 
  'trigger-events-improvement';

// Modal types
export interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestionType: JTBDSuggestionType;
  currentInput: string;
  suggestions: JTBDSuggestion[];
  onSelectSuggestion: (suggestion: JTBDSuggestion) => void;
}

// Feedback types
export interface JTBDFeedback {
  statementId: string;
  rating: number;
  comments?: string;
  improvementSuggestions?: string[];
}
