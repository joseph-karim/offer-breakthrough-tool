import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';
import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step02_BigIdea: React.FC = () => {
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);
  
  const [formData, setFormData] = useState<BigIdea>({
    description: bigIdea?.description || '',
    targetCustomers: bigIdea?.targetCustomers || '',
    version: 'initial'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store value changes
  useEffect(() => {
    if (bigIdea) {
      setFormData({
        description: bigIdea.description || '',
        targetCustomers: bigIdea.targetCustomers || '',
        version: 'initial'
      });
    }
  }, [bigIdea]);

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

  // Check if a field is empty
  const isFieldEmpty = (field: keyof BigIdea) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof BigIdea) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };
  
  // Generate step context for AI
  const stepContext = `
    Workshop Step: Big Idea
    
    The user is defining their initial product or service idea.
    
    Current big idea:
    Description: ${formData.description}
    Target Customers: ${formData.targetCustomers}
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={2}
        title="Your Big Idea"
        description="Describe your product idea using a simple framework: [What it is] + [what will it help customers do]"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          variant="ghost"
          onClick={() => setShowChat(!showChat)}
          rightIcon={<MessageSquare size={16} />}
        >
          {showChat ? 'Hide AI Assistant' : 'Get AI Help'}
        </Button>
      </div>
      
      {showChat && (
        <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
          <ChatInterface 
            step={2}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[2] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(2)}
          />
        </Card>
      )}
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '0 8px 8px 0',
            color: '#0c4a6e',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            This is just version 1 of your idea. You'll refine it as you go through the workshop.
          </div>
          
          {/* Big Idea Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="big-idea-description"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                What is your product or service idea?
              </label>
              <Tooltip content="Describe what your product or service is and what it will help customers do">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="big-idea-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., A 6-week group coaching program that helps service-based entrepreneurs create a scalable digital product"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('description') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
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
              <SaveIndicator isSaving={isSaving} />
            </div>
          </div>
          
          {/* Target Customers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="target-customers"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Who do you think your target customers are?
              </label>
              <Tooltip content="Describe who you think might buy your product or service">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="target-customers"
              value={formData.targetCustomers}
              onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
              placeholder="e.g., Freelance marketers who want to stop trading time for money"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('targetCustomers') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('targetCustomers') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('targetCustomers')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator isSaving={isSaving} />
            </div>
          </div>
          
          {/* Example Ideas */}
          <div style={{ 
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <p style={{ 
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic',
              marginBottom: '12px'
            }}>
              Example big ideas:
            </p>
            <ul style={{ 
              listStyle: 'disc',
              paddingLeft: '24px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <li>A 6-week group coaching program that helps service-based entrepreneurs create a scalable digital product</li>
              <li>A SaaS tool that helps content creators repurpose their content across multiple platforms</li>
              <li>A membership community that provides ongoing support and resources for freelance designers</li>
              <li>A productized service that delivers monthly SEO audits and recommendations for e-commerce stores</li>
              <li>A course that teaches small business owners how to use AI tools to streamline their operations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
