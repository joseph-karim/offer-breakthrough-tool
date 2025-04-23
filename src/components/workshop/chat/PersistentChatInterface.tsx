import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AIMessage } from '../../../types/chat';
import { AIService } from '../../../services/aiService';
import { Send, Loader2, Brain, MessageSquare, X } from 'lucide-react';

interface PersistentChatInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PersistentChatInterface: React.FC<PersistentChatInterfaceProps> = ({
  isOpen = true,
  onClose
}) => {
  const {
    currentStep,
    workshopData,
    addChatMessage,
    currentSuggestion,
    setCurrentSuggestion,
    acceptSuggestion
  } = useWorkshopStore();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // No suggestions state needed
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Get all messages from all steps for a persistent chat experience
  const allMessages = Object.values(workshopData.stepChats || {})
    .flatMap(chat => chat.messages || [])
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, isOpen]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    setIsTyping(true);

    // Add user message to chat
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    if (typeof currentStep === 'number') {
      addChatMessage(currentStep, userMessage);
    }
    setInputValue('');

    try {
      // Get context for the current step
      const stepContext = getStepContext(currentStep, workshopData);

      // Generate AI response
      const assistantResponse = await aiService.answerFollowUpQuestion(
        currentStep,
        typeof userMessage.content === 'string' ? userMessage.content : JSON.stringify(userMessage.content),
        stepContext
      );

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, assistantResponse);
      }

      // Generate suggestions based on the conversation
      await generateSuggestions();
    } catch (error) {
      console.error('Error in chat:', error);

      // Add error message
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, errorMessage);
      }
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, currentStep, workshopData, addChatMessage, aiService]);

  // Generate context-aware suggestions
  const generateSuggestions = useCallback(async () => {
    try {
      const suggestion = await aiService.getStepSuggestion(
        currentStep,
        getStepContext(currentStep, workshopData)
      );

      if (suggestion) {
        setCurrentSuggestion(suggestion);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  }, [currentStep, workshopData, setCurrentSuggestion, aiService]);

  // Handle selecting a suggestion
  const handleSelectSuggestion = useCallback(() => {
    if (typeof currentStep === 'number') {
      acceptSuggestion(currentStep);
      setShowSuggestions(false);
    }
  }, [currentStep, acceptSuggestion]);

  // Handle key press (Enter to send)
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Helper function to get context for the current step
  function getStepContext(step: number, _data: any): string {
    // This is a simplified version - in a real implementation,
    // you would extract relevant context based on the current step
    return `Workshop Progress: Step ${step}`;
  }

  // Render message bubbles
  const renderMessage = (message: AIMessage) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginBottom: '12px',
          alignItems: 'flex-start',
          gap: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '36px',
            width: '36px',
            borderRadius: '50%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFDD00',
            color: '#222222',
            border: `2px solid ${isUser ? '#EEEEEE' : '#FFDD00'}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            flexShrink: 0
          }}
        >
          {isUser ? '👤' : '✨'}
        </div>

        <div
          style={{
            padding: '12px 16px',
            maxWidth: '70%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFFFFF',
            borderColor: isUser ? '#EEEEEE' : '#FFDD00',
            borderWidth: '1px',
            borderLeftWidth: isUser ? '1px' : '3px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{
            fontSize: '14px',
            marginBottom: '4px',
            color: '#222222',
            fontWeight: 600
          }}>
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          <div style={{
            fontSize: '15px',
            lineHeight: 1.5,
            color: '#333333',
            whiteSpace: 'pre-wrap'
          }}>
            {typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content, null, 2)}
          </div>
          <div style={{ fontSize: '12px', color: '#888888', marginTop: '8px', textAlign: isUser ? 'right' : 'left' }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Card
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        border: '1px solid #EEEEEE',
        borderLeft: '3px solid #FFDD00'
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain style={{ color: '#FFDD00', width: '20px', height: '20px' }} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Workshop Assistant</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="#666666" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div
        style={{
          padding: '16px',
          overflowY: 'auto',
          flexGrow: 1,
          maxHeight: '400px',
          backgroundColor: '#FAFAFA'
        }}
      >
        {allMessages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666666', padding: '20px' }}>
            <MessageSquare style={{ width: '24px', height: '24px', margin: '0 auto 12px' }} />
            <p>Ask me anything about the workshop or for help with the current step.</p>
          </div>
        ) : (
          allMessages.map(renderMessage)
        )}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666666' }}>
            <Loader2 className="animate-spin" size={16} />
            <span>AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && currentSuggestion && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #EEEEEE',
            backgroundColor: '#FFFDF5'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Suggestion</h4>
            <Button
              variant="yellow"
              size="sm"
              onClick={handleSelectSuggestion}
            >
              Accept & Apply
            </Button>
          </div>
          <div
            style={{
              fontSize: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #EEEEEE',
              borderRadius: '8px',
              padding: '8px 12px',
              maxHeight: '100px',
              overflowY: 'auto'
            }}
          >
            {typeof currentSuggestion.content === 'string'
              ? currentSuggestion.content
              : JSON.stringify(currentSuggestion.content, null, 2)}
          </div>
        </div>
      )}

      {/* Input Container */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #EEEEEE',
          display: 'flex',
          gap: '8px',
          backgroundColor: '#FFFFFF'
        }}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flexGrow: 1,
            border: '1px solid #EEEEEE',
            borderRadius: '8px',
            padding: '8px 12px',
            resize: 'none',
            minHeight: '40px',
            maxHeight: '120px',
            fontSize: '14px',
            lineHeight: 1.5
          }}
          rows={1}
        />
        <Button
          variant="yellow"
          size="sm"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          style={{ alignSelf: 'flex-end' }}
        >
          {isTyping ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </Button>
      </div>
    </Card>
  );
};
