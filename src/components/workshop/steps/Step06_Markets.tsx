import React, { useState, useEffect, useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import type { Market } from '../../../types/workshop';
import { Users } from 'lucide-react';

// Separate selectors to prevent unnecessary re-renders
const selectMarkets = (state: WorkshopStore) => 
  state.workshopData.markets?.map(market => market.description).join('\n') || '';
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step06_Markets: React.FC = () => {
  const storeValue = useWorkshopStore(selectMarkets);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);

  // Use local state for the textarea
  const [localValue, setLocalValue] = useState(storeValue);

  // Update local state when store value changes
  useEffect(() => {
    setLocalValue(storeValue);
  }, [storeValue]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(event.target.value);
  }, []);

  const handleSave = useCallback(() => {
    if (localValue.trim() !== '') {
      // Map strings back to Market objects
      const markets: Market[] = localValue
        .split('\n')
        .map(desc => desc.trim())
        .filter(desc => desc !== '')
        .map((description, index) => ({
          id: `user-${Date.now()}-${index}`,
          description,
          source: 'user'
        }));
      
      updateWorkshopData({ markets });
    }
  }, [localValue, updateWorkshopData]);

  const canSave = localValue.trim() !== '' && localValue !== storeValue;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={6}
        title="Define Target Markets"
        description="Who are the specific groups of people or organizations that would benefit most from your solution?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '0 8px 8px 0',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Users style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Be specific about who your ideal customers are. Consider demographics, behaviors, and pain points.
          </div>

          <label 
            htmlFor="markets"
            style={{ fontWeight: 600, color: '#374151' }}
          >
            List Target Markets (one per line):
          </label>
          <textarea
            id="markets"
            rows={8}
            value={localValue}
            onChange={handleInputChange}
            placeholder={
              "e.g., Mid-sized SaaS companies (50-200 employees)\n" +
              "Product managers at enterprise tech firms\n" +
              "E-commerce businesses doing $1M-5M annual revenue\n" +
              "Marketing agencies with 5-20 employees\n" +
              "B2B software startups in growth phase"
            }
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
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save Target Markets
        </Button>
      </div>
    </div>
  );
}; 