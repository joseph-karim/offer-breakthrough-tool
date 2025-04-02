export interface AIMessage {
  id: string;
  content: string | any;
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
  content: any;
  rawResponse: string;
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