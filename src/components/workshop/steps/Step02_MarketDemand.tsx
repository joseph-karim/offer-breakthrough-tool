import React, { useState, useEffect } from 'react';
// import { StepHeader } from '../../ui/StepHeader'; // StepHeader still commented out
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
// import type { Job } from '../../../types/workshop'; // Keep commented if Job not needed yet
import { Lightbulb } from 'lucide-react';

export const Step02_MarketDemand: React.FC = () => {
  // Restore state logic and handlers
  const { marketDemandAnalysis: initialData, updateWorkshopData } = useWorkshopStore(
    (state) => ({ 
      marketDemandAnalysis: state.workshopData.marketDemandAnalysis,
      updateWorkshopData: state.updateWorkshopData 
    })
  );
  
  // *** ADDING LOG HERE ***
  console.log('[Step02] Initial Market Demand Data:', initialData);

  const [marketAnalysis, setMarketAnalysis] = useState<string>(initialData || '');

  // Keep state updated if store changes (e.g., loading session)
  useEffect(() => {
     console.log('[Step02] useEffect - initialData changed:', initialData);
     if (initialData !== undefined && initialData !== marketAnalysis) {
       setMarketAnalysis(initialData);
     }
  }, [initialData]); // Dependency on initialData from store

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarketAnalysis(event.target.value);
  };

  const handleSave = () => {
    updateWorkshopData({ marketDemandAnalysis: marketAnalysis });
    console.log('Market Demand data saved for Step 2:', { marketAnalysis });
  };
  
  const canSave = marketAnalysis ? marketAnalysis.trim() !== '' : false;

  console.log('[Step02] Rendering simplified view without StepHeader'); 

  // Restore return statement with Card/Button but NO StepHeader
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* <StepHeader ... /> */} {/* Still Commented out */}
      <h1>Step 2: Market Demand (No Header Test)</h1>

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
            placeholder="Describe the solutions your target market currently uses..."
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
            Think about direct competitors...
          </div>
        </div>
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!canSave} 
        >
          Save Analysis
        </Button>
      </div>
    </div>
  );
}; 