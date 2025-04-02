import { useEffect } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { WorkshopLayout } from '../layout/WorkshopLayout';

// Import step components as they are created
import { Step01_Intro } from './steps/Step01_Intro';
import { Step02_MarketDemand } from './steps/Step02_MarketDemand';
import { Step03_AntiGoals } from './steps/Step03_AntiGoals';
// ... other step imports will go here

export const WorkshopWizard = () => {
  const { currentStep, initializeSession } = useWorkshopStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step01_Intro />;
      case 2:
        return <Step02_MarketDemand />;
      case 3:
        return <Step03_AntiGoals />;
      // ... other steps will go here
      default:
        return <div>Step {currentStep} is under construction</div>;
    }
  };

  return <WorkshopLayout>{renderStep()}</WorkshopLayout>;
}; 