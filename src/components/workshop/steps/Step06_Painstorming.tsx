import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { Lightbulb, Save, Edit, Check, Lock } from 'lucide-react';
import { Button } from '../../ui/Button';

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

  // Track which section is currently saving
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Track which sections are locked (saved and not editable)
  const [lockedSections, setLockedSections] = useState({
    buyer1: false,
    buyer2: false,
    buyer3: false,
    overlapping: false,
    ahaMoments: false
  });

  // For backward compatibility - keeping this to avoid breaking changes
  const [saveTimer] = useState<NodeJS.Timeout | null>(null);

  // Get top selected buyers (up to 3)
  const topBuyers = targetBuyers
    .filter(buyer => buyer.isTopThree)
    .slice(0, 3);

  // Get selected job
  const selectedJob = jobs.find(job => job.isOverarching || job.selected);

  // Load initial data if available
  useEffect(() => {
    // This effect should only run once on mount or when topBuyers changes
    // We'll use a ref to track if we've already loaded the data
    const initialBuyerSegments = () => {
      if (topBuyers.length > 0) {
        // Only set buyer segments from topBuyers if we don't have painstorming results
        if (!painstormingResults) {
          if (topBuyers[0]) setBuyerSegment1(topBuyers[0].description);
          if (topBuyers[1]) setBuyerSegment2(topBuyers[1].description);
          if (topBuyers[2]) setBuyerSegment3(topBuyers[2].description);
        }
      }
    };

    // Load painstorming results if available
    const loadPainstormingResults = () => {
      if (painstormingResults) {
        setBuyerSegment1(painstormingResults.buyerSegment1 || (topBuyers[0]?.description || ''));
        setBuyerSegment2(painstormingResults.buyerSegment2 || (topBuyers[1]?.description || ''));
        setBuyerSegment3(painstormingResults.buyerSegment3 || (topBuyers[2]?.description || ''));
        setBuyer1Pains(painstormingResults.buyer1Pains || '');
        setBuyer2Pains(painstormingResults.buyer2Pains || '');
        setBuyer3Pains(painstormingResults.buyer3Pains || '');
        setOverlappingPains(painstormingResults.overlappingPains || '');
        setAhaMoments(painstormingResults.ahaMoments || '');

        // Set sections with content as locked
        setLockedSections({
          buyer1: !!painstormingResults.buyer1Pains,
          buyer2: !!painstormingResults.buyer2Pains,
          buyer3: !!painstormingResults.buyer3Pains,
          overlapping: !!painstormingResults.overlappingPains,
          ahaMoments: !!painstormingResults.ahaMoments
        });
      }
    };

    initialBuyerSegments();
    loadPainstormingResults();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save a specific section
  const saveSection = useCallback((section: 'buyer1' | 'buyer2' | 'buyer3' | 'overlapping' | 'ahaMoments') => {
    // Set saving indicator for this section
    setSavingSection(section);

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

    // Create updated results object
    const updatedResults = { ...currentResults };

    // Update the appropriate fields based on the section being saved
    switch (section) {
      case 'buyer1':
        updatedResults.buyerSegment1 = buyerSegment1;
        updatedResults.buyer1Pains = buyer1Pains;
        break;
      case 'buyer2':
        updatedResults.buyerSegment2 = buyerSegment2;
        updatedResults.buyer2Pains = buyer2Pains;
        break;
      case 'buyer3':
        updatedResults.buyerSegment3 = buyerSegment3;
        updatedResults.buyer3Pains = buyer3Pains;
        break;
      case 'overlapping':
        updatedResults.overlappingPains = overlappingPains;
        break;
      case 'ahaMoments':
        updatedResults.ahaMoments = ahaMoments;
        break;
    }

    // Save to store
    updateWorkshopData({
      painstormingResults: updatedResults
    });

    // Lock this section
    setLockedSections(prev => ({ ...prev, [section]: true }));

    // Clear saving indicator after a delay
    setTimeout(() => {
      setSavingSection(null);
    }, 2000);
  }, [
    painstormingResults,
    updateWorkshopData,
    buyerSegment1,
    buyerSegment2,
    buyerSegment3,
    buyer1Pains,
    buyer2Pains,
    buyer3Pains,
    overlappingPains,
    ahaMoments
  ]);

  // Unlock a section for editing
  const unlockSection = useCallback((section: 'buyer1' | 'buyer2' | 'buyer3' | 'overlapping' | 'ahaMoments') => {
    setLockedSections(prev => ({ ...prev, [section]: false }));
  }, []);

  // Handle buyer segment title changes
  const handleBuyerSegmentChange = useCallback((index: number, value: string) => {
    // Always update the title field regardless of lock state
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

    // Cancel any auto-save functionality
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
  }, [saveTimer]);

  // Handle pain text changes
  const handlePainTextChange = useCallback((field: 'buyer1' | 'buyer2' | 'buyer3' | 'overlapping', value: string) => {
    // Only update if the section is not locked
    switch (field) {
      case 'buyer1':
        if (!lockedSections.buyer1) {
          setBuyer1Pains(value);
        }
        break;
      case 'buyer2':
        if (!lockedSections.buyer2) {
          setBuyer2Pains(value);
        }
        break;
      case 'buyer3':
        if (!lockedSections.buyer3) {
          setBuyer3Pains(value);
        }
        break;
      case 'overlapping':
        if (!lockedSections.overlapping) {
          setOverlappingPains(value);
        }
        break;
    }

    // Cancel any auto-save functionality
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
  }, [lockedSections, saveTimer]);

  // Handle aha moments text change
  const handleAhaMomentsChange = useCallback((value: string) => {
    // Only update if the section is not locked
    if (!lockedSections.ahaMoments) {
      setAhaMoments(value);
    }

    // Cancel any auto-save functionality
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
  }, [lockedSections, saveTimer]);



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
                  style={{
                    ...styles.textareaStyle,
                    backgroundColor: lockedSections.buyer1 ? '#f3f4f6' : 'white',
                    borderColor: lockedSections.buyer1 ? '#d1d5db' : '#cbd5e1',
                    cursor: lockedSections.buyer1 ? 'not-allowed' : 'text'
                  }}
                  disabled={lockedSections.buyer1}
                  rows={5}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
                  {!lockedSections.buyer1 ? (
                    <Button
                      onClick={() => saveSection('buyer1')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fcf720', // Yellow
                        color: '#222222',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Save size={16} />
                      Save Section
                    </Button>
                  ) : (
                    <Button
                      onClick={() => unlockSection('buyer1')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f3f4f6', // Light gray
                        color: '#4b5563',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Edit size={16} />
                      Edit Section
                    </Button>
                  )}

                  {savingSection === 'buyer1' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#10b981', // Emerald green
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Check size={18} />
                      Content Saved
                    </div>
                  )}

                  {lockedSections.buyer1 && savingSection !== 'buyer1' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4b5563',
                      fontSize: '14px',
                    }}>
                      <Lock size={16} />
                      Section Locked
                    </div>
                  )}
                </div>
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
                  style={{
                    ...styles.textareaStyle,
                    backgroundColor: lockedSections.buyer2 ? '#f3f4f6' : 'white',
                    borderColor: lockedSections.buyer2 ? '#d1d5db' : '#cbd5e1',
                    cursor: lockedSections.buyer2 ? 'not-allowed' : 'text'
                  }}
                  disabled={lockedSections.buyer2}
                  rows={5}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
                  {!lockedSections.buyer2 ? (
                    <Button
                      onClick={() => saveSection('buyer2')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fcf720', // Yellow
                        color: '#222222',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Save size={16} />
                      Save Section
                    </Button>
                  ) : (
                    <Button
                      onClick={() => unlockSection('buyer2')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f3f4f6', // Light gray
                        color: '#4b5563',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Edit size={16} />
                      Edit Section
                    </Button>
                  )}

                  {savingSection === 'buyer2' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#10b981', // Emerald green
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Check size={18} />
                      Content Saved
                    </div>
                  )}

                  {lockedSections.buyer2 && savingSection !== 'buyer2' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4b5563',
                      fontSize: '14px',
                    }}>
                      <Lock size={16} />
                      Section Locked
                    </div>
                  )}
                </div>
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
                  style={{
                    ...styles.textareaStyle,
                    backgroundColor: lockedSections.buyer3 ? '#f3f4f6' : 'white',
                    borderColor: lockedSections.buyer3 ? '#d1d5db' : '#cbd5e1',
                    cursor: lockedSections.buyer3 ? 'not-allowed' : 'text'
                  }}
                  disabled={lockedSections.buyer3}
                  rows={5}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
                  {!lockedSections.buyer3 ? (
                    <Button
                      onClick={() => saveSection('buyer3')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fcf720', // Yellow
                        color: '#222222',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Save size={16} />
                      Save Section
                    </Button>
                  ) : (
                    <Button
                      onClick={() => unlockSection('buyer3')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f3f4f6', // Light gray
                        color: '#4b5563',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Edit size={16} />
                      Edit Section
                    </Button>
                  )}

                  {savingSection === 'buyer3' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#10b981', // Emerald green
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Check size={18} />
                      Content Saved
                    </div>
                  )}

                  {lockedSections.buyer3 && savingSection !== 'buyer3' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4b5563',
                      fontSize: '14px',
                    }}>
                      <Lock size={16} />
                      Section Locked
                    </div>
                  )}
                </div>
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
                  style={{
                    ...styles.textareaStyle,
                    backgroundColor: lockedSections.overlapping ? '#f3f4f6' : 'white',
                    borderColor: lockedSections.overlapping ? '#d1d5db' : '#cbd5e1',
                    cursor: lockedSections.overlapping ? 'not-allowed' : 'text'
                  }}
                  disabled={lockedSections.overlapping}
                  rows={5}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
                  {!lockedSections.overlapping ? (
                    <Button
                      onClick={() => saveSection('overlapping')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fcf720', // Yellow
                        color: '#222222',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Save size={16} />
                      Save Section
                    </Button>
                  ) : (
                    <Button
                      onClick={() => unlockSection('overlapping')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#f3f4f6', // Light gray
                        color: '#4b5563',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Edit size={16} />
                      Edit Section
                    </Button>
                  )}

                  {savingSection === 'overlapping' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#10b981', // Emerald green
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Check size={18} />
                      Content Saved
                    </div>
                  )}

                  {lockedSections.overlapping && savingSection !== 'overlapping' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4b5563',
                      fontSize: '14px',
                    }}>
                      <Lock size={16} />
                      Section Locked
                    </div>
                  )}
                </div>
              </div>
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
              <ul style={{ margin: '0', paddingLeft: '24px', listStyleType: 'disc' }}>
                <li style={{ display: 'list-item', marginBottom: '4px' }}>What patterns do you see in the problems?</li>
                <li style={{ display: 'list-item', marginBottom: '4px' }}>Which problems feel most resonant or 'ouchy' based on your experience?</li>
                <li style={{ display: 'list-item', marginBottom: '4px' }}>Are there any problems listed that particularly excite you to solve?</li>
                <li style={{ display: 'list-item', marginBottom: '4px' }}>Are there problems here you might already be solving for clients without explicitly realizing it?</li>
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
              style={{
                ...styles.textareaStyle,
                backgroundColor: lockedSections.ahaMoments ? '#f3f4f6' : 'white',
                borderColor: lockedSections.ahaMoments ? '#d1d5db' : '#cbd5e1',
                cursor: lockedSections.ahaMoments ? 'not-allowed' : 'text'
              }}
              disabled={lockedSections.ahaMoments}
              rows={5}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '8px' }}>
              {!lockedSections.ahaMoments ? (
                <Button
                  onClick={() => saveSection('ahaMoments')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#fcf720', // Yellow
                    color: '#222222',
                    fontSize: '14px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  <Save size={16} />
                  Save Section
                </Button>
              ) : (
                <Button
                  onClick={() => unlockSection('ahaMoments')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#f3f4f6', // Light gray
                    color: '#4b5563',
                    fontSize: '14px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}
                >
                  <Edit size={16} />
                  Edit Section
                </Button>
              )}

              {savingSection === 'ahaMoments' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#10b981', // Emerald green
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <Check size={18} />
                  Content Saved
                </div>
              )}

              {lockedSections.ahaMoments && savingSection !== 'ahaMoments' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#4b5563',
                  fontSize: '14px',
                }}>
                  <Lock size={16} />
                  Section Locked
                </div>
              )}
            </div>
          </AccordionItem>
        </AccordionGroup>
      </div>


    </div>
  );
};