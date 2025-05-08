import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { ProblemUp } from '../../../types/workshop';
import { Check, Flame, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import * as styles from '../../../styles/stepStyles';
import { Button } from '../../ui/Button';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents;
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectAddChatMessage = (state: WorkshopStore) => state.addChatMessage;

export const Step08_ProblemUp: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const jobs = useWorkshopStore(selectJobs);
  const problemUp = useWorkshopStore(selectProblemUp);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const addChatMessage = useWorkshopStore(selectAddChatMessage);

  // Get the selected job
  const selectedJob = jobs.find(job => job.isOverarching);

  // Get FIRE pains
  const firePains = pains.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7));

  // Get selected target buyers
  const selectedTargetBuyers = targetBuyers.filter(buyer => buyer.isTopThree || buyer.selected);

  // State for collapsible panels
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);

  // Use local state for the problem-up data
  const [formData, setFormData] = useState<ProblemUp>({
    selectedPains: problemUp?.selectedPains || [],
    selectedBuyers: problemUp?.selectedBuyers || [],
    relevantTriggerIds: problemUp?.relevantTriggerIds || [],
    targetMoment: problemUp?.targetMoment || '',
    notes: problemUp?.notes || ''
  });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTargetMomentSuggestions, setShowTargetMomentSuggestions] = useState(false);
  const [targetMomentSuggestions, setTargetMomentSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // State for primary selections
  const [primaryPainId, setPrimaryPainId] = useState<string | null>(
    formData.selectedPains.length === 1 ? formData.selectedPains[0] : null
  );
  const [primaryBuyerId, setPrimaryBuyerId] = useState<string | null>(
    formData.selectedBuyers.length === 1 ? formData.selectedBuyers[0] : null
  );

  // Update local state when store value changes
  useEffect(() => {
    if (problemUp) {
      setFormData({
        selectedPains: problemUp.selectedPains || [],
        selectedBuyers: problemUp.selectedBuyers || [],
        relevantTriggerIds: problemUp.relevantTriggerIds || [],
        targetMoment: problemUp.targetMoment || '',
        notes: problemUp.notes || ''
      });

      // Update primary selections if they exist
      if (problemUp.selectedPains.length === 1) {
        setPrimaryPainId(problemUp.selectedPains[0]);
      }

      if (problemUp.selectedBuyers.length === 1) {
        setPrimaryBuyerId(problemUp.selectedBuyers[0]);
      }
    }
  }, [problemUp]);

  const handleInputChange = useCallback((field: keyof ProblemUp, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        problemUp: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Handle primary pain selection
  const handlePrimaryPainChange = useCallback((painId: string) => {
    setPrimaryPainId(painId);

    // Update the selectedPains array to only include this pain
    const updatedData = {
      ...formData,
      selectedPains: [painId]
    };

    setFormData(updatedData);
    updateWorkshopData({
      problemUp: updatedData
    });
  }, [formData, updateWorkshopData]);

  // Handle primary buyer selection
  const handlePrimaryBuyerChange = useCallback((buyerId: string) => {
    setPrimaryBuyerId(buyerId);

    // Update the selectedBuyers array to only include this buyer
    const updatedData = {
      ...formData,
      selectedBuyers: [buyerId]
    };

    setFormData(updatedData);
    updateWorkshopData({
      problemUp: updatedData
    });
  }, [formData, updateWorkshopData]);

  // Handle trigger selection for target moment
  const handleTriggerSelection = useCallback((triggerId: string) => {
    setFormData(prev => {
      const newRelevantTriggerIds = prev.relevantTriggerIds.includes(triggerId)
        ? prev.relevantTriggerIds.filter(id => id !== triggerId)
        : [...prev.relevantTriggerIds, triggerId];

      const updatedData = {
        ...prev,
        relevantTriggerIds: newRelevantTriggerIds
      };

      updateWorkshopData({
        problemUp: updatedData
      });

      return updatedData;
    });
  }, [updateWorkshopData]);

  // Generate target moment suggestions
  const generateTargetMomentSuggestions = useCallback(async () => {
    if (!primaryPainId || !primaryBuyerId || formData.relevantTriggerIds.length === 0) {
      // Can't generate without primary pain, buyer, and at least one trigger
      return;
    }

    setIsGeneratingSuggestions(true);

    // Get the primary pain and buyer objects
    const primaryPain = pains.find(p => p.id === primaryPainId);
    const primaryBuyer = targetBuyers.find(b => b.id === primaryBuyerId);
    const relevantTriggers = triggerEvents.filter(t => formData.relevantTriggerIds.includes(t.id));

    if (!primaryPain || !primaryBuyer || relevantTriggers.length === 0) {
      setIsGeneratingSuggestions(false);
      return;
    }

    // In a real implementation, this would call the AI service
    // For now, we'll generate mock suggestions

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock suggestions
    const suggestions = [
      `When ${primaryBuyer.description} experiences ${relevantTriggers[0].description}, they acutely feel the pain of ${primaryPain.description}, driving them to urgently seek a solution.`,
      `The moment ${primaryBuyer.description} realizes ${relevantTriggers[0].description}, the frustration of ${primaryPain.description} becomes unbearable, pushing them to find a way to solve this problem once and for all.`,
      `After ${relevantTriggers[0].description}, ${primaryBuyer.description} can no longer ignore the pain of ${primaryPain.description}, creating an urgent need for a solution that addresses this specific challenge.`
    ];

    setTargetMomentSuggestions(suggestions);
    setShowTargetMomentSuggestions(true);
    setIsGeneratingSuggestions(false);

    // Add a message to the chat
    addChatMessage(8, {
      id: Date.now().toString(),
      content: `Based on your selections, here are some Target Moment options:\n\n1. ${suggestions[0]}\n\n2. ${suggestions[1]}\n\n3. ${suggestions[2]}\n\nFeel free to use one of these as a starting point for the 'Target Moment' field, or refine it to make it perfect!`,
      role: 'assistant',
      timestamp: new Date().toISOString()
    });

  }, [primaryPainId, primaryBuyerId, formData.relevantTriggerIds, pains, targetBuyers, triggerEvents, addChatMessage]);

  // Apply a target moment suggestion
  const applyTargetMomentSuggestion = useCallback((suggestion: string) => {
    handleInputChange('targetMoment', suggestion);
    setShowTargetMomentSuggestions(false);
  }, [handleInputChange]);

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

  // Toggle Workshop Insights panel
  const toggleInsightsPanel = () => {
    setIsInsightsExpanded(!isInsightsExpanded);
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
          08
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0,
          lineHeight: '1'
        }}>
          Problem Up
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Connect your insights to define a focused "Target Moment" for your offer</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Collapsible Workshop Insights */}
          <div>
            <div 
              onClick={toggleInsightsPanel}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: isInsightsExpanded ? '#fcf720' : '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                marginBottom: isInsightsExpanded ? '16px' : '0',
                fontWeight: 600
              }}
            >
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                margin: 0
              }}>
                Your Workshop Insights
              </h3>
              {isInsightsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isInsightsExpanded && (
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                {/* Overarching Job Statement */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '4px'
                  }}>
                    Your Overarching Job Statement:
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    color: '#334155'
                  }}>
                    {selectedJob?.description || "No job statement selected yet"}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    The main progress your customer is trying to make.
                  </div>
                </div>

                {/* Top Target Buyer Segments */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '4px'
                  }}>
                    Your Top Target Buyer Segments:
                  </div>
                  {selectedTargetBuyers.length > 0 ? (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#334155'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {selectedTargetBuyers.map(buyer => (
                          <li key={buyer.id}>{buyer.description}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#94a3b8'
                    }}>
                      No target buyers selected yet
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    The key groups you're focusing on.
                  </div>
                </div>

                {/* Key Buying Triggers */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '4px'
                  }}>
                    Key Buying Triggers Identified:
                  </div>
                  {triggerEvents.length > 0 ? (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#334155'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {triggerEvents.slice(0, 5).map(trigger => (
                          <li key={trigger.id}>{trigger.description}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#94a3b8'
                    }}>
                      No trigger events identified yet
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    The moments that likely push these buyers to seek a solution.
                  </div>
                </div>

                {/* High-Impact FIRE Pains */}
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '4px'
                  }}>
                    Your Selected High-Impact (FIRE) Pains:
                  </div>
                  {firePains.length > 0 ? (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#334155'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {firePains.slice(0, 5).map(pain => (
                          <li key={pain.id}>{pain.description}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#94a3b8'
                    }}>
                      No FIRE pains identified yet
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    The specific, acute problems you've chosen to focus on solving.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={styles.yellowInfoBoxStyle}>
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#222222' }} />
            Now, let's narrow your focus to define your "Target Moment" - the specific scenario where your ideal buyer feels a key pain acutely and becomes ready to seek a solution.
          </div>

          {/* Step 1: Focus Your Efforts - Select Primary Pain & Buyer */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Step 1: Focus Your Efforts - Select Primary Pain & Buyer
            </h3>

            <p style={{
              fontSize: '15px',
              color: '#475569',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Now, let's narrow your focus even further. From your selected high-impact pains and top buyer segments, choose <strong>one primary pain</strong> and <strong>one primary target buyer segment</strong> that you believe represents the strongest opportunity for your offer. This will be the foundation for defining your 'Target Moment'.
            </p>

            {/* Select Primary Target Buyer */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="primary-buyer"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Which of your Top Target Buyer Segments will you focus on for this offer?
              </label>

              {selectedTargetBuyers.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {selectedTargetBuyers.map(buyer => (
                    <div
                      key={buyer.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: primaryBuyerId === buyer.id ? '#f0fdf4' : '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: primaryBuyerId === buyer.id ? '#22c55e' : '#e5e7eb',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePrimaryBuyerChange(buyer.id)}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: primaryBuyerId === buyer.id ? '#22c55e' : '#d1d5db',
                        backgroundColor: primaryBuyerId === buyer.id ? '#22c55e' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {primaryBuyerId === buyer.id && (
                          <Check size={16} color="#FFFFFF" />
                        )}
                      </div>

                      <div style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#1e293b',
                      }}>
                        {buyer.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px dashed #d1d5db',
                  color: '#6b7280',
                  fontSize: '14px',
                }}>
                  No target buyers selected yet. Go back to the Target Buyers step to select some.
                </div>
              )}
            </div>

            {/* Select Primary Pain */}
            <div>
              <label
                htmlFor="primary-pain"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Which of your Selected High-Impact Pains will be the primary focus for this buyer?
              </label>

              {firePains.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {firePains.map(pain => (
                    <div
                      key={pain.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: primaryPainId === pain.id ? '#f0fdf4' : '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: primaryPainId === pain.id ? '#22c55e' : '#e5e7eb',
                        borderLeft: `3px solid ${getPainTypeColor(pain.type)}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePrimaryPainChange(pain.id)}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: primaryPainId === pain.id ? '#22c55e' : '#d1d5db',
                        backgroundColor: primaryPainId === pain.id ? '#22c55e' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {primaryPainId === pain.id && (
                          <Check size={16} color="#FFFFFF" />
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        flex: 1,
                      }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#1e293b',
                        }}>
                          {pain.description}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: `${getPainTypeColor(pain.type)}20`,
                            color: getPainTypeColor(pain.type),
                            fontWeight: 500,
                          }}>
                            {pain.type}
                          </span>
                          <span>
                            {pain.buyerSegment}
                          </span>
                          {pain.isFire && (
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              fontWeight: 500,
                            }}>
                              <Flame size={12} color="#ef4444" />
                              FIRE
                            </span>
                          )}
                          {pain.calculatedFireScore && (
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              fontWeight: 500,
                            }}>
                              Score: {pain.calculatedFireScore}/12
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px dashed #d1d5db',
                  color: '#6b7280',
                  fontSize: '14px',
                }}>
                  No FIRE pains identified yet. Go back to the Painstorming step to identify some.
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Connect Triggers to the Selected Pain-Buyer Combo */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Step 2: Connect Triggers to Your Selected Focus
            </h3>

            <p style={{
              fontSize: '15px',
              color: '#475569',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Now, let's connect your primary pain and buyer to the trigger events that most directly lead to this situation. Which trigger events do you feel most directly and frequently lead your selected buyer to experience this pain acutely?
            </p>

            {primaryPainId && primaryBuyerId ? (
              <>
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #bae6fd'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px', color: '#0369a1' }}>Your Selected Focus:</div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>Primary Buyer:</span> {targetBuyers.find(b => b.id === primaryBuyerId)?.description}
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>Primary Pain:</span> {pains.find(p => p.id === primaryPainId)?.description}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Select the most relevant trigger events (1-2):
                  </label>

                  {triggerEvents.length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {triggerEvents.map(trigger => (
                        <div
                          key={trigger.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: formData.relevantTriggerIds.includes(trigger.id) ? '#f0fdf4' : '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: formData.relevantTriggerIds.includes(trigger.id) ? '#22c55e' : '#e5e7eb',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleTriggerSelection(trigger.id)}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '1px solid',
                            borderColor: formData.relevantTriggerIds.includes(trigger.id) ? '#22c55e' : '#d1d5db',
                            backgroundColor: formData.relevantTriggerIds.includes(trigger.id) ? '#22c55e' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {formData.relevantTriggerIds.includes(trigger.id) && (
                              <Check size={16} color="#FFFFFF" />
                            )}
                          </div>

                          <div style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#1e293b',
                          }}>
                            {trigger.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px dashed #d1d5db',
                      color: '#6b7280',
                      fontSize: '14px',
                    }}>
                      No trigger events identified yet. Go back to the Trigger Events step to add some.
                    </div>
                  )}
                </div>

                {/* Generate Target Moment Button */}
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={generateTargetMomentSuggestions}
                    disabled={!primaryPainId || !primaryBuyerId || formData.relevantTriggerIds.length === 0 || isGeneratingSuggestions}
                    style={{
                      backgroundColor: (!primaryPainId || !primaryBuyerId || formData.relevantTriggerIds.length === 0) ? '#cbd5e1' : '#fcf720',
                      color: (!primaryPainId || !primaryBuyerId || formData.relevantTriggerIds.length === 0) ? '#64748b' : '#222222',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: (!primaryPainId || !primaryBuyerId || formData.relevantTriggerIds.length === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                      fontSize: '15px'
                    }}
                  >
                    {isGeneratingSuggestions ? 'Generating...' : 'Generate Target Moment Suggestions'}
                  </Button>
                </div>

                {/* Target Moment Suggestions */}
                {showTargetMomentSuggestions && targetMomentSuggestions.length > 0 && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '12px', color: '#166534' }}>Target Moment Suggestions:</div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {targetMomentSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #dcfce7',
                            fontSize: '15px',
                            color: '#334155',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                          onClick={() => applyTargetMomentSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: '#166534', marginTop: '8px' }}>
                      Click on a suggestion to use it as your Target Moment.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={styles.yellowInfoBoxStyle}>
                Please select a primary pain and buyer segment first to continue.
              </div>
            )}
          </div>

          {/* Step 3: Define Your Target Moment */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              Step 3: Define Your Target Moment
            </h3>

            <p style={{
              fontSize: '15px',
              color: '#475569',
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              Now, finalize your "Target Moment" - the specific scenario where your ideal buyer, often kicked off by one of those triggers, feels that key pain most acutely and becomes ready to seek a solution.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="target-moment"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Define Your Target Moment:
              </label>
              <textarea
                id="target-moment"
                value={formData.targetMoment}
                onChange={(e) => handleInputChange('targetMoment', e.target.value)}
                placeholder="e.g., When a busy marketing consultant loses a major client unexpectedly, they acutely feel the pain of unpredictable income and the intense pressure to find new leads fast, pushing them to find a reliable client acquisition system."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  backgroundColor: '#f8fafc',
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '4px',
                fontSize: '12px',
                color: '#64748b'
              }}>
                <div>
                  A good format: "When [Buyer] experiences [Trigger], they acutely feel [Pain], making them look for a solution."
                </div>
                <SaveIndicator saving={isSaving} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                Additional Notes on Your Problem-Up Focus:
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="e.g., This target moment is critical because it aligns with their highest anxiety. My offer needs to promise quick, reliable results."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  backgroundColor: '#f8fafc',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <SaveIndicator saving={isSaving} />
              </div>
            </div>
          </div>

          {/* Example */}
          <div style={styles.examplesContainerStyle}>
            <div style={styles.examplesLabelStyle}>
              EXAMPLE
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong>Primary Buyer:</strong> Marketing consultants with 3+ years experience
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Primary Pain:</strong> Can't scale their business without working more hours
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Relevant Trigger:</strong> Losing a major client unexpectedly
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Target Moment:</strong> "When a marketing consultant loses a major client unexpectedly, they acutely feel the pain of unpredictable income and the intense pressure to find new leads fast, pushing them to find a reliable client acquisition system."
              </div>
              <div>
                <strong>Notes:</strong> "This target moment is critical because it aligns with their highest anxiety. My offer needs to promise quick, reliable results while addressing their fear of feast-or-famine income cycles."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};