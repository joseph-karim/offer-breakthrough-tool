import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { AlertCircle, HelpCircle, DollarSign } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';

// Separate selectors to prevent unnecessary re-renders
const selectPricing = (state: WorkshopStore) => state.workshopData.pricing || {
  strategy: '',
  justification: ''
};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

interface PricingFields {
  strategy: string;
  justification: string;
}

export const Step10_Pricing: React.FC = () => {
  const storeValue = useWorkshopStore(selectPricing);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the form
  const [localValue, setLocalValue] = useState<PricingFields>(storeValue);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const savingTimerRef = useRef<number | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
      if (savingTimerRef.current !== null) {
        window.clearTimeout(savingTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field: keyof PricingFields, value: string) => {
    const newValue = { ...localValue, [field]: value };
    setLocalValue(newValue);
    
    // Show saving indicator
    setIsSaving(true);
    
    // Clear any existing timers
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    if (savingTimerRef.current !== null) {
      window.clearTimeout(savingTimerRef.current);
    }
    
    // Save to store after a short delay
    saveTimerRef.current = window.setTimeout(() => {
      updateWorkshopData({ pricing: newValue });
      // Keep the saving indicator visible briefly
      savingTimerRef.current = window.setTimeout(() => setIsSaving(false), 500);
    }, 300);
  }, [localValue, updateWorkshopData]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={10}
        title="Determine Your Pricing Strategy"
        description="Set a price that reflects the value you provide and aligns with your market."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #16a34a',
            borderRadius: '0 8px 8px 0',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <DollarSign style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#16a34a' }} />
            Your pricing strategy should reflect both the value you provide and your market positioning.
          </div>

          {/* Pricing Strategy */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <label 
                htmlFor="pricing-strategy"
                style={{ fontWeight: 600, color: '#374151' }}
              >
                Pricing Strategy:
              </label>
              <Tooltip content="Choose your overall approach to pricing (e.g., premium, competitive, value-based)" position="right">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'help' 
                }}>
                  <HelpCircle size={16} style={{ color: '#9ca3af' }} />
                </div>
              </Tooltip>
            </div>
            <textarea
              id="pricing-strategy"
              rows={3}
              value={localValue.strategy}
              onChange={(e) => handleInputChange('strategy', e.target.value)}
              placeholder="Describe your overall pricing strategy. Will you position as premium, mid-market, or entry-level? Why?"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                lineHeight: 1.6,
                backgroundColor: 'white',
              }}
            />
          </div>

          {/* Pricing Justification */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <label 
                htmlFor="pricing-justification"
                style={{ fontWeight: 600, color: '#374151' }}
              >
                Pricing Justification:
              </label>
              <Tooltip content="Explain the reasoning behind your pricing strategy and specific price points" position="right">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'help' 
                }}>
                  <HelpCircle size={16} style={{ color: '#9ca3af' }} />
                </div>
              </Tooltip>
            </div>
            <textarea
              id="pricing-justification"
              rows={4}
              value={localValue.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              placeholder="What factors influenced your pricing decision? Consider market rates, perceived value, your costs, and any tiered offerings. List specific price points and explain the value at each tier."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                lineHeight: 1.6,
                backgroundColor: 'white',
              }}
            />
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 