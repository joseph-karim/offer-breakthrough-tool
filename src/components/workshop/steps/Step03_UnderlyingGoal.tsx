import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { UnderlyingGoal } from '../../../types/workshop';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';
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
    businessGoal: underlyingGoal?.businessGoal || '',
    constraints: underlyingGoal?.constraints || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    if (underlyingGoal) {
      setFormData({
        businessGoal: underlyingGoal.businessGoal || '',
        constraints: underlyingGoal.constraints || ''
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
      <div style={styles.stepHeaderContainerStyle}>
        <div style={styles.stepNumberStyle}>
          3
        </div>
        <h2 style={styles.stepTitleStyle}>
          Clarify Your Underlying Goal
        </h2>
      </div>

      {/* Description */}
      <div style={styles.stepDescriptionStyle}>
        <p>Define what you want to achieve with your new offer and what constraints you have</p>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={styles.infoBoxStyle}>
          <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#ea580c' }} />
          Clarifying your underlying goal will help you design a solution that works for both your customers AND your business.
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
            <Tooltip content="What do you hope to achieve with this new offer? How will it fit into your broader business strategy?">
              <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
            </Tooltip>
          </div>
          <textarea
            id="business-goal"
            value={formData.businessGoal}
            onChange={(e) => handleInputChange('businessGoal', e.target.value)}
            placeholder="e.g., Create a new revenue stream that's less dependent on my time and expertise"
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

        {/* Constraints */}
        <div style={styles.formGroupStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label
              htmlFor="constraints"
              style={styles.labelStyle}
            >
              What constraints do you have?
            </label>
            <Tooltip content="What limitations do you have in terms of time, resources, skills, etc.?">
              <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
            </Tooltip>
          </div>
          <textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => handleInputChange('constraints', e.target.value)}
            placeholder="e.g., I can only dedicate 5 hours per week to this new offer, I have a limited budget for marketing"
            style={isFieldEmpty('constraints') ? styles.errorTextareaStyle : styles.textareaStyle}
          />
          {isFieldEmpty('constraints') && (
            <div style={styles.errorMessageStyle}>
              <AlertCircle size={14} />
              {getErrorMessage('constraints')}
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
