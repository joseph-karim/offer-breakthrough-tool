import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ChatMessage } from './ChatMessage';
import { SuggestionCard } from './SuggestionCard';
import type { AIMessage, StepQuestion } from '../../../types/chat';
import type { AIService } from '../../../services/aiService';
import { Send, Loader2, Brain, BarChart, Target, AlertCircle, Lightbulb, ArrowRightLeft, LineChart, Microscope } from 'lucide-react';

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

interface AssistantDefinition {
  id: AssistantType;
  name: string;
  description: string;
  icon: React.ReactNode;
  availableSteps: number[];
}

// Define the available assistants in the Buyer Breakthrough Toolkit
const ASSISTANTS: AssistantDefinition[] = [
  {
    id: 'default',
    name: 'General Assistant',
    description: 'General guidance for the current workshop step',
    icon: <Brain size={20} />,
    availableSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: 'business-analyzer',
    name: 'Business Analyzer',
    description: 'Analyzes current business structure and client base to identify patterns and opportunities',
    icon: <BarChart size={20} />,
    availableSteps: [1, 2]
  },
  {
    id: 'anti-goal-generator',
    name: 'Anti-Goal Generator',
    description: 'Helps identify client types and situations to avoid based on past experiences',
    icon: <AlertCircle size={20} />,
    availableSteps: [3]
  },
  {
    id: 'job-statement-refiner',
    name: 'Job Statement Refiner',
    description: 'Refines job statements using the JTBD framework',
    icon: <Target size={20} />,
    availableSteps: [5]
  },
  {
    id: 'problem-expander',
    name: 'Problem Expander',
    description: 'Generates additional problem ideas based on initial input',
    icon: <Lightbulb size={20} />,
    availableSteps: [7]
  },
  {
    id: 'capability-analyzer',
    name: 'Capability Analyzer',
    description: 'Maps solution capabilities to potential problems',
    icon: <ArrowRightLeft size={20} />,
    availableSteps: [7]
  },
  {
    id: 'market-evaluator',
    name: 'Market Evaluator',
    description: 'Provides market intelligence to assist with segment scoring',
    icon: <LineChart size={20} />,
    availableSteps: [6]
  },
  {
    id: 'research-designer',
    name: 'Research Designer',
    description: 'Creates customized research protocols based on identified problems and segments',
    icon: <Microscope size={20} />,
    availableSteps: [8, 9, 10, 11]
  }
];

interface ChatInterfaceProps {
  step: number;
  stepContext: string;
  questions: StepQuestion[];
  aiService: AIService;
  onSuggestionAccept: (step: number) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  step,
  stepContext,
  questions,
  aiService,
  onSuggestionAccept
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType>('default');
  const [showAssistantSelector, setShowAssistantSelector] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    workshopData,
    addChatMessage,
    currentSuggestion,
    setCurrentSuggestion
  } = useWorkshopStore();

  const stepChat = workshopData.stepChats?.[step] || { messages: [] };
  const messages = stepChat.messages || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Send the first question if there are no messages
  useEffect(() => {
    if (messages.length === 0 && currentQuestion) {
      const question: AIMessage = {
        id: Date.now().toString(),
        content: currentQuestion.text,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      addChatMessage(step, question);
    }
  }, [messages, currentQuestion, addChatMessage, step]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Add user message to chat
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    addChatMessage(step, userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      if (currentQuestionIndex < questions.length - 1) {
        // If not the last question, just provide a response and move to next question
        const assistantResponse = await aiService.answerFollowUpQuestion(
          step,
          inputValue,
          stepContext
        );
        
        addChatMessage(step, assistantResponse);
        
        // Move to the next question
        setCurrentQuestionIndex(prev => prev + 1);
        
        // Add the next question as a message
        const nextQuestion = questions[currentQuestionIndex + 1];
        if (nextQuestion) {
          const questionMessage: AIMessage = {
            id: Date.now().toString(),
            content: nextQuestion.text,
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
          
          // Small delay for a more natural conversation flow
          setTimeout(() => {
            addChatMessage(step, questionMessage);
          }, 1000);
        }
      } else {
        // For the last question, generate a suggestion
        const suggestion = await aiService.getStepSuggestion(
          step,
          stepContext
        );
        
        if (suggestion) {
          setCurrentSuggestion(suggestion);
          
          // Also add a message acknowledging the input
          const responseMessage: AIMessage = {
            id: Date.now().toString(),
            content: 'Thank you for your input! I\'ve prepared some suggestions based on what you\'ve shared.',
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
          
          addChatMessage(step, responseMessage);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message to chat
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      addChatMessage(step, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden" padding="none">
      <div className="flex flex-col h-full overflow-hidden rounded-lg border border-gray-200">
        <div style={{ backgroundColor: '#f9fafb' }} className="flex-1 overflow-y-auto p-4 space-y-1 h-[400px]">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center text-gray-500 ml-10">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              AI is thinking...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={isTyping ? "Please wait..." : "Type your message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isTyping || !inputValue.trim()}
              rightIcon={<Send className="h-4 w-4" />}
              variant="primary"
            >
              Send
            </Button>
          </div>
        </div>
        
        {currentSuggestion && (
          <div className="mt-4">
            <SuggestionCard
              suggestion={currentSuggestion}
              onAccept={() => onSuggestionAccept(step)}
              isLoading={isTyping}
            />
          </div>
        )}
      </div>
    </Card>
  );
}; 