import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';
import * as styles from '../../../styles/stepStyles';

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
          09
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Refine Your Idea
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Revise your initial idea based on the insights from the workshop</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>


        <div style={{ display: 'grid', gap: '24px' }}>
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
              Refine Your Idea
            </label>
            <ResponsiveFloatingTooltip
              content="Now it's time to refine your initial idea based on the insights you've gained throughout the workshop."
              placement="right"
              maxWidth={300}
            >
              <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                <HelpCircle size={16} style={{ color: '#6b7280' }} />
              </div>
            </ResponsiveFloatingTooltip>
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="refined-idea-description"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                Your Refined Big Idea
              </label>
              <ResponsiveFloatingTooltip
                content="Describe your refined product or service idea based on the insights from the workshop"
                placement="right"
                maxWidth={300}
              >
                <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                  <HelpCircle size={16} style={{ color: '#6b7280' }} />
                </div>
              </ResponsiveFloatingTooltip>
            </div>
            <textarea
              id="refined-idea-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="e.g., A 6-week group coaching program that helps marketing consultants create systems to scale their business without working more hours"
              style={isFieldEmpty('description') ? styles.errorTextareaStyle : styles.textareaStyle}
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <label
                htmlFor="refined-target-customers"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                Refined Target Customers
              </label>
              <ResponsiveFloatingTooltip
                content="Describe your refined target customers based on the insights from the workshop"
                placement="right"
                maxWidth={300}
              >
                <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                  <HelpCircle size={16} style={{ color: '#6b7280' }} />
                </div>
              </ResponsiveFloatingTooltip>
            </div>
            <textarea
              id="refined-target-customers"
              value={formData.targetCustomers}
              onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
              placeholder="e.g., Marketing consultants with 3+ years experience who have hit a revenue ceiling and can't take on more clients without working more hours"
              style={isFieldEmpty('targetCustomers') ? styles.errorTextareaStyle : styles.textareaStyle}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
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
              Next Steps
            </label>
            <ResponsiveFloatingTooltip
              content="In the next step, you'll review your workshop journey and plan your next actions."
              placement="right"
              maxWidth={300}
            >
              <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                <ArrowRight size={16} style={{ color: '#6b7280' }} />
              </div>
            </ResponsiveFloatingTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};