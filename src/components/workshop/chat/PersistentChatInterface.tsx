import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AIMessage } from '../../../types/chat';
import { AIService } from '../../../services/aiService';
import { JTBDService } from '../../../services/jtbdService';
import { OpenAIService } from '../../../services/openai';
import { SparkyService, SparkyMessage, SuggestionOption } from '../../../services/sparkyService';
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
  const [sparkySuggestions, setSparkySuggestions] = useState<SuggestionOption[]>([]);
  const [sparkyMessages, setSparkyMessages] = useState<SparkyMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create AI service instances
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const aiService = new AIService({
    apiKey: apiKey,
  });

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
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 2: Your Big Idea!\n\nIn this step, you'll define your initial product or service concept using the format: '[What it is] + [What it helps customers do]'.\n\nFor example: 'A 6-week group coaching program that helps service-based entrepreneurs create their first scalable digital product.'\n\nNeed help? Try asking me:\n• Can you suggest some examples of Big Idea statements?\n• How do I make my statement more specific?\n• What are some scalable offer formats I could consider?";
      case 3:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 3: Clarify Your Underlying Goal!\n\nIn this step, you'll define your business objectives and key constraints for creating this offer.\n\nThink about:\n• What specific business outcome are you aiming for? (revenue target, lifestyle change, lead generation, etc.)\n• What constraints must you work within? (time available, budget, skills, etc.)\n\nNeed help? I can suggest example goals and constraints that make sense for your Big Idea!";
      case 4:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 4: Identify Trigger Events!\n\nIn this step, you'll identify specific moments when potential customers realize they need your solution.\n\nThese can be:\n• Situational triggers (external events)\n• Emotional triggers (internal feelings)\n• Social triggers (comparisons to others)\n\nNeed specific examples? Just ask me to suggest some trigger events based on your Big Idea!";
      case 5:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 5: Define Jobs-to-be-Done!\n\nIn this step, you'll identify the core progress your customers are trying to make when they seek your solution.\n\nThe format is: 'Help me [VERB] my [OBJECT] [CONTEXT]'\n\nFor example: 'Help me establish a professional brand identity quickly and affordably when launching my business.'\n\nType 'jtbd' if you'd like me to help you generate job statements based on your previous inputs!";
      case 6:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 6: Identify Target Buyers!\n\nIn this step, you'll identify specific segments who experience your Job-to-be-Done most intensely.\n\nThink about:\n• Who frequently finds themselves in the context of your job statement?\n• Which segments have high urgency, willingness to pay, and accessibility?\n• Which segments are a 'Hell Yes!' for you personally?\n\nNeed help brainstorming specific segments? Just ask!";
      case 7:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 7: Painstorming!\n\nIn this step, you'll identify specific pains your target segments experience related to your Job-to-be-Done.\n\nLook for:\n• Functional pains (processes breaking down)\n• Emotional pains (frustration, overwhelm)\n• Social pains (how others perceive them)\n• FIRE pains (Frequent, Intense, Recurring, Expensive)\n\nNeed help identifying specific pains for your segments? I can suggest some examples!";
      case 8:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 8: Problem-Up!\n\nIn this step, you'll select the most promising problems to focus your offer on and refine your target market accordingly.\n\nConsider:\n• Which problems have you personally experienced or helped solve before?\n• Which problems align best with your skills and goals?\n• Are you focusing on people with specific traits or in specific trigger moments?\n\nNeed help selecting problems or refining your target market? Just ask!";
      case 9:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 9: Refine Your Big Idea!\n\nIn this step, you'll create a more targeted offer concept based on all your insights.\n\nConsider:\n• What format would best solve the focused problems? (Done-For-You, DIY, Done-With-You)\n• How can you leverage your unique skills to solve these problems?\n• What's a feasible delivery model given your constraints?\n\nNeed help crafting your refined Big Idea statement? I can suggest some options!";
      case 10:
        return "👋 Hi! I'm Sparky, your workshop assistant. Welcome to Step 10: Summary & Next Steps!\n\nCongratulations on completing the workshop! Now it's time to plan how to validate your offer concept before building it.\n\nConsider:\n• What's the single biggest assumption you need to test?\n• How could you quickly test if your message resonates?\n• What specific validation steps could you take in the next 1-4 weeks?\n\nNeed help planning your validation approach? I can suggest specific methods!";
      default:
        return "Hi! I'm Sparky, your AI workshop assistant. I'm here to help you brainstorm, refine your ideas, and navigate the exercises. Feel free to ask me questions anytime!";
    }
  }, []);

  // Get a proactive message when user moves to a new step
  const getProactiveStepMessage = useCallback((step: number, workshopData: WorkshopData): string => {
    switch (step) {
      case 2:
        return "I see you've started Step 2! Let's craft your Big Idea statement. Would you like me to suggest some example formats based on your background or interests?";
      case 3:
        if (workshopData.bigIdea?.description) {
          return `Great job defining your Big Idea: "${workshopData.bigIdea.description}"\n\nNow let's clarify your business goals for this offer. Are you looking to create a new revenue stream, replace client work, generate leads, or something else?`;
        }
        return "Now let's clarify your business goals for this offer. Are you looking to create a new revenue stream, replace client work, generate leads, or something else?";
      case 4:
        if (workshopData.underlyingGoal?.businessGoal) {
          return `I see your business goal is: "${workshopData.underlyingGoal.businessGoal}"\n\nNow let's identify specific Trigger Events - those moments when customers realize they need your solution. What situations might prompt someone to seek your offer?`;
        }
        return "Now let's identify specific Trigger Events - those moments when customers realize they need your solution. What situations might prompt someone to seek your offer?";
      case 5:
        if (workshopData.triggerEvents && workshopData.triggerEvents.length > 0) {
          return "Great job identifying trigger events! Now let's define the Job-to-be-Done - the progress your customers are trying to make. Would you like me to help generate some job statements based on your previous inputs? Just type 'jtbd' to start.";
        }
        return "Now let's define the Job-to-be-Done - the progress your customers are trying to make. Would you like me to help generate some job statements based on your previous inputs? Just type 'jtbd' to start.";
      case 6:
        const selectedJob = workshopData.jobs?.find(job => job.selected);
        if (selectedJob) {
          return `I see you've selected this job statement: "${selectedJob.description}"\n\nNow let's identify specific target buyer segments who experience this job intensely. What types of people or businesses frequently find themselves in this situation?`;
        }
        return "Now let's identify specific target buyer segments who experience your job statement intensely. What types of people or businesses frequently find themselves in this situation?";
      case 7:
        const selectedBuyers = workshopData.targetBuyers?.filter(buyer => buyer.selected);
        if (selectedBuyers && selectedBuyers.length > 0) {
          return `I see you've selected these target segments: ${selectedBuyers.map(b => `"${b.description}"`).join(", ")}\n\nNow let's identify specific pains they experience related to your job statement. What functional, emotional, or social pains do they face?`;
        }
        return "Now let's identify specific pains your target segments experience. What functional, emotional, or social pains do they face when trying to get this job done?";
      case 8:
        if (workshopData.pains && workshopData.pains.length > 0) {
          return "Great job identifying pains! Now let's select which specific problems to focus your offer on. Which pains do you feel most qualified or excited to solve? Which ones align best with your skills and goals?";
        }
        return "Now let's select which specific problems to focus your offer on. Which pains do you feel most qualified or excited to solve? Which ones align best with your skills and goals?";
      case 9:
        if (workshopData.problemUp?.selectedPains && workshopData.problemUp.selectedPains.length > 0) {
          return "Excellent! Now let's refine your Big Idea based on all these insights. Would you like me to suggest some specific offer formats that would work well for your selected problems and target market?";
        }
        return "Now let's refine your Big Idea based on all your insights. Would you like me to suggest some specific offer formats that would work well for your selected problems and target market?";
      case 10:
        if (workshopData.refinedIdea?.description) {
          return `Congratulations on refining your offer concept: "${workshopData.refinedIdea.description}"\n\nNow let's plan how to validate this concept before building it. Would you like me to suggest some specific validation methods you could implement in the next 1-4 weeks?`;
        }
        return "Congratulations on completing the workshop! Now let's plan how to validate your offer concept before building it. Would you like me to suggest some specific validation methods you could implement in the next 1-4 weeks?";
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
      };

      setSparkyMessages([welcomeMessage]);

      // Also add to workshop store
      const workshopWelcomeMessage: AIMessage = {
        id: welcomeMessage.id,
        content: welcomeMessage.content,
        role: welcomeMessage.role,
        timestamp: welcomeMessage.timestamp,
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
    };

    // Add to Sparky messages
    setSparkyMessages(prev => [...prev, userMessage]);

    // Also add to workshop store for persistence
    const workshopUserMessage: AIMessage = {
      id: userMessage.id,
      content: userMessage.content,
      role: userMessage.role,
      timestamp: userMessage.timestamp,
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

      // Add Sparky's response to the messages
      setSparkyMessages(prev => [...prev, sparkyResponse]);

      // Also add to workshop store for persistence
      const workshopSparkyResponse: AIMessage = {
        id: sparkyResponse.id,
        content: sparkyResponse.content,
        role: sparkyResponse.role,
        timestamp: sparkyResponse.timestamp,
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
        const workshopSuggestion = {
          step: currentStep,
          content: {
            [suggestionType]: suggestions.map(s => s.content)
          },
          rawResponse: suggestions
        };

        setCurrentSuggestion(workshopSuggestion);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error generating Sparky suggestions:', error);
    }
  }, [currentStep, workshopData, setCurrentSuggestion, sparkyService]);

  // Legacy suggestion generator (keeping for compatibility)
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
  const renderMessage = (message: SparkyMessage | AIMessage) => {
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
        width: '350px', // Fixed width to match the container
        height: 'calc(100vh - 120px)', // Fixed height
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
        {sparkyMessages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666666', padding: '40px 20px' }}>
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', display: 'block' }}
            />
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>Hi! I'm Sparky, your workshop assistant. Ask me anything about the workshop or for help with the current step.</p>
          </div>
        ) : (
          sparkyMessages.map(renderMessage)
        )}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666666' }}>
            <Loader2 className="animate-spin" size={16} />
            <span>Sparky is typing...</span>
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
