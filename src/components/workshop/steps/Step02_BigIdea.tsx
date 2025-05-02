import React, { useState, useCallback, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { BigIdea } from '../../../types/workshop';
import { AlertCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectBigIdea = (state: WorkshopStore) => state.workshopData.bigIdea;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectValidationErrors = (state: WorkshopStore) => state.validationErrors;


export const Step02_BigIdea: React.FC = () => {
  const bigIdea = useWorkshopStore(selectBigIdea);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const showErrors = useWorkshopStore(selectValidationErrors);


  const [formData, setFormData] = useState<BigIdea>({
    description: bigIdea?.description || '',
    targetCustomers: bigIdea?.targetCustomers || '',
    version: 'initial'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    if (bigIdea) {
      setFormData({
        description: bigIdea.description || '',
        targetCustomers: bigIdea.targetCustomers || '',
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
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', color: '#333333', padding: '30px', borderRadius: '20px' }}>
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#FFDD00',
          color: 'black',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '15px'
        }}>
          2
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }}>
          Your Big Idea
        </h2>
      </div>

      {/* Description */}
      <div style={{
        marginBottom: '30px',
        color: '#555555'
      }}>
        <p>Describe your product idea using a simple framework: <span style={{ color: '#FFDD00', backgroundColor: '#333333', padding: '0 4px' }}>[What it is]</span> + <span style={{ color: '#FFDD00', backgroundColor: '#333333', padding: '0 4px' }}>[what will it help customers do]</span></p>
        <p>This is just version 1 of your idea. You'll refine it as you go through the workshop.</p>
      </div>

      {/* Main content area */}
      <div style={{
        marginBottom: '40px'
      }}>
        {/* Big Idea Description */}
        <div style={{ marginBottom: '30px' }}>
          <label
            htmlFor="big-idea-description"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333333',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            What is your product or service idea?
          </label>
          <textarea
            id="big-idea-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="e.g., A 6-week group coaching program that helps service-based entrepreneurs create a scalable digital product"
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
              backgroundColor: '#F0F9FF',
              color: '#333333',
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

        {/* Target Customers */}
        <div style={{ marginBottom: '30px' }}>
          <label
            htmlFor="target-customers"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333333',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            Who do you think your target customers are?
          </label>
          <textarea
            id="target-customers"
            value={formData.targetCustomers}
            onChange={(e) => handleInputChange('targetCustomers', e.target.value)}
            placeholder="e.g., Freelance marketers who want to stop trading time for money"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '15px',
              border: '1px solid',
              borderColor: isFieldEmpty('targetCustomers') ? '#ef4444' : '#DDDDDD',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              backgroundColor: '#F0F9FF',
              color: '#333333',
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

        {/* Example Ideas */}
        <div style={{
          backgroundColor: '#F0E6FF',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <div style={{
            display: 'inline-block',
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: '15px',
            backgroundColor: '#6B46C1',
            padding: '4px 12px',
            borderRadius: '20px'
          }}>
            EXAMPLES
          </div>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#333333',
            fontSize: '14px'
          }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A 6-week group coaching program that helps service-based entrepreneurs create a scalable digital product
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A SaaS tool that helps content creators repurpose their content across multiple platforms
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A membership community that provides ongoing support and resources for freelance designers
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A productized service that delivers monthly SEO audits and recommendations for e-commerce stores
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#6B46C1', marginRight: '10px', fontWeight: 'bold' }}>•</span>
              A course that teaches small business owners how to use AI tools to streamline their operations
            </li>
          </ul>
        </div>
      </div>


    </div>
  );
};
