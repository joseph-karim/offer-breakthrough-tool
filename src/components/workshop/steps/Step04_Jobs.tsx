import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop';
import { Plus, X, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import * as styles from '../../../styles/stepStyles';
import { InfoBox } from '../../ui/InfoBox';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ExampleBox } from '../../ui/ExampleBox';


// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs || [];
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents || [];
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;


export const Step04_Jobs: React.FC = () => {
  const storeJobs = useWorkshopStore(selectJobs);
  const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the jobs
  const [jobs, setJobs] = useState<Job[]>(storeJobs);
  const [newOverarchingJob, setNewOverarchingJob] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Accordion state
  const [isJobStatementHelpOpen, setIsJobStatementHelpOpen] = useState(false);

  // State for step accordions
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);
  const [isStep3Expanded, setIsStep3Expanded] = useState(false);

  // Toggle functions for accordions
  const toggleStep1 = useCallback(() => {
    setIsStep1Expanded(!isStep1Expanded);
  }, [isStep1Expanded]);

  const toggleStep2 = useCallback(() => {
    setIsStep2Expanded(!isStep2Expanded);
  }, [isStep2Expanded]);

  const toggleStep3 = useCallback(() => {
    setIsStep3Expanded(!isStep3Expanded);
  }, [isStep3Expanded]);

  // Get the overarching job
  const overarchingJob = jobs.find(job => job.isOverarching);

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

  // Accordion toggle function
  const toggleJobStatementHelp = useCallback(() => {
    setIsJobStatementHelpOpen(prev => !prev);
  }, []);

  return (
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#fcf720',
          color: 'black',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '15px',
          marginTop: '3px'
        }}>
          4
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Uncover Jobs-to-be-done
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>People don't buy products or services because of who they are. They buy things because they have a specific job they're trying to get done. Let's explore the 'job' your customer is trying to get done as it relates to your solution.</p>
        <p>A job statement describes the progress the customer seeks to make and the specific context. It's not about describing what your product does—it's about what your customer wants to get done.</p>
        <p>Format: "Help me [verb] + [object of verb] + [added context]"</p>
        <p>Example: "Help me generate [verb] predictable revenue [object of verb] from my email list without constantly creating new content [added context]"</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        {/* Context from previous steps */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginTop: '20px',
          marginBottom: '24px'  /* Added more bottom margin for spacing */
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

        <AccordionGroup>
          {/* Step 1: Job Brainstorming */}
          <AccordionItem
            title="Step 1: Job Brainstorming"
            isExpanded={isStep1Expanded}
            onToggle={toggleStep1}
          >
            <p style={{ marginBottom: '16px' }}>
              What jobs might your customers want to get done?
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <ChatWithSparkyButton
                exerciseKey="jobBrainstorm"
                exerciseTitle="Job Brainstorming"
                initialContext={{ message: "Let's brainstorm different jobs your customer may need to get done" }}
              />
            </div>
          </AccordionItem>

          {/* Step 2: Make Shortlist of Job Statements */}
          <AccordionItem
            title="Step 2: Make Shortlist of Job Statements"
            isExpanded={isStep2Expanded}
            onToggle={toggleStep2}
          >
            <p style={{ marginBottom: '16px' }}>
              Which jobs align with your unique capabilities or interests?
            </p>

            <p style={{ marginBottom: '16px' }}>
              Make a short list of the top 2-5 jobs.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <textarea
                placeholder="e.g., Help me create strategic lead magnet offers that attract high-intent leads and prime them for my paid offer"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Job Statement Help Box - ACCORDION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  backgroundColor: '#feffb7',
                  borderRadius: '8px',
                  border: '1px solid #e5e0a3'
                }}
                onClick={toggleJobStatementHelp}
              >
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Lightbulb size={16} style={{ color: '#222222' }} />
                  JOB STATEMENT HELP
                </h4>
                {isJobStatementHelpOpen ? (
                  <ChevronUp size={20} color="#1e293b" />
                ) : (
                  <ChevronDown size={20} color="#1e293b" />
                )}
              </div>

              {isJobStatementHelpOpen && (
                <InfoBox
                  showIcon={false}
                  style={{
                    padding: '16px',
                    fontSize: '14px',
                    borderRadius: '8px'
                  }}>
                  <p style={{ margin: '0 0 12px 0' }}>
                    A 'job' describes <strong>what</strong> the customer is trying to get done — it's action-driven, specific, and contextual. 'Desired outcomes' describe <strong>why</strong> they're doing it — it's the underlying motivation.
                  </p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    An 'overarching job' describes the customer's high-level objective. A 'supporting job' is a more specific job that the customer may also need to do to get their overarching job done. Small jobs can be big business opportunities.
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Overarching Job:</p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    "Help me to scale my service-based business without hiring more team members or working more hours."
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Supporting Jobs:</p>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                    <li>"Help me identify the specific buyers I should target to grow sales for an underperforming product"</li>
                    <li>"Help me validate demand for my new product before I waste time creating the wrong thing"</li>
                    <li>"Help me develop a new, scalable revenue stream for my existing online business that sells"</li>
                    <li>"Help me to build an audience that trusts me before I launch a new offer"</li>
                  </ul>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Using 'So that..." Technique to Refine Job Statement</p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    If you're unsure what the customer's true motivation is, try using the "so that" technique to dig deeper into the true job your customers want to get done.
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Example Refinement:</p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    "I want email sequences... so that... I can sell to my list... so that... I can generate revenue... so that... I can have predictable income without constantly chasing new leads"
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>Final Job Statement:</p>
                  <p style={{ margin: '0 0 12px 0' }}>
                    "Help me generate predictable revenue from my existing audience without spending more on ads or constantly creating new content"
                  </p>
                  <p style={{ margin: '0' }}>
                    This job statement exercise shifts perspective from focusing on the craft (writing emails) to solving the actual business problem—reliable revenue generation.
                  </p>
                </InfoBox>
              )}
            </div>
          </AccordionItem>

          {/* Step 3: Choose ONE job to focus on */}
          <AccordionItem
            title="Step 3: Choose ONE job to focus on building your offer around"
            isExpanded={isStep3Expanded}
            onToggle={toggleStep3}
          >
            <p style={{ marginBottom: '16px' }}>
              Narrow it down to ONE for now.
            </p>

            <p style={{ marginBottom: '16px' }}>
              You can choose an overarching or supporting job. You can revise your job statement as you better understand buyers for your offer.
            </p>

            {/* Input for the chosen job */}
            <div>
              <label
                htmlFor="chosenJob"
                style={styles.labelStyle}
              >
                Your chosen job statement:
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  id="chosenJob"
                  value={newOverarchingJob}
                  onChange={(e) => setNewOverarchingJob(e.target.value)}
                  onKeyPress={handleKeyPressOverarching}
                  placeholder="e.g., Help me generate more revenue from my existing customers without constantly creating new content"
                  style={styles.inputStyle}
                />
                <Button
                  variant="primary"
                  onClick={handleAddOverarchingJob}
                  disabled={!newOverarchingJob.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fcf720',
                    color: '#222222',
                    borderRadius: '15px',
                  }}
                >
                  <Plus size={20} />
                  Add
                </Button>
              </div>
            </div>
          </AccordionItem>
        </AccordionGroup>

        {/* Display existing job if it exists */}
        {overarchingJob && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Your Selected Job Statement
            </h3>

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
          </div>
        )}

        {/* Examples section */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 16px 0'
          }}>
            EXAMPLES
          </h3>

          <ExampleBox
            examples={[
              "Help me generate predictable revenue from my existing audience",
              "Help me attract new high-intent leads profitably and on autopilot",
              "Help me stay top-of-mind with my audience between launches",
              "Help me convert more email subscribers into paying customers",
              "Help me feel confident my marketing systems are working",
              "Help me maximize the value of each email subscriber",
              "Help me segment new leads and identify high-intent prospects",
              "Help me ensure my campaigns are being seen by my subscribers"
            ]}
            title="JOB STATEMENT EXAMPLES"
            initiallyVisible={true}
          />
        </div>
      </div>
    </div>
  );
};