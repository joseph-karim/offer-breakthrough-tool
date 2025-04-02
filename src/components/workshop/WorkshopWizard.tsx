import { useEffect } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';

// Import step components
import { Step01_Intro } from './steps/Step01_Intro';
import { Step02_MarketDemand } from './steps/Step02_MarketDemand';
import { Step03_AntiGoals } from './steps/Step03_AntiGoals';
import { Step04_TriggerEvents } from './steps/Step04_TriggerEvents';
import { Step05_Jobs } from './steps/Step05_Jobs';
import { Step06_Markets } from './steps/Step06_Markets';
import { Step10_Pricing } from './steps/Step10_Pricing';
import { Step11_Summary } from './steps/Step11_Summary';

export const WorkshopWizard = () => {
  const { currentStep, initializeSession, setCurrentStep } = useWorkshopStore();

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
      case 4:
        return <Step04_TriggerEvents />;
      case 5:
        return <Step05_Jobs />;
      case 6:
        return <Step06_Markets />;
      case 10:
        return <Step10_Pricing />;
      case 11:
        return <Step11_Summary />;
      default:
        return <div>Step {currentStep} is under construction</div>;
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const goToNextStep = () => {
    setCurrentStep(Math.min(11, currentStep + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Workshop Header with Progress */}
        <div className="bg-white border-b border-gray-200 mb-8 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-display font-bold text-primary">Offer Breakthrough Workshop</h1>
            <div className="mt-4 mb-2">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${(currentStep / 11) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Step {currentStep} of 11</span>
                <span>{Math.round((currentStep / 11) * 100)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Content */}
        <div className="px-4">
          {renderStep()}
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-10">
          <div className="max-w-5xl mx-auto flex justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className={`px-5 py-2 border rounded-full flex items-center ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'border-primary text-primary hover:bg-primary-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button
              onClick={goToNextStep}
              disabled={currentStep === 11}
              className={`px-5 py-2 rounded-full flex items-center ${
                currentStep === 11
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-700 text-white'
              }`}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 