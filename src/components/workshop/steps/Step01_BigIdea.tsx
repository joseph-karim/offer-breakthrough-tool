import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Button } from '../../ui/Button';
import { InfoBox } from '../../ui/InfoBox';
import { URLInputModal } from '../chat/URLInputModal';
import { BrainstormContext } from '../../../services/brainstormService';


// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
const selectAddChatMessage = (state: WorkshopStore) => state.addChatMessage;
const selectBrainstormBigIdeasWithContext = (state: WorkshopStore) => state.brainstormBigIdeasWithContext;
const selectIsAiLoading = (state: WorkshopStore) => state.isAiLoading;


export const Step01_BigIdea: React.FC = () => {
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);
  const addChatMessage = useWorkshopStore(selectAddChatMessage);
  const brainstormBigIdeasWithContext = useWorkshopStore(selectBrainstormBigIdeasWithContext);
  const isAiLoading = useWorkshopStore(selectIsAiLoading);

  const [formData, setFormData] = useState<BigIdea>({
    description: bigIdea?.description || '',
    version: 'initial'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showURLModal, setShowURLModal] = useState(false);
  const [hasTriggeredProactiveHelp, setHasTriggeredProactiveHelp] = useState(false);

  // Reference to track if the component has mounted
  const hasComponentMounted = useRef(false);

  // Keywords that trigger proactive help
  const helpKeywords = ['help', 'stuck', 'idea', 'brainstorm', 'suggest', 'example'];

  // Update local state when store value changes
  useEffect(() => {
    if (bigIdea) {
      setFormData({
        description: bigIdea.description || '',
        version: 'initial'
      });
    }
  }, [bigIdea]);

  // Proactive help effect - triggers when the component mounts and the description is empty
  useEffect(() => {
    // Only run this effect after the component has mounted
    if (!hasComponentMounted.current) {
      hasComponentMounted.current = true;
      return;
    }

    // Check if the description is empty and we haven't triggered proactive help yet
    if (!formData.description.trim() && !hasTriggeredProactiveHelp) {
      // Add a small delay to make it feel more natural
      const timer = setTimeout(() => {
        // Send a proactive message offering help
        addChatMessage(2, {
          id: Date.now().toString(),
          content: "I notice you're starting your Big Idea. Would you like help brainstorming? I can suggest ideas based on your LinkedIn profile, website, or a description of your expertise. Just type 'help me brainstorm' or click the brainstorm button below.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
          step: 2
        });

        setHasTriggeredProactiveHelp(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formData.description, hasTriggeredProactiveHelp, addChatMessage]);

  // Effect to monitor for help keywords in the description
  useEffect(() => {
    if (formData.description && !hasTriggeredProactiveHelp) {
      // Check if any help keywords are in the description
      const containsHelpKeyword = helpKeywords.some(keyword =>
        formData.description.toLowerCase().includes(keyword.toLowerCase())
      );

      if (containsHelpKeyword) {
        // Send a proactive message offering help
        addChatMessage(2, {
          id: Date.now().toString(),
          content: "I see you might need some help with your Big Idea. Would you like me to help you brainstorm? I can suggest ideas based on your LinkedIn profile, website, or a description of your expertise.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
          step: 2
        });

        setHasTriggeredProactiveHelp(true);
      }
    }
  }, [formData.description, hasTriggeredProactiveHelp, helpKeywords, addChatMessage]);

  const handleInputChange = useCallback((field: keyof BigIdea, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        bigIdea: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Handle opening the URL input modal
  const handleOpenURLModal = useCallback(() => {
    setShowURLModal(true);
  }, []);

  // Handle closing the URL input modal
  const handleCloseURLModal = useCallback(() => {
    setShowURLModal(false);
  }, []);

  // Handle submitting the URL or text for brainstorming
  const handleBrainstormWithContext = useCallback((contextType: 'url' | 'text', contextValue: string) => {
    // Create the context object
    const context: BrainstormContext = {
      contextType,
      contextValue
    };

    // Call the brainstorm action
    brainstormBigIdeasWithContext(context);

    // Close the modal
    setShowURLModal(false);
  }, [brainstormBigIdeasWithContext]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof BigIdea) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof BigIdea) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', color: '#333333', padding: '30px', borderRadius: '20px' }} data-sb-object-id="step1">
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#fcf720',
          color: 'black',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '15px',
          marginTop: '3px'
        }} data-sb-field-path="stepNumber">
          1
        </div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333333',
            margin: 0
          }}
          data-sb-field-path="title"
        >
          Define Your Big Idea
        </h2>
      </div>

      {/* Description */}
      <div
        style={{
          marginBottom: '30px',
          color: '#555555'
        }}
        data-sb-field-path="description"
      >
        <p>Let's start with your initial product or service idea. Don't worry about making it perfect - we'll refine it throughout the workshop</p>
        <p>Describe your idea using this simple framework: <span style={{ color: '#fcf720', backgroundColor: '#333333', padding: '0 4px' }}>[What it is]</span> + <span style={{ color: '#fcf720', backgroundColor: '#333333', padding: '0 4px' }}>[what will it help customers do]</span></p>
      </div>

      {/* Info box with lightbulb icon */}
      <InfoBox data-sb-field-path="infoBoxContent">
        Don't overthink it. This is just version 1.0 of your idea. You'll refine it as you dig deeper.
      </InfoBox>

      {/* Main content area */}
      <div style={{
        marginBottom: '40px'
      }}>
        {/* Big Idea Description */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <label
              htmlFor="big-idea-description"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#333333',
                display: 'block'
              }}
              data-sb-field-path="labels.bigIdeaLabel"
            >
              What is your big idea for your new product or productized service?
            </label>

            <Button
              onClick={handleOpenURLModal}
              disabled={isAiLoading}
              style={{
                backgroundColor: '#fcf720',
                color: '#333333',
                borderRadius: '20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px'
              }}
            >
              <Lightbulb size={16} />
              Help me brainstorm
            </Button>
          </div>

          <textarea
            id="big-idea-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="e.g., A fillable buyer profile template and series of custom GPTs that helps entrepreneurs identify the best-fit buyers for their underperforming product/service"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '15px',
              border: '1px solid',
              borderColor: isFieldEmpty('description') ? '#ef4444' : '#DDDDDD',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              backgroundColor: '#F2F2F2',
              color: '#333333',
            }}
            data-sb-field-path="placeholders.bigIdeaPlaceholder"
          />
          {isFieldEmpty('description') && (
            <div style={{
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <AlertCircle size={14} />
              {getErrorMessage('description')}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <SaveIndicator saving={isSaving} />
          </div>
        </div>

        {/* Example Ideas */}
        <div style={{
          backgroundColor: '#F0E6FF',
          borderRadius: '15px',
          padding: '20px'
        }} data-sb-field-path="examples">
          <div style={{
            display: 'inline-block',
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: '15px',
            backgroundColor: '#6B46C1',
            padding: '4px 12px',
            borderRadius: '20px'
          }}>
            EXAMPLES
          </div>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#333333',
            fontSize: '14px'
          }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }} data-sb-field-path="examples.items[0]">
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A 6-week group coaching program that helps bootstrapped startups fix their user onboarding experience
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }} data-sb-field-path="examples.items[1]">
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A SaaS tool that helps content creators repurpose their content across multiple platforms
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }} data-sb-field-path="examples.items[2]">
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A membership community that provides ongoing support and resources for freelance designers
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }} data-sb-field-path="examples.items[3]">
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A productized service that delivers monthly SEO audits and recommendations for e-commerce stores
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }} data-sb-field-path="examples.items[4]">
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A course that teaches small business owners how to use AI tools to streamline their operations
            </li>
          </ul>
        </div>
      </div>

      {/* URL Input Modal */}
      <URLInputModal
        isOpen={showURLModal}
        onClose={handleCloseURLModal}
        onSubmit={handleBrainstormWithContext}
        isLoading={isAiLoading}
      />
    </div>
  );
};