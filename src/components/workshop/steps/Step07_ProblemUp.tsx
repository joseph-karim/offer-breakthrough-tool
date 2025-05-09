import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { ProblemUp } from '../../../types/workshop';
import { Check, Flame } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import * as styles from '../../../styles/stepStyles';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { ChatWithSparkyButton } from '../chat/ChatWithSparkyButton';
import { ContextBox } from '../ContextBox';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectTriggerEvents = (state: WorkshopStore) => state.workshopData.triggerEvents;
const selectJobs = (state: WorkshopStore) => state.workshopData.jobs;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step08_ProblemUp: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const triggerEvents = useWorkshopStore(selectTriggerEvents);
  const jobs = useWorkshopStore(selectJobs);
  const problemUp = useWorkshopStore(selectProblemUp);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Local state for form values
  const [formData, setFormData] = useState<ProblemUp>({
    selectedPains: problemUp?.selectedPains || [],
    selectedBuyers: problemUp?.selectedBuyers || [],
    relevantTriggerIds: problemUp?.relevantTriggerIds || [],
    targetMoment: problemUp?.targetMoment || '',
    notes: problemUp?.notes || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [primaryPainId, setPrimaryPainId] = useState<string | null>(null);
  const [primaryBuyerId, setPrimaryBuyerId] = useState<string | null>(null);

  // Get FIRE pains
  const firePains = pains.filter(pain => pain.isFire || (pain.calculatedFireScore && pain.calculatedFireScore >= 7));

  // Get selected target buyers (top 3)
  const selectedTargetBuyers = targetBuyers.filter(buyer => buyer.isTopThree);

  // Get overarching job
  const overarchingJob = jobs.find(job => job.isOverarching);

  // Toggle insights panel
  const toggleInsightsPanel = useCallback(() => {
    setIsInsightsExpanded(prev => !prev);
  }, []);

  // Load initial data if available
  useEffect(() => {
    if (problemUp) {
      setFormData({
        selectedPains: problemUp.selectedPains || [],
        selectedBuyers: problemUp.selectedBuyers || [],
        relevantTriggerIds: problemUp.relevantTriggerIds || [],
        targetMoment: problemUp.targetMoment || '',
        notes: problemUp.notes || ''
      });

      // Set primary pain and buyer if they exist
      if (problemUp.selectedPains && problemUp.selectedPains.length > 0) {
        setPrimaryPainId(problemUp.selectedPains[0]);
      }
      if (problemUp.selectedBuyers && problemUp.selectedBuyers.length > 0) {
        setPrimaryBuyerId(problemUp.selectedBuyers[0]);
      }
    }
  }, [problemUp]);

  const handleInputChange = useCallback((field: keyof ProblemUp, value: string | string[]) => {
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

  const handlePainSelection = useCallback((painId: string) => {
    setPrimaryPainId(painId);
    setFormData(prev => ({
      ...prev,
      selectedPains: [painId]
    }));

    updateWorkshopData({
      problemUp: {
        ...formData,
        selectedPains: [painId]
      }
    });
  }, [formData, updateWorkshopData]);

  const handleBuyerSelection = useCallback((buyerId: string) => {
    setPrimaryBuyerId(buyerId);
    setFormData(prev => ({
      ...prev,
      selectedBuyers: [buyerId]
    }));

    updateWorkshopData({
      problemUp: {
        ...formData,
        selectedBuyers: [buyerId]
      }
    });
  }, [formData, updateWorkshopData]);

  const handleTriggerSelection = useCallback((triggerId: string) => {
    setFormData(prev => {
      const newRelevantTriggerIds = prev.relevantTriggerIds.includes(triggerId)
        ? prev.relevantTriggerIds.filter(id => id !== triggerId)
        : [...prev.relevantTriggerIds, triggerId];

      // Update the store
      updateWorkshopData({
        problemUp: {
          ...prev,
          relevantTriggerIds: newRelevantTriggerIds
        }
      });

      return {
        ...prev,
        relevantTriggerIds: newRelevantTriggerIds
      };
    });
  }, [updateWorkshopData]);



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
          08
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Problem Up
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
        <p>Now, let's narrow your focus to a specific pain-buyer combination and define your "Target Moment" - the specific scenario where your ideal buyer feels a key pain acutely and becomes ready to seek a solution.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Workshop Insights */}
          <AccordionItem
            title="Your Workshop Insights"
            defaultExpanded={isInsightsExpanded}
            onToggle={toggleInsightsPanel}
          >
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
                  {overarchingJob?.description || "No job statement selected yet"}
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
          </AccordionItem>

          <div style={styles.yellowInfoBoxStyle}>
            Now, let's narrow your focus to define your "Target Moment" - the specific scenario where your ideal buyer feels a key pain acutely and becomes ready to seek a solution.
          </div>

          <AccordionGroup>
            {/* Step 1: Focus Your Efforts - Select Primary Pain & Buyer */}
            <AccordionItem
              title="Step 1: Focus Your Efforts - Select Primary Pain & Buyer"
              defaultExpanded={true}
            >
              <p style={{
                fontSize: '15px',
                color: '#475569',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                Now, let's narrow your focus even further. From your selected high-impact pains and top buyer segments, choose <strong>one primary pain</strong> and <strong>one primary target buyer segment</strong> that you believe represents the strongest opportunity for your offer. This will be the foundation for defining your 'Target Moment'.
              </p>

              {/* Primary Pain Selection */}
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
                  Select Your Primary Pain:
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
                          backgroundColor: primaryPainId === pain.id ? '#fff1f2' : '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: primaryPainId === pain.id ? '#e11d48' : '#e5e7eb',
                          cursor: 'pointer',
                        }}
                        onClick={() => handlePainSelection(pain.id)}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '1px solid',
                          borderColor: primaryPainId === pain.id ? '#e11d48' : '#d1d5db',
                          backgroundColor: primaryPainId === pain.id ? '#e11d48' : 'transparent',
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
                          fontSize: '15px',
                          fontWeight: 500,
                          color: '#1e293b',
                        }}>
                          {pain.description}
                          {pain.isFire && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginLeft: '8px',
                              color: '#ef4444',
                              fontSize: '13px',
                              fontWeight: 600,
                            }}>
                              <Flame size={14} style={{ marginRight: '2px' }} />
                              FIRE
                            </span>
                          )}
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

              {/* Primary Buyer Selection */}
              <div>
                <label
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#1e293b',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Select Your Primary Buyer Segment:
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
                          backgroundColor: primaryBuyerId === buyer.id ? '#ecfdf5' : '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: primaryBuyerId === buyer.id ? '#10b981' : '#e5e7eb',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleBuyerSelection(buyer.id)}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '1px solid',
                          borderColor: primaryBuyerId === buyer.id ? '#10b981' : '#d1d5db',
                          backgroundColor: primaryBuyerId === buyer.id ? '#10b981' : 'transparent',
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
                    No target buyers selected yet. Go back to the Target Buyers step to select your top 3.
                  </div>
                )}
              </div>
            </AccordionItem>

            {/* Step 2: Connect Triggers to the Selected Pain-Buyer Combo */}
            <AccordionItem
              title="Step 2: Connect Triggers to Your Selected Focus"
            >
              <ContextBox>
                <ul className="list-disc list-inside">
                  <li><strong>Primary Buyer:</strong> {targetBuyers.find(b => b.id === primaryBuyerId)?.description || "Not selected yet"}</li>
                  <li><strong>Primary Pain:</strong> {pains.find(p => p.id === primaryPainId)?.description || "Not selected yet"}</li>
                </ul>
              </ContextBox>

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
                    <ChatWithSparkyButton
                      exerciseKey="targetMoment"
                      exerciseTitle="Generate Target Moment Ideas"
                      initialContext={{
                        primaryBuyer: targetBuyers.find(b => b.id === primaryBuyerId)?.description,
                        primaryPain: pains.find(p => p.id === primaryPainId)?.description,
                        relevantTriggers: triggerEvents
                          .filter(t => formData.relevantTriggerIds.includes(t.id))
                          .map(t => t.description)
                      }}
                      systemPromptKey="TARGET_MOMENT_PROMPT"
                    />
                  </div>
                </>
              ) : (
                <div style={styles.yellowInfoBoxStyle}>
                  Please select a primary pain and buyer segment first to continue.
                </div>
              )}
            </AccordionItem>

            {/* Step 3: Define Your Target Moment */}
            <AccordionItem
              title="Step 3: Define Your Target Moment"
            >
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
            </AccordionItem>

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
          </AccordionGroup>
        </div>
      </div>
    </div>
  );
};
