import { useEffect, CSSProperties, useState, useCallback } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Zap, CheckCircle, ChevronLeft, Sparkles, Layers, ArrowRight } from 'lucide-react';

// Import step components
import { Step01_Intro } from './steps/Step01_Intro';
import { Step02_BigIdea } from './steps/Step02_BigIdea';
import { Step03_UnderlyingGoal } from './steps/Step03_UnderlyingGoal';
import { Step04_TriggerEvents } from './steps/Step04_TriggerEvents';
import { Step05_Jobs } from './steps/Step05_Jobs';
import { Step06_TargetBuyers } from './steps/Step06_TargetBuyers';
import { Step07_Painstorming } from './steps/Step07_Painstorming';
import { Step08_ProblemUp } from './steps/Step08_ProblemUp';
import { Step09_RefineIdea } from './steps/Step09_RefineIdea';
import { Step10_Summary } from './steps/Step10_Summary';
import { Button } from '../ui/Button'; // Corrected path: ../ui/Button
import { WorkshopChatWrapper } from './chat/WorkshopChatWrapper';


export const WorkshopWizard = () => {
  const {
    currentStep,
    initializeSession,
    setCurrentStep,
    setValidationErrors,
  } = useWorkshopStore();
  const [isInitialized, setIsInitialized] = useState(false);

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
    setCurrentStep(Math.max(1, currentStep - 1));
  }, [currentStep, setCurrentStep, setValidationErrors]);

  const goToNextStep = useCallback(() => {
    setValidationErrors(false); // Reset validation errors when successfully moving forward
    setCurrentStep(Math.min(10, currentStep + 1));
  }, [currentStep, setCurrentStep, setValidationErrors]);

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
          borderLeft: '3px solid #FFDD00',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <Sparkles style={{ color: '#FFDD00' }} />
          ✨ Initializing workshop... ✨
        </div>
      </div>
    );
  }

  // Memoize step rendering to prevent unnecessary re-renders
  const currentStepComponent = (() => {
    switch (currentStep) {
      case 1:
        return <Step01_Intro key="step1" />;
      case 2:
        return <Step02_BigIdea key="step2" />;
      case 3:
        return <Step03_UnderlyingGoal key="step3" />;
      case 4:
        return <Step04_TriggerEvents key="step4" />;
      case 5:
        return <Step05_Jobs key="step5" />;
      case 6:
        return <Step06_TargetBuyers key="step6" />;
      case 7:
        return <Step07_Painstorming key="step7" />;
      case 8:
        return <Step08_ProblemUp key="step8" />;
      case 9:
        return <Step09_RefineIdea key="step9" />;
      case 10:
        return <Step10_Summary key="step10" />;
      default:
        return <div key={`step${currentStep}`}>Step {currentStep} is under construction</div>;
    }
  })();

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStep / 10) * 100);

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

  const headerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10, // Lower z-index to avoid conflicts with modals
    backgroundColor: '#1E1E1E', // Dark background to match the body
    color: '#FFFFFF', // White text
    borderBottom: 'none',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '16px 24px',
    marginBottom: '32px',
  };

  const headerContentStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const logoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 800,
    fontSize: '28px',
    color: '#FFFFFF', // White text on purple header
    textShadow: 'none',
    fontFamily: '"Mada", sans-serif',
  };

  const logoIconContainerStyle: CSSProperties = {
    marginRight: '16px',
    borderRadius: '0',
    backgroundColor: '#FFDD00',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none',
    border: 'none',
  };

  const stepIndicatorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFDD00',
    padding: '8px 16px',
    borderRadius: '0',
    fontSize: '14px',
    fontWeight: 700,
    color: '#222222',
    boxShadow: 'none',
    border: 'none',
  };

  const progressContainerStyle: CSSProperties = {
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '0',
    overflow: 'hidden',
    boxShadow: 'none',
    border: 'none',
  };

  const progressBarStyle: CSSProperties = {
    height: '100%',
    backgroundColor: '#FFDD00',
    borderRadius: '0',
    transition: 'width 0.5s ease',
    width: `${completionPercentage}%`,
    boxShadow: 'none',
    border: 'none',
  };

  const progressStatsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginTop: '8px',
  };

  const progressTextStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    color: '#FFFFFF', // White text for readability
    textShadow: 'none',
  };

  const stepCountStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: '#FFFFFF', // White text for readability
    fontWeight: 600,
    textShadow: 'none',
  };

  // Content container styles
  const contentContainerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 5, // Lower z-index to avoid conflicts with modals
    display: 'flex',
    gap: '24px',
  };

  // Chat container styles
  const chatContainerStyle: CSSProperties = {
    width: '350px', // Reverted to original width
    flexShrink: 0,
    position: 'sticky',
    top: '100px',
    alignSelf: 'flex-start',
    height: 'calc(100vh - 120px)', // Set fixed height to make it taller
    maxHeight: 'calc(100vh - 120px)',
    display: currentStep >= 2 ? 'block' : 'none',
  };

  const contentCardStyle: CSSProperties = {
    backgroundColor: '#222222',
    borderRadius: '0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '1px solid #333333',
    borderLeft: '3px solid #FFDD00', // Yellow accent border
    padding: '0',
    marginBottom: '0',
    color: '#FFFFFF', // White text on dark background
    flexGrow: 1, // Take up remaining space
  };

  // Navigation styles INLINE with content
  const inlineNavStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    marginTop: '0', // Add space between content and nav
    borderTop: '1px solid #333333', // Dark gray border
    backgroundColor: '#222222', // Dark background
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
          color: '#FFFFFF'
        }}>
        {/* Background decoration - removed for cleaner look */}

        {/* Decorative blobs - removed completely for cleaner look */}
        {/* {decorativeBlobs.map((style, index) => (
          <div key={index} style={{...style, opacity: 0.1}}></div>
        ))} */}

        {/* Header with progress */}
        <header className="customercamp-theme-header" style={{
          ...headerStyle,
          backgroundColor: '#1E1E1E',
          background: '#1E1E1E',
          backgroundImage: 'none !important'
        }}>
          <div style={headerContentStyle}>
            <div style={logoContainerStyle}>
              <h1 style={logoStyle}>
                <span style={logoIconContainerStyle}>
                  <Sparkles style={{ width: '24px', height: '24px', color: '#222222' }} />
                </span>
                Buyer Breakthrough
                <span style={{
                  position: 'relative',
                  marginLeft: '8px',
                  fontSize: '20px',
                  opacity: 1
                }}>
                  Workshop
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-20px'
                  }}>
                    <img
                      src="/src/assets/Group 157.png"
                      alt="Bomb icon"
                      style={{
                        width: '18px',
                        height: '18px'
                      }}
                    />
                  </span>
                </span>
              </h1>

              <div style={stepIndicatorStyle}>
                <Zap style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '8px',
                  color: '#222222'
                }} />
                Step {currentStep} of 10
              </div>
            </div>

            <div>
              <div style={progressContainerStyle}>
                <div style={progressBarStyle}></div>
              </div>

              <div style={progressStatsStyle}>
                <div style={progressTextStyle}>
                  <CheckCircle style={{
                    width: '18px',
                    height: '18px',
                    marginRight: '8px',
                    color: '#FFDD00'
                  }} />
                  {completionPercentage}% Complete
                </div>

                <div style={stepCountStyle}>
                  <Layers style={{
                    width: '18px',
                    height: '18px',
                    marginRight: '6px',
                    color: '#FFDD00'
                  }} />
                  10 steps total
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={contentContainerStyle}>
          {/* Persistent Chat Interface - only show from step 2 onwards */}
          <div style={chatContainerStyle}>
            <WorkshopChatWrapper />
          </div>

          <div style={contentCardStyle}>
            <div className="workbook-content">
              {currentStepComponent}
            </div>

            {/* Inline Navigation Buttons */}
            <div style={inlineNavStyle}>
              <Button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                variant={currentStep === 1 ? 'default' : 'outline'}
                size="lg"
                leftIcon={<ChevronLeft style={{ width: '20px', height: '20px', color: currentStep === 1 ? '#666666' : '#FFDD00'}} />}
                style={currentStep === 1 ? {cursor: 'not-allowed', opacity: 0.6} : {}}
              >
                Previous Step
              </Button>

              <Button
                onClick={goToNextStep}
                disabled={currentStep === 10}
                variant={currentStep === 10 ? 'default' : 'yellow'}
                size="lg"
                rightIcon={currentStep === 10 ? <CheckCircle style={{ width: '20px', height: '20px', color: '#222222'}} /> : <ArrowRight style={{ width: '20px', height: '20px', color: '#222222'}} />}
                style={currentStep === 10 ? {cursor: 'not-allowed', opacity: 0.6} : {}}
              >
                {currentStep === 10 ? 'Complete Workshop ✅' : 'Next Step ⚡'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
