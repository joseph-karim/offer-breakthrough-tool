import React, { useState, useEffect, useRef, KeyboardEvent, useMemo } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { ChatMessage } from './ChatMessage';
import { SuggestionCard } from './SuggestionCard';
import type { AIMessage, StepQuestion } from '../../../types/chat';
import type { AIService } from '../../../services/aiService';
import { Send, Loader2, Brain } from 'lucide-react';

// Remove the circular dependency by removing this export
// This type is now defined in src/types/chat.ts
// type AssistantType = ...

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
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    workshopData,
    addChatMessage,
    currentSuggestion,
    setCurrentSuggestion
  } = useWorkshopStore();

  const stepChat = workshopData.stepChats?.[step] || { messages: [] };
  
  // Use useMemo to prevent the messages array from causing rerenders
  const messages = useMemo(() => stepChat.messages || [], [stepChat.messages]);
  
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
        {/* Buyer Breakthrough Toolkit Header - CustomerCamp Styled */}
        <div style={{ 
          backgroundColor: '#222222', 
          borderBottom: '2px solid #FFDD00',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain size={22} color="#FFDD00" />
            <span style={{ 
              fontWeight: 700, 
              fontSize: '16px', 
              color: '#FFDD00',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              ✨ Buyer Breakthrough Toolkit
            </span>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#333333',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23444444\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\'/%3E%3C/g%3E%3C/svg%3E")'
        }} className="flex-1 overflow-y-auto p-4 space-y-2 h-[400px]">
          {messages.map((message: AIMessage) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center text-yellow-300 ml-10">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-yellow-300" />
              ✨ AI is crafting a response...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200" style={{ 
          backgroundColor: '#222222', 
          borderTop: '2px solid #FFDD00'
        }}>
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 mr-2 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              style={{
                backgroundColor: '#333333',
                color: 'white',
                border: '1px solid #444444'
              }}
              placeholder={isTyping ? "✨ Please wait..." : "✨ Type your message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isTyping || !inputValue.trim()}
              rightIcon={<Send className="h-4 w-4" />}
              variant="yellow"
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