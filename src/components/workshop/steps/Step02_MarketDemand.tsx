import React, { useState, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { Job } from '../../../types/workshop'; // Keep type import if needed elsewhere, or remove if only for JTBD
import { Lightbulb } from 'lucide-react'; // Keep icon import

export const Step02_MarketDemand: React.FC = () => {
  // Keep state logic for now, but we won't use it in the return
  const { marketDemandAnalysis: initialData, updateWorkshopData } = useWorkshopStore(
    (state) => ({ 
      marketDemandAnalysis: state.workshopData.marketDemandAnalysis,
      updateWorkshopData: state.updateWorkshopData 
    })
  );
  const [marketAnalysis, setMarketAnalysis] = useState<string>(initialData || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarketAnalysis(event.target.value);
  };

  const handleSave = () => {
    updateWorkshopData({ marketDemandAnalysis: marketAnalysis });
    console.log('Market Demand data saved for Step 2:', { marketAnalysis });
  };

  // TEMPORARY: Return a simple div for testing
  return (
    <div>
      <h1>Step 2: Market Demand (Test)</h1>
      <p>If you see this, the basic component rendering works.</p>
    </div>
  );
  
  /* Original Return (commented out for testing)
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
            value={marketAnalysis}
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
            backgroundColor: '#fffbeb', // yellow-50
            borderLeft: '4px solid #f59e0b', // yellow-400
            borderRadius: '0 8px 8px 0',
            color: '#92400e', // yellow-800
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
          onClick={handleSave}
          disabled={!marketAnalysis.trim()} // Disable if empty
        >
          Save Analysis
        </Button>
      </div>
    </div>
  );
  */
}; 