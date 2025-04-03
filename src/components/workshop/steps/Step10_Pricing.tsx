import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { DollarSign, HelpCircle, AlertCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectPricing = (state: WorkshopStore) => state.workshopData.pricing || { strategy: '', justification: '' };
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectCanProceedToNextStep = (state: WorkshopStore) => state.canProceedToNextStep;

export const Step10_Pricing: React.FC = () => {
  const pricing = useWorkshopStore(selectPricing);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const canProceedToNextStep = useWorkshopStore(selectCanProceedToNextStep);

  const [formData, setFormData] = useState(pricing);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setFormData(pricing);
  }, [pricing]);

  // Show errors when trying to proceed without completing
  useEffect(() => {
    const checkCompletion = () => {
      const isComplete = canProceedToNextStep();
      if (!isComplete) {
        setShowErrors(true);
      }
    };

    // Only check completion when showErrors is true
    if (showErrors) {
      checkCompletion();
    }
  }, [canProceedToNextStep, showErrors]);

  const handleInputChange = useCallback((field: 'strategy' | 'justification', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        pricing: {
          ...pricing,
          [field]: value
        }
      });
      setIsSaving(false);
      if (value.trim() !== '') {
        setShowErrors(false);
      }
    }, 500);
    setSaveTimer(timer);
  }, [pricing, updateWorkshopData]);

  const isFieldEmpty = (field: 'strategy' | 'justification'): boolean => {
    return showErrors && !formData[field].trim();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={10}
        title="Pricing Strategy"
        description="Define your pricing strategy and explain how it aligns with your value proposition."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '0 8px 8px 0',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <DollarSign style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Consider factors like market positioning, customer value perception, and operational costs.
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="strategy"
                style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  flex: 1
                }}
              >
                Pricing Strategy
              </label>
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}
              >
                <HelpCircle size={14} />
                What pricing model will you use?
              </div>
            </div>
            <textarea
              id="strategy"
              rows={4}
              value={formData.strategy}
              onChange={(e) => handleInputChange('strategy', e.target.value)}
              placeholder="e.g., Tiered pricing with three levels: Basic ($X/mo), Pro ($Y/mo), and Enterprise (custom pricing)"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('strategy') ? '#ef4444' : '#d1d5db',
                fontSize: '16px',
                lineHeight: 1.6,
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('strategy') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px'
              }}>
                <AlertCircle size={14} />
                Please define your pricing strategy
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label 
                htmlFor="justification"
                style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  flex: 1
                }}
              >
                Strategy Justification
              </label>
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}
              >
                <HelpCircle size={14} />
                Why did you choose this pricing strategy?
              </div>
            </div>
            <textarea
              id="justification"
              rows={4}
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              placeholder="Explain why this pricing strategy makes sense for your market and offer. How does it align with your value proposition?"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('justification') ? '#ef4444' : '#d1d5db',
                fontSize: '16px',
                lineHeight: 1.6,
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('justification') && (
              <div style={{ 
                color: '#ef4444',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '8px'
              }}>
                <AlertCircle size={14} />
                Please explain your pricing strategy choice
              </div>
            )}
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 