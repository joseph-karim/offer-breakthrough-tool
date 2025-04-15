import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { Lightbulb, AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectValueProposition = (state: WorkshopStore) => state.workshopData.valueProposition || {};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;

interface ValuePropositionData {
  uniqueValue?: string;
  painPoints?: string;
  benefits?: string;
  differentiators?: string;
}

const FIELDS = {
  uniqueValue: 'Unique Value',
  painPoints: 'Pain Points',
  benefits: 'Benefits',
  differentiators: 'Differentiators'
} as const;

const PLACEHOLDERS = {
  uniqueValue: 'What makes your solution unique? What can you offer that others cannot?',
  painPoints: 'What specific problems or challenges does your solution address?',
  benefits: 'What tangible outcomes and benefits will customers receive?',
  differentiators: 'How are you different from existing solutions in the market?'
} as const;

export const Step09_ValueProposition: React.FC = () => {
  const valueProposition = useWorkshopStore(selectValueProposition);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);

  // Make sure formData is initialized with a safe default object
  const [formData, setFormData] = useState<ValuePropositionData>({
    uniqueValue: valueProposition?.uniqueValue || '',
    painPoints: valueProposition?.painPoints || '',
    benefits: valueProposition?.benefits || '',
    differentiators: valueProposition?.differentiators || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFormData(valueProposition);
  }, [valueProposition]);

  // Initialize value proposition if it doesn't exist
  useEffect(() => {
    // Only update if the valueProposition doesn't exist or is missing required properties
    if (!valueProposition || 
        Object.keys(valueProposition).length === 0 || 
        Object.values(valueProposition).every(val => val === undefined || val === null)) {
      updateWorkshopData({
        valueProposition: {
          uniqueValue: '',
          painPoints: '',
          benefits: '',
          differentiators: ''
        }
      });
    }
  }, [updateWorkshopData]);

  const handleInputChange = useCallback((field: keyof ValuePropositionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      // Ensure we're updating with the latest valueProposition data
      updateWorkshopData({
        valueProposition: {
          uniqueValue: valueProposition?.uniqueValue || '',
          painPoints: valueProposition?.painPoints || '',
          benefits: valueProposition?.benefits || '',
          differentiators: valueProposition?.differentiators || '',
          // Override with the new value
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [valueProposition, updateWorkshopData, saveTimer]);

  const isFieldEmpty = (field: keyof ValuePropositionData): boolean => {
    return showErrors && !formData[field]?.trim();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={9}
        title="Value Proposition"
        description="Define your unique value proposition and how it addresses your market's needs."
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
            <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Focus on what makes your solution unique and valuable to your target market.
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {Object.entries(FIELDS).map(([field, label]) => {
              // Ensure field is a valid key of ValuePropositionData
              const typedField = field as keyof ValuePropositionData;
              return (
                <div key={field}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <label 
                      htmlFor={field}
                      style={{ 
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        flex: 1
                      }}
                    >
                      {label}
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
                      {PLACEHOLDERS[typedField]}
                    </div>
                  </div>
                  <textarea
                    id={field}
                    rows={4}
                    value={formData[typedField] || ''}
                    onChange={(e) => handleInputChange(typedField, e.target.value)}
                    placeholder={PLACEHOLDERS[typedField]}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isFieldEmpty(typedField) ? '#ef4444' : '#d1d5db',
                      fontSize: '16px',
                      lineHeight: 1.6,
                      backgroundColor: 'white',
                    }}
                  />
                  {isFieldEmpty(typedField) && (
                    <div style={{ 
                      color: '#ef4444',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px'
                    }}>
                      <AlertCircle size={14} />
                      Please fill in this field
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 