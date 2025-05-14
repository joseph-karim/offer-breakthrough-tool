import React, { useCallback, useState, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { ExternalLink, Download, Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { InfoBox } from '../../ui/InfoBox';
import { exportWorkshopToPdf } from '../../../utils/pdfExporter';
import { AccordionGroup, AccordionItem } from '../../ui/Accordion';
import { useNavigate } from 'react-router-dom';

// Separate selectors to prevent unnecessary re-renders
const selectWorkshopData = (state: WorkshopStore) => state.workshopData;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step10_PlanNextSteps: React.FC = () => {
  const workshopData = useWorkshopStore(selectWorkshopData);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const { saveSession } = useWorkshopStore();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Accordion state
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isStep2Expanded, setIsStep2Expanded] = useState(false);

  // Toggle functions for accordions
  const toggleStep1 = useCallback(() => setIsStep1Expanded(prev => !prev), []);
  const toggleStep2 = useCallback(() => setIsStep2Expanded(prev => !prev), []);

  // State for individual items
  const [preSellPlanItems, setPreSellPlanItems] = useState<string[]>([]);
  const [workshopReflectionItems, setWorkshopReflectionItems] = useState<string[]>([]);

  // State for new item inputs
  const [newPreSellItem, setNewPreSellItem] = useState('');
  const [newReflectionItem, setNewReflectionItem] = useState('');

  // Initialize with data from the store
  useEffect(() => {
    // Convert existing text to items if needed
    const initPreSellItems = workshopData.nextSteps?.preSellPlanItems || [];
    const initReflectionItems = workshopData.nextSteps?.workshopReflectionItems || [];

    // If we have items already, use them
    if (initPreSellItems.length > 0) {
      setPreSellPlanItems(initPreSellItems);
    }
    // Otherwise, try to convert the old string format to items
    else if (workshopData.nextSteps?.preSellPlan) {
      const lines = workshopData.nextSteps.preSellPlan
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      setPreSellPlanItems(lines);
    }

    // Same for reflection items
    if (initReflectionItems.length > 0) {
      setWorkshopReflectionItems(initReflectionItems);
    } else if (workshopData.nextSteps?.workshopReflections) {
      const lines = workshopData.nextSteps.workshopReflections
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      setWorkshopReflectionItems(lines);
    }
  }, [
    workshopData.nextSteps?.preSellPlan,
    workshopData.nextSteps?.workshopReflections,
    workshopData.nextSteps?.preSellPlanItems,
    workshopData.nextSteps?.workshopReflectionItems
  ]);



  // Handle adding a new pre-sell plan item
  const handleAddPreSellItem = useCallback(() => {
    if (newPreSellItem.trim()) {
      const updatedItems = [...preSellPlanItems, newPreSellItem.trim()];
      setPreSellPlanItems(updatedItems);
      setNewPreSellItem('');

      // Debounce saving
      setIsSaving(true);
      setTimeout(() => {
        const updatedNextSteps = {
          preSellPlanItems: updatedItems,
          workshopReflectionItems: workshopReflectionItems,
          preSellPlan: updatedItems.join('\n'),
          workshopReflections: workshopReflectionItems.join('\n')
        };

        updateWorkshopData({
          nextSteps: updatedNextSteps
        });
        setIsSaving(false);
      }, 500);
    }
  }, [newPreSellItem, preSellPlanItems, workshopReflectionItems, updateWorkshopData]);

  // Handle adding a new workshop reflection item
  const handleAddReflectionItem = useCallback(() => {
    if (newReflectionItem.trim()) {
      const updatedItems = [...workshopReflectionItems, newReflectionItem.trim()];
      setWorkshopReflectionItems(updatedItems);
      setNewReflectionItem('');

      // Debounce saving
      setIsSaving(true);
      setTimeout(() => {
        const updatedNextSteps = {
          preSellPlanItems: preSellPlanItems,
          workshopReflectionItems: updatedItems,
          preSellPlan: preSellPlanItems.join('\n'),
          workshopReflections: updatedItems.join('\n')
        };

        updateWorkshopData({
          nextSteps: updatedNextSteps
        });
        setIsSaving(false);
      }, 500);
    }
  }, [newReflectionItem, preSellPlanItems, workshopReflectionItems, updateWorkshopData]);

  // Handle removing a pre-sell plan item
  const handleRemovePreSellItem = useCallback((index: number) => {
    const updatedItems = preSellPlanItems.filter((_, i) => i !== index);
    setPreSellPlanItems(updatedItems);

    // Debounce saving
    setIsSaving(true);
    setTimeout(() => {
      const updatedNextSteps = {
        preSellPlanItems: updatedItems,
        workshopReflectionItems: workshopReflectionItems,
        preSellPlan: updatedItems.join('\n'),
        workshopReflections: workshopReflectionItems.join('\n')
      };

      updateWorkshopData({
        nextSteps: updatedNextSteps
      });
      setIsSaving(false);
    }, 500);
  }, [preSellPlanItems, workshopReflectionItems, updateWorkshopData]);

  // Handle removing a workshop reflection item
  const handleRemoveReflectionItem = useCallback((index: number) => {
    const updatedItems = workshopReflectionItems.filter((_, i) => i !== index);
    setWorkshopReflectionItems(updatedItems);

    // Debounce saving
    setIsSaving(true);
    setTimeout(() => {
      const updatedNextSteps = {
        preSellPlanItems: preSellPlanItems,
        workshopReflectionItems: updatedItems,
        preSellPlan: preSellPlanItems.join('\n'),
        workshopReflections: updatedItems.join('\n')
      };

      updateWorkshopData({
        nextSteps: updatedNextSteps
      });
      setIsSaving(false);
    }, 500);
  }, [preSellPlanItems, workshopReflectionItems, updateWorkshopData]);

  // Handle key press for adding items
  const handleKeyPress = useCallback((e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler();
    }
  }, []);

  // Download summary as PDF
  const downloadPdfSummary = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportWorkshopToPdf(workshopData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, [workshopData]);

  // Complete workshop and go to dashboard
  const completeWorkshop = useCallback(async () => {
    setIsCompleting(true);
    try {
      // Save the session one last time
      await saveSession();
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing workshop:', error);
      alert('There was an error saving your workshop. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  }, [saveSession, navigate]);

  return (
    <div style={styles.stepContainerStyle} data-sb-field-path="content">
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
        }} data-sb-field-path="stepNumber">
          10
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }} data-sb-field-path="title">
          Plan Next Steps
        </h2>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Description */}
          <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
            <p>You have a shiny new idea to explore. Now it's time to plan how you'll validate that you're on the right track—so you don't spend months building the wrong thing.</p>
          </div>

          {/* Info box */}
          <InfoBox data-sb-field-path="infoBox">
            Pre-selling your offer is the best way to validate market demand
          </InfoBox>

          <AccordionGroup>
            {/* Step 1: Define Pre-Sell Plan */}
            <AccordionItem
              title="Step 1) Define Pre-Sell Plan"
              isExpanded={isStep1Expanded}
              onToggle={toggleStep1}
            >
              <p style={{
                fontSize: '16px',
                color: '#4b5563',
                margin: '0 0 16px 0'
              }} data-sb-field-path="section1Description">
                How will you validate that there is demand for your new offer?
              </p>

              <p style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#4b5563',
                margin: '0 0 12px 0'
              }} data-sb-field-path="section1Prompt">
                Ask yourself:
              </p>

              <ul style={{
                listStyle: 'disc',
                paddingLeft: '24px',
                color: '#4b5563',
                fontSize: '16px',
                margin: '0 0 16px 0'
              }} data-sb-field-path="section1Questions">
                <li>Who are the first 3-10 people you could approach about your offer?</li>
                <li>What's the simplest version of your offer you could pre-sell?</li>
                <li>What's a reasonable timeline for delivery?</li>
                <li>What price point would make it irresistible for early adopters but still valuable to you?</li>
              </ul>

              {/* Add new pre-sell plan item - MOVED ABOVE the list */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={newPreSellItem}
                  onChange={(e) => setNewPreSellItem(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleAddPreSellItem)}
                  placeholder="Add a new pre-sell plan item..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                  }}
                />
                <Button
                  onClick={handleAddPreSellItem}
                  disabled={!newPreSellItem.trim()}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', marginBottom: '16px' }}>
                <SaveIndicator saving={isSaving} />
              </div>

              {/* Display existing pre-sell plan items - MOVED BELOW the input */}
              {preSellPlanItems.length > 0 && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {preSellPlanItems.map((item, index) => (
                    <div
                      key={`presell-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ flex: 1, color: '#4b5563' }}>{item}</span>
                      <button
                        onClick={() => handleRemovePreSellItem(index)}
                        onMouseEnter={() => setHoveredId(`presell-${index}`)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          padding: '4px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: hoveredId === `presell-${index}` ? '#ef4444' : '#6b7280',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AccordionItem>

            {/* Step 2: Workshop Reflections */}
            <AccordionItem
              title="Step 2) Workshop Reflections"
              isExpanded={isStep2Expanded}
              onToggle={toggleStep2}
            >
              <p style={{
                fontSize: '16px',
                color: '#4b5563',
                margin: '0 0 16px 0'
              }} data-sb-field-path="section2Description">
                What are your top learnings or key insights from this workshop?
              </p>

              {/* Add new workshop reflection item - MOVED ABOVE the list */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={newReflectionItem}
                  onChange={(e) => setNewReflectionItem(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleAddReflectionItem)}
                  placeholder="Add a new workshop reflection or key takeaway..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    backgroundColor: '#f8fafc',
                  }}
                />
                <Button
                  onClick={handleAddReflectionItem}
                  disabled={!newReflectionItem.trim()}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', marginBottom: '16px' }}>
                <SaveIndicator saving={isSaving} />
              </div>

              {/* Display existing workshop reflection items - MOVED BELOW the input */}
              {workshopReflectionItems.length > 0 && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {workshopReflectionItems.map((item, index) => (
                    <div
                      key={`reflection-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <span style={{ flex: 1, color: '#4b5563' }}>{item}</span>
                      <button
                        onClick={() => handleRemoveReflectionItem(index)}
                        onMouseEnter={() => setHoveredId(`reflection-${index}`)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          padding: '4px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: hoveredId === `reflection-${index}` ? '#ef4444' : '#6b7280',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AccordionItem>
          </AccordionGroup>

          {/* Workshop Summary */}
          <div style={{
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginTop: '32px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                margin: 0
              }}>
                Your Workshop Summary
              </h3>
              <Button
                onClick={downloadPdfSummary}
                variant="outline"
                size="sm"
                rightIcon={<Download size={16} />}
                disabled={isExporting}
              >
                {isExporting ? 'Generating PDF...' : 'Download as PDF'}
              </Button>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Refined Offer Idea */}
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px'
                }}>
                  Your Refined Offer Idea
                </h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Refined Offer */}
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.5'
                    }}>
                      {workshopData.refinedIdea?.description || workshopData.bigIdea?.description || "Not defined yet"}
                    </p>
                  </div>

                  {/* Target Market */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Target Market:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      {workshopData.targetMarketProfile?.name || "Not defined yet"}
                    </p>
                  </div>

                  {/* Common Traits */}
                  {workshopData.targetMarketProfile?.commonTraits && workshopData.targetMarketProfile.commonTraits.length > 0 && (
                    <div>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#4b5563',
                        margin: '0 0 4px 0'
                      }}>
                        Common Traits:
                      </h5>
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.targetMarketProfile.commonTraits.map((trait, index) => (
                          <li key={`trait-${index}`}>{trait}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Triggers */}
                  {workshopData.targetMarketProfile?.commonTriggers && workshopData.targetMarketProfile.commonTriggers.length > 0 && (
                    <div>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#4b5563',
                        margin: '0 0 4px 0'
                      }}>
                        Common Triggers:
                      </h5>
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.targetMarketProfile.commonTriggers.map((trigger, index) => (
                          <li key={`trigger-${index}`}>{trigger}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Core Problem Solved */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Core Problem Solved:
                    </h5>
                    {workshopData.problemUp?.selectedPains && workshopData.problemUp.selectedPains.length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.problemUp.selectedPains.map((painId, index) => {
                          const pain = workshopData.pains.find(p => p.id === painId);
                          return pain ? (
                            <li key={`pain-${index}`}>{pain.description}</li>
                          ) : null;
                        }).filter(Boolean)}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0'
                      }}>
                        No core problems selected yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Workshop Journey */}
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px'
                }}>
                  Your Workshop Journey
                </h4>

                <div style={{ display: 'grid', gap: '16px' }}>
                  {/* Initial Big Idea */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Initial Big Idea:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {workshopData.bigIdea?.description || "Not defined yet"}
                    </p>
                  </div>

                  {/* Underlying Goal */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Underlying Goal:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {workshopData.underlyingGoal?.businessGoal || "Not defined yet"}
                    </p>
                  </div>

                  {/* Overarching Job */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Overarching Job:
                    </h5>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {workshopData.jobs.find(job => job.isOverarching)?.description || "Not defined yet"}
                    </p>
                  </div>

                  {/* Key Trigger Events */}
                  <div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#4b5563',
                      margin: '0 0 4px 0'
                    }}>
                      Key Trigger Events:
                    </h5>
                    {workshopData.triggerEvents.length > 0 ? (
                      <ul style={{
                        listStyle: 'disc',
                        paddingLeft: '24px',
                        color: '#4b5563',
                        fontSize: '14px',
                        margin: '0'
                      }}>
                        {workshopData.triggerEvents.map((event, index) => (
                          <li key={`event-${index}`}>{event.description}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0'
                      }}>
                        No trigger events defined yet
                      </p>
                    )}
                  </div>

                  {/* Target Moment */}
                  {workshopData.problemUp?.targetMoment && (
                    <div>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#4b5563',
                        margin: '0 0 4px 0'
                      }}>
                        Target Moment:
                      </h5>
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {workshopData.problemUp.targetMoment}
                      </p>
                    </div>
                  )}

                  {/* Aha Moments */}
                  {workshopData.painstormingResults?.ahaMoments && (
                    <div>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#4b5563',
                        margin: '0 0 4px 0'
                      }}>
                        'Aha!' Moments & Reflections:
                      </h5>
                      <p style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: '0',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {workshopData.painstormingResults.ahaMoments}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pre-Sell Plan */}
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px'
                }}>
                  Your Pre-Sell Plan
                </h4>
                {preSellPlanItems.length > 0 ? (
                  <ul style={{
                    listStyle: 'disc',
                    paddingLeft: '24px',
                    color: '#4b5563',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    {preSellPlanItems.map((item, index) => (
                      <li key={`summary-presell-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    margin: '0',
                    fontStyle: 'italic'
                  }}>
                    Add pre-sell plan items above to see them here
                  </p>
                )}
              </div>

              {/* Workshop Reflections */}
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  margin: '0 0 12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '8px'
                }}>
                  Your Key Takeaways
                </h4>
                {workshopReflectionItems.length > 0 ? (
                  <ul style={{
                    listStyle: 'disc',
                    paddingLeft: '24px',
                    color: '#4b5563',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    {workshopReflectionItems.map((item, index) => (
                      <li key={`summary-reflection-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    margin: '0',
                    fontStyle: 'italic'
                  }}>
                    Add workshop reflections above to see them here
                  </p>
                )}
              </div>
            </div>

            {/* Complete Workshop Button */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button
                onClick={completeWorkshop}
                variant="yellow"
                size="lg"
                leftIcon={<CheckCircle size={18} />}
                isLoading={isCompleting}
                disabled={isCompleting}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                {isCompleting ? 'Saving...' : 'Complete Workshop & Save'}
              </Button>
            </div>
          </div>

          {/* Need messaging help? */}
          <div style={{
            padding: '24px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            color: 'white',
            marginTop: '32px'
          }} data-sb-field-path="ctaSection">
            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaTitle">
              Need messaging help?
            </h3>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaDescription">
              Now that you have a refined offer idea and validation plan, it's time to test your concept with real potential buyers before building it. The best validation is to pre-sell your offer.
            </p>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaSubDescription">
              That means you need to figure out your product positioning, messaging strategy, and craft your pitch.
            </p>

            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaProductName">
              Consider grabbing PAINKILLER, the AI-fuelled messaging system for time-crunched entrepreneurs.
            </p>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaProductIntro">
              With help from Sparky, you can:
            </p>

            <ol style={{
              paddingLeft: '24px',
              fontSize: '16px',
              margin: '0 0 24px 0'
            }} data-sb-field-path="ctaFeatures">
              <li>Audit the competitive landscape</li>
              <li>Do fast-as-f*ck customer research</li>
              <li>Figure out your product positioning</li>
              <li>Design your painkiller messaging strategy</li>
              <li>Craft direct-response copy to pre-sell your offer</li>
            </ol>

            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 24px 0'
            }} data-sb-field-path="ctaTimeframe">
              All in just 3.5 days
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="yellow"
                size="lg"
                rightIcon={<ExternalLink size={16} />}
                onClick={() => window.open('https://learnwhywebuy.com/painkiller-flash-sale/', '_blank')}
                data-sb-field-path="ctaButton"
              >
                Figure out your pre-sale messaging &gt;
              </Button>
            </div>
          </div>

          {/* Testimonial */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px'
          }} data-sb-field-path="testimonialSection">
            <img
              src="https://raw.githubusercontent.com/joseph-karim/offer-breakthrough-tool/main/public/assets/testimonial.png"
              alt="Customer testimonial"
              style={{
                maxWidth: '100%',
                borderRadius: '8px'
              }}
              data-sb-field-path="testimonialImage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
