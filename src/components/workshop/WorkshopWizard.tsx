import { useEffect } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Zap, CheckCircle, ChevronLeft, ChevronRight, Sparkles, Star, Layers, ArrowRight } from 'lucide-react';

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

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStep / 11) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-32">
      {/* Decorative pattern background */}
      <div className="absolute inset-0 opacity-10 bg-gradient-dots bg-[length:20px_20px] pointer-events-none"></div>
      
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Workshop Header with Progress */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 shadow-md">
          <div className="max-w-5xl mx-auto p-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 flex items-center">
                <div className="mr-3 bg-gradient-to-r from-primary to-secondary p-1.5 rounded-md">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-primary">Offer Breakthrough</span> 
                <span className="relative">
                  Workshop
                  <span className="absolute -top-1 -right-6">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </span>
                </span>
              </h1>
              <div className="flex items-center bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-2 rounded-full shadow-sm border border-primary-100">
                <Zap className="text-primary w-5 h-5 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Step {currentStep} of 11
                </span>
              </div>
            </div>
            <div className="mt-5">
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-3 bg-gradient-to-r from-primary via-secondary to-primary rounded-full animated-gradient"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  <span className="font-medium">{completionPercentage}% Complete</span>
                </div>
                <span className="text-gray-500 flex items-center">
                  <Layers className="w-4 h-4 mr-1" />
                  11 steps total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Content */}
        <div className="px-4 sm:px-6 mt-8">
          {renderStep()}
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-5xl mx-auto">
            {/* Floating action buttons on smaller screens */}
            <div className="md:hidden flex justify-between px-4 py-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className={`w-24 py-2.5 rounded-full flex justify-center items-center transition-all duration-300 ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border border-primary text-primary hover:bg-primary-50 hover:shadow-md'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Prev
              </button>
              
              <button
                onClick={goToNextStep}
                disabled={currentStep === 11}
                className={`w-24 py-2.5 rounded-full flex justify-center items-center transition-all duration-300 ${
                  currentStep === 11
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg shadow-md text-white'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            
            {/* Larger bottom navigation for larger screens */}
            <div className="hidden md:block">
              <div className="flex justify-between p-7 mb-6 mx-6 bg-white/95 rounded-2xl shadow-xl border border-gray-100 backdrop-blur">
                <button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3.5 rounded-xl flex items-center font-medium transition-all duration-300 ${
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
                      className={`w-2.5 h-2.5 mx-1 rounded-full transition-all duration-300 ${
                        i < currentStep % 5 || (currentStep % 5 === 0 && i === 4) 
                          ? 'bg-gradient-to-r from-primary to-secondary scale-110' 
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
                
                <button
                  onClick={goToNextStep}
                  disabled={currentStep === 11}
                  className={`px-7 py-3.5 rounded-xl flex items-center font-medium transition-all duration-300 ${
                    currentStep === 11
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl shadow-md text-white'
                  }`}
                >
                  {currentStep === 11 ? (
                    <>
                      Complete Workshop
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 