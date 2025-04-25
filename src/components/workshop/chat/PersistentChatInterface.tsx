import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AIMessage } from '../../../types/chat';
import { AIService } from '../../../services/aiService';
import { JTBDService } from '../../../services/jtbdService';
import { OpenAIService } from '../../../services/openai';
import { JTBDSuggestionModal } from './JTBDSuggestionModal';
import { Send, Loader2, X, Lightbulb, Sparkles } from 'lucide-react';

interface PersistentChatInterfaceProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFixed?: boolean; // Whether the chat is fixed position or part of the layout
}

export const PersistentChatInterface: React.FC<PersistentChatInterfaceProps> = ({
  isOpen = true,
  onClose,
  isFixed = true
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

  // Create AI service instances
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const aiService = new AIService({
    apiKey: apiKey,
  });

  // Create OpenAI service for JTBD
  const openaiService = new OpenAIService({
    apiKey: apiKey
  });

  // Create JTBD service with base GPT-4.1 model
  const jtbdService = new JTBDService(
    openaiService,
    'gpt-4.1-2025-04-14'
  );

  // State for JTBD input collection
  const [jtbdInput, setJtbdInput] = useState({
    productService: '',
    desiredOutcomes: '',
    triggerEvents: ''
  });

  // State for JTBD output
  const [jtbdOutput, setJtbdOutput] = useState<{
    overarchingJobStatement: string;
    supportingJobStatements: string[];
  } | null>(null);

  // State for JTBD collection mode
  const [collectingJTBD, setCollectingJTBD] = useState<'product' | 'outcomes' | 'triggers' | null>(null);

  // State for JTBD suggestion modal
  const [showJTBDSuggestionModal, setShowJTBDSuggestionModal] = useState(false);
  const [jtbdSuggestionType, setJtbdSuggestionType] = useState<'overarching' | 'supporting'>('overarching');
  const [currentJTBDStatement, setCurrentJTBDStatement] = useState('');
  const [jtbdSuggestions, setJtbdSuggestions] = useState<Array<{
    id: string;
    content: string;
    type: 'overarching' | 'supporting';
  }>>([]);

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

  // Function to open JTBD suggestion modal
  const openJTBDSuggestionModal = async (
    type: 'overarching' | 'supporting',
    statement: string
  ) => {
    setJtbdSuggestionType(type);
    setCurrentJTBDStatement(statement);

    // Generate suggestions
    const suggestions = await generateJTBDSuggestions(type, statement);
    setJtbdSuggestions(suggestions);

    // Show the modal
    setShowJTBDSuggestionModal(true);
  };

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
      // Handle JTBD input collection if in collection mode
      if (collectingJTBD) {
        // Store the input based on what we're collecting
        if (collectingJTBD === 'product') {
          setJtbdInput(prev => ({ ...prev, productService: inputValue.trim() }));

          // Add assistant response asking for desired outcomes
          const outcomeQuestion: AIMessage = {
            id: Date.now().toString(),
            content: "Great! Now, what outcomes do your customers desire from this product or service?",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, outcomeQuestion);
          }

          // Move to next collection step
          setCollectingJTBD('outcomes');
          setIsTyping(false);
          return;
        }
        else if (collectingJTBD === 'outcomes') {
          setJtbdInput(prev => ({ ...prev, desiredOutcomes: inputValue.trim() }));

          // Add assistant response asking for trigger events
          const triggerQuestion: AIMessage = {
            id: Date.now().toString(),
            content: "Thanks! Finally, what events or situations trigger customers to look for your solution?",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, triggerQuestion);
          }

          // Move to next collection step
          setCollectingJTBD('triggers');
          setIsTyping(false);
          return;
        }
        else if (collectingJTBD === 'triggers') {
          setJtbdInput(prev => ({ ...prev, triggerEvents: inputValue.trim() }));

          // Add assistant response indicating processing
          const processingMessage: AIMessage = {
            id: Date.now().toString(),
            content: "Thank you for providing all the information! I'm now generating your Jobs-to-be-Done statements...",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, processingMessage);
          }

          // Generate JTBD statements
          const updatedInput = {
            ...jtbdInput,
            triggerEvents: inputValue.trim()
          };

          try {
            const result = await jtbdService.generateJobStatements(updatedInput);
            setJtbdOutput(result);

            // Format the result for display
            const formattedResult = `
**Overarching Job Statement:**
* ${result.overarchingJobStatement}

**Supporting Job Statements:**
${result.supportingJobStatements.map((statement, index) => `${index + 1}. ${statement}`).join('\n')}

Would you like to refine any of these statements? Type "refine overarching" or "refine supporting" to see alternative suggestions.
            `;

            // Add the result to the chat
            const resultMessage: AIMessage = {
              id: Date.now().toString(),
              content: formattedResult,
              role: 'assistant',
              timestamp: new Date().toISOString(),
            };

            if (typeof currentStep === 'number') {
              addChatMessage(currentStep, resultMessage);
            }

            // Exit collection mode
            setCollectingJTBD(null);
          } catch (error) {
            console.error('Error generating JTBD statements:', error);

            // Add error message
            const errorMessage: AIMessage = {
              id: Date.now().toString(),
              content: "I'm sorry, I encountered an error generating your JTBD statements. Please try again.",
              role: 'assistant',
              timestamp: new Date().toISOString(),
            };

            if (typeof currentStep === 'number') {
              addChatMessage(currentStep, errorMessage);
            }

            // Exit collection mode
            setCollectingJTBD(null);
          }

          setIsTyping(false);
          return;
        }
      }

      // Check if the message is asking for JTBD refinement
      const refineOverarchingRegex = /refine\s+overarching/i;
      const refineSupportingRegex = /refine\s+supporting/i;

      if (refineOverarchingRegex.test(inputValue) && jtbdOutput) {
        // User wants to refine the overarching job statement
        const message: AIMessage = {
          id: Date.now().toString(),
          content: "I'll help you refine your Overarching Job Statement. Let me generate some alternative suggestions...",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, message);
        }

        // Open the suggestion modal for the overarching job statement
        openJTBDSuggestionModal('overarching', jtbdOutput.overarchingJobStatement);
        setIsTyping(false);
        return;
      }

      if (refineSupportingRegex.test(inputValue) && jtbdOutput) {
        // User wants to refine supporting job statements
        const message: AIMessage = {
          id: Date.now().toString(),
          content: "I'll help you refine your Supporting Job Statements. Let me generate some alternative suggestions...",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, message);
        }

        // For simplicity, we'll just use the first supporting statement
        // In a real implementation, you might ask which one they want to refine
        if (jtbdOutput.supportingJobStatements.length > 0) {
          openJTBDSuggestionModal('supporting', jtbdOutput.supportingJobStatements[0]);
        } else {
          const errorMessage: AIMessage = {
            id: Date.now().toString(),
            content: "I don't see any supporting job statements to refine. Let's create some first.",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, errorMessage);
          }
        }
        setIsTyping(false);
        return;
      }

      // Check if the message is asking for JTBD help
      const jtbdKeywords = ['jtbd', 'job to be done', 'job statement', 'jobs to be done'];
      const isJTBDRequest = jtbdKeywords.some(keyword =>
        inputValue.toLowerCase().includes(keyword)
      );

      if (isJTBDRequest) {
        // Start JTBD collection process
        const jtbdIntroMessage: AIMessage = {
          id: Date.now().toString(),
          content: "I'd be happy to help you create Jobs-to-be-Done statements! Let's collect the necessary information. First, please describe your product or service:",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, jtbdIntroMessage);
        }

        // Set collection mode to product
        setCollectingJTBD('product');
        setIsTyping(false);
        return;
      }

      // Regular chat flow for non-JTBD requests
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
  }, [inputValue, isTyping, currentStep, workshopData, addChatMessage, aiService, collectingJTBD, jtbdInput, jtbdService, jtbdOutput]);

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

  // Generate JTBD suggestions
  const generateJTBDSuggestions = useCallback(async (
    type: 'overarching' | 'supporting',
    currentStatement: string
  ) => {
    try {
      // Only generate suggestions if we have JTBD input
      if (!jtbdInput.productService || !jtbdInput.desiredOutcomes || !jtbdInput.triggerEvents) {
        return [];
      }

      // Generate suggestions using the JTBD service
      return await jtbdService.generateSuggestions(
        type,
        currentStatement,
        jtbdInput,
        3 // Generate 3 suggestions
      );
    } catch (error) {
      console.error('Error generating JTBD suggestions:', error);
      return [];
    }
  }, [jtbdInput, jtbdService]);

  // Handle selecting a suggestion
  const handleSelectSuggestion = useCallback(() => {
    if (typeof currentStep === 'number') {
      acceptSuggestion(currentStep);
      setShowSuggestions(false);
    }
  }, [currentStep, acceptSuggestion]);



  // Handle selecting a JTBD suggestion
  const handleSelectJTBDSuggestion = useCallback((suggestion: {
    id: string;
    content: string;
    type: 'overarching' | 'supporting';
  }) => {
    // Update the JTBD output based on the suggestion type
    if (suggestion.type === 'overarching') {
      setJtbdOutput(prev => prev ? {
        ...prev,
        overarchingJobStatement: suggestion.content
      } : null);

      // Add a message to the chat
      const message: AIMessage = {
        id: Date.now().toString(),
        content: `I've updated your Overarching Job Statement to:\n\n${suggestion.content}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, message);
      }
    } else {
      // For supporting statements, we need to know which one to replace
      // For simplicity, we'll just add it as a new one
      setJtbdOutput(prev => {
        if (!prev) return null;

        return {
          ...prev,
          supportingJobStatements: [...prev.supportingJobStatements, suggestion.content]
        };
      });

      // Add a message to the chat
      const message: AIMessage = {
        id: Date.now().toString(),
        content: `I've added a new Supporting Job Statement:\n\n${suggestion.content}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, message);
      }
    }

    // Close the modal
    setShowJTBDSuggestionModal(false);
  }, [currentStep, addChatMessage]);

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
          marginBottom: '24px',
          alignItems: 'flex-start',
          gap: '16px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFDD00',
            color: '#222222',
            border: `2px solid ${isUser ? '#EEEEEE' : '#FFDD00'}`,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            flexShrink: 0
          }}
        >
          {isUser ? '👤' : (
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            />
          )}
        </div>

        <div
          style={{
            padding: '16px 24px',
            maxWidth: '75%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFFFFF',
            borderColor: isUser ? '#EEEEEE' : '#FFDD00',
            borderWidth: '1px',
            borderLeftWidth: isUser ? '1px' : '3px',
            borderRadius: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{
            fontSize: '18px',
            marginBottom: '6px',
            color: '#222222',
            fontWeight: 600
          }}>
            {isUser ? 'You' : 'Sparky'}
          </div>
          <div style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#333333',
            whiteSpace: 'pre-wrap'
          }}>
            {typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content, null, 2)}
          </div>
          <div style={{ fontSize: '14px', color: '#888888', marginTop: '10px', textAlign: isUser ? 'right' : 'left' }}>
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
        position: isFixed ? 'fixed' : 'relative',
        top: isFixed ? '120px' : 'auto',
        left: isFixed ? '20px' : 'auto',
        width: '100%',
        height: '100%', // Always use full height
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: isFixed ? 1050 : 'auto',
        border: '1px solid #EEEEEE',
        borderLeft: '3px solid #FFDD00'
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
            alt="Sparky"
            style={{ width: '42px', height: '42px', borderRadius: '50%' }}
          />
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Sparky</h3>
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
          padding: '24px',
          overflowY: 'auto',
          flexGrow: 1,
          height: 'calc(100% - 150px)', // Maintain space for header and input
          backgroundColor: '#FAFAFA'
        }}
      >
        {allMessages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666666', padding: '40px 20px' }}>
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', display: 'block' }}
            />
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>Hi! I'm Sparky, your workshop assistant. Ask me anything about the workshop or for help with the current step.</p>
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
          padding: '20px 24px',
          borderTop: '1px solid #EEEEEE',
          display: 'flex',
          gap: '12px',
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
            borderRadius: '12px',
            padding: '12px 16px',
            resize: 'none',
            minHeight: '50px',
            maxHeight: '150px',
            fontSize: '16px',
            lineHeight: 1.6
          }}
          rows={1}
        />
        <Button
          variant="yellow"
          size="lg"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          style={{ alignSelf: 'flex-end', padding: '12px 16px' }}
        >
          {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </Button>
      </div>

      {/* JTBD Suggestion Modal */}
      <JTBDSuggestionModal
        isOpen={showJTBDSuggestionModal}
        onClose={() => setShowJTBDSuggestionModal(false)}
        title={jtbdSuggestionType === 'overarching'
          ? 'Refine Overarching Job Statement'
          : 'Refine Supporting Job Statement'}
        description={jtbdSuggestionType === 'overarching'
          ? 'Select an alternative Overarching Job Statement that better captures the core progress your customers want to make.'
          : 'Select an alternative Supporting Job Statement that better captures a specific aspect of the job.'}
        currentInput={currentJTBDStatement}
        suggestions={jtbdSuggestions}
        onSelectSuggestion={handleSelectJTBDSuggestion}
      />
    </Card>
  );
};
