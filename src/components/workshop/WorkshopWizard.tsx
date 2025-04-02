import { useEffect } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Zap, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Workshop Header with Progress */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                <span className="text-primary">Offer Breakthrough</span> Workshop
              </h1>
              <div className="flex items-center bg-primary-50 px-3 py-1 rounded-full">
                <Zap className="text-primary w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Step {currentStep} of 11</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full" 
                  style={{ width: `${(currentStep / 11) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-primary mr-1" />
                  <span>{Math.round((currentStep / 11) * 100)}% Complete</span>
                </div>
                <span className="text-gray-400">11 steps total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Content */}
        <div className="px-4 mt-6">
          {renderStep()}
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-5xl mx-auto">
            {/* Floating action buttons on smaller screens */}
            <div className="md:hidden flex justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-t border-gray-200">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className={`w-20 py-2 rounded-full flex justify-center items-center ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border border-primary text-primary hover:bg-primary-50'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Prev
              </button>
              
              <button
                onClick={goToNextStep}
                disabled={currentStep === 11}
                className={`w-20 py-2 rounded-full flex justify-center items-center ${
                  currentStep === 11
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-700 text-white'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Larger bottom navigation for larger screens */}
            <div className="hidden md:block">
              <div className="flex justify-between p-6 mb-6 mx-6 bg-white rounded-xl shadow-xl border border-gray-100">
                <button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl flex items-center font-medium transition-all ${
                    currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border border-primary text-primary hover:bg-primary-50 hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Step
                </button>
                
                <div className="flex items-center px-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 mx-1 rounded-full ${i < currentStep % 5 ? 'bg-primary' : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
                
                <button
                  onClick={goToNextStep}
                  disabled={currentStep === 11}
                  className={`px-6 py-3 rounded-xl flex items-center font-medium transition-all ${
                    currentStep === 11
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-700 hover:shadow-lg text-white'
                  }`}
                >
                  {currentStep === 11 ? 'Complete Workshop' : 'Next Step'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 