import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { UnderlyingGoal } from '../../../types/workshop';
import { AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';
import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectUnderlyingGoal = (state: WorkshopStore) => state.workshopData.underlyingGoal;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step03_UnderlyingGoal: React.FC = () => {
  const underlyingGoal = useWorkshopStore(selectUnderlyingGoal);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);
  
  const [formData, setFormData] = useState<UnderlyingGoal>({
    businessGoal: underlyingGoal?.businessGoal || '',
    constraints: underlyingGoal?.constraints || '',
    antiGoals: underlyingGoal?.antiGoals || ''
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
    if (underlyingGoal) {
      setFormData({
        businessGoal: underlyingGoal.businessGoal || '',
        constraints: underlyingGoal.constraints || '',
        antiGoals: underlyingGoal.antiGoals || ''
      });
    }
  }, [underlyingGoal]);

  const handleInputChange = useCallback((field: keyof UnderlyingGoal, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        underlyingGoal: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof UnderlyingGoal) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof UnderlyingGoal) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };
  
  // Generate step context for AI
  const stepContext = `
    Workshop Step: Underlying Goal
    
    The user is clarifying their underlying business goal and constraints.
    
    Current underlying goal:
    Business Goal: ${formData.businessGoal}
    Constraints: ${formData.constraints}
    Anti-Goals: ${formData.antiGoals}
  `;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={3}
        title="Clarify Your Underlying Goal"
        description="Define what you want to achieve with your new offer and what constraints you have"
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
            step={3}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[3] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(3)}
          />
        </Card>
      )}
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fff7ed',
            borderLeft: '4px solid #ea580c',
            borderRadius: '0 8px 8px 0',
            color: '#9a3412',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#ea580c' }} />
            Clarifying your underlying goal will help you design a solution that works for both your customers AND your business.
          </div>
          
          {/* Business Goal */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="business-goal"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                What is your underlying business goal?
              </label>
              <Tooltip content="What do you hope to achieve with this new offer? How will it fit into your broader business strategy?">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="business-goal"
              value={formData.businessGoal}
              onChange={(e) => handleInputChange('businessGoal', e.target.value)}
              placeholder="e.g., Create a new revenue stream that's less dependent on my time and expertise"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('businessGoal') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('businessGoal') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('businessGoal')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator isSaving={isSaving} />
            </div>
          </div>
          
          {/* Constraints */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="constraints"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                What constraints do you have?
              </label>
              <Tooltip content="What limitations do you have in terms of time, resources, skills, etc.?">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="constraints"
              value={formData.constraints}
              onChange={(e) => handleInputChange('constraints', e.target.value)}
              placeholder="e.g., I can only dedicate 5 hours per week to this new offer, I have a limited budget for marketing"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('constraints') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('constraints') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('constraints')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator isSaving={isSaving} />
            </div>
          </div>
          
          {/* Anti-Goals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="anti-goals"
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                What are your anti-goals?
              </label>
              <Tooltip content="What do you want to avoid at all costs? What would make this offer a failure for you?">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="anti-goals"
              value={formData.antiGoals}
              onChange={(e) => handleInputChange('antiGoals', e.target.value)}
              placeholder="e.g., I don't want to create something that requires me to be available 24/7, I don't want to compete on price"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('antiGoals') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('antiGoals') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('antiGoals')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator isSaving={isSaving} />
            </div>
          </div>
          
          {/* Example Goals */}
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
              Example underlying goals:
            </p>
            <ul style={{ 
              listStyle: 'disc',
              paddingLeft: '24px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <li>Create a new revenue stream that's less dependent on my time and expertise</li>
              <li>Build a product that can generate passive income while I sleep</li>
              <li>Create a lead generation tool that helps me attract higher-value clients</li>
              <li>Develop an offer that complements my existing services and creates upsell opportunities</li>
              <li>Build something that can eventually be sold or run by someone else</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
