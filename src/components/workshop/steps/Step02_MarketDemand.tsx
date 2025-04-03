import React, { useState, useEffect } from 'react';
import { StepHeader } from '../../ui/StepHeader'; // Restore StepHeader import
// import { Card } from '../../ui/Card'; // Temporarily comment out Card import
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
// import type { Job } from '../../../types/workshop'; // Keep commented if Job not needed yet
// import { Lightbulb } from 'lucide-react'; // Keep commented out as Card content is removed

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

  console.log('[Step02] Rendering simplified view without Card content'); 

  // Return statement with StepHeader and Button, but NO Card
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={2}
        title="Analyze Market Demand & Existing Solutions"
        description="Understand what your target audience currently uses..."
      />
      
      <h2>Testing Card Removal</h2>
      <p>Does Step 2 render now?</p>

      {/* <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}> */}
      {/*   ... Card content commented out ... */}
      {/* </Card> */}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
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