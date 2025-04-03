import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { AntiGoals } from '../../../types/workshop';
import { Info } from 'lucide-react';

// Define the keys for anti-goals for easier mapping
const antiGoalKeys: (keyof AntiGoals)[] = ['market', 'offer', 'delivery', 'lifestyle', 'values'];

// Helper to get placeholder text for each anti-goal
const getPlaceholder = (key: keyof AntiGoals): string => {
  switch (key) {
    case 'market': return "e.g., I don't want to serve beginners, I don't want clients who haggle on price...";
    case 'offer': return "e.g., I don't want to offer generic services, I don't want a low-ticket offer...";
    case 'delivery': return "e.g., I don't want to do 1:1 coaching calls, I don't want scope creep...";
    case 'lifestyle': return "e.g., I don't want to work weekends, I don't want to travel constantly...";
    case 'values': return "e.g., I don't want to work with unethical companies, I don't want high-pressure sales...";
    default: return "Describe what you want to avoid...";
  }
};

// Helper to get title for each anti-goal
const getTitle = (key: keyof AntiGoals): string => {
  switch (key) {
    case 'market': return "Market Anti-Goals";
    case 'offer': return "Offer Anti-Goals";
    case 'delivery': return "Delivery Anti-Goals";
    case 'lifestyle': return "Business Lifestyle Anti-Goals";
    case 'values': return "Values & Ethics Anti-Goals";
    default: return "Anti-Goal";
  }
};

// Separate selectors to prevent unnecessary re-renders
const selectAntiGoals = (state: WorkshopStore) => state.workshopData.antiGoals || {
  market: '', offer: '', delivery: '', lifestyle: '', values: ''
};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step03_AntiGoals: React.FC = () => {
  const storeValue = useWorkshopStore(selectAntiGoals);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the form
  const [localValue, setLocalValue] = useState<AntiGoals>(storeValue);

  // Update local state when store value changes
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  const handleInputChange = useCallback((key: keyof AntiGoals, value: string) => {
    setLocalValue(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    updateWorkshopData({ antiGoals: localValue });
  }, [localValue, updateWorkshopData]);

  // Check if any changes have been made
  const hasChanges = JSON.stringify(localValue) !== JSON.stringify(storeValue);
  const hasContent = Object.values(localValue).some(value => value.trim() !== '');
  const canSave = hasChanges && hasContent;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={3}
        title="Define Your Anti-Goals"
        description="Clarify what you *don't* want to happen. Setting boundaries helps focus your offer and attract the right clients."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#eef2ff',
            borderLeft: '4px solid #4f46e5',
            borderRadius: '0 8px 8px 0',
            color: '#3730a3',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#4f46e5' }} />
            Being clear about what you *don't* want is as important as knowing what you *do* want. It prevents future frustration.
          </div>

          {antiGoalKeys.map(key => (
            <div key={key}>
              <label 
                htmlFor={`antiGoal-${key}`}
                style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}
              >
                {getTitle(key)}:
              </label>
              <textarea
                id={`antiGoal-${key}`}
                rows={3}
                value={localValue[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={getPlaceholder(key)}
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
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save Anti-Goals
        </Button>
      </div>
    </div>
  );
}; 