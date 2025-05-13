import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Pain } from '../../../types/workshop';
import { AlertCircle, Plus, X, Flame } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { PainstormingModal } from '../chat/PainstormingModal';
import { PainParsingModal } from '../chat/PainParsingModal';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { ContextBox } from '../ContextBox';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectIsPainstormingModalOpen = (state: WorkshopStore) => state.isPainstormingModalOpen;
const selectPainstormingOutput = (state: WorkshopStore) => state.painstormingOutput;
const selectClosePainstormingModal = (state: WorkshopStore) => state.closePainstormingModal;
const selectSetFocusedProblems = (state: WorkshopStore) => state.setFocusedProblems;
const selectIsPainParsingModalOpen = (state: WorkshopStore) => state.isPainParsingModalOpen;
const selectParsedPains = (state: WorkshopStore) => state.parsedPains;
const selectClosePainParsingModal = (state: WorkshopStore) => state.closePainParsingModal;
const selectSaveParsedPains = (state: WorkshopStore) => state.saveParsedPains;

interface PainstormingResults {
  buyer1Pains: string;
  buyer2Pains: string;
  buyer3Pains: string;
  overlappingPains: string;
  ahaMoments: string;
}

export const Step06_Painstorming: React.FC = () => {
  const jobs = useWorkshopStore(selectJobs);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const pains = useWorkshopStore(selectPains);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const isPainstormingModalOpen = useWorkshopStore(selectIsPainstormingModalOpen);
  const painstormingOutput = useWorkshopStore(selectPainstormingOutput);
  const closePainstormingModal = useWorkshopStore(selectClosePainstormingModal);
  const setFocusedProblems = useWorkshopStore(selectSetFocusedProblems);
  const isPainParsingModalOpen = useWorkshopStore(selectIsPainParsingModalOpen);
  const parsedPains = useWorkshopStore(selectParsedPains);
  const closePainParsingModal = useWorkshopStore(selectClosePainParsingModal);
  const saveParsedPains = useWorkshopStore(selectSaveParsedPains);

  // Local state for pain entry
  const [newPain, setNewPain] = useState('');
  const [selectedBuyerSegment, setSelectedBuyerSegment] = useState<string>('');
  const [selectedPainType, setSelectedPainType] = useState<'functional' | 'emotional' | 'social' | 'anticipated'>('functional');
  const [isFire, setIsFire] = useState(false);
  const [ahaMoments, setAhaMoments] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Get top selected buyers (up to 3)
  const topBuyers = targetBuyers
    .filter(buyer => buyer.isTopThree)
    .slice(0, 3);

  // Get selected job
  const selectedJob = jobs.find(job => job.isOverarching || job.selected);

  // Group pains by buyer segment
  const buyerPains = topBuyers.map(buyer => ({
    buyer,
    pains: pains.filter(pain => pain.buyerSegment === buyer.description)
  }));

  // Get overlapping pains
  const overlappingPains = pains.filter(pain =>
    pain.buyerSegment === 'All segments' ||
    pain.buyerSegment === 'Overlapping' ||
    pain.buyerSegment.toLowerCase().includes('overlap')
  );

  // Get FIRE pains
  const firePains = pains.filter(pain =>
    pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7)
  );

  // Load initial data if available
  useEffect(() => {
    const currentData = useWorkshopStore.getState().workshopData.painstormingResults;
    if (currentData) {
      setAhaMoments(currentData.ahaMoments || '');

      // If we have text-based pain data but no structured pains, convert them
      if (currentData.buyer1Pains || currentData.buyer2Pains || currentData.buyer3Pains || currentData.overlappingPains) {
        if (pains.length === 0) {
          convertTextPainsToStructured(currentData);
        }
      }
    }

    // Set default buyer segment if none selected
    if (topBuyers.length > 0 && !selectedBuyerSegment) {
      setSelectedBuyerSegment(topBuyers[0].description);
    }
  }, [topBuyers]);

  // Convert text-based pains to structured pains
  const convertTextPainsToStructured = useCallback((data: PainstormingResults) => {
    const newPains: Pain[] = [];

    // Process buyer 1 pains
    if (data.buyer1Pains && topBuyers[0]) {
      const buyer1Lines = data.buyer1Pains.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      buyer1Lines.forEach((line, index) => {
        // Remove bullet points or dashes
        const cleanLine = line.replace(/^[\s•\-–—*]+|^\d+[\s.)\]]+/, '').trim();
        if (cleanLine.length < 5 || cleanLine.endsWith(':')) return;

        newPains.push({
          id: `converted_b1_${index}_${Date.now()}`,
          description: cleanLine,
          buyerSegment: topBuyers[0].description,
          type: 'functional',
          source: 'user',
          isFire: line.toLowerCase().includes('fire')
        });
      });
    }

    // Process buyer 2 pains
    if (data.buyer2Pains && topBuyers[1]) {
      const buyer2Lines = data.buyer2Pains.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      buyer2Lines.forEach((line, index) => {
        const cleanLine = line.replace(/^[\s•\-–—*]+|^\d+[\s.)\]]+/, '').trim();
        if (cleanLine.length < 5 || cleanLine.endsWith(':')) return;

        newPains.push({
          id: `converted_b2_${index}_${Date.now()}`,
          description: cleanLine,
          buyerSegment: topBuyers[1].description,
          type: 'functional',
          source: 'user',
          isFire: line.toLowerCase().includes('fire')
        });
      });
    }

    // Process buyer 3 pains
    if (data.buyer3Pains && topBuyers[2]) {
      const buyer3Lines = data.buyer3Pains.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      buyer3Lines.forEach((line, index) => {
        const cleanLine = line.replace(/^[\s•\-–—*]+|^\d+[\s.)\]]+/, '').trim();
        if (cleanLine.length < 5 || cleanLine.endsWith(':')) return;

        newPains.push({
          id: `converted_b3_${index}_${Date.now()}`,
          description: cleanLine,
          buyerSegment: topBuyers[2].description,
          type: 'functional',
          source: 'user',
          isFire: line.toLowerCase().includes('fire')
        });
      });
    }

    // Process overlapping pains
    if (data.overlappingPains) {
      const overlapLines = data.overlappingPains.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      overlapLines.forEach((line, index) => {
        const cleanLine = line.replace(/^[\s•\-–—*]+|^\d+[\s.)\]]+/, '').trim();
        if (cleanLine.length < 5 || cleanLine.endsWith(':')) return;

        newPains.push({
          id: `converted_overlap_${index}_${Date.now()}`,
          description: cleanLine,
          buyerSegment: 'Overlapping',
          type: 'functional',
          source: 'user',
          isFire: line.toLowerCase().includes('fire')
        });
      });
    }

    // Add the new pains to the store
    if (newPains.length > 0) {
      updateWorkshopData({ pains: newPains });
    }
  }, [topBuyers, updateWorkshopData]);

  // Handle adding a new pain
  const handleAddPain = useCallback(() => {
    if (newPain.trim() !== '' && selectedBuyerSegment) {
      const pain: Pain = {
        id: `user-${Date.now()}`,
        description: newPain.trim(),
        buyerSegment: selectedBuyerSegment,
        type: selectedPainType,
        isFire,
        source: 'user'
      };

      updateWorkshopData({
        pains: [...pains, pain]
      });

      setNewPain(''); // Clear input
    }
  }, [newPain, selectedBuyerSegment, selectedPainType, isFire, pains, updateWorkshopData]);

  // Handle deleting a pain
  const handleDeletePain = useCallback((id: string) => {
    const updatedPains = pains.filter(pain => pain.id !== id);
    updateWorkshopData({ pains: updatedPains });
  }, [pains, updateWorkshopData]);

  // Handle key press (Enter) for adding a pain
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddPain();
    }
  }, [handleAddPain]);

  // Toggle FIRE status
  const toggleFireStatus = useCallback((id: string) => {
    const updatedPains = pains.map(pain =>
      pain.id === id ? { ...pain, isFire: !pain.isFire } : pain
    );
    updateWorkshopData({ pains: updatedPains });
  }, [pains, updateWorkshopData]);

  // Handle aha moments text change
  const handleAhaMomentsChange = useCallback((value: string) => {
    setAhaMoments(value);

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      // Get current painstorming results
      const currentResults = useWorkshopStore.getState().workshopData.painstormingResults || {
        buyer1Pains: '',
        buyer2Pains: '',
        buyer3Pains: '',
        overlappingPains: '',
        ahaMoments: ''
      };

      updateWorkshopData({
        painstormingResults: {
          ...currentResults,
          ahaMoments: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [updateWorkshopData, saveTimer]);

  // Handle confirmation of selected problems from modal
  const handleConfirmSelection = useCallback((selectedProblems: string[]) => {
    // Save the selected problems to store
    setFocusedProblems(selectedProblems);

    // Process each problem and add it as a structured pain
    selectedProblems.forEach((problem, index) => {
      // Check if this problem already exists
      const exists = pains.some(p => p.description.toLowerCase() === problem.toLowerCase());

      if (!exists) {
        const newPain: Pain = {
          id: `modal_${Date.now()}_${index}`,
          description: problem,
          buyerSegment: 'Overlapping', // Default to overlapping since we don't know the segment
          type: 'functional',
          source: 'assistant',
          isFire: true // Mark as important by default
        };

        updateWorkshopData({
          pains: [...pains, newPain]
        });
      }
    });
  }, [setFocusedProblems, pains, updateWorkshopData]);

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

        <AccordionGroup>
          {/* Step 1: Start Painstorming with Sparky */}
          <AccordionItem
            title="Step 1: Generate & Input Painstorming Analysis"
            defaultExpanded={true}
          >
            <ContextBox>
              <ul className="list-disc list-inside">
                <li><strong>Your Focus Job:</strong> {selectedJob?.description || "No job statement selected yet"}</li>
                <li><strong>Your Top Buyers:</strong> {topBuyers.map(buyer => buyer.description).join(', ') || "No buyers selected yet"}</li>
              </ul>
            </ContextBox>

            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Use Sparky to conduct a detailed painstorming analysis for your target buyer segments. Sparky will help identify Functional, Emotional, Social, and Perceived Risk problems, and also flag potential FIRE problems. Alternatively, if you have prepared a similar analysis, you can paste it below.
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

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              marginTop: '24px',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                Paste your full Painstorming Analysis here:
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Paste the complete structured text output from Sparky or your own prepared analysis. It should include sections for each buyer segment (with Functional, Emotional, Social, Perceived problems, and FIRE problems listed under each) and a section for Overlapping FIRE Problems.
              </p>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  resize: 'vertical'
                }}
                placeholder="Paste your painstorming analysis here..."
                value={useWorkshopStore.getState().rawPainstormingInput}
                onChange={(e) => useWorkshopStore.getState().setRawPainstormingInput(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button
                  variant="yellow"
                  onClick={() => useWorkshopStore.getState().parseAndSavePains(useWorkshopStore.getState().rawPainstormingInput)}
                  disabled={useWorkshopStore.getState().isParsing || !useWorkshopStore.getState().rawPainstormingInput.trim()}
                >
                  {useWorkshopStore.getState().isParsing ? 'Parsing...' : 'Save & Parse Pains'}
                </Button>
              </div>
            </div>
          </AccordionItem>

          {/* Step 2: Record Identified Problems */}
          <AccordionItem
            title="Step 2: Record Identified Problems"
          >
            <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
              Add individual problems for each buyer segment. You can add problems from Sparky's analysis or your own insights.
            </p>

            {/* Add new pain form */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
                Add a New Problem:
              </h4>

              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Buyer segment selection */}
                <div>
                  <label style={styles.labelStyle}>
                    Buyer Segment:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {topBuyers.map(buyer => (
                      <button
                        key={buyer.id}
                        onClick={() => setSelectedBuyerSegment(buyer.description)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: selectedBuyerSegment === buyer.description ? '#3b82f6' : '#d1d5db',
                          backgroundColor: selectedBuyerSegment === buyer.description ? '#eff6ff' : 'transparent',
                          color: selectedBuyerSegment === buyer.description ? '#3b82f6' : '#6b7280',
                          fontSize: '14px',
                          fontWeight: selectedBuyerSegment === buyer.description ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {buyer.description}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedBuyerSegment('Overlapping')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: selectedBuyerSegment === 'Overlapping' ? '#3b82f6' : '#d1d5db',
                        backgroundColor: selectedBuyerSegment === 'Overlapping' ? '#eff6ff' : 'transparent',
                        color: selectedBuyerSegment === 'Overlapping' ? '#3b82f6' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: selectedBuyerSegment === 'Overlapping' ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      Overlapping
                    </button>
                  </div>
                </div>

                {/* Pain type selection */}
                <div>
                  <label style={styles.labelStyle}>
                    Pain Type:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['functional', 'emotional', 'social', 'anticipated'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedPainType(type)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: selectedPainType === type ? '#3b82f6' : '#d1d5db',
                          backgroundColor: selectedPainType === type ? '#eff6ff' : 'transparent',
                          color: selectedPainType === type ? '#3b82f6' : '#6b7280',
                          fontSize: '14px',
                          fontWeight: selectedPainType === type ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FIRE toggle */}
                <div>
                  <button
                    onClick={() => setIsFire(!isFire)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: isFire ? '#ef4444' : '#d1d5db',
                      backgroundColor: isFire ? '#fef2f2' : 'transparent',
                      color: isFire ? '#ef4444' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: isFire ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    <Flame size={16} />
                    {isFire ? 'FIRE Problem (Frequent, Intense, Recurring, Expensive)' : 'Mark as FIRE Problem'}
                  </button>
                </div>

                {/* Problem description */}
                <div>
                  <label style={styles.labelStyle}>
                    Problem Description:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newPain}
                      onChange={(e) => setNewPain(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="e.g., Struggles to find time to create content consistently"
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                      }}
                    />
                    <Button
                      onClick={handleAddPain}
                      disabled={!newPain.trim() || !selectedBuyerSegment}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={16} />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Display problems by segment */}
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* FIRE Problems */}
              {firePains.length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Flame size={18} style={{ color: '#ef4444' }} />
                    FIRE Problems:
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {firePains.map(pain => (
                      <div
                        key={pain.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          backgroundColor: '#fff1f2',
                          borderRadius: '6px',
                          border: '1px solid #fecdd3',
                        }}
                      >
                        <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                          <strong>{pain.buyerSegment}:</strong> {pain.description}
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                            Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFireStatus(pain.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <Flame size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePain(pain.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overlapping Problems */}
              {overlappingPains.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                    Overlapping Problems:
                  </h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {overlappingPains.map(pain => (
                      <div
                        key={pain.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                          {pain.description}
                          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                            Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFireStatus(pain.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: pain.isFire ? '#ef4444' : '#94a3b8',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <Flame size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePain(pain.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            display: 'flex',
                            padding: '4px',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buyer-specific problems */}
              {buyerPains.map(({ buyer, pains: buyerSpecificPains }) =>
                buyerSpecificPains.length > 0 ? (
                  <div key={buyer.id}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                      {buyer.description} Problems:
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {buyerSpecificPains.map(pain => (
                        <div
                          key={pain.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 12px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <div style={{ flex: 1, fontSize: '15px', color: '#1e293b' }}>
                            {pain.description}
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                              Type: {pain.type.charAt(0).toUpperCase() + pain.type.slice(1)}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFireStatus(pain.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: pain.isFire ? '#ef4444' : '#94a3b8',
                              display: 'flex',
                              padding: '4px',
                            }}
                          >
                            <Flame size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePain(pain.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#94a3b8',
                              display: 'flex',
                              padding: '4px',
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}

              {/* No problems message */}
              {pains.length === 0 && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px dashed #d1d5db',
                  color: '#6b7280',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  No problems added yet. Use Sparky to generate problems or add them manually above.
                </div>
              )}
            </div>
          </AccordionItem>

          {/* Step 3: Make Note of Any 'Aha!' Moments */}
          <AccordionItem
            title="Step 3: Make Note of 'Aha!' Moments"
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

      {/* Painstorming Modal */}
      <PainstormingModal
        isOpen={isPainstormingModalOpen}
        onClose={closePainstormingModal}
        markdownContent={painstormingOutput}
        onConfirmSelection={handleConfirmSelection}
      />

      {/* Pain Parsing Modal */}
      {isPainParsingModalOpen && parsedPains && (
        <PainParsingModal
          isOpen={isPainParsingModalOpen}
          onClose={closePainParsingModal}
          parsedPains={parsedPains}
          onConfirmSelection={saveParsedPains}
        />
      )}
    </div>
  );
};