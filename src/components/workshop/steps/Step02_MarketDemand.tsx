import React, { useState, useEffect } from 'react';
// import { StepHeader } from '../../ui/StepHeader'; // Temporarily comment out
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
// import { Lightbulb } from 'lucide-react'; // Temporarily comment out

export const Step02_MarketDemand: React.FC = () => {
  // Keep state logic for now
  const { marketDemandAnalysis: initialData, updateWorkshopData } = useWorkshopStore(
    (state) => ({ 
      marketDemandAnalysis: state.workshopData.marketDemandAnalysis,
      updateWorkshopData: state.updateWorkshopData 
    })
  );
  const [marketAnalysis, setMarketAnalysis] = useState<string>(initialData || '');

  useEffect(() => {
     if (initialData !== undefined && initialData !== marketAnalysis) {
       setMarketAnalysis(initialData);
     }
  }, [initialData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarketAnalysis(event.target.value);
  };

  const handleSave = () => {
    updateWorkshopData({ marketDemandAnalysis: marketAnalysis });
    console.log('Market Demand data saved for Step 2:', { marketAnalysis });
  };
  
  const canSave = marketAnalysis ? marketAnalysis.trim() !== '' : false;

  // Simplified return for diagnostics
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Step 2: Market Demand (Simplified Test)</h1> 
      {/* <StepHeader ... /> */} {/* Commented out */}
      
      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <p>Test Content inside Card</p>
        {/* 
        <div style={{ display: 'grid', gap: '20px' }}>
          <label htmlFor="marketAnalysis" style={{ fontWeight: 600, color: '#374151' }}>
            Existing Solutions & Competitor Analysis:
          </label>
          <textarea
            id="marketAnalysis"
            rows={8}
            value={marketAnalysis}
            onChange={handleInputChange}
            placeholder="Describe the solutions..."
            style={...}
          />
          <div style={...}>
            <Lightbulb ... />
            Think about...
          </div>
        </div>
        */}
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="primary"
          onClick={handleSave}
          disabled={!canSave} 
        >
          Save Analysis (Test)
        </Button>
      </div>
    </div>
  );
}; 