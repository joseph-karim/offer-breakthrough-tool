import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Reflections } from '../../../types/workshop';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { SaveIndicator } from '../../ui/SaveIndicator';
import { ResponsiveFloatingTooltip } from '../../ui/FloatingTooltip';

// Modified selectors to prevent creating new objects on each call
const selectReflections = (state: WorkshopStore) => state.workshopData.reflections;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

// Default values outside component to avoid recreation
const defaultReflections: Reflections = {
  keyInsights: '',
  nextSteps: ''
};

export const Step11_Summary: React.FC = () => {
  // Get values from store - use the reflections if they exist, otherwise use defaults
  const storeReflections = useWorkshopStore(selectReflections);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Only initialize state once with default values
  const [localValue, setLocalValue] = useState<Reflections>(() => {
    return storeReflections || defaultReflections;
  });

  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const savingTimerRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Only sync from store on initial mount
  useEffect(() => {
    if (!initializedRef.current && storeReflections) {
      setLocalValue(storeReflections);
      initializedRef.current = true;
    }
  }, []);

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

  const handleInputChange = useCallback((field: keyof Reflections, value: string) => {
    setLocalValue(prev => {
      const newValue = { ...prev, [field]: value };

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
        updateWorkshopData({ reflections: newValue });
        // Keep the saving indicator visible briefly
        savingTimerRef.current = window.setTimeout(() => setIsSaving(false), 500);
      }, 300);

      return newValue;
    });
  }, [updateWorkshopData]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={11}
        title="Workshop Summary & Next Steps"
        description="Review your key insights and plan your path forward."
      />

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fdf2f8',
            borderLeft: '4px solid #db2777',
            borderRadius: '0 8px 8px 0',
            color: '#9d174d',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <CheckCircle2 style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#db2777' }} />
            Congratulations on completing the workshop! Take a moment to reflect on what you've learned.
          </div>

          {/* Key Insights */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <label
                htmlFor="key-insights"
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                Key Insights:
              </label>
              <ResponsiveFloatingTooltip
                content="Summarize the most important discoveries and decisions from the workshop"
                placement="right"
                maxWidth={300}
              >
                <div style={{
                  display: 'flex',
                  cursor: 'help',
                  marginTop: '3px'
                }}>
                  <HelpCircle size={16} style={{ color: '#9ca3af' }} />
                </div>
              </ResponsiveFloatingTooltip>
            </div>
            <textarea
              id="key-insights"
              rows={5}
              value={localValue.keyInsights || ''}
              onChange={(e) => handleInputChange('keyInsights', e.target.value)}
              placeholder="What were your biggest realizations during this workshop? What key decisions did you make about your offer?"
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
          </div>

          {/* Next Steps */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <label
                htmlFor="next-steps"
                style={{
                  fontWeight: 600,
                  color: '#374151',
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                Action Plan:
              </label>
              <ResponsiveFloatingTooltip
                content="List specific actions you'll take to implement your offer"
                placement="right"
                maxWidth={300}
              >
                <div style={{
                  display: 'flex',
                  cursor: 'help',
                  marginTop: '3px'
                }}>
                  <HelpCircle size={16} style={{ color: '#9ca3af' }} />
                </div>
              </ResponsiveFloatingTooltip>
            </div>
            <textarea
              id="next-steps"
              rows={5}
              value={localValue.nextSteps || ''}
              onChange={(e) => handleInputChange('nextSteps', e.target.value)}
              placeholder="What specific actions will you take to implement your offer? List them in order of priority. Include deadlines if possible."
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
          </div>
        </div>
      </Card>

      <SaveIndicator saving={isSaving} />
    </div>
  );
};