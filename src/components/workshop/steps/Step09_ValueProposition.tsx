import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';

// Separate selectors to prevent unnecessary re-renders
const selectValueProposition = (state: WorkshopStore) => state.workshopData.valueProposition || {};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

interface ValuePropositionData {
  uniqueValue?: string;
  painPoints?: string;
  benefits?: string;
  differentiators?: string;
}

const placeholders = {
  uniqueValue: "Example: We help small business owners increase their revenue by 30% through automated marketing campaigns that require minimal time investment.",
  painPoints: "Example: Small business owners struggle with limited time and marketing expertise, leading to inconsistent customer acquisition and revenue.",
  benefits: "Example: Save 10 hours per week on marketing tasks, increase customer engagement by 50%, and generate 25% more qualified leads.",
  differentiators: "Example: Unlike traditional agencies, we offer AI-powered automation, fixed pricing, and guaranteed results within 90 days."
};

const tooltips = {
  uniqueValue: "A clear statement that explains how your solution helps customers achieve their desired outcome",
  painPoints: "The specific challenges and problems your target market faces that your solution addresses",
  benefits: "Quantifiable advantages and positive outcomes customers gain from using your solution",
  differentiators: "What makes your solution unique compared to alternatives in the market"
};

export const Step09_ValueProposition: React.FC = () => {
  const valueProposition = useWorkshopStore(selectValueProposition);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const [formData, setFormData] = useState<ValuePropositionData>(valueProposition);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFormData(valueProposition);
  }, [valueProposition]);

  const handleInputChange = useCallback((field: keyof ValuePropositionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        valueProposition: {
          ...valueProposition,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [valueProposition, updateWorkshopData]);

  const isComplete = useCallback(() => {
    return Boolean(
      formData.uniqueValue?.trim() &&
      formData.painPoints?.trim() &&
      formData.benefits?.trim() &&
      formData.differentiators?.trim()
    );
  }, [formData]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={9}
        title="Define Your Value Proposition"
        description="Create a compelling value proposition that resonates with your target market."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fef3c7',
            borderLeft: '4px solid #d97706',
            borderRadius: '0 8px 8px 0',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#d97706' }} />
            Your value proposition should clearly communicate the unique benefits and advantages your solution offers to your target market.
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {Object.entries({
              uniqueValue: 'Unique Value Statement',
              painPoints: 'Customer Pain Points',
              benefits: 'Key Benefits',
              differentiators: 'Competitive Differentiators'
            }).map(([field, label]) => (
              <div key={field} style={{ display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label
                    htmlFor={field}
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#111827'
                    }}
                  >
                    {label}
                  </label>
                  <Tooltip
                    content={tooltips[field as keyof typeof tooltips]}
                    position="right"
                  >
                    <div style={{
                      cursor: 'help',
                      display: 'inline-flex',
                      padding: '2px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6'
                    }}>
                      <AlertCircle size={14} style={{ color: '#6b7280' }} />
                    </div>
                  </Tooltip>
                </div>
                <textarea
                  id={field}
                  value={formData[field as keyof ValuePropositionData] || ''}
                  onChange={(e) => handleInputChange(field as keyof ValuePropositionData, e.target.value)}
                  placeholder={placeholders[field as keyof typeof placeholders]}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: isComplete() ? '#f0fdf4' : '#fef2f2',
            borderRadius: '8px',
            color: isComplete() ? '#166534' : '#991b1b',
            fontSize: '14px',
          }}>
            {isComplete() ? (
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
            )}
            <span>
              {isComplete()
                ? 'Great job! Your value proposition is complete.'
                : 'Please fill in all fields to complete your value proposition.'}
            </span>
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 