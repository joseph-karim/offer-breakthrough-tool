import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { UnderlyingGoal } from '../../../types/workshop';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import * as styles from '../../../styles/stepStyles';

// Separate selectors to prevent unnecessary re-renders
const selectUnderlyingGoal = (state: WorkshopStore) => state.workshopData.underlyingGoal;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;
export const Step03_UnderlyingGoal: React.FC = () => {
  const underlyingGoal = useWorkshopStore(selectUnderlyingGoal);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);

  const [formData, setFormData] = useState<UnderlyingGoal>({
    businessGoal: underlyingGoal?.businessGoal || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Hover state for tooltip
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Update local state when store value changes
  useEffect(() => {
    if (underlyingGoal) {
      setFormData({
        businessGoal: underlyingGoal.businessGoal || ''
      });
    }
  }, [underlyingGoal]);

  const handleInputChange = useCallback((field: keyof UnderlyingGoal, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        underlyingGoal: {
          ...formData,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [formData, updateWorkshopData, saveTimer]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof UnderlyingGoal) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof UnderlyingGoal) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };

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
          2
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Clarify Your Underlying Goal
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Let's get clear on why you're building a new offer. There are many ways to achieve a goal, but you must clarify where you're going in the first place.</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{
          backgroundColor: '#fcf720',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: '#222222',
          fontWeight: '500'
        }}>
          <p style={{ margin: 0 }}>Your underlying goal can relate to your business and/or personal life.</p>
        </div>

        {/* Business Goal */}
        <div style={styles.formGroupStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label
              htmlFor="business-goal"
              style={styles.labelStyle}
            >
              What is your underlying business goal?
            </label>
            <div
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              style={{ position: 'relative', cursor: 'help' }}
            >
              <HelpCircle size={16} style={{ color: '#6b7280' }} />

              {isTooltipVisible && (
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '100%',
                  transform: 'translateY(-100%)',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  maxWidth: '280px',
                  zIndex: 10,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  marginLeft: '8px',
                  whiteSpace: 'normal',
                }}>
                  What do you hope to achieve with this new offer? How will it fit into your broader business strategy?
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '100%',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#1e293b',
                    transform: 'translateY(-50%) rotate(45deg)',
                    marginRight: '-4px',
                  }} />
                </div>
              )}
            </div>
          </div>
          <textarea
            id="business-goal"
            value={formData.businessGoal}
            onChange={(e) => handleInputChange('businessGoal', e.target.value)}
            placeholder="e.g., Use new offer to solve a small problem for ideal customers and deliver a quick win that both earns their trust and creates interest in our other products/services."
            style={isFieldEmpty('businessGoal') ? styles.errorTextareaStyle : styles.textareaStyle}
          />
          {isFieldEmpty('businessGoal') && (
            <div style={styles.errorMessageStyle}>
              <AlertCircle size={14} />
              {getErrorMessage('businessGoal')}
            </div>
          )}
          <div style={styles.saveIndicatorContainerStyle}>
            <SaveIndicator saving={isSaving} />
          </div>
        </div>

        {/* Example Goals */}
        <div style={styles.examplesContainerStyle}>
          <div style={styles.examplesLabelStyle}>
            EXAMPLES
          </div>
          <ul style={styles.examplesListStyle}>
            <li style={styles.exampleItemStyle}>
              <span style={styles.exampleBulletStyle}>•</span>
              Create a new revenue stream that's less dependent on my time and expertise
            </li>
            <li style={styles.exampleItemStyle}>
              <span style={styles.exampleBulletStyle}>•</span>
              Build a product that can generate passive income while I sleep
            </li>
            <li style={styles.exampleItemStyle}>
              <span style={styles.exampleBulletStyle}>•</span>
              Create a lead generation tool that helps me attract higher-value clients
            </li>
            <li style={styles.exampleItemStyle}>
              <span style={styles.exampleBulletStyle}>•</span>
              Develop an offer that complements my existing services and creates upsell opportunities
            </li>
            <li style={styles.exampleItemStyle}>
              <span style={styles.exampleBulletStyle}>•</span>
              Build something that can eventually be sold or run by someone else
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};