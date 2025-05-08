import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Pain } from '../../../types/workshop';
import { Plus, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains || [];
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step07_ChooseTargetProblems: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const problemUp = useWorkshopStore(selectProblemUp);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // State for selected problems to solve
  const [selectedProblems, setSelectedProblems] = useState<string[]>(problemUp?.selectedPains || []);
  const [newProblem, setNewProblem] = useState('');
  // const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);

  // Get FIRE pains - the most critical problems
  const firePains = pains.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7));

  // Get top buyer segments
  const topBuyers = targetBuyers.filter(buyer => buyer.isTopThree).slice(0, 3);

  // Initialize with any existing selected pains
  useEffect(() => {
    if (problemUp && problemUp.selectedPains && problemUp.selectedPains.length > 0) {
      setSelectedProblems(problemUp.selectedPains);
    }
  }, [problemUp]);

  // Handle selecting a problem
  const toggleProblemSelection = useCallback((painId: string) => {
    setSelectedProblems(prev => {
      const isSelected = prev.includes(painId);

      // If already selected, remove it
      if (isSelected) {
        const newSelection = prev.filter(id => id !== painId);

        // Update workshop data
        updateWorkshopData({
          problemUp: problemUp ? {
            ...problemUp,
            selectedPains: newSelection
          } : {
            selectedPains: newSelection,
            selectedBuyers: [],
            relevantTriggerIds: [],
            targetMoment: '',
            notes: ''
          }
        });

        return newSelection;
      }
      // If not selected and we have less than 5 selections, add it
      else if (prev.length < 5) {
        const newSelection = [...prev, painId];

        // Update workshop data
        updateWorkshopData({
          problemUp: problemUp ? {
            ...problemUp,
            selectedPains: newSelection
          } : {
            selectedPains: newSelection,
            selectedBuyers: [],
            relevantTriggerIds: [],
            targetMoment: '',
            notes: ''
          }
        });

        return newSelection;
      }

      // Otherwise, just return the current selection
      return prev;
    });
  }, [problemUp, updateWorkshopData]);

  // Handle adding a custom problem
  const handleAddProblem = useCallback(() => {
    if (newProblem.trim() && selectedProblems.length < 5) {
      // Create a new pain
      const newPain: Pain = {
        id: `user-${Date.now()}`,
        description: newProblem.trim(),
        buyerSegment: topBuyers.length > 0 ? topBuyers[0].description : 'All segments',
        type: 'functional',
        source: 'user',
        isFire: true // Mark as important by default
      };

      // Update pains in the store
      const updatedPains = [...pains, newPain];
      updateWorkshopData({ pains: updatedPains });

      // Add to selected problems
      const newSelection = [...selectedProblems, newPain.id];
      setSelectedProblems(newSelection);

      // Update workshop data
      updateWorkshopData({
        problemUp: problemUp ? {
          ...problemUp,
          selectedPains: newSelection
        } : {
          selectedPains: newSelection,
          selectedBuyers: [],
          relevantTriggerIds: [],
          targetMoment: '',
          notes: ''
        }
      });

      setNewProblem(''); // Clear input
    }
  }, [newProblem, selectedProblems, pains, topBuyers, problemUp, updateWorkshopData]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddProblem();
    }
  }, [handleAddProblem]);

  // Get pain display information
  const getPainDetails = (painId: string) => {
    const pain = pains.find(p => p.id === painId);
    if (!pain) return null;

    const buyerSegment = pain.buyerSegment;
    const isFire = pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7);

    return {
      description: pain.description,
      buyerSegment,
      isFire,
      type: pain.type,
      calculatedFireScore: pain.calculatedFireScore
    };
  };

  return (
    <div style={styles.stepContainerStyle}>
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
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
          position: 'relative',
          top: '4px'
        }}>
          7
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0,
          lineHeight: '1'
        }}>
          Choose Target Problems
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>You've identified a bunch of problems you could solve with your new offer. But you don't need to solve all the problems with one product. Let's narrow down your options and find the specific problems you're best suited to solve.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        {/* Workshop Insights */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '12px 16px',
            backgroundColor: isInsightsExpanded ? '#fcf720' : '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '16px',
            fontWeight: 600
          }}
          onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
        >
          Workshop Insights
          {isInsightsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isInsightsExpanded && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            {/* Problems Identified */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 8px 0'
              }}>
                Problems Identified:
              </h4>
              {pains.length > 0 ? (
                <ul style={{
                  margin: '0',
                  paddingLeft: '24px',
                  color: '#334155',
                  fontSize: '14px'
                }}>
                  {pains.slice(0, Math.min(pains.length, 5)).map((pain, index) => (
                    <li key={index}>{pain.description} {pain.isFire ? '(FIRE)' : ''}</li>
                  ))}
                  {pains.length > 5 && <li>...and {pains.length - 5} more.</li>}
                </ul>
              ) : (
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>No problems identified yet.</p>
              )}
            </div>

            {/* Top 3 Buyer Segments */}
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 8px 0'
              }}>
                Your Top 3 Buyer Segments:
              </h4>
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
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>No top buyer segments selected yet.</p>
              )}
            </div>
          </div>
        )}

        <div style={styles.yellowInfoBoxStyle}>
          <p style={{ margin: 0 }}>You can choose overlapping problems or focus on problems that are specific to one buyer segment.</p>
        </div>

        {/* Step 1: Analyze Your Problem Lists - ACCORDION */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '12px 16px',
              backgroundColor: isGuideExpanded ? '#fcf720' : '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '16px',
              fontWeight: 600
            }}
            onClick={() => setIsGuideExpanded(!isGuideExpanded)}
          >
            Step 1: Analyze Your Problem Lists
            {isGuideExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {isGuideExpanded && (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ fontWeight: 600, margin: '0 0 8px 0' }}>Ask yourself:</p>
              <ul style={{ margin: '0 0 16px 0', paddingLeft: '24px' }}>
                <li>What skills do you already have?</li>
                <li>Which problems align with your interests?</li>
                <li>What existing resources or assets can you leverage?</li>
                <li>What problems have you solved already, either for your own business or for your clients?</li>
                <li>Which problems are poorly solved by existing solutions?</li>
                <li>Which problems align with your broader business strategy?</li>
                <li>Which problems, if solved well, can create a profitable domino effect in your business?</li>
              </ul>
              <p style={{ margin: '0', fontSize: '14px', fontStyle: 'italic', color: '#6b7280' }}>
                Considering these questions will help you identify the problems you're best positioned to solve with your offer.
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Select Problems to Solve */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 16px 0'
          }}>
            Step 2: Which 1-5 specific problems are you interested in solving?
          </h3>

          {/* Add new problem */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                value={newProblem}
                onChange={(e) => setNewProblem(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="e.g., Fears their service business will be disrupted by AI"
                style={styles.inputStyle}
              />
              <Button
                onClick={handleAddProblem}
                disabled={!newProblem.trim() || selectedProblems.length >= 5}
                variant="primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#fcf720',
                  color: '#222222',
                  borderRadius: '15px',
                }}
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              fontStyle: 'italic'
            }}>
              {selectedProblems.length}/5 problems selected
            </p>
          </div>

          {/* Display FIRE problems first */}
          {firePains.length > 0 && (
            <>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px 0'
              }}>
                FIRE Problems:
              </h4>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                {firePains.map(pain => (
                  <div
                    key={pain.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: selectedProblems.includes(pain.id) ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: selectedProblems.includes(pain.id) ? '#22c55e' : '#e5e7eb',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleProblemSelection(pain.id)}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: selectedProblems.includes(pain.id) ? '#22c55e' : '#d1d5db',
                      backgroundColor: selectedProblems.includes(pain.id) ? '#22c55e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {selectedProblems.includes(pain.id) && (
                        <Check size={16} color="#FFFFFF" />
                      )}
                    </div>
                    <span style={{ flex: 1, color: '#1e293b' }}>{pain.description}</span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      backgroundColor: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontWeight: 500,
                    }}>
                      FIRE
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Display other problems */}
          {pains.filter(pain => !pain.isFire && (!pain.calculatedFireScore || pain.calculatedFireScore < 7)).length > 0 && (
            <>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px 0'
              }}>
                Other Problems:
              </h4>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                {pains
                  .filter(pain => !pain.isFire && (!pain.calculatedFireScore || pain.calculatedFireScore < 7))
                  .map(pain => (
                    <div
                      key={pain.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: selectedProblems.includes(pain.id) ? '#f0fdf4' : '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedProblems.includes(pain.id) ? '#22c55e' : '#e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleProblemSelection(pain.id)}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: selectedProblems.includes(pain.id) ? '#22c55e' : '#d1d5db',
                        backgroundColor: selectedProblems.includes(pain.id) ? '#22c55e' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {selectedProblems.includes(pain.id) && (
                          <Check size={16} color="#FFFFFF" />
                        )}
                      </div>
                      <span style={{ flex: 1, color: '#1e293b' }}>{pain.description}</span>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                      }}>
                        {pain.type}
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {/* Display selected problems */}
          {selectedProblems.length > 0 && (
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
              padding: '16px',
              marginTop: '20px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#166534',
                margin: '0 0 12px 0'
              }}>
                Your Selected Problems ({selectedProblems.length}/5):
              </h4>
              <ul style={{
                margin: '0',
                paddingLeft: '24px',
                color: '#166534',
                fontSize: '14px'
              }}>
                {selectedProblems.map(painId => {
                  const painDetails = getPainDetails(painId);
                  return painDetails ? (
                    <li key={painId} style={{ marginBottom: '8px' }}>
                      <strong>{painDetails.description}</strong>
                      {painDetails.isFire && <span style={{ color: '#dc2626', fontWeight: 'bold' }}> (FIRE)</span>}
                      <div style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        fontStyle: 'italic',
                        marginTop: '2px'
                      }}>
                        Segment: {painDetails.buyerSegment} • Type: {painDetails.type}
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}

          {/* Example problems */}
          {(!pains.length || selectedProblems.length === 0) && (
            <div style={{
              backgroundColor: '#F0E6FF', // Purple background
              borderRadius: '15px',
              padding: '20px'
            }}>
              <div style={{
                display: 'inline-block',
                fontSize: '14px',
                color: '#FFFFFF',
                fontWeight: 'bold',
                marginBottom: '15px',
                backgroundColor: '#6B46C1',
                padding: '4px 12px',
                borderRadius: '20px'
              }}>
                EXAMPLES
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: '#333333',
                fontSize: '14px'
              }}>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  Struggles to find time to create content consistently
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  Feels overwhelmed by the constant pressure to stay visible online
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  Worries about being perceived as irrelevant by peers and clients
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  Fears their service business will be disrupted by AI
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  Can't scale their business without working more hours
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};