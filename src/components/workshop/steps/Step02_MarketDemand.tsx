import React, { useCallback } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Lightbulb } from 'lucide-react';
import type { WorkshopStore } from '../../../store/workshopStore';

export const Step02_MarketDemand: React.FC = () => {
  const { marketDemandAnalysis, updateWorkshopData } = useWorkshopStore(
    (state: WorkshopStore) => ({
      marketDemandAnalysis: state.workshopData.marketDemandAnalysis || '',
      updateWorkshopData: state.updateWorkshopData
    })
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateWorkshopData({ marketDemandAnalysis: event.target.value });
  }, [updateWorkshopData]);
  
  const canSave = marketDemandAnalysis.trim() !== '';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={2}
        title="Analyze Market Demand & Existing Solutions"
        description="Understand what your target audience currently uses and their frustrations. Who are your main competitors?"
      />
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gap: '20px' }}>
          <label htmlFor="marketAnalysis" style={{ fontWeight: 600, color: '#374151' }}>
            Existing Solutions & Competitor Analysis:
          </label>
          <textarea
            id="marketAnalysis"
            rows={8}
            value={marketDemandAnalysis}
            onChange={handleInputChange}
            placeholder="Describe the solutions your target market currently uses. Who are the main players? What are their strengths and weaknesses? What frustrations do customers have?"
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
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '0 8px 8px 0',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#d97706' }} />
            Think about direct competitors (offering similar solutions) and indirect alternatives (how people solve the problem now, even if differently).
          </div>
        </div>
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={() => {}} // Remove save button since we're saving on every change
          disabled={!canSave}
        >
          Save Analysis
        </Button>
      </div>
    </div>
  );
}; 