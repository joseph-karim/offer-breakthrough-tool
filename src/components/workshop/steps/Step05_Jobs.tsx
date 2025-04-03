import React, { useState, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop'; // Import the Job type
import { Target } from 'lucide-react';

export const Step05_Jobs: React.FC = () => {
  const { initialJobs, updateWorkshopData } = useWorkshopStore(state => ({
    initialJobs: state.workshopData.jobs || [], // Ensure it's always an array
    updateWorkshopData: state.updateWorkshopData,
  }));

  // Join descriptions for the textarea
  const [jobsText, setJobsText] = useState<string>(
    initialJobs.map(job => job.description).join('\n')
  );

  // Update textarea if store data changes
  useEffect(() => {
    setJobsText(initialJobs.map(job => job.description).join('\n'));
  }, [initialJobs]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobsText(event.target.value);
  };

  const handleSave = () => {
    // Map strings back to Job objects
    const jobs: Job[] = jobsText
      .split('\n')
      .map(desc => desc.trim())
      .filter(desc => desc !== '')
      .map((description, index) => ({
        id: `user-${Date.now()}-${index}`, // Simple generated ID
        description,
        source: 'user' // Set source
      })); 
      
    updateWorkshopData({ jobs });
    console.log('Jobs To Be Done saved:', jobs);
  };

  const canSave = jobsText.trim() !== '';

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
            backgroundColor: '#f0f9ff', // sky-50
            borderLeft: '4px solid #0ea5e9', // sky-500
            borderRadius: '0 8px 8px 0',
            color: '#0369a1', // sky-800
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
            value={jobsText}
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
          disabled={!canSave} // Disable if empty
        >
          Save Jobs To Be Done
        </Button>
      </div>
    </div>
  );
}; 