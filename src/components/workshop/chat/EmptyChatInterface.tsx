import React from 'react';
import type { StepQuestion } from '../../../types/chat';
import type { AIService } from '../../../services/aiService';

interface EmptyChatInterfaceProps {
  step: number;
  stepContext: string;
  questions: StepQuestion[];
  aiService: AIService;
  onSuggestionAccept: (step: number) => void;
}

// This is an empty component that replaces the ChatInterface
// It doesn't render anything since we now have the persistent chat
export const EmptyChatInterface: React.FC<EmptyChatInterfaceProps> = () => {
  return null;
};
