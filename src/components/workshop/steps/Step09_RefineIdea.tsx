import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';

// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectRefinedIdea = (state: WorkshopStore) => state.workshopData.refinedIdea;
const selectProblemUp = (state: WorkshopStore) => state.workshopData.problemUp;
const selectPains = (state: WorkshopStore) => state.workshopData.pains;
const selectTargetBuyers = (state: WorkshopStore) => state.workshopData.targetBuyers;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;

export const Step09_RefineIdea: React.FC = () => {
  const initialBigIdea = useWorkshopStore(selectBigIdea);
  const refinedIdea = useWorkshopStore(selectRefinedIdea);
  const problemUp = useWorkshopStore(selectProblemUp);
  const pains = useWorkshopStore(selectPains);
  const targetBuyers = useWorkshopStore(selectTargetBuyers);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);

  const [formData, setFormData] = useState<BigIdea>({
    description: refinedIdea?.description || '',
    targetCustomers: refinedIdea?.targetCustomers || '',
    version: 'refined'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    if (refinedIdea) {
      setFormData({
        description: refinedIdea.description || '',
        targetCustomers: refinedIdea.targetCustomers || '',
        version: 'refined'
      });
    }
  }, [refinedIdea]);

  // Initialize with initial big idea if no refined idea exists
  useEffect(() => {
    if (!refinedIdea && initialBigIdea) {
      setFormData({
        description: initialBigIdea.description || '',
        targetCustomers: initialBigIdea.targetCustomers || '',
        version: 'refined'
      });
    }
  }, [initialBigIdea, refinedIdea]);

  const handleInputChange = useCallback((field: keyof BigIdea, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        refinedIdea: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof BigIdea) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof BigIdea) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };

  // Get selected pains
  const selectedPains = pains.filter(pain =>
    problemUp?.selectedPains?.includes(pain.id)
  );

  // Get selected buyers
  const selectedBuyers = targetBuyers.filter(buyer =>
    problemUp?.selectedBuyers?.includes(buyer.id)
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={9}
        title="Refine Your Idea"
        description="Revise your initial idea based on the insights from the workshop"
      />

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#eff6ff',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0 8px 8px 0',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <HelpCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#3b82f6' }} />
            Now it's time to refine your initial idea based on the insights you've gained throughout the workshop.
          </div>

          {/* Initial Big Idea */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 12px 0'
            }}>
              Your Initial Big Idea
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#4b5563',
              margin: '0 0 8px 0'
            }}>
              {initialBigIdea?.description || 'No initial idea defined'}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic',
              margin: '0'
            }}>
              Target customers: {initialBigIdea?.targetCustomers || 'None specified'}
            </p>
          </div>

          {/* Workshop Insights */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 12px 0'
            }}>
              Workshop Insights
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {/* Selected Pains */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 8px 0'
                }}>
                  Selected Painful Problems:
                </h4>
                {selectedPains.length > 0 ? (
                  <ul style={{
                    listStyle: 'disc',
                    paddingLeft: '24px',
                    color: '#4b5563',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    {selectedPains.map(pain => (
                      <li key={pain.id}>{pain.description}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    margin: '0'
                  }}>
                    No pains selected
                  </p>
                )}
              </div>

              {/* Selected Buyers */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 8px 0'
                }}>
                  Selected Target Buyers:
                </h4>
                {selectedBuyers.length > 0 ? (
                  <ul style={{
                    listStyle: 'disc',
                    paddingLeft: '24px',
                    color: '#4b5563',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    {selectedBuyers.map(buyer => (
                      <li key={buyer.id}>{buyer.description}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    margin: '0'
                  }}>
                    No buyers selected
                  </p>
                )}
              </div>

              {/* Target Moment */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4b5563',
                  margin: '0 0 8px 0'
                }}>
                  Target Moment:
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  {problemUp?.targetMoment || 'No target moment defined'}
                </p>
              </div>
            </div>
          </div>

          {/* Refined Big Idea */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="refined-idea-description"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Your Refined Big Idea
              </label>
              <Tooltip content="Describe your refined product or service idea based on the insights from the workshop">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="refined-idea-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., A 6-week group coaching program that helps marketing consultants create systems to scale their business without working more hours"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('description') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('description') && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('description')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Refined Target Customers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="refined-target-customers"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'block'
                }}
              >
                Refined Target Customers
              </label>
              <Tooltip content="Describe your refined target customers based on the insights from the workshop">
                <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
              </Tooltip>
            </div>
            <textarea
              id="refined-target-customers"
              value={formData.targetCustomers}
              onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
              placeholder="e.g., Marketing consultants with 3+ years experience who have hit a revenue ceiling and can't take on more clients without working more hours"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: isFieldEmpty('targetCustomers') ? '#ef4444' : '#d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: 'white',
              }}
            />
            {isFieldEmpty('targetCustomers') && (
              <div style={{
                color: '#ef4444',
                fontSize: '14px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={14} />
                {getErrorMessage('targetCustomers')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Next Steps */}
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fff7ed',
            borderLeft: '4px solid #ea580c',
            borderRadius: '0 8px 8px 0',
            color: '#9a3412',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <ArrowRight style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#ea580c' }} />
            In the next step, you'll review your workshop journey and plan your next actions.
          </div>
        </div>
      </Card>
    </div>
  );
};
