import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { InfoBox } from '../../ui/InfoBox';
import { ExampleBox } from '../../ui/ExampleBox';


// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;


export const Step01_BigIdea: React.FC = () => {
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);

  const [formData, setFormData] = useState<BigIdea>({
    description: bigIdea?.description || '',
    version: 'initial'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    if (bigIdea) {
      setFormData({
        description: bigIdea.description || '',
        version: 'initial'
      });
    }
  }, [bigIdea]);

  const handleInputChange = useCallback((field: keyof BigIdea, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        bigIdea: {
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', color: '#333333', padding: '30px', borderRadius: '20px' }} data-sb-object-id="step1">
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
          1
        </div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333333',
            margin: 0
          }}
          data-sb-field-path="title"
        >
          Define Your Big Idea
        </h2>
      </div>

      {/* Description */}
      <div
        style={{
          marginBottom: '30px',
          color: '#555555'
        }}
        data-sb-field-path="description"
      >
        <p>Let's start with your initial product or service idea. Don't worry about making it perfect - we'll refine it throughout the workshop</p>
        <p>Describe your idea using this simple framework: <span style={{ color: '#fcf720', backgroundColor: '#333333', padding: '0 4px' }}>[What it is]</span> + <span style={{ color: '#fcf720', backgroundColor: '#333333', padding: '0 4px' }}>[what will it help customers do]</span></p>
      </div>

      {/* Info box with lightbulb icon */}
      <InfoBox data-sb-field-path="infoBoxContent">
        Don't overthink it. This is just version 1.0 of your idea. You'll refine it as you dig deeper.
      </InfoBox>

      {/* Main content area */}
      <div style={{
        marginBottom: '40px'
      }}>
        {/* Big Idea Description */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            marginBottom: '10px'
          }}>
            <label
              htmlFor="big-idea-description"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#333333',
                display: 'block'
              }}
              data-sb-field-path="labels.bigIdeaLabel"
            >
              What is your big idea for your new product or productized service?
            </label>
          </div>

          <textarea
            id="big-idea-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="e.g., A fillable buyer profile template and series of custom GPTs that helps entrepreneurs identify the best-fit buyers for their underperforming product/service"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '15px',
              border: '1px solid',
              borderColor: isFieldEmpty('description') ? '#ef4444' : '#DDDDDD',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              backgroundColor: '#F2F2F2',
              color: '#333333',
            }}
            data-sb-field-path="placeholders.bigIdeaPlaceholder"
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

        {/* Example Ideas */}
        <div data-sb-field-path="examples">
          <ExampleBox
            examples={[
              "A 6-week group coaching program that helps bootstrapped startups fix their user onboarding experience",
              "A SaaS tool that helps content creators repurpose their content across multiple platforms",
              "A membership community that provides ongoing support and resources for freelance designers",
              "A productized service that delivers monthly SEO audits and recommendations for e-commerce stores",
              "A course that teaches small business owners how to use AI tools to streamline their operations"
            ]}
            title="EXAMPLES"
            initiallyVisible={true}
          />
        </div>
      </div>


    </div>
  );
};