import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop';
import { Target, Plus, X, ArrowRight } from 'lucide-react';
import * as styles from '../../../styles/stepStyles';


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
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={styles.stepHeaderContainerStyle}>
        <div style={styles.stepNumberStyle}>
          05
        </div>
        <h2 style={styles.stepTitleStyle}>
          Uncover Jobs To Be Done (JTBD)
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>What progress is your customer trying to make? What outcome are they hiring a product/service for?</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>


        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={styles.infoBoxStyle}>
            <Target style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Think beyond features. Focus on the underlying need or goal. Why are they really looking for a solution?
          </div>

          {/* Job Hierarchy Framework */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              3A: Understanding Job Hierarchy
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Jobs-to-be-Done exist in a hierarchy with main functional jobs, supporting jobs, and emotional jobs:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Main Functional Job:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Initial attempt:</span>
                  <p style={{ margin: '4px 0 0 0' }}>"Help me write email sequences"</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowRight size={16} color="#94a3b8" />
                </div>
                <div style={{ padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '14px' }}>
                  <span style={{ color: '#0369a1', fontSize: '12px' }}>Refined:</span>
                  <p style={{ margin: '4px 0 0 0' }}>"Help me generate consistent revenue from my existing audience without spending more on ads"</p>
                </div>
              </div>

              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Supporting Jobs:</p>
              <ul style={{
                margin: '0 0 16px 0',
                paddingLeft: '16px',
                listStyleType: 'disc',
                color: '#334155',
                fontSize: '14px'
              }}>
                <li>"Help me stay top-of-mind with my audience"</li>
                <li>"Help me move prospects from interested to ready-to-buy"</li>
                <li>"Help me re-engage people who have gone cold"</li>
                <li>"Help me maximize the value of each subscriber"</li>
              </ul>

              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Emotional Jobs:</p>
              <ul style={{
                margin: '0',
                paddingLeft: '16px',
                listStyleType: 'disc',
                color: '#334155',
                fontSize: '14px'
              }}>
                <li>"Help me feel confident my marketing is working even when I'm not actively selling"</li>
                <li>"Help me stop worrying about feast-or-famine income cycles"</li>
                <li>"Help me feel professional and systematic in my approach to sales"</li>
              </ul>
            </div>
          </div>

          {/* Job Statement Refinement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              3B: Refining Your Job Statement
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Use the "so that" technique to dig deeper into the true job your customers are hiring you for:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Example Refinement:</p>
              <div style={{ color: '#334155', fontSize: '14px', fontStyle: 'italic' }}>
                "I want email sequences... <span style={{ color: '#0ea5e9' }}>so that</span>... I can sell to my list... <span style={{ color: '#0ea5e9' }}>so that</span>... I can generate revenue... <span style={{ color: '#0ea5e9' }}>so that</span>... I can have predictable income without constantly chasing new leads"
              </div>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#dcfce7',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#166534'
              }}>
                Final Job Statement:<br />
                "Help me generate predictable revenue from my existing audience without spending more on ads or constantly creating new content"
              </div>

              <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#475569' }}>
                This job statement exercise shifts perspective from focusing on the craft (writing emails) to solving the actual business problem—reliable revenue generation.
              </p>
            </div>
          </div>

          {/* Your Jobs To Be Done */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              3C: Your Jobs To Be Done
            </h3>

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
              style={styles.labelStyle}
            >
              Add Job To Be Done:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="newJob"
                value={newJob}
                onChange={(e) => setNewJob(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Help my clients generate predictable revenue from their existing audience"
                style={styles.inputStyle}
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
            <div style={styles.examplesContainerStyle}>
              <div style={styles.examplesLabelStyle}>
                EXAMPLES
              </div>
              <ul style={styles.examplesListStyle}>
                <li style={styles.exampleItemStyle}>
                  <span style={styles.exampleBulletStyle}>•</span>
                  Help me generate predictable revenue from my existing audience
                </li>
                <li style={styles.exampleItemStyle}>
                  <span style={styles.exampleBulletStyle}>•</span>
                  Help me stay top-of-mind with my audience between launches
                </li>
                <li style={styles.exampleItemStyle}>
                  <span style={styles.exampleBulletStyle}>•</span>
                  Help me convert more subscribers into paying customers
                </li>
                <li style={styles.exampleItemStyle}>
                  <span style={styles.exampleBulletStyle}>•</span>
                  Help me feel confident my marketing systems are working
                </li>
                <li style={styles.exampleItemStyle}>
                  <span style={styles.exampleBulletStyle}>•</span>
                  Help me maximize the value of each email subscriber
                </li>
              </ul>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};