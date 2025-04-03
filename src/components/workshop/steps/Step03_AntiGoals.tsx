import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { AntiGoals } from '../../../types/workshop';
import { Info, HelpCircle } from 'lucide-react';
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

export const Step03_AntiGoals: React.FC = () => {
  const storeValue = useWorkshopStore(selectAntiGoals);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the form
  const [localValue, setLocalValue] = useState<AntiGoals>(storeValue);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const savingTimerRef = useRef<number | null>(null);

  // Update local state when store value changes
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
      if (savingTimerRef.current !== null) {
        window.clearTimeout(savingTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((key: keyof AntiGoals, value: string) => {
    const newValue = { ...localValue, [key]: value };
    setLocalValue(newValue);
    
    // Show saving indicator
    setIsSaving(true);
    
    // Clear any existing timers
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    if (savingTimerRef.current !== null) {
      window.clearTimeout(savingTimerRef.current);
    }
    
    // Save to store after a short delay
    saveTimerRef.current = window.setTimeout(() => {
      updateWorkshopData({ antiGoals: newValue });
      // Keep the saving indicator visible briefly
      savingTimerRef.current = window.setTimeout(() => setIsSaving(false), 500);
    }, 300);
  }, [localValue, updateWorkshopData]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentKey: keyof AntiGoals) => {
    const currentIndex = antiGoalKeys.indexOf(currentKey);
    
    if (e.key === 'Tab') {
      // Let the browser handle normal tab navigation
      return;
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Move to next field if available
      if (currentIndex < antiGoalKeys.length - 1) {
        const nextKey = antiGoalKeys[currentIndex + 1];
        document.getElementById(`antiGoal-${nextKey}`)?.focus();
      }
    }
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={3}
        title="Define Your Anti-Goals"
        description="Clarify what you *don't* want to happen. Setting boundaries helps focus your offer and attract the right clients."
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#eef2ff',
            borderLeft: '4px solid #4f46e5',
            borderRadius: '0 8px 8px 0',
            color: '#3730a3',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Info style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#4f46e5' }} />
            Being clear about what you *don't* want is as important as knowing what you *do* want. It prevents future frustration.
          </div>

          {antiGoalKeys.map(key => (
            <div key={key}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '8px'
              }}>
                <label 
                  htmlFor={`antiGoal-${key}`}
                  style={{ fontWeight: 600, color: '#374151' }}
                >
                  {getTitle(key)}:
                </label>
                <Tooltip content={getTooltip(key)} position="right">
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'help' 
                  }}>
                    <HelpCircle size={16} style={{ color: '#9ca3af' }} />
                  </div>
                </Tooltip>
              </div>
              <textarea
                id={`antiGoal-${key}`}
                rows={3}
                value={localValue[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                placeholder={getPlaceholder(key)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  backgroundColor: 'white',
                }}
              />
              
              {/* Show examples when the field is empty */}
              {!localValue[key].trim() && (
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px dashed #d1d5db'
                }}>
                  <p style={{ 
                    fontSize: '14px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    marginBottom: '8px'
                  }}>
                    Example {getTitle(key).toLowerCase()}:
                  </p>
                  <ul style={{ 
                    listStyle: 'disc',
                    paddingLeft: '24px',
                    color: '#6b7280',
                    fontSize: '14px',
                    display: 'grid',
                    gap: '4px'
                  }}>
                    {getExamples(key).map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
}; 