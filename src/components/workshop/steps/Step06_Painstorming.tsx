import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { Lightbulb } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';

import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectPainstormingResults = (state: WorkshopStore) => state.workshopData.painstormingResults;

export const Step06_Painstorming: React.FC = () => {
  const jobs = useWorkshopStore(selectJobs);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const painstormingResults = useWorkshopStore(selectPainstormingResults);

  // Local state for buyer segment titles
  const [buyerSegment1, setBuyerSegment1] = useState('');
  const [buyerSegment2, setBuyerSegment2] = useState('');
  const [buyerSegment3, setBuyerSegment3] = useState('');

  // Local state for painstorming text fields
  const [buyer1Pains, setBuyer1Pains] = useState('');
  const [buyer2Pains, setBuyer2Pains] = useState('');
  const [buyer3Pains, setBuyer3Pains] = useState('');
  const [overlappingPains, setOverlappingPains] = useState('');
  const [ahaMoments, setAhaMoments] = useState('');
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
    // Initialize buyer segment titles from top buyers
    if (topBuyers.length > 0) {
      if (topBuyers[0]) setBuyerSegment1(topBuyers[0].description);
      if (topBuyers[1]) setBuyerSegment2(topBuyers[1].description);
      if (topBuyers[2]) setBuyerSegment3(topBuyers[2].description);
    }

    // Load painstorming results if available
    if (painstormingResults) {
      setBuyerSegment1(painstormingResults.buyerSegment1 || (topBuyers[0]?.description || ''));
      setBuyerSegment2(painstormingResults.buyerSegment2 || (topBuyers[1]?.description || ''));
      setBuyerSegment3(painstormingResults.buyerSegment3 || (topBuyers[2]?.description || ''));
      setBuyer1Pains(painstormingResults.buyer1Pains || '');
      setBuyer2Pains(painstormingResults.buyer2Pains || '');
      setBuyer3Pains(painstormingResults.buyer3Pains || '');
      setOverlappingPains(painstormingResults.overlappingPains || '');
      setAhaMoments(painstormingResults.ahaMoments || '');
    }
  }, [topBuyers, painstormingResults]);

  // Handle buyer segment title changes
  const handleBuyerSegmentChange = useCallback((index: number, value: string) => {
    // Update local state
    switch (index) {
      case 1:
        setBuyerSegment1(value);
        break;
      case 2:
        setBuyerSegment2(value);
        break;
      case 3:
        setBuyerSegment3(value);
        break;
    }

    // Clear any existing timer
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Set saving indicator
    setIsSaving(true);

    // Save to store after a shorter delay (500ms) to match other steps
    const timer = setTimeout(() => {
      // Get current painstorming results
      const currentResults = painstormingResults || {
        buyerSegment1: '',
        buyerSegment2: '',
        buyerSegment3: '',
        buyer1Pains: '',
        buyer2Pains: '',
        buyer3Pains: '',
        overlappingPains: '',
        ahaMoments: ''
      };

      // Update with new value
      const updatedResults = { ...currentResults };
      switch (index) {
        case 1:
          updatedResults.buyerSegment1 = value;
          break;
        case 2:
          updatedResults.buyerSegment2 = value;
          break;
        case 3:
          updatedResults.buyerSegment3 = value;
          break;
      }

      // Save to store
      updateWorkshopData({
        painstormingResults: updatedResults
      });

      // Clear saving indicator
      setIsSaving(false);
    }, 500); // Reduced to 500ms to match other steps

    // Save timer reference
    setSaveTimer(timer);
  }, [painstormingResults, saveTimer, updateWorkshopData]);

  // Handle pain text changes
  const handlePainTextChange = useCallback((field: 'buyer1' | 'buyer2' | 'buyer3' | 'overlapping', value: string) => {
    // Update local state
    switch (field) {
      case 'buyer1':
        setBuyer1Pains(value);
        break;
      case 'buyer2':
        setBuyer2Pains(value);
        break;
      case 'buyer3':
        setBuyer3Pains(value);
        break;
      case 'overlapping':
        setOverlappingPains(value);
        break;
    }

    // Clear any existing timer
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Set saving indicator
    setIsSaving(true);

    // Save to store after a shorter delay (500ms) to match other steps
    const timer = setTimeout(() => {
      // Get current painstorming results
      const currentResults = painstormingResults || {
        buyerSegment1: buyerSegment1,
        buyerSegment2: buyerSegment2,
        buyerSegment3: buyerSegment3,
        buyer1Pains: '',
        buyer2Pains: '',
        buyer3Pains: '',
        overlappingPains: '',
        ahaMoments: ''
      };

      // Update with new value
      const updatedResults = { ...currentResults };
      switch (field) {
        case 'buyer1':
          updatedResults.buyer1Pains = value;
          break;
        case 'buyer2':
          updatedResults.buyer2Pains = value;
          break;
        case 'buyer3':
          updatedResults.buyer3Pains = value;
          break;
        case 'overlapping':
          updatedResults.overlappingPains = value;
          break;
      }

      // Save to store
      updateWorkshopData({
        painstormingResults: updatedResults
      });

      // Clear saving indicator
      setIsSaving(false);
    }, 500); // Reduced to 500ms to match other steps

    // Save timer reference
    setSaveTimer(timer);
  }, [painstormingResults, saveTimer, updateWorkshopData, buyerSegment1, buyerSegment2, buyerSegment3]);

  // Handle aha moments text change
  const handleAhaMomentsChange = useCallback((value: string) => {
    setAhaMoments(value);

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      // Get current painstorming results
      const currentResults = painstormingResults || {
        buyerSegment1: buyerSegment1,
        buyerSegment2: buyerSegment2,
        buyerSegment3: buyerSegment3,
        buyer1Pains: '',
        buyer2Pains: '',
        buyer3Pains: '',
        overlappingPains: '',
        ahaMoments: ''
      };

      // Update with new aha moments
      updateWorkshopData({
        painstormingResults: {
          ...currentResults,
          ahaMoments: value
        }
      });
      setIsSaving(false);
    }, 500); // Reduced to 500ms to match other steps
    setSaveTimer(timer);
  }, [painstormingResults, saveTimer, updateWorkshopData]);



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
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>Let's do some rapid painstorming to identify the painful and expensive problems that your potential buyers might struggle with when trying to get the job done.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ marginBottom: '16px' }}>
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
        </div>

        {/* FIRE Info Box */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            backgroundColor: '#feffb7',
            borderColor: '#e5e0a3',
            padding: '12px 15px',
            borderRadius: '10px',
            color: '#222222',
            fontWeight: '500',
            fontSize: '14px',
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{ marginTop: '3px', flexShrink: 0 }}>
              <Lightbulb size={16} style={{ color: '#222222' }} />
            </div>
            <div>
              Remember: FIRE problems are <strong>Frequent</strong>, <strong>Intense</strong>, <strong>Require fast action</strong>, and <strong>Expensive</strong>
            </div>
          </div>
        </div>

        <AccordionGroup>
          {/* Step 1: Start Painstorming with Sparky */}
          <AccordionItem
            title="Step 1: Generate & Input Painstorming Analysis"
            defaultExpanded={true}
          >
            {/* Context Display */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
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

            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Use Sparky to conduct a detailed painstorming analysis for your target buyer segments, then record the problems for each segment below.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <ChatWithSparkyButton
                exerciseKey="painstorming"
                exerciseTitle="Rapid Painstorming with Sparky"
                initialContext={{
                  jobStatement: selectedJob?.description,
                  buyers: topBuyers.map(buyer => buyer.description)
                }}
                systemPromptKey="PAINSTORMING_PROMPT"
              />
            </div>

            {/* Buyer Segment 1 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={styles.labelStyle}>
                  Buyer Segment 1:
                </label>
                <input
                  type="text"
                  value={buyerSegment1}
                  onChange={(e) => handleBuyerSegmentChange(1, e.target.value)}
                  placeholder="Enter buyer segment name"
                  style={styles.inputStyle}
                />
              </div>
              <div>
                <label style={styles.labelStyle}>
                  Problems for {buyerSegment1 || 'Buyer Segment 1'}:
                </label>
                <textarea
                  value={buyer1Pains}
                  onChange={(e) => handlePainTextChange('buyer1', e.target.value)}
                  placeholder="List the problems this buyer segment faces..."
                  style={styles.textareaStyle}
                  rows={5}
                />
              </div>
            </div>

            {/* Buyer Segment 2 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={styles.labelStyle}>
                  Buyer Segment 2:
                </label>
                <input
                  type="text"
                  value={buyerSegment2}
                  onChange={(e) => handleBuyerSegmentChange(2, e.target.value)}
                  placeholder="Enter buyer segment name"
                  style={styles.inputStyle}
                />
              </div>
              <div>
                <label style={styles.labelStyle}>
                  Problems for {buyerSegment2 || 'Buyer Segment 2'}:
                </label>
                <textarea
                  value={buyer2Pains}
                  onChange={(e) => handlePainTextChange('buyer2', e.target.value)}
                  placeholder="List the problems this buyer segment faces..."
                  style={styles.textareaStyle}
                  rows={5}
                />
              </div>
            </div>

            {/* Buyer Segment 3 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={styles.labelStyle}>
                  Buyer Segment 3:
                </label>
                <input
                  type="text"
                  value={buyerSegment3}
                  onChange={(e) => handleBuyerSegmentChange(3, e.target.value)}
                  placeholder="Enter buyer segment name"
                  style={styles.inputStyle}
                />
              </div>
              <div>
                <label style={styles.labelStyle}>
                  Problems for {buyerSegment3 || 'Buyer Segment 3'}:
                </label>
                <textarea
                  value={buyer3Pains}
                  onChange={(e) => handlePainTextChange('buyer3', e.target.value)}
                  placeholder="List the problems this buyer segment faces..."
                  style={styles.textareaStyle}
                  rows={5}
                />
              </div>
            </div>

            {/* Overlapping Problems */}
            <div style={{ marginBottom: '24px' }}>
              <div>
                <label style={styles.labelStyle}>
                  Overlapping Problems (problems that affect multiple buyer segments):
                </label>
                <textarea
                  value={overlappingPains}
                  onChange={(e) => handlePainTextChange('overlapping', e.target.value)}
                  placeholder="List problems that are common across multiple buyer segments..."
                  style={styles.textareaStyle}
                  rows={5}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </AccordionItem>

          {/* Step 2: Make Note of Any 'Aha!' Moments */}
          <AccordionItem
            title="Step 2: Make Note of 'Aha!' Moments"
          >
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
              value={ahaMoments}
              onChange={(e) => handleAhaMomentsChange(e.target.value)}
              placeholder="Jot down any key insights, surprising patterns, or problems that stand out most to you after reviewing the painstorming analysis."
              style={styles.textareaStyle}
              rows={5}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </AccordionItem>
        </AccordionGroup>
      </div>


    </div>
  );
};