import React, { useState, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { TriggerEvent } from '../../../types/workshop'; // Import the correct type
import { Info } from 'lucide-react';

export const Step04_TriggerEvents: React.FC = () => {
  const { initialTriggerEvents, updateWorkshopData } = useWorkshopStore(state => ({
    initialTriggerEvents: state.workshopData.triggerEvents || [], 
    updateWorkshopData: state.updateWorkshopData,
  }));

  const [triggerEventsText, setTriggerEventsText] = useState<string>(
    initialTriggerEvents.map(event => event.description).join('\n')
  );

  useEffect(() => {
    setTriggerEventsText(initialTriggerEvents.map(event => event.description).join('\n'));
  }, [initialTriggerEvents]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTriggerEventsText(event.target.value);
  };

  const handleSave = () => {
    // Map strings back to TriggerEvent objects, generating ID and source
    const triggerEvents: TriggerEvent[] = triggerEventsText
      .split('\n')
      .map(desc => desc.trim())
      .filter(desc => desc !== '')
      .map((description, index) => ({
        id: `user-${Date.now()}-${index}`, // Simple generated ID
        description,
        source: 'user' // Corrected source type
      })); 
      
    updateWorkshopData({ triggerEvents });
    console.log('Trigger Events saved:', triggerEvents);
  };

  const canSave = triggerEventsText.trim() !== '';

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
            backgroundColor: '#eef2ff', // indigo-50
            borderLeft: '4px solid #4f46e5', // indigo-600
            borderRadius: '0 8px 8px 0',
            color: '#3730a3', // indigo-800
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
            value={triggerEventsText}
            onChange={handleInputChange}
            placeholder={
              "e.g., Just got a promotion but feel overwhelmed\n" +
              "Received negative customer feedback\n" +
              "Competitor launched a new feature\n" +
              "Yearly planning session is approaching\n" +
              "Failed an important audit/compliance check"
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
          disabled={!canSave} // Disable if empty
        >
          Save Trigger Events
        </Button>
      </div>
    </div>
  );
};