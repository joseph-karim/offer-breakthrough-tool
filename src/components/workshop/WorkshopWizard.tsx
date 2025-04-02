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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 pb-32">
      {/* Decorative pattern background */}
      <div className="absolute inset-0 opacity-10 bg-gradient-dots bg-[length:20px_20px] pointer-events-none"></div>
      
      {/* Colorful decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-80 left-0 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
      
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Workshop Header with Progress */}
        <div className="bg-white/90 backdrop-blur-md border-0 sticky top-0 z-20 shadow-lg rounded-b-2xl">
          <div className="max-w-5xl mx-auto p-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center">
                <div className="mr-3 bg-gradient-to-r from-pink-500 to-indigo-500 p-2 rounded-lg">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                Offer Breakthrough
                <span className="relative ml-2">
                  Workshop
                  <span className="absolute -top-1 -right-6">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </span>
                </span>
              </h1>
              <div className="flex items-center bg-gradient-to-r from-indigo-100 to-pink-100 px-4 py-2 rounded-full shadow-md border border-indigo-200">
                <Zap className="text-indigo-600 w-5 h-5 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Step {currentStep} of 11
                </span>
              </div>
            </div>
            <div className="mt-5">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-pink-500 mr-2" />
                  <span className="font-medium bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">{completionPercentage}% Complete</span>
                </div>
                <span className="text-indigo-600 flex items-center">
                  <Layers className="w-4 h-4 mr-1" />
                  11 steps total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Content */}
        <div className="px-4 sm:px-6 mt-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 p-6 md:p-8">
            {renderStep()}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <div className="max-w-5xl mx-auto">
            {/* Floating action buttons on smaller screens */}
            <div className="md:hidden flex justify-between px-4 py-4 bg-white/90 backdrop-blur-md border-t-0 rounded-t-2xl shadow-[0_-4px_20px_rgba(79,70,229,0.2)]">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className={`w-24 py-2.5 rounded-full flex justify-center items-center transition-all duration-300 ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:shadow-indigo-200 hover:shadow-lg'
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
                    : 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:shadow-xl shadow-lg shadow-indigo-200/50 text-white'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            
            {/* Larger bottom navigation for larger screens */}
            <div className="hidden md:block">
              <div className="flex justify-between p-7 mb-6 mx-6 bg-white/95 rounded-2xl shadow-xl border-0 backdrop-blur-lg">
                <button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3.5 rounded-xl flex items-center font-medium transition-all duration-300 ${
                    currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-200'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Step
                </button>
                
                <div className="flex items-center px-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 mx-1.5 rounded-full transition-all duration-300 ${
                        i < currentStep % 5 || (currentStep % 5 === 0 && i === 4) 
                          ? 'bg-gradient-to-r from-indigo-500 to-pink-500 scale-110' 
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
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl shadow-xl shadow-indigo-300/40 text-white'
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