import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Pain } from '../../../types/workshop';
import { AlertCircle, HelpCircle, Plus, Flame, MessageSquare, ArrowUpDown } from 'lucide-react';
import { PainstormingModal } from '../chat/PainstormingModal';
import { PainItemInteractiveCard } from '../pain/PainItemInteractiveCard';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectIsPainstormingModalOpen = (state: WorkshopStore) => state.isPainstormingModalOpen;
const selectPainstormingOutput = (state: WorkshopStore) => state.painstormingOutput;
const selectClosePainstormingModal = (state: WorkshopStore) => state.closePainstormingModal;
const selectSetFocusedProblems = (state: WorkshopStore) => state.setFocusedProblems;
const selectGeneratePainstormingSuggestions = (state: WorkshopStore) => state.generatePainstormingSuggestions;

export const Step07_Painstorming: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const isPainstormingModalOpen = useWorkshopStore(selectIsPainstormingModalOpen);
  const painstormingOutput = useWorkshopStore(selectPainstormingOutput);
  const closePainstormingModal = useWorkshopStore(selectClosePainstormingModal);
  const setFocusedProblems = useWorkshopStore(selectSetFocusedProblems);
  const generatePainstormingSuggestions = useWorkshopStore(selectGeneratePainstormingSuggestions);

  // Use local state for the pains
  const [painsList, setPainsList] = useState<Pain[]>(pains || []);
  const [newPain, setNewPain] = useState('');
  const [selectedBuyerSegment, setSelectedBuyerSegment] = useState<string>('');
  const [selectedPainType, setSelectedPainType] = useState<'functional' | 'emotional' | 'social' | 'anticipated'>('functional');
  const [isFire, setIsFire] = useState(false);
  const [sortBy, setSortBy] = useState<'none' | 'fireScore'>('none');
  const [filterFire, setFilterFire] = useState(false);

  // Update local state when store value changes
  useEffect(() => {
    setPainsList(pains || []);
  }, [pains]);

  // Set default buyer segment if none selected
  useEffect(() => {
    if (targetBuyers.length > 0 && !selectedBuyerSegment) {
      setSelectedBuyerSegment(targetBuyers[0].description);
    }
  }, [targetBuyers, selectedBuyerSegment]);

  // Sort and filter pains
  const sortedAndFilteredPains = useCallback(() => {
    let result = [...painsList];

    // Apply filter
    if (filterFire) {
      result = result.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7));
    }

    // Apply sort
    if (sortBy === 'fireScore') {
      result.sort((a, b) => {
        const scoreA = a.calculatedFireScore || 0;
        const scoreB = b.calculatedFireScore || 0;
        return scoreB - scoreA; // Descending order
      });
    }

    return result;
  }, [painsList, sortBy, filterFire]);

  const handleAddPain = useCallback(() => {
    if (newPain.trim() !== '' && selectedBuyerSegment) {
      // Initialize FIRE scores if marked as FIRE
      const fireScores = isFire ? {
        frequency: 2, // Medium
        intensity: 2, // Medium
        recurring: 2, // Medium
        expensive: 2  // Medium
      } : undefined;

      // Calculate score if FIRE
      const calculatedFireScore = isFire ? 8 : undefined; // 2+2+2+2=8

      const pain: Pain = {
        id: `user-${Date.now()}`,
        description: newPain.trim(),
        buyerSegment: selectedBuyerSegment,
        type: selectedPainType,
        isFire,
        fireScores,
        calculatedFireScore,
        source: 'user'
      };

      setPainsList(prev => [...prev, pain]);
      setNewPain(''); // Clear input
      updateWorkshopData({ pains: [...painsList, pain] });
    }
  }, [newPain, selectedBuyerSegment, selectedPainType, isFire, painsList, updateWorkshopData]);

  const handleDeletePain = useCallback((id: string) => {
    const updatedPains = painsList.filter(pain => pain.id !== id);
    setPainsList(updatedPains);
    updateWorkshopData({ pains: updatedPains });
  }, [painsList, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddPain();
    }
  }, [handleAddPain]);

  const handleConfirmSelection = useCallback((selectedProblems: string[]) => {
    // Add the selected problems as pains
    const newPains = selectedProblems.map(problem => {
      // Check if the problem contains "FIRE" to set initial scores higher
      const containsFire = problem.includes("FIRE");

      // Initialize FIRE scores
      const fireScores = {
        frequency: containsFire ? 3 : 2, // High if FIRE, Medium otherwise
        intensity: containsFire ? 3 : 2,  // High if FIRE, Medium otherwise
        recurring: containsFire ? 3 : 2,  // High if FIRE, Medium otherwise
        expensive: containsFire ? 3 : 2   // High if FIRE, Medium otherwise
      };

      // Calculate score
      const calculatedFireScore = containsFire ? 12 : 8; // 3+3+3+3=12 or 2+2+2+2=8

      // Remove the "(FIRE?)" marker from the description if present
      const cleanDescription = problem.replace(/\s*\(FIRE\?\)\s*/g, '');

      return {
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        description: cleanDescription,
        buyerSegment: targetBuyers.length > 0 ? targetBuyers[0].description : '', // Default to first buyer segment
        type: 'functional' as const, // Default to functional, can be updated later
        isFire: true, // Mark as FIRE since these are the key problems
        fireScores,
        calculatedFireScore,
        source: 'assistant' as const
      };
    });

    // Update the store with the new pains
    const updatedPains = [...painsList, ...newPains];
    setPainsList(updatedPains);
    updateWorkshopData({ pains: updatedPains });

    // Save the selected problems for reference in the Problem Up step
    setFocusedProblems(selectedProblems);
  }, [painsList, targetBuyers, updateWorkshopData, setFocusedProblems]);

  // Get pain type label
  const getPainTypeLabel = (type: string): string => {
    switch (type) {
      case 'functional': return 'Functional';
      case 'emotional': return 'Emotional';
      case 'social': return 'Social';
      case 'anticipated': return 'Anticipated';
      default: return type;
    }
  };

  // Get pain type color
  const getPainTypeColor = (type: string): string => {
    switch (type) {
      case 'functional': return '#3b82f6'; // Blue
      case 'emotional': return '#ec4899'; // Pink
      case 'social': return '#8b5cf6'; // Purple
      case 'anticipated': return '#f59e0b'; // Amber
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={styles.stepHeaderContainerStyle}>
        <div style={styles.stepNumberStyle}>
          07
        </div>
        <h2 style={styles.stepTitleStyle}>
          Painstorming
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Identify the painful problems your target buyers experience when trying to get the job done</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          variant="yellow"
          onClick={generatePainstormingSuggestions}
          rightIcon={<MessageSquare size={16} />}
        >
          Generate Painstorming Analysis
        </Button>
      </div>


        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={styles.infoBoxStyle}>
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#e11d48' }} />
            The more urgent, painful, and expensive the problems, the more people will pay for your solution.
          </div>

          {/* Add new pain */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="new-pain"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Add a painful problem
              </label>
              <div title="Describe a specific problem your target buyers face">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Buyer segment selector */}
              <div>
                <label
                  htmlFor="buyer-segment"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#4b5563',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  Buyer segment:
                </label>
                <select
                  id="buyer-segment"
                  value={selectedBuyerSegment}
                  onChange={(e) => setSelectedBuyerSegment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="" disabled>Select a buyer segment</option>
                  {targetBuyers.map(buyer => (
                    <option key={buyer.id} value={buyer.description}>
                      {buyer.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pain type selector */}
              <div>
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#4b5563',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  Pain type:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['functional', 'emotional', 'social', 'anticipated'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedPainType(type)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedPainType === type ? getPainTypeColor(type) : '#d1d5db',
                        backgroundColor: selectedPainType === type ? `${getPainTypeColor(type)}20` : 'transparent',
                        color: selectedPainType === type ? getPainTypeColor(type) : '#6b7280',
                        fontSize: '14px',
                        fontWeight: selectedPainType === type ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {getPainTypeLabel(type)}
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
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isFire ? '#ef4444' : '#d1d5db',
                    backgroundColor: isFire ? '#fee2e2' : 'transparent',
                    color: isFire ? '#b91c1c' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: isFire ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  <Flame size={16} color={isFire ? '#ef4444' : '#6b7280'} fill={isFire ? '#ef4444' : 'none'} />
                  {isFire ? 'This is a F.I.R.E. problem' : 'Mark as F.I.R.E. problem'}
                </button>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  F.I.R.E. = Frequent, Intense, Recurring, Expensive
                </div>
              </div>

              {/* Pain description input */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="new-pain"
                  type="text"
                  value={newPain}
                  onChange={(e) => setNewPain(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g., Struggles to find time to create content consistently"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                />
                <Button
                  onClick={handleAddPain}
                  disabled={!newPain.trim() || !selectedBuyerSegment}
                  variant="yellow"
                  rightIcon={<Plus size={16} />}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* List of pains */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                margin: 0
              }}>
                Painful Problems Identified
              </h3>

              {painsList.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setFilterFire(!filterFire)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: filterFire ? '#ef4444' : '#d1d5db',
                      backgroundColor: filterFire ? '#fee2e2' : 'transparent',
                      color: filterFire ? '#b91c1c' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: filterFire ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    <Flame size={16} color={filterFire ? '#ef4444' : '#6b7280'} fill={filterFire ? '#ef4444' : 'none'} />
                    {filterFire ? 'Showing FIRE problems' : 'Show FIRE problems only'}
                  </button>

                  <button
                    onClick={() => setSortBy(sortBy === 'fireScore' ? 'none' : 'fireScore')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: sortBy === 'fireScore' ? '#0ea5e9' : '#d1d5db',
                      backgroundColor: sortBy === 'fireScore' ? '#e0f2fe' : 'transparent',
                      color: sortBy === 'fireScore' ? '#0369a1' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: sortBy === 'fireScore' ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUpDown size={16} color={sortBy === 'fireScore' ? '#0ea5e9' : '#6b7280'} />
                    {sortBy === 'fireScore' ? 'Sorted by FIRE score' : 'Sort by FIRE score'}
                  </button>
                </div>
              )}
            </div>

            {painsList.length > 0 ? (
              <div>
                {sortedAndFilteredPains().map(pain => (
                  <PainItemInteractiveCard
                    key={pain.id}
                    pain={pain}
                    onDelete={handleDeletePain}
                  />
                ))}

                {sortedAndFilteredPains().length === 0 && (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db'
                  }}>
                    No problems match your current filter. {filterFire && (
                      <button
                        onClick={() => setFilterFire(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0ea5e9',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 500,
                          textDecoration: 'underline'
                        }}
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.examplesContainerStyle}>
                <div style={styles.examplesLabelStyle}>
                  EXAMPLES
                </div>
                <ul style={styles.examplesListStyle}>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Struggles to find time to create content consistently (Functional)
                  </li>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Feels overwhelmed by the constant pressure to stay visible online (Emotional)
                  </li>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Worries about being perceived as irrelevant by peers and clients (Social)
                  </li>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Fears their service business will be disrupted by AI (Anticipated)
                  </li>
                  <li style={styles.exampleItemStyle}>
                    <span style={styles.exampleBulletStyle}>•</span>
                    Can't scale their business without working more hours (Functional, FIRE)
                  </li>
                </ul>
              </div>
            )}
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
