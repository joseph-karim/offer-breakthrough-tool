import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/Button';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { PainstormingModal } from '../chat/PainstormingModal';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectIsPainstormingModalOpen = (state: WorkshopStore) => state.isPainstormingModalOpen;
const selectPainstormingOutput = (state: WorkshopStore) => state.painstormingOutput;
const selectClosePainstormingModal = (state: WorkshopStore) => state.closePainstormingModal;
const selectSetFocusedProblems = (state: WorkshopStore) => state.setFocusedProblems;
const selectGeneratePainstormingSuggestions = (state: WorkshopStore) => state.generatePainstormingSuggestions;
const selectIsAiLoading = (state: WorkshopStore) => state.isAiLoading;

interface PainstormingResults {
  buyer1Pains: string;
  buyer2Pains: string;
  buyer3Pains: string;
  overlappingPains: string;
  ahaMoments: string;
}

export const Step07_Painstorming: React.FC = () => {
  const jobs = useWorkshopStore(selectJobs);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const isPainstormingModalOpen = useWorkshopStore(selectIsPainstormingModalOpen);
  const painstormingOutput = useWorkshopStore(selectPainstormingOutput);
  const closePainstormingModal = useWorkshopStore(selectClosePainstormingModal);
  const setFocusedProblems = useWorkshopStore(selectSetFocusedProblems);
  const generatePainstormingSuggestions = useWorkshopStore(selectGeneratePainstormingSuggestions);
  const isAiLoading = useWorkshopStore(selectIsAiLoading);

  // Local state for form values
  const [formData, setFormData] = useState<PainstormingResults>({
    buyer1Pains: '',
    buyer2Pains: '',
    buyer3Pains: '',
    overlappingPains: '',
    ahaMoments: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Get top selected buyers (up to 3)
  const topBuyers = targetBuyers
    .filter(buyer => buyer.isTopThree)
    .slice(0, 3);

  // Get selected job
  const selectedJob = jobs.find(job => job.isOverarching || job.selected);

  // Load initial data if available
  useEffect(() => {
    const currentData = useWorkshopStore.getState().workshopData.painstormingResults;
    if (currentData) {
      setFormData({
        buyer1Pains: currentData.buyer1Pains || '',
        buyer2Pains: currentData.buyer2Pains || '',
        buyer3Pains: currentData.buyer3Pains || '',
        overlappingPains: currentData.overlappingPains || '',
        ahaMoments: currentData.ahaMoments || ''
      });
    }
  }, []);

  const handleInputChange = useCallback((field: keyof PainstormingResults, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        painstormingResults: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  const handleConfirmSelection = useCallback((selectedProblems: string[]) => {
    // Save the selected problems to store
    setFocusedProblems(selectedProblems);

    // Also update the overlapping pains in our local form
    const formattedProblems = selectedProblems.map(p => `- ${p}`).join('\n');
    setFormData(prev => ({
      ...prev,
      overlappingPains: formattedProblems
    }));

    // Update workshopData
    updateWorkshopData({
      painstormingResults: {
        ...formData,
        overlappingPains: formattedProblems
      }
    });
  }, [setFocusedProblems, formData, updateWorkshopData]);

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
          06
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Do Rapid Painstorming
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Let's do some rapid painstorming to identify the painful and expensive problems that your potential buyers might struggle with when trying to get the job done.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
          <label
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e293b',
              display: 'inline-flex',
              alignItems: 'center',
              margin: 0
            }}
          >
            Rapid Painstorming
          </label>
          <ResponsiveFloatingTooltip
            content="A good framework is to use FIRE; these problems are Frequent, Intense, Recurring (or Require Action), and Expensive. These are often the most valuable problems to solve."
            placement="right"
            maxWidth={300}
          >
            <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
              <AlertCircle size={16} style={{ color: '#6b7280' }} />
            </div>
          </ResponsiveFloatingTooltip>
        </div>

        {/* Context Display */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Context for Painstorming:
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Your Focus Job Statement:</p>
            <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
              {selectedJob?.description || "No job statement selected yet"}
            </div>
          </div>

          <div>
            <p style={{ margin: '0 0 4px 0', fontWeight: 500, fontSize: '14px' }}>Your Top 3 Target Buyer Segments:</p>
            {topBuyers.length > 0 ? (
              <ul style={{
                margin: '0',
                paddingLeft: '24px',
                color: '#334155',
                fontSize: '14px'
              }}>
                {topBuyers.map((buyer, index) => (
                  <li key={index}>{buyer.description}</li>
                ))}
              </ul>
            ) : (
              <div style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '14px' }}>
                No target buyers selected yet. Please go back to Step 5 to select your top 3 buyer segments.
              </div>
            )}
          </div>
        </div>

        {/* Step 1: Start Painstorming with Sparky */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Step 1: Start Painstorming with Sparky
          </h3>

          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
            Sparky will analyze your Job Statement and Target Buyers to brainstorm potential pains, including Functional, Emotional, Social, and Perceived Risk types, and identify potential FIRE problems and overlaps. Click below to begin.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={generatePainstormingSuggestions}
              isLoading={isAiLoading}
              rightIcon={<MessageSquare size={16} />}
              style={{
                backgroundColor: '#fcf720',
                color: '#222222',
                borderRadius: '15px',
                fontSize: '15px'
              }}
            >
              {isAiLoading ? 'Generating Analysis...' : 'Generate Painstorming Analysis'}
            </Button>
          </div>
        </div>

        {/* Step 2: Record Identified Problems */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Step 2: Record Identified Problems
          </h3>

          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
            Copy the lists generated by Sparky (from the chat window or modal) and paste them into the corresponding fields below. Feel free to add any other problems you think of!
          </p>

          {/* Form fields for each buyer */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Buyer 1 */}
            <div>
              <label
                htmlFor="buyer1-pains"
                style={styles.labelStyle}
              >
                Potential Buyer #1: {topBuyers[0]?.description || "First Buyer"}
              </label>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
                What problems did you identify for this segment?
              </p>
              <textarea
                id="buyer1-pains"
                value={formData.buyer1Pains}
                onChange={(e) => handleInputChange('buyer1Pains', e.target.value)}
                placeholder={`Paste the list of pains Sparky identified for ${topBuyers[0]?.description || "this buyer"} here. e.g.,\n- Spending weeks stuck on tasks...\n- Fear that a DIY look will hurt credibility...\n- Feeling overwhelmed by...`}
                style={styles.textareaStyle}
                rows={6}
              />
            </div>

            {/* Buyer 2 */}
            <div>
              <label
                htmlFor="buyer2-pains"
                style={styles.labelStyle}
              >
                Potential Buyer #2: {topBuyers[1]?.description || "Second Buyer"}
              </label>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
                What problems did you identify for this segment?
              </p>
              <textarea
                id="buyer2-pains"
                value={formData.buyer2Pains}
                onChange={(e) => handleInputChange('buyer2Pains', e.target.value)}
                placeholder={`Paste the list of pains Sparky identified for ${topBuyers[1]?.description || "this buyer"} here.`}
                style={styles.textareaStyle}
                rows={6}
              />
            </div>

            {/* Buyer 3 */}
            <div>
              <label
                htmlFor="buyer3-pains"
                style={styles.labelStyle}
              >
                Potential Buyer #3: {topBuyers[2]?.description || "Third Buyer"}
              </label>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
                What problems did you identify for this segment?
              </p>
              <textarea
                id="buyer3-pains"
                value={formData.buyer3Pains}
                onChange={(e) => handleInputChange('buyer3Pains', e.target.value)}
                placeholder={`Paste the list of pains Sparky identified for ${topBuyers[2]?.description || "this buyer"} here.`}
                style={styles.textareaStyle}
                rows={6}
              />
            </div>

            {/* Overlapping Problems */}
            <div>
              <label
                htmlFor="overlapping-pains"
                style={styles.labelStyle}
              >
                Overlapping Problems Across Segments
              </label>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 8px 0' }}>
                What overlapping problems did Sparky identify (especially FIRE ones)?
              </p>
              <textarea
                id="overlapping-pains"
                value={formData.overlappingPains}
                onChange={(e) => handleInputChange('overlappingPains', e.target.value)}
                placeholder={`Paste the list of overlapping problems identified by Sparky here. e.g.,\n- FIRE Problem: 'I don't have the time or expertise...'\n- Problem: 'Struggle to make materials look consistent...'`}
                style={styles.textareaStyle}
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Make Note of Any 'Aha!' Moments */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px 0'
          }}>
            Step 3: Make Note of Any 'Aha!' Moments
          </h3>

          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{ fontWeight: 600, margin: '0 0 8px 0' }}>Ask yourself:</p>
            <ul style={{ margin: '0', paddingLeft: '24px' }}>
              <li>What patterns do you see in the problems?</li>
              <li>Which problems feel most resonant or 'ouchy' based on your experience?</li>
              <li>Are there any problems listed that particularly excite you to solve?</li>
              <li>Are there problems here you might already be solving for clients without explicitly realizing it?</li>
            </ul>
          </div>

          <label
            htmlFor="aha-moments"
            style={styles.labelStyle}
          >
            Your 'Aha!' Moments & Reflections on Pains:
          </label>
          <textarea
            id="aha-moments"
            value={formData.ahaMoments}
            onChange={(e) => handleInputChange('ahaMoments', e.target.value)}
            placeholder="Jot down any key insights, surprising patterns, or problems that stand out most to you after reviewing the painstorming analysis."
            style={styles.textareaStyle}
            rows={5}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <SaveIndicator saving={isSaving} />
          </div>
        </div>
      </div>

      {/* Painstorming Modal */}
      <PainstormingModal
        isOpen={isPainstormingModalOpen}
        onClose={closePainstormingModal}
        markdownContent={painstormingOutput}
        onConfirmSelection={handleConfirmSelection}
      />
    </div>
  );
};