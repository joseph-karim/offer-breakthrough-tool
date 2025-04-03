import React, { useState, useCallback, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { AntiGoals } from '../../../types/workshop';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { Tooltip } from '../../ui/Tooltip';

// Define the keys for anti-goals for easier mapping
const antiGoalKeys: (keyof AntiGoals)[] = ['market', 'offer', 'delivery', 'lifestyle', 'values'];

// Helper to get placeholder text for each anti-goal
const getPlaceholder = (key: keyof AntiGoals): string => {
  switch (key) {
    case 'market': return "e.g., I don't want to serve beginners, I don't want clients who haggle on price...";
    case 'offer': return "e.g., I don't want to offer generic services, I don't want a low-ticket offer...";
    case 'delivery': return "e.g., I don't want to do 1:1 coaching calls, I don't want scope creep...";
    case 'lifestyle': return "e.g., I don't want to work weekends, I don't want to travel constantly...";
    case 'values': return "e.g., I don't want to work with unethical companies, I don't want high-pressure sales...";
    default: return "Describe what you want to avoid...";
  }
};

// Helper to get title for each anti-goal
const getTitle = (key: keyof AntiGoals): string => {
  switch (key) {
    case 'market': return "Market Anti-Goals";
    case 'offer': return "Offer Anti-Goals";
    case 'delivery': return "Delivery Anti-Goals";
    case 'lifestyle': return "Business Lifestyle Anti-Goals";
    case 'values': return "Values & Ethics Anti-Goals";
    default: return "Anti-Goal";
  }
};

// Helper to get tooltip content for each anti-goal
const getTooltip = (key: keyof AntiGoals): string => {
  switch (key) {
    case 'market': return "Define which types of customers or market segments you want to avoid.";
    case 'offer': return "Specify what kind of products or services you don't want to provide.";
    case 'delivery': return "Outline delivery methods or service aspects you want to avoid.";
    case 'lifestyle': return "Describe business practices that would negatively impact your lifestyle.";
    case 'values': return "List business practices or behaviors that conflict with your values.";
    default: return "";
  }
};

// Helper to get example anti-goals for each category
const getExamples = (key: keyof AntiGoals): string[] => {
  switch (key) {
    case 'market':
      return [
        "Don't want to serve complete beginners who need basic handholding",
        "Avoid clients who constantly haggle on price",
        "Not interested in working with companies under $1M revenue"
      ];
    case 'offer':
      return [
        "No generic, one-size-fits-all solutions",
        "Avoid low-ticket offers under $500",
        "Don't want to compete on price with cheaper alternatives"
      ];
    case 'delivery':
      return [
        "No unlimited 1:1 calls or support",
        "Avoid projects with unclear scope",
        "Don't want to travel to client sites"
      ];
    case 'lifestyle':
      return [
        "No weekend work or emergency calls",
        "Avoid businesses that require constant travel",
        "Don't want to manage a large team"
      ];
    case 'values':
      return [
        "No high-pressure sales tactics",
        "Avoid working with unethical industries",
        "Don't want to compromise on quality for profit"
      ];
    default:
      return [];
  }
};

// Separate selectors to prevent unnecessary re-renders
const selectAntiGoals = (state: WorkshopStore) => state.workshopData.antiGoals || {
  market: '', offer: '', delivery: '', lifestyle: '', values: ''
};
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;
const selectCanProceedToNextStep = (state: WorkshopStore) => state.canProceedToNextStep;

export const Step03_AntiGoals: React.FC = () => {
  const antiGoals = useWorkshopStore(selectAntiGoals);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const canProceedToNextStep = useWorkshopStore(selectCanProceedToNextStep);
  const [formData, setFormData] = useState<AntiGoals>(antiGoals);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // Update local state when store value changes
  useEffect(() => {
    setFormData(antiGoals);
  }, [antiGoals]);

  const handleInputChange = useCallback((field: keyof AntiGoals, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    setIsSaving(true);
    const timer = setTimeout(() => {
      updateWorkshopData({
        antiGoals: {
          ...antiGoals,
          [field]: value
        }
      });
      setIsSaving(false);
    }, 500);
    setSaveTimer(timer);
  }, [antiGoals, updateWorkshopData]);

  // Check if a field is empty
  const isFieldEmpty = (field: keyof AntiGoals) => showErrors && !formData[field]?.trim();

  // Get error message for a field
  const getErrorMessage = (field: keyof AntiGoals) => {
    if (isFieldEmpty(field)) {
      return 'This field is required to proceed';
    }
    return '';
  };

  // Effect to show errors when trying to proceed
  useEffect(() => {
    if (!canProceedToNextStep()) {
      setShowErrors(true);
    }
  }, [canProceedToNextStep]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={3}
        title="Define Your Anti-Goals"
        description="Clarify what you don't want in your business to make better decisions."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
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
            <AlertCircle style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#ea580c' }} />
            Define what you want to avoid in each area to make better decisions about your offer.
          </div>

          {antiGoalKeys.map((key) => (
            <div key={key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <label 
                  htmlFor={`${key}-anti-goals`}
                  style={{ 
                    display: 'block',
                    fontWeight: 600,
                    color: '#374151'
                  }}
                >
                  {getTitle(key)}:
                </label>
                <Tooltip content={getTooltip(key)}>
                  <HelpCircle size={16} style={{ color: '#6b7280', cursor: 'help' }} />
                </Tooltip>
              </div>
              <textarea
                id={`${key}-anti-goals`}
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={getPlaceholder(key)}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isFieldEmpty(key) ? '#ef4444' : '#d1d5db',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  backgroundColor: 'white',
                }}
              />
              {isFieldEmpty(key) && (
                <div style={{ 
                  color: '#ef4444',
                  fontSize: '14px',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle size={14} />
                  {getErrorMessage(key)}
                </div>
              )}
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
              }}>
                Examples: {getExamples(key).join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 