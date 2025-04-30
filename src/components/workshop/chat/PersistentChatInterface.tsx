import React, { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AIMessage, ChatSuggestion } from '../../../types/chat';
import { JTBDService } from '../../../services/jtbdService';
import { OpenAIService } from '../../../services/openai';
import { SparkyService, SparkyMessage, SuggestionOption } from '../../../services/sparkyService';
import { JTBDSuggestionModal } from './JTBDSuggestionModal';
import { MessagesContainer } from './MessagesContainer';
import { SuggestionBubble } from './SuggestionBubble';
import { ExpandedChatModal } from './ExpandedChatModal';
import { Send, Loader2, X, Maximize2, Minimize2 } from 'lucide-react';

// Custom type for position styles
type PositionStyles = {
  position: 'fixed' | 'relative' | 'absolute' | 'static' | 'sticky';
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
};
import { WorkshopData } from '../../../types/workshop';

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
    acceptSuggestion,
    updateWorkshopData
  } = useWorkshopStore();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  // We need to keep this state even if it's not directly used in the render
  // as it's used in the generateSparkySuggestions function
  const [, setSparkySuggestions] = useState<SuggestionOption[]>([]);
  const [sparkyMessages, setSparkyMessages] = useState<SparkyMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create API key for OpenAI services
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

  // Create OpenAI service for JTBD and Sparky
  const openaiService = new OpenAIService({
    apiKey: apiKey
  });

  // Create JTBD service with base GPT-4.1 model
  const jtbdService = new JTBDService(
    openaiService,
    'gpt-4.1-2025-04-14'
  );

  // Create Sparky service with GPT-4.1 model and mock mode enabled
  const sparkyService = new SparkyService(
    openaiService,
    'gpt-4.1-2025-04-14',
    true // Enable mock mode to avoid API errors
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

  // Load existing messages from the workshop store when the component mounts or the step changes
  useEffect(() => {
    if (sparkyMessages.length === 0 && allMessages.length > 0) {
      // Convert AIMessages to SparkyMessages
      const convertedMessages: SparkyMessage[] = allMessages.map(msg => ({
        id: msg.id,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
        role: msg.role,
        timestamp: msg.timestamp
      }));

      setSparkyMessages(convertedMessages);
    }
  }, [allMessages, sparkyMessages.length]);

  // Get a step-specific welcome message
  const getStepSpecificWelcomeMessage = useCallback((step: number): string => {
    switch (step) {
      case 2:
        return "👋 Welcome to Step 2: Your Big Idea!\n\nIn this step, you'll define your initial product or service concept using the format: '[What it is] + [What it helps customers do]'.\n\nFor example: 'A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.'\n\nThis is just version 1 of your idea - we'll refine it throughout the workshop. Need help? Try asking me:\n• Can you suggest some examples of Big Idea statements?\n• How do I make my statement more specific?\n• What are some scalable offer formats I could consider?";
      case 3:
        return "What business goals and constraints do you have for this offer? I can help with examples.";
      case 4:
        return "What moments trigger customers to seek your solution? (Situational, emotional, or social triggers)";
      case 5:
        return "Define your Jobs-to-be-Done using 'Help me [VERB] my [OBJECT] [CONTEXT]'. Type 'jtbd' for help.";
      case 6:
        return "Which segments experience your job statement most intensely? Consider urgency and willingness to pay.";
      case 7:
        return "What pains do your target segments experience? Look for functional, emotional, and social pains.";
      case 8:
        return "Which problems will you focus on? Select ones that align with your skills and goals.";
      case 9:
        return "Create a targeted offer based on your insights. What format would best solve these problems?";
      case 10:
        return "How will you validate your offer? What assumptions need testing before you build?";
      default:
        return "I'm here to help with the workshop. Ask me anything about the current step.";
    }
  }, []);

  // Get a proactive message when user moves to a new step
  const getProactiveStepMessage = useCallback((step: number, workshopData: WorkshopData): string => {
    switch (step) {
      case 2:
        return "Need help with your Big Idea statement? I can suggest some examples.";
      case 3:
        if (workshopData.bigIdea?.description) {
          return "What business goals do you have for this offer?";
        }
        return "What business goals do you have for this offer?";
      case 4:
        return "What situations might prompt someone to seek your offer?";
      case 5:
        return "Type 'jtbd' if you'd like help generating job statements.";
      case 6:
        return "What types of people or businesses frequently need your solution?";
      case 7:
        return "What functional, emotional, or social pains do your target segments face?";
      case 8:
        return "Which pains do you feel most qualified or excited to solve?";
      case 9:
        return "Would you like suggestions for offer formats that would work well for your target market?";
      case 10:
        return "Would you like suggestions for validation methods you could implement in the next few weeks?";
      default:
        return "";
    }
  }, []);

  // Track previous step to detect changes
  const [previousStep, setPreviousStep] = useState<number>(currentStep);

  // Initialize Sparky with a welcome message when the component mounts
  useEffect(() => {
    // Only add the welcome message if there are no messages yet
    if (sparkyMessages.length === 0 && currentStep > 1) {
      const welcomeContent = getStepSpecificWelcomeMessage(currentStep);

      const welcomeMessage: SparkyMessage = {
        id: Date.now().toString(),
        content: welcomeContent,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        stepContext: currentStep
      };

      setSparkyMessages([welcomeMessage]);

      // Also add to workshop store
      const workshopWelcomeMessage: AIMessage = {
        id: welcomeMessage.id,
        content: welcomeMessage.content,
        role: welcomeMessage.role,
        timestamp: welcomeMessage.timestamp,
        step: currentStep
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, workshopWelcomeMessage);
      }
    }
  }, [currentStep, sparkyMessages.length, addChatMessage, getStepSpecificWelcomeMessage]);

  // Send proactive messages when user moves to a new step
  useEffect(() => {
    // Check if the step has changed and it's not the initial load
    if (previousStep !== currentStep && previousStep !== 0 && currentStep > 1) {
      // Get the proactive message for the new step
      const proactiveMessage = getProactiveStepMessage(currentStep, workshopData);

      if (proactiveMessage) {
        // Add a small delay to make it feel more natural
        setTimeout(() => {
          const message: SparkyMessage = {
            id: Date.now().toString(),
            content: proactiveMessage,
            role: 'assistant',
            timestamp: new Date().toISOString(),
            stepContext: currentStep
          };

          setSparkyMessages(prev => [...prev, message]);

          // Also add to workshop store
          const workshopMessage: AIMessage = {
            id: message.id,
            content: message.content,
            role: message.role,
            timestamp: message.timestamp,
            step: currentStep
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, workshopMessage);
          }
        }, 1000); // 1 second delay
      }
    }

    // Update previous step
    setPreviousStep(currentStep);
  }, [currentStep, previousStep, workshopData, getProactiveStepMessage, addChatMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sparkyMessages, isOpen]);

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

    // Create a user message for Sparky
    const userMessage: SparkyMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
      stepContext: currentStep
    };

    // Add to Sparky messages
    setSparkyMessages(prev => [...prev, userMessage]);

    // Also add to workshop store for persistence
    const workshopUserMessage: AIMessage = {
      id: userMessage.id,
      content: userMessage.content,
      role: userMessage.role,
      timestamp: userMessage.timestamp,
      step: currentStep
    };

    if (typeof currentStep === 'number') {
      addChatMessage(currentStep, workshopUserMessage);
    }

    setInputValue('');

    try {
      // Handle JTBD input collection if in collection mode
      if (collectingJTBD) {
        // Store the input based on what we're collecting
        if (collectingJTBD === 'product') {
          setJtbdInput(prev => ({ ...prev, productService: inputValue.trim() }));

          // Add assistant response asking for desired outcomes
          const outcomeQuestion: SparkyMessage = {
            id: Date.now().toString(),
            content: "Great! Now, what outcomes do your customers desire from this product or service?",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setSparkyMessages(prev => [...prev, outcomeQuestion]);

          // Also add to workshop store
          const workshopAssistantMessage: AIMessage = {
            id: outcomeQuestion.id,
            content: outcomeQuestion.content,
            role: outcomeQuestion.role,
            timestamp: outcomeQuestion.timestamp,
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, workshopAssistantMessage);
          }

          // Move to next collection step
          setCollectingJTBD('outcomes');
          setIsTyping(false);
          return;
        }
        else if (collectingJTBD === 'outcomes') {
          setJtbdInput(prev => ({ ...prev, desiredOutcomes: inputValue.trim() }));

          // Add assistant response asking for trigger events
          const triggerQuestion: SparkyMessage = {
            id: Date.now().toString(),
            content: "Thanks! Finally, what events or situations trigger customers to look for your solution?",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setSparkyMessages(prev => [...prev, triggerQuestion]);

          // Also add to workshop store
          const workshopAssistantMessage: AIMessage = {
            id: triggerQuestion.id,
            content: triggerQuestion.content,
            role: triggerQuestion.role,
            timestamp: triggerQuestion.timestamp,
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, workshopAssistantMessage);
          }

          // Move to next collection step
          setCollectingJTBD('triggers');
          setIsTyping(false);
          return;
        }
        else if (collectingJTBD === 'triggers') {
          setJtbdInput(prev => ({ ...prev, triggerEvents: inputValue.trim() }));

          // Add assistant response indicating processing
          const processingMessage: SparkyMessage = {
            id: Date.now().toString(),
            content: "Thank you for providing all the information! I'm now generating your Jobs-to-be-Done statements...",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setSparkyMessages(prev => [...prev, processingMessage]);

          // Also add to workshop store
          const workshopAssistantMessage: AIMessage = {
            id: processingMessage.id,
            content: processingMessage.content,
            role: processingMessage.role,
            timestamp: processingMessage.timestamp,
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, workshopAssistantMessage);
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
            const resultMessage: SparkyMessage = {
              id: Date.now().toString(),
              content: formattedResult,
              role: 'assistant',
              timestamp: new Date().toISOString(),
            };

            setSparkyMessages(prev => [...prev, resultMessage]);

            // Also add to workshop store
            const workshopResultMessage: AIMessage = {
              id: resultMessage.id,
              content: resultMessage.content,
              role: resultMessage.role,
              timestamp: resultMessage.timestamp,
            };

            if (typeof currentStep === 'number') {
              addChatMessage(currentStep, workshopResultMessage);
            }

            // Exit collection mode
            setCollectingJTBD(null);
          } catch (error) {
            console.error('Error generating JTBD statements:', error);

            // Add error message
            const errorMessage: SparkyMessage = {
              id: Date.now().toString(),
              content: "I'm sorry, I encountered an error generating your JTBD statements. Please try again.",
              role: 'assistant',
              timestamp: new Date().toISOString(),
            };

            setSparkyMessages(prev => [...prev, errorMessage]);

            // Also add to workshop store
            const workshopErrorMessage: AIMessage = {
              id: errorMessage.id,
              content: errorMessage.content,
              role: errorMessage.role,
              timestamp: errorMessage.timestamp,
            };

            if (typeof currentStep === 'number') {
              addChatMessage(currentStep, workshopErrorMessage);
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
        const message: SparkyMessage = {
          id: Date.now().toString(),
          content: "I'll help you refine your Overarching Job Statement. Let me generate some alternative suggestions...",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        setSparkyMessages(prev => [...prev, message]);

        // Also add to workshop store
        const workshopMessage: AIMessage = {
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, workshopMessage);
        }

        // Open the suggestion modal for the overarching job statement
        openJTBDSuggestionModal('overarching', jtbdOutput.overarchingJobStatement);
        setIsTyping(false);
        return;
      }

      if (refineSupportingRegex.test(inputValue) && jtbdOutput) {
        // User wants to refine supporting job statements
        const message: SparkyMessage = {
          id: Date.now().toString(),
          content: "I'll help you refine your Supporting Job Statements. Let me generate some alternative suggestions...",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        setSparkyMessages(prev => [...prev, message]);

        // Also add to workshop store
        const workshopMessage: AIMessage = {
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: message.timestamp,
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, workshopMessage);
        }

        // For simplicity, we'll just use the first supporting statement
        // In a real implementation, you might ask which one they want to refine
        if (jtbdOutput.supportingJobStatements.length > 0) {
          openJTBDSuggestionModal('supporting', jtbdOutput.supportingJobStatements[0]);
        } else {
          const errorMessage: SparkyMessage = {
            id: Date.now().toString(),
            content: "I don't see any supporting job statements to refine. Let's create some first.",
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          setSparkyMessages(prev => [...prev, errorMessage]);

          // Also add to workshop store
          const workshopErrorMessage: AIMessage = {
            id: errorMessage.id,
            content: errorMessage.content,
            role: errorMessage.role,
            timestamp: errorMessage.timestamp,
          };

          if (typeof currentStep === 'number') {
            addChatMessage(currentStep, workshopErrorMessage);
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
        const jtbdIntroMessage: SparkyMessage = {
          id: Date.now().toString(),
          content: "I'd be happy to help you create Jobs-to-be-Done statements! Let's collect the necessary information. First, please describe your product or service:",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        setSparkyMessages(prev => [...prev, jtbdIntroMessage]);

        // Also add to workshop store
        const workshopIntroMessage: AIMessage = {
          id: jtbdIntroMessage.id,
          content: jtbdIntroMessage.content,
          role: jtbdIntroMessage.role,
          timestamp: jtbdIntroMessage.timestamp,
        };

        if (typeof currentStep === 'number') {
          addChatMessage(currentStep, workshopIntroMessage);
        }

        // Set collection mode to product
        setCollectingJTBD('product');
        setIsTyping(false);
        return;
      }

      // Regular chat flow for non-JTBD requests using Sparky
      // Generate response using Sparky service
      const sparkyResponse = await sparkyService.generateResponse(
        userMessage.content,
        currentStep,
        workshopData,
        sparkyMessages
      );

      // Make sure the response includes the step context
      const responseWithContext = {
        ...sparkyResponse,
        stepContext: currentStep
      };

      // Add Sparky's response to the messages
      setSparkyMessages(prev => [...prev, responseWithContext]);

      // Also add to workshop store for persistence
      const workshopSparkyResponse: AIMessage = {
        id: responseWithContext.id,
        content: responseWithContext.content,
        role: responseWithContext.role,
        timestamp: responseWithContext.timestamp,
        step: currentStep
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, workshopSparkyResponse);
      }

      // Generate suggestions based on the conversation
      await generateSparkySuggestions();
    } catch (error) {
      console.error('Error in chat:', error);

      // Add error message
      const errorMessage: SparkyMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setSparkyMessages(prev => [...prev, errorMessage]);

      // Also add to workshop store
      const workshopErrorMessage: AIMessage = {
        id: errorMessage.id,
        content: errorMessage.content,
        role: errorMessage.role,
        timestamp: errorMessage.timestamp,
      };

      if (typeof currentStep === 'number') {
        addChatMessage(currentStep, workshopErrorMessage);
      }
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, currentStep, workshopData, addChatMessage, sparkyService, sparkyMessages, collectingJTBD, jtbdInput, jtbdService, jtbdOutput]);

  // Generate context-aware suggestions using Sparky
  const generateSparkySuggestions = useCallback(async () => {
    try {
      // Determine the suggestion type based on the current step
      let suggestionType = 'general';

      switch (currentStep) {
        case 2:
          suggestionType = 'big-idea';
          break;
        case 3:
          suggestionType = 'underlying-goal';
          break;
        case 4:
          suggestionType = 'trigger-events';
          break;
        case 5:
          suggestionType = 'jobs';
          break;
        case 6:
          suggestionType = 'target-buyers';
          break;
        case 7:
          suggestionType = 'pains';
          break;
        case 8:
          suggestionType = 'problem-up';
          break;
        case 9:
          suggestionType = 'offer-concepts';
          break;
        case 10:
          suggestionType = 'next-steps';
          break;
        default:
          suggestionType = 'general';
      }

      // Generate suggestions using Sparky
      const suggestions = await sparkyService.generateSuggestions(
        currentStep,
        workshopData,
        suggestionType
      );

      if (suggestions && suggestions.length > 0) {
        // Store the suggestions
        setSparkySuggestions(suggestions);

        // Also create a suggestion for the workshop store
        const workshopSuggestion: ChatSuggestion = {
          step: currentStep,
          content: {
            [suggestionType]: suggestions.map(s => s.content)
          },
          rawResponse: JSON.stringify(suggestions)
        };

        setCurrentSuggestion(workshopSuggestion);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error generating Sparky suggestions:', error);
    }
  }, [currentStep, workshopData, setCurrentSuggestion, sparkyService]);

  // We've removed the legacy suggestion generator as it's no longer used
  // Now we're using the Sparky-based suggestion generator above

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



  // Handle adding a specific suggestion to the workshop
  const handleAddSuggestion = useCallback((id: string, content: string, type: string) => {
    // Mark this suggestion as applied
    setAppliedSuggestions(prev => [...prev, id]);

    // Add a confirmation message to the chat
    const confirmationMessage: SparkyMessage = {
      id: Date.now().toString(),
      content: `✅ I've added "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}" to your workshop.`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      stepContext: currentStep
    };

    setSparkyMessages(prev => [...prev, confirmationMessage]);

    // Also add to workshop store
    const workshopConfirmationMessage: AIMessage = {
      id: confirmationMessage.id,
      content: confirmationMessage.content,
      role: confirmationMessage.role,
      timestamp: confirmationMessage.timestamp,
      step: currentStep
    };

    addChatMessage(currentStep, workshopConfirmationMessage);

    // Add the suggestion to the appropriate part of the workshop data
    // based on the current step and suggestion type
    switch (type) {
      case 'big-idea':
        if (currentStep === 2) {
          updateWorkshopData({
            bigIdea: {
              ...workshopData.bigIdea,
              description: content,
              targetCustomers: workshopData.bigIdea?.targetCustomers || '',
              version: 'initial'
            }
          });
        } else if (currentStep === 9) {
          updateWorkshopData({
            refinedIdea: {
              ...workshopData.refinedIdea,
              description: content,
              targetCustomers: workshopData.refinedIdea?.targetCustomers || '',
              version: 'refined'
            }
          });
        }
        break;
      case 'underlying-goal':
        updateWorkshopData({
          underlyingGoal: {
            ...workshopData.underlyingGoal,
            businessGoal: content,
            constraints: workshopData.underlyingGoal?.constraints || ''
          }
        });
        break;
      case 'trigger-events':
        updateWorkshopData({
          triggerEvents: [
            ...workshopData.triggerEvents,
            {
              id: id,
              description: content,
              source: 'assistant'
            }
          ]
        });
        break;
      case 'jobs':
        updateWorkshopData({
          jobs: [
            ...workshopData.jobs,
            {
              id: id,
              description: content,
              source: 'assistant'
            }
          ]
        });
        break;
      case 'target-buyers':
        updateWorkshopData({
          targetBuyers: [
            ...workshopData.targetBuyers,
            {
              id: id,
              description: content,
              source: 'assistant'
            }
          ]
        });
        break;
      case 'pains':
        updateWorkshopData({
          pains: [
            ...workshopData.pains,
            {
              id: id,
              description: content,
              buyerSegment: '',
              type: 'functional',
              source: 'assistant'
            }
          ]
        });
        break;
      default:
        // For other types, we'll just use the generic acceptSuggestion
        if (typeof currentStep === 'number') {
          acceptSuggestion(currentStep);
        }
    }
  }, [currentStep, workshopData, updateWorkshopData, addChatMessage, acceptSuggestion]);



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

  // We've removed the unused getStepContext function as it's no longer needed

  // Render message bubbles
  const renderMessage = (message: SparkyMessage | AIMessage) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginBottom: '16px',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            maxWidth: '90%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFFFFF',
            borderColor: isUser ? '#EEEEEE' : '#FFDD00',
            borderWidth: '1px',
            borderLeftWidth: isUser ? '1px' : '3px',
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        >
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
          <div style={{
            fontSize: '12px',
            color: '#888888',
            marginTop: '6px',
            textAlign: isUser ? 'right' : 'left'
          }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  // Create the input container component to be reused in both views
  const renderInputContainer = () => (
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
          resize: 'vertical',
          minHeight: '50px',
          maxHeight: '200px',
          fontSize: '16px',
          lineHeight: 1.6,
          overflowY: 'auto'
        }}
        rows={2}
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
  );

  // Render suggestions as individual bubbles
  const renderSuggestions = () => {
    if (!showSuggestions || !currentSuggestion) return null;

    return (
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #EEEEEE',
          backgroundColor: '#FFFDF5'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Suggestions</h4>
        </div>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {typeof currentSuggestion.content === 'string' ? (
            <SuggestionBubble
              id={`suggestion-${Date.now()}`}
              content={currentSuggestion.content}
              type="general"
              onAdd={handleAddSuggestion}
              isAdded={false}
            />
          ) : (
            // Parse the content object and render each suggestion as a separate bubble
            Object.entries(currentSuggestion.content).map(([type, value]) => {
              if (Array.isArray(value)) {
                return value.map((suggestion, index) => (
                  <SuggestionBubble
                    key={`${type}-${index}`}
                    id={`${type}-${index}-${Date.now()}`}
                    content={suggestion}
                    type={type}
                    onAdd={handleAddSuggestion}
                    isAdded={appliedSuggestions.includes(`${type}-${index}-${Date.now()}`)}
                  />
                ));
              }
              return null;
            })
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  // Create a responsive style object based on screen size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine position based on screen size
  const getChatPosition = (): PositionStyles => {
    if (!isFixed) {
      return {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        bottom: 'auto',
        right: 'auto',
      };
    }

    // For very small screens (e.g., small laptops)
    if (windowWidth < 600) {
      return {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        top: 'auto',
        left: 'auto',
      };
    }

    // For medium screens (tablets, small laptops)
    if (windowWidth < 1024) {
      return {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        top: 'auto',
        left: 'auto',
      };
    }

    // For larger screens, position on the left with more space for content
    return {
      position: 'fixed',
      top: '120px',
      left: '20px',
      bottom: 'auto',
      right: 'auto',
    };
  };

  // Get responsive dimensions
  const getChatDimensions = (): CSSProperties => {
    // For very small screens (e.g., small laptops)
    if (windowWidth < 600) {
      return {
        width: '280px',
        maxWidth: 'calc(100vw - 20px)',
        height: '400px',
        maxHeight: 'calc(100vh - 160px)',
      };
    }

    // For medium screens (tablets, small laptops)
    if (windowWidth < 1024) {
      return {
        width: '300px',
        maxWidth: 'calc(100vw - 40px)',
        height: '450px',
        maxHeight: 'calc(100vh - 180px)',
      };
    }

    // For larger screens
    return {
      width: '320px',
      maxWidth: 'calc(100vw - 60px)',
      height: 'calc(100vh - 200px)',
      maxHeight: '600px',
    };
  };

  // Render the expanded chat modal
  return (
    <>
      {isMinimized ? (
        // Minimized chat button
        <div
          style={{
            position: 'fixed',
            bottom: windowWidth < 600 ? '10px' : '20px',
            right: windowWidth < 600 ? '10px' : '20px',
            zIndex: 1050,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFDD00',
            padding: windowWidth < 600 ? '8px 12px' : '12px 16px',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setIsMinimized(false)}
        >
          <img
            src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
            alt="Sparky"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
          {windowWidth >= 480 && (
            <span style={{ fontWeight: 600, color: '#333333' }}>Chat with Sparky</span>
          )}
        </div>
      ) : (
        // Full chat interface
        <Card
          style={{
            ...(getChatPosition() as CSSProperties),
            ...getChatDimensions(),
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: isFixed ? 1000 : 'auto', // Lower z-index to avoid overlapping with modals
            border: '1px solid #EEEEEE',
            borderLeft: '3px solid #FFDD00',
            overflowY: 'auto', // Allow scrolling if content is too large
            resize: 'both', // Allow user resizing
            maxWidth: '500px', // Maximum width when resizing
            maxHeight: '800px', // Maximum height when resizing
            transition: 'all 0.3s ease' // Smooth transitions
          } as React.CSSProperties}
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsExpanded(true)}
                title="Expand"
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
                <Maximize2 size={18} color="#666666" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize"
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
                <Minimize2 size={18} color="#666666" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  title="Close"
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
          </div>

          {/* Messages Container */}
          <MessagesContainer
            messages={sparkyMessages}
            isTyping={isTyping}
            currentStep={currentStep}
            renderMessage={renderMessage}
          />

          {/* Suggestions Panel */}
          {renderSuggestions()}

          {/* Input Container */}
          {renderInputContainer()}
        </Card>
      )}

      {/* Expanded Chat Modal */}
      <ExpandedChatModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        messages={sparkyMessages}
        isTyping={isTyping}
        currentStep={currentStep}
        renderMessage={renderMessage}
        inputContainer={renderInputContainer()}
      />


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
    </>
  );
};
