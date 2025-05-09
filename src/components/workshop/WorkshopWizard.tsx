import { useEffect, CSSProperties, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkshopStore } from '../../store/workshopStore';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Import step components
import { Step01_BigIdea } from './steps/Step01_BigIdea';
import { Step02_UnderlyingGoal } from './steps/Step02_UnderlyingGoal';
import { Step03_TriggerEvents } from './steps/Step03_TriggerEvents';
import { Step04_Jobs } from './steps/Step04_Jobs';
import { Step05_TargetBuyers } from './steps/Step05_TargetBuyers';
import { Step06_Painstorming } from './steps/Step06_Painstorming';
import { Step07_ProblemUp } from './steps/Step07_ProblemUp';
import { Step08_TargetMarket } from './steps/Step08_TargetMarket';
import { Step09_RefineIdea } from './steps/Step09_RefineIdea';
import { Step10_Summary } from './steps/Step10_Summary';
import { Button } from '../ui/Button'; // Corrected path: ../ui/Button


export const WorkshopWizard = () => {
  const { stepNumber } = useParams<{ stepNumber: string }>();
  const navigate = useNavigate();
  const {
    initializeSession,
    setCurrentStep,
    setValidationErrors,
  } = useWorkshopStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Convert URL parameter to number
  const currentStep = parseInt(stepNumber || '1', 10);

  // Update the store when URL changes
  useEffect(() => {
    if (isInitialized && currentStep) {
      setCurrentStep(currentStep);
    }
  }, [currentStep, isInitialized, setCurrentStep]);

  // Run initialization only once when component mounts
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeSession();
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [initializeSession]); // Add initializeSession as a dependency

  const goToPreviousStep = useCallback(() => {
    setValidationErrors(false); // Reset validation errors when going back
    const prevStep = Math.max(1, currentStep - 1);
    navigate(`/step/${prevStep}`);
  }, [currentStep, navigate, setValidationErrors]);

  const goToNextStep = useCallback(() => {
    setValidationErrors(false); // Reset validation errors when successfully moving forward
    const nextStep = Math.min(12, currentStep + 1);
    navigate(`/step/${nextStep}`);
  }, [currentStep, navigate, setValidationErrors]);

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        backgroundImage: 'none',
      }}>
        <div style={{
          fontSize: '20px',
          color: '#222222',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 24px',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EEEEEE',
          borderLeft: '3px solid #fcf720', // Updated to brand Yellow
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <Sparkles style={{ color: '#fcf720' }} /> {/* Updated to brand Yellow */}
          ✨ Initializing workshop... ✨
        </div>
      </div>
    );
  }

  // Memoize step rendering to prevent unnecessary re-renders
  const currentStepComponent = (() => {
    switch (currentStep) {
      case 1:
        return <Step01_BigIdea key="step1" />;
      case 2:
        return <Step02_UnderlyingGoal key="step2" />;
      case 3:
        return <Step03_TriggerEvents key="step3" />;
      case 4:
        return <Step04_Jobs key="step4" />;
      case 5:
        return <Step05_TargetBuyers key="step5" />;
      case 6:
        return <Step06_Painstorming key="step6" />;
      case 7:
        return <Step07_ProblemUp key="step7" />;
      case 8:
        return <Step08_TargetMarket key="step8" />;
      case 9:
        return <Step09_RefineIdea key="step9" />;
      case 10:
        return <Step10_Summary key="step10" />;
      default:
        return <div key={`step${currentStep}`}>Step {currentStep} is under construction</div>;
    }
  })();

  // Base styles for the whole app
  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1E1E1E', // Dark background
    backgroundImage: 'none',
    backgroundRepeat: 'repeat',
    paddingBottom: '64px',
    position: 'relative',
    color: '#FFFFFF', // White text for dark background
  };

  // Content container styles
  const contentContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    padding: '0',
  };

  // Chat container styles are no longer needed here as they're handled in WorkshopLayout

  const contentCardStyle: CSSProperties = {
    backgroundColor: '#222222',
    border: '1px solid #333333',
    padding: '0',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'auto',
  };

  // Navigation styles INLINE with content
  const inlineNavStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    marginTop: '0', // Add space between content and nav
    backgroundColor: '#1E1E1E', // Match the dark background of the page
    color: '#FFFFFF', // White text
  };

  // Create animations
  const animationStyles = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 0.7; }
      100% { opacity: 0.4; }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className="bg-black customercamp-theme-container"
        style={{
          ...containerStyle,
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none !important',
          background: '#1E1E1E !important',
          backgroundSize: '0 !important',
          backgroundRepeat: 'no-repeat !important',
          backgroundPosition: 'center !important',
          color: '#FFFFFF',
          width: '100%',
          maxWidth: '100%'
        }}>

        {/* Main content */}
        <main style={contentContainerStyle}>
          <div style={contentCardStyle}>
            <div className="workbook-content" style={{
              padding: '24px',
              flexGrow: 1,
              overflow: 'auto',
              minHeight: '300px'
            }}>
              {currentStepComponent}
            </div>

            {/* Show navigation buttons only if not on intro page */}
            {currentStep > 1 && (
              <div style={inlineNavStyle}>
                <Button
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  size="lg"
                  leftIcon={<ChevronLeft style={{ width: '20px', height: '20px' }} />}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    color: '#fcf720', // Updated to brand Yellow
                    border: '2px solid #fcf720', // Updated to brand Yellow
                    borderRadius: '8px',
                    padding: '10px 20px',
                    opacity: currentStep === 1 ? 0.6 : 1,
                    cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Back
                </Button>

                <Button
                  onClick={goToNextStep}
                  disabled={currentStep === 12}
                  variant="yellow"
                  size="lg"
                  rightIcon={<ChevronRight style={{ width: '20px', height: '20px', color: '#222222' }} />}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fcf720', // Updated to brand Yellow
                    color: 'black',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    opacity: currentStep === 12 ? 0.6 : 1,
                    cursor: currentStep === 12 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {currentStep === 12 ? 'Complete Workshop' : 'Next Step'}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};