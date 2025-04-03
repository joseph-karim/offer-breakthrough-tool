import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Lightbulb, AlertCircle } from 'lucide-react';
import type { WorkshopStore } from '../../../store/workshopStore';

// Separate selectors to prevent unnecessary re-renders
const selectMarketDemandAnalysis = (state: WorkshopStore) => state.workshopData.marketDemandAnalysis || '';
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectCanProceedToNextStep = (state: WorkshopStore) => state.canProceedToNextStep;

export const Step02_MarketDemand: React.FC = () => {
  // Get initial value from store
  const storeValue = useWorkshopStore(selectMarketDemandAnalysis);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const canProceedToNextStep = useWorkshopStore(selectCanProceedToNextStep);
  
  // Use local state for the textarea
  const [localValue, setLocalValue] = useState(storeValue);
  const [showError, setShowError] = useState(false);

  // Update local state when store value changes (e.g., when navigating back to this step)
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  // Show error when trying to proceed without completing
  useEffect(() => {
    if (!canProceedToNextStep()) {
      setShowError(true);
    }
  }, [canProceedToNextStep]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    // Save to store immediately if there's content
    if (newValue.trim() !== '') {
      updateWorkshopData({ marketDemandAnalysis: newValue });
      setShowError(false);
    }
  }, [updateWorkshopData]);

  const isFieldEmpty = () => showError && !localValue.trim();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={2}
        title="Analyze Market Demand & Existing Solutions"
        description="Understand what your target audience currently uses and their frustrations. Who are your main competitors?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <label htmlFor="marketAnalysis" style={{ fontWeight: 600, color: '#374151' }}>
            Existing Solutions & Competitor Analysis:
          </label>
          <textarea
            id="marketAnalysis"
            rows={8}
            value={localValue}
            onChange={handleInputChange}
            placeholder="Describe the solutions your target market currently uses. Who are the main players? What are their strengths and weaknesses? What frustrations do customers have?"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isFieldEmpty() ? '#ef4444' : '#d1d5db',
              fontSize: '16px',
              lineHeight: 1.6,
              backgroundColor: 'white',
            }}
          />
          {isFieldEmpty() && (
            <div style={{ 
              color: '#ef4444',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <AlertCircle size={14} />
              This field is required to proceed
            </div>
          )}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '0 8px 8px 0',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#d97706' }} />
            Think about direct competitors (offering similar solutions) and indirect alternatives (how people solve the problem now, even if differently).
          </div>
        </div>
      </Card>
    </div>
  );
}; 