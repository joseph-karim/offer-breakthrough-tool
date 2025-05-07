import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop';
import { Target, Plus, X, Info } from 'lucide-react';
import * as styles from '../../../styles/stepStyles';


// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs || [];
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents || [];
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;


export const Step05_Jobs: React.FC = () => {
  const storeJobs = useWorkshopStore(selectJobs);
  const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the jobs
  const [jobs, setJobs] = useState<Job[]>(storeJobs);
  const [newOverarchingJob, setNewOverarchingJob] = useState('');
  const [newSupportingJob, setNewSupportingJob] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Get the overarching job and supporting jobs
  const overarchingJob = jobs.find(job => job.isOverarching);
  const supportingJobs = jobs.filter(job => !job.isOverarching);

  // Get a sample of trigger events to display (max 3)
  const sampleTriggerEvents = triggerEvents.slice(0, 3);

  // Update local state when store value changes
  useEffect(() => {
    setJobs(storeJobs);
  }, [storeJobs]);

  const handleAddOverarchingJob = useCallback(() => {
    if (newOverarchingJob.trim() !== '') {
      // Remove any existing overarching job
      const filteredJobs = jobs.filter(job => !job.isOverarching);

      const job: Job = {
        id: `user-${Date.now()}`,
        description: newOverarchingJob.trim(),
        source: 'user',
        isOverarching: true
      };

      const updatedJobs = [...filteredJobs, job];
      setJobs(updatedJobs);
      setNewOverarchingJob(''); // Clear input
      updateWorkshopData({ jobs: updatedJobs });
    }
  }, [newOverarchingJob, jobs, updateWorkshopData]);

  const handleAddSupportingJob = useCallback(() => {
    if (newSupportingJob.trim() !== '') {
      const job: Job = {
        id: `user-${Date.now()}`,
        description: newSupportingJob.trim(),
        source: 'user',
        isOverarching: false
      };

      const updatedJobs = [...jobs, job];
      setJobs(updatedJobs);
      setNewSupportingJob(''); // Clear input
      updateWorkshopData({ jobs: updatedJobs });
    }
  }, [newSupportingJob, jobs, updateWorkshopData]);

  const handleDeleteJob = useCallback((id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    updateWorkshopData({ jobs: updatedJobs });
  }, [jobs, updateWorkshopData]);

  const handleKeyPressOverarching = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddOverarchingJob();
    }
  }, [handleAddOverarchingJob]);

  const handleKeyPressSupporting = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddSupportingJob();
    }
  }, [handleAddSupportingJob]);

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
          {/* Context from previous steps */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 12px 0'
            }}>
              Your Context
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Your Business/Expertise:</p>
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                {bigIdea?.description || "Not specified yet"}
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Some Potential Buying Triggers:</p>
              <ul style={{
                margin: '0',
                paddingLeft: '16px',
                listStyleType: 'disc',
                color: '#334155',
                fontSize: '14px'
              }}>
                {sampleTriggerEvents.length > 0 ? (
                  sampleTriggerEvents.map((trigger, index) => (
                    <li key={index}>{trigger.description}</li>
                  ))
                ) : (
                  <li>No trigger events specified yet</li>
                )}
              </ul>
            </div>
          </div>

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
              Understanding Job Hierarchy
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Jobs-to-be-Done exist in a hierarchy with an Overarching Job and Supporting Jobs:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>Overarching Job:</p>
              <div style={{ padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '14px' }}>
                <p style={{ margin: '0' }}>"Help me generate predictable revenue from my existing audience without spending more on ads"</p>
              </div>

              <p style={{ margin: '16px 0 8px 0', fontWeight: 500 }}>Supporting Jobs:</p>
              <ul style={{
                margin: '0',
                paddingLeft: '16px',
                listStyleType: 'disc',
                color: '#334155',
                fontSize: '14px'
              }}>
                <li>"Help me stay top-of-mind with my audience between launches"</li>
                <li>"Help me move prospects from interested to ready-to-buy"</li>
                <li>"Help me re-engage people who have gone cold"</li>
                <li>"Help me maximize the value of each subscriber"</li>
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
              Refining Your Job Statement
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

          {/* Overarching Job */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              Your Overarching Job Statement
            </h3>

            <div style={styles.infoBoxStyle}>
              <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
              This is the main, high-level 'job' or 'progress' a customer is trying to make. Think big picture here.
            </div>

            {/* Display existing overarching job if it exists */}
            {overarchingJob && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#e0f2fe',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd',
                }}
              >
                <span style={{ flex: 1, color: '#0c4a6e', fontWeight: 500 }}>{overarchingJob.description}</span>
                <button
                  onClick={() => handleDeleteJob(overarchingJob.id)}
                  onMouseEnter={() => setHoveredId(overarchingJob.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: hoveredId === overarchingJob.id ? '#ef4444' : '#6b7280',
                    transition: 'color 0.2s ease'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Add overarching job input */}
            {!overarchingJob && (
              <div>
                <label
                  htmlFor="newOverarchingJob"
                  style={styles.labelStyle}
                >
                  Add Overarching Job Statement:
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    id="newOverarchingJob"
                    value={newOverarchingJob}
                    onChange={(e) => setNewOverarchingJob(e.target.value)}
                    onKeyPress={handleKeyPressOverarching}
                    placeholder="e.g., Help me generate predictable revenue from my existing audience"
                    style={styles.inputStyle}
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddOverarchingJob}
                    disabled={!newOverarchingJob.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={20} />
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Example overarching jobs */}
            {!overarchingJob && (
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
                    Help me build a sustainable business that doesn't depend on my constant presence
                  </li>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Help me transform my expertise into a scalable solution that serves more people
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Supporting Jobs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: 0
            }}>
              Your Supporting Job Statements
            </h3>

            <div style={styles.infoBoxStyle}>
              <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
              These are the smaller, more specific 'jobs' that help achieve the Overarching Job.
            </div>

            {/* List of existing supporting jobs */}
            {supportingJobs.length > 0 && (
              <div style={{ display: 'grid', gap: '12px' }}>
                {supportingJobs.map(job => (
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

            {/* Add supporting job input */}
            <div>
              <label
                htmlFor="newSupportingJob"
                style={styles.labelStyle}
              >
                Add Supporting Job:
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  id="newSupportingJob"
                  value={newSupportingJob}
                  onChange={(e) => setNewSupportingJob(e.target.value)}
                  onKeyPress={handleKeyPressSupporting}
                  placeholder="e.g., Help me stay top-of-mind with my audience between launches"
                  style={styles.inputStyle}
                />
                <Button
                  variant="primary"
                  onClick={handleAddSupportingJob}
                  disabled={!newSupportingJob.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={20} />
                  Add
                </Button>
              </div>
            </div>

            {/* Example supporting jobs */}
            {supportingJobs.length === 0 && (
              <div style={styles.examplesContainerStyle}>
                <div style={styles.examplesLabelStyle}>
                  EXAMPLES
                </div>
                <ul style={styles.examplesListStyle}>
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