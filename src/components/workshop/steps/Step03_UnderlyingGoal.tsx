import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { UnderlyingGoal } from '../../../types/workshop';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { FloatingTooltip } from '../../ui/FloatingTooltip';
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

  // We don't need the tooltip state anymore with FloatingTooltip

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
          backgroundColor: '#feffb7',
          padding: '12px 15px',
          borderRadius: '10px',
          marginBottom: '20px',
          color: '#222222',
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Your underlying goal can relate to your business and/or personal life.
        </div>

        {/* Business Goal */}
        <div style={styles.formGroupStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <label
              htmlFor="business-goal"
              style={{
                ...styles.labelStyle,
                marginBottom: 0, // Override the default margin to prevent spacing issues
                display: 'inline-flex', // Change to inline-flex for better alignment
                alignItems: 'center', // Center items vertically
              }}
            >
              What is your underlying business goal?
            </label>
            <FloatingTooltip
              content="What do you hope to achieve with this new offer? How will it fit into your broader business strategy?"
              placement="right"
              maxWidth={280}
            >
              <div style={{ cursor: 'help', display: 'flex', marginTop: '3px' }}>
                <HelpCircle size={16} style={{ color: '#6b7280' }} />
              </div>
            </FloatingTooltip>
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