import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { TriggerEvent } from '../../../types/workshop';
import { Info } from 'lucide-react';

// Separate selectors to prevent unnecessary re-renders
const selectTriggerEvents = (state: WorkshopStore) => 
  state.workshopData.triggerEvents?.map(event => event.description).join('\n') || '';
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step04_TriggerEvents: React.FC = () => {
  const storeValue = useWorkshopStore(selectTriggerEvents);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the textarea
  const [localValue, setLocalValue] = useState(storeValue);

  // Update local state when store value changes
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(event.target.value);
  }, []);

  const handleSave = useCallback(() => {
    if (localValue.trim() !== '') {
      // Map strings back to TriggerEvent objects
      const triggerEvents: TriggerEvent[] = localValue
        .split('\n')
        .map(desc => desc.trim())
        .filter(desc => desc !== '')
        .map((description, index) => ({
          id: `user-${Date.now()}-${index}`,
          description,
          source: 'user'
        }));
      
      updateWorkshopData({ triggerEvents });
    }
  }, [localValue, updateWorkshopData]);

  const canSave = localValue.trim() !== '' && localValue !== storeValue;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={4}
        title="Identify Trigger Events"
        description="What specific events or situations cause someone to actively seek a solution like yours?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
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
            Focus on the *moment* of change. What just happened that made them realize they need help NOW?
          </div>

          <label 
            htmlFor="triggerEvents"
            style={{ fontWeight: 600, color: '#374151' }}
          >
            List Trigger Events (one per line):
          </label>
          <textarea
            id="triggerEvents"
            rows={8}
            value={localValue}
            onChange={handleInputChange}
            placeholder={
              "e.g., Just got promoted to manager\n" +
              "Lost a major client due to poor reporting\n" +
              "Team doubled in size in 3 months\n" +
              "Received negative feedback about leadership style\n" +
              "Missed quarterly targets for the first time"
            }
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
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save Trigger Events
        </Button>
      </div>
    </div>
  );
};