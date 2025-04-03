import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop';
import { Target } from 'lucide-react';

// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => 
  state.workshopData.jobs?.map(job => job.description).join('\n') || '';
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step05_Jobs: React.FC = () => {
  const storeValue = useWorkshopStore(selectJobs);
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
      // Map strings back to Job objects
      const jobs: Job[] = localValue
        .split('\n')
        .map(desc => desc.trim())
        .filter(desc => desc !== '')
        .map((description, index) => ({
          id: `user-${Date.now()}-${index}`,
          description,
          source: 'user'
        }));
      
      updateWorkshopData({ jobs });
    }
  }, [localValue, updateWorkshopData]);

  const canSave = localValue.trim() !== '' && localValue !== storeValue;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={5}
        title="Uncover Jobs To Be Done (JTBD)"
        description="What progress is your customer trying to make? What outcome are they hiring a product/service for?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
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
            <Target style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Think beyond features. Focus on the underlying need or goal. Why are they really looking for a solution?
          </div>

          <label 
            htmlFor="jobs"
            style={{ fontWeight: 600, color: '#374151' }}
          >
            List Jobs To Be Done (one per line):
          </label>
          <textarea
            id="jobs"
            rows={8}
            value={localValue}
            onChange={handleInputChange}
            placeholder={
              "e.g., Reduce the time it takes to generate monthly reports\n" +
              "Feel more confident presenting to executives\n" +
              "Avoid costly mistakes in financial planning\n" +
              "Impress my boss with proactive insights\n" +
              "Delegate tasks more effectively to my team"
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
          Save Jobs To Be Done
        </Button>
      </div>
    </div>
  );
}; 