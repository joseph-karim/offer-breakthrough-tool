import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop';
import { Target, Plus, X } from 'lucide-react';

// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs || [];
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step05_Jobs: React.FC = () => {
  const storeJobs = useWorkshopStore(selectJobs);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the jobs
  const [jobs, setJobs] = useState<Job[]>(storeJobs);
  const [newJob, setNewJob] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    setJobs(storeJobs);
  }, [storeJobs]);

  const handleAddJob = useCallback(() => {
    if (newJob.trim() !== '') {
      const job: Job = {
        id: `user-${Date.now()}`,
        description: newJob.trim(),
        source: 'user'
      };
      
      setJobs(prev => [...prev, job]);
      setNewJob(''); // Clear input
      updateWorkshopData({ jobs: [...jobs, job] });
    }
  }, [newJob, jobs, updateWorkshopData]);

  const handleDeleteJob = useCallback((id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    updateWorkshopData({ jobs: updatedJobs });
  }, [jobs, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddJob();
    }
  }, [handleAddJob]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={5}
        title="Uncover Jobs To Be Done (JTBD)"
        description="What progress is your customer trying to make? What outcome are they hiring a product/service for?"
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
            <Target style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Think beyond features. Focus on the underlying need or goal. Why are they really looking for a solution?
          </div>

          {/* List of existing jobs */}
          {jobs.length > 0 && (
            <div style={{ display: 'grid', gap: '12px' }}>
              {jobs.map(job => (
                <div 
                  key={job.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ flex: 1, color: '#374151' }}>{job.description}</span>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    onMouseEnter={() => setHoveredId(job.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      padding: '4px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: hoveredId === job.id ? '#ef4444' : '#6b7280',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new job input */}
          <div>
            <label 
              htmlFor="newJob"
              style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}
            >
              Add Job To Be Done:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="newJob"
                value={newJob}
                onChange={(e) => setNewJob(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Reduce the time it takes to generate monthly reports"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  backgroundColor: 'white',
                }}
              />
              <Button 
                variant="primary"
                onClick={handleAddJob}
                disabled={!newJob.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={20} />
                Add
              </Button>
            </div>
          </div>

          {/* Example jobs */}
          {jobs.length === 0 && (
            <div style={{ 
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #d1d5db'
            }}>
              <p style={{ 
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic',
                marginBottom: '12px'
              }}>
                Example jobs to be done:
              </p>
              <ul style={{ 
                listStyle: 'disc',
                paddingLeft: '24px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                <li>Reduce the time it takes to generate monthly reports</li>
                <li>Feel more confident presenting to executives</li>
                <li>Avoid costly mistakes in financial planning</li>
                <li>Impress my boss with proactive insights</li>
                <li>Delegate tasks more effectively to my team</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}; 