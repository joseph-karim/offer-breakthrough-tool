import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { ProblemUp } from '../../../types/workshop';
import { HelpCircle, MessageSquare, Check } from 'lucide-react';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import { AIService } from '../../../services/aiService';
import { Button } from '../../ui/Button';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectAcceptSuggestion = (state: WorkshopStore) => state.acceptSuggestion;

export const Step08_ProblemUp: React.FC = () => {
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const problemUp = useWorkshopStore(selectProblemUp);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const acceptSuggestion = useWorkshopStore(selectAcceptSuggestion);

  // Use local state for the problem-up data
  const [formData, setFormData] = useState<ProblemUp>({
    selectedPains: problemUp?.selectedPains || [],
    selectedBuyers: problemUp?.selectedBuyers || [],
    targetMoment: problemUp?.targetMoment || '',
    notes: problemUp?.notes || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Create AI service instance
  const aiService = new AIService({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // Update local state when store value changes
  useEffect(() => {
    if (problemUp) {
      setFormData({
        selectedPains: problemUp.selectedPains || [],
        selectedBuyers: problemUp.selectedBuyers || [],
        targetMoment: problemUp.targetMoment || '',
        notes: problemUp.notes || ''
      });
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

  const togglePainSelection = useCallback((painId: string) => {
    setFormData(prev => {
      const newSelectedPains = prev.selectedPains.includes(painId)
        ? prev.selectedPains.filter(id => id !== painId)
        : [...prev.selectedPains, painId];

      const updatedData = {
        ...prev,
        selectedPains: newSelectedPains
      };

      updateWorkshopData({
        problemUp: updatedData
      });

      return updatedData;
    });
  }, [updateWorkshopData]);

  const toggleBuyerSelection = useCallback((buyerId: string) => {
    setFormData(prev => {
      const newSelectedBuyers = prev.selectedBuyers.includes(buyerId)
        ? prev.selectedBuyers.filter(id => id !== buyerId)
        : [...prev.selectedBuyers, buyerId];

      const updatedData = {
        ...prev,
        selectedBuyers: newSelectedBuyers
      };

      updateWorkshopData({
        problemUp: updatedData
      });

      return updatedData;
    });
  }, [updateWorkshopData]);

  // Generate step context for AI
  const stepContext = `
    Workshop Step: Problem Up

    The user is selecting specific problems and target buyers to focus on.

    Available pains:
    ${pains.map(pain => `- ${pain.description} (${pain.type}${pain.isFire ? ', FIRE' : ''})`).join('\n')}

    Available target buyers:
    ${targetBuyers.map(buyer => `- ${buyer.description}`).join('\n')}

    Currently selected:
    Selected pains: ${formData.selectedPains.length}
    Selected buyers: ${formData.selectedBuyers.length}
    Target moment: ${formData.targetMoment}
    Notes: ${formData.notes}
  `;

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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={8}
        title="Problem Up"
        description="Choose specific problems and target buyers to shape your solution around"
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button
          variant="ghost"
          onClick={() => setShowChat(!showChat)}
          rightIcon={<MessageSquare size={16} />}
        >
          {showChat ? 'Hide AI Assistant' : 'Get AI Help'}
        </Button>
      </div>

      {showChat && (
        <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
          <ChatInterface
            step={8}
            stepContext={stepContext}
            questions={STEP_QUESTIONS[8] || []}
            aiService={aiService}
            onSuggestionAccept={() => acceptSuggestion(8)}
          />
        </Card>
      )}

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            borderLeft: '4px solid #22c55e',
            borderRadius: '0 8px 8px 0',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#22c55e' }} />
            Select the most profitable problems and target buyers to focus your solution on.
          </div>

          {/* Select Pains */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              1. Select Painful Problems to Solve
            </h3>

            {pains.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {pains.map(pain => (
                  <div
                    key={pain.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: formData.selectedPains.includes(pain.id) ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: formData.selectedPains.includes(pain.id) ? '#22c55e' : '#e5e7eb',
                      borderLeft: `3px solid ${getPainTypeColor(pain.type)}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => togglePainSelection(pain.id)}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: formData.selectedPains.includes(pain.id) ? '#22c55e' : '#d1d5db',
                      backgroundColor: formData.selectedPains.includes(pain.id) ? '#22c55e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {formData.selectedPains.includes(pain.id) && (
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
                            <Fire size={12} color="#ef4444" />
                            FIRE
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
                No pains identified yet. Go back to the Painstorming step to add some.
              </div>
            )}
          </div>

          {/* Select Buyers */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }}>
              2. Select Target Buyers to Focus On
            </h3>

            {targetBuyers.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {targetBuyers.map(buyer => (
                  <div
                    key={buyer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: formData.selectedBuyers.includes(buyer.id) ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: formData.selectedBuyers.includes(buyer.id) ? '#22c55e' : '#e5e7eb',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleBuyerSelection(buyer.id)}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: formData.selectedBuyers.includes(buyer.id) ? '#22c55e' : '#d1d5db',
                      backgroundColor: formData.selectedBuyers.includes(buyer.id) ? '#22c55e' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {formData.selectedBuyers.includes(buyer.id) && (
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
                No target buyers identified yet. Go back to the Target Buyers step to add some.
              </div>
            )}
          </div>

          {/* Target Moment */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="target-moment"
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                3. Define the Target Moment
              </label>
              <div title="When exactly would someone need your solution?">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </div>
            </div>
            <textarea
              id="target-moment"
              value={formData.targetMoment}
              onChange={(e) => handleInputChange('targetMoment', e.target.value)}
              placeholder="e.g., When a marketing consultant realizes they've hit a revenue ceiling and can't take on more clients without working more hours"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="notes"
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                4. Notes & Insights
              </label>
              <div title="Any additional insights or ideas about your problem-up approach">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </div>
            </div>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="e.g., I'm noticing that the most painful problems are around time management and scaling. I should focus my solution on automating repetitive tasks."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Example */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic',
              marginBottom: '12px'
            }}>
              Example problem-up approach:
            </p>
            <ul style={{
              listStyle: 'disc',
              paddingLeft: '24px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <li><strong>Selected Problems:</strong> "Can't scale their business without working more hours", "Struggles to find time to create content consistently"</li>
              <li><strong>Selected Buyers:</strong> "Marketing consultants with 3+ years experience"</li>
              <li><strong>Target Moment:</strong> "When a marketing consultant realizes they've hit a revenue ceiling and can't take on more clients without working more hours"</li>
              <li><strong>Notes:</strong> "I'll focus on helping marketing consultants automate their content creation process so they can scale without working more hours. This will be a high-value solution because it directly addresses their FIRE problems."</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
