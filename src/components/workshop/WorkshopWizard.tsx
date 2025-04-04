import { useEffect, CSSProperties, useState, useCallback } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Zap, CheckCircle, ChevronLeft, Sparkles, Star, Layers, ArrowRight } from 'lucide-react';

// Import step components
import { Step01_Intro } from './steps/Step01_Intro';
import { Step02_MarketDemand } from './steps/Step02_MarketDemand';
import { Step03_AntiGoals } from './steps/Step03_AntiGoals';
import { Step04_TriggerEvents } from './steps/Step04_TriggerEvents';
import { Step05_Jobs } from './steps/Step05_Jobs';
import { Step06_Markets } from './steps/Step06_Markets';
import { Step07_Problems } from './steps/Step07_Problems';
import { Step08_MarketEvaluation } from './steps/Step08_MarketEvaluation';
import { Step09_ValueProposition } from './steps/Step09_ValueProposition';
import { Step10_Pricing } from './steps/Step10_Pricing';
import { Step11_Summary } from './steps/Step11_Summary';
import { Button } from '../ui/Button'; // Corrected path: ../ui/Button

export const WorkshopWizard = () => {
  const { 
    currentStep, 
    initializeSession, 
    setCurrentStep, 
    canProceedToNextStep,
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
    const canProceed = canProceedToNextStep();
    if (!canProceed) {
      setValidationErrors(true);
      return;
    }
    setValidationErrors(false); // Reset validation errors when successfully moving forward
    setCurrentStep(Math.min(11, currentStep + 1));
  }, [currentStep, setCurrentStep, canProceedToNextStep, setValidationErrors]);

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
        return <Step02_MarketDemand key="step2" />;
      case 3:
        return <Step03_AntiGoals key="step3" />;
      case 4:
        return <Step04_TriggerEvents key="step4" />;
      case 5:
        return <Step05_Jobs key="step5" />;
      case 6:
        return <Step06_Markets key="step6" />;
      case 7:
        return <Step07_Problems key="step7" />;
      case 8:
        return <Step08_MarketEvaluation key="step8" />;
      case 9:
        return <Step09_ValueProposition key="step9" />;
      case 10:
        return <Step10_Pricing key="step10" />;
      case 11:
        return <Step11_Summary key="step11" />;
      default:
        return <div key={`step${currentStep}`}>Step {currentStep} is under construction</div>;
    }
  })();

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStep / 11) * 100);

  // Base styles for the whole app
  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF', // White background
    backgroundImage: 'none',
    backgroundRepeat: 'repeat',
    paddingBottom: '64px',
    position: 'relative',
    color: '#222222', // Black text for light background
  };

  const decorationStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23FFDD00\' stroke-width=\'2\'%3E%3Cpath d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/%3E%3C/svg%3E")',
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat',
    pointerEvents: 'none',
  };

  const decorativeBlobs: CSSProperties[] = [
    {
      position: 'absolute',
      top: '80px',
      right: '10%',
      width: '350px',
      height: '350px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255, 221, 0, 0.05) 0%, rgba(255, 221, 0, 0) 70%)',
      filter: 'blur(40px)',
      zIndex: 0,
      animation: 'float 10s ease-in-out infinite',
    },
    {
      position: 'absolute',
      top: '30%',
      left: '5%',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255, 221, 0, 0.05) 0%, rgba(255, 221, 0, 0) 70%)',
      filter: 'blur(40px)',
      zIndex: 0,
      animation: 'float 12s ease-in-out infinite reverse',
    },
    {
      position: 'absolute',
      bottom: '10%',
      right: '20%',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(107, 70, 193, 0.05) 0%, rgba(107, 70, 193, 0) 70%)',
      filter: 'blur(40px)',
      zIndex: 0,
      animation: 'float 8s ease-in-out infinite',
    },
  ];

  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    backgroundColor: '#FFFFFF', // White background
    color: '#222222', // Black text
    borderBottom: '1px solid #EEEEEE',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
    color: '#222222', // Black text on yellow header
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.2)',
    fontFamily: '"Poppins", sans-serif',
  };

  const logoIconContainerStyle: CSSProperties = {
    marginRight: '16px',
    borderRadius: '50%',
    backgroundColor: '#FFDD00',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    border: 'none',
  };

  const stepIndicatorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFDD00',
    padding: '8px 16px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#222222',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    border: 'none',
  };

  const progressContainerStyle: CSSProperties = {
    height: '12px',
    backgroundColor: '#F5F5F5',
    borderRadius: '9999px',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #EEEEEE',
  };

  const progressBarStyle: CSSProperties = {
    height: '100%',
    backgroundColor: '#FFDD00',
    borderRadius: '9999px',
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
    color: '#222222', // Black text for readability
    textShadow: 'none',
  };

  const stepCountStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: '#222222', // Black text for readability
    fontWeight: 600,
    textShadow: 'none',
  };

  // Content container styles
  const contentContainerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    position: 'relative',
    zIndex: 10,
  };

  const contentCardStyle: CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #EEEEEE',
    borderLeft: '3px solid #FFDD00', // Yellow accent border
    padding: '32px',
    marginBottom: '0',
    color: '#222222', // Black text on white background
  };

  // Navigation styles INLINE with content
  const inlineNavStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 0',
    marginTop: '24px', // Add space between content and nav
    borderTop: '1px solid #EEEEEE', // Light gray border
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
      <div style={containerStyle}>
        {/* Background decoration */}
        <div style={decorationStyle}></div>
        
        {/* Decorative blobs */}
        {decorativeBlobs.map((style, index) => (
          <div key={index} style={style}></div>
        ))}

        {/* Header with progress */}
        <header style={headerStyle}>
          <div style={headerContentStyle}>
            <div style={logoContainerStyle}>
              <h1 style={logoStyle}>
                <span style={logoIconContainerStyle}>
                  <Sparkles style={{ width: '24px', height: '24px', color: '#222222' }} />
                </span>
                Offer Breakthrough
                <span style={{ 
                  position: 'relative', 
                  marginLeft: '8px',
                  fontSize: '20px',
                  opacity: 0.9
                }}>
                  Workshop
                  <span style={{ 
                    position: 'absolute', 
                    top: '-8px', 
                    right: '-20px' 
                  }}>
                    <Star style={{ 
                      width: '18px', 
                      height: '18px', 
                      color: '#FFDD00',
                      fill: '#FFDD00' 
                    }} />
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
                ⚡ Step {currentStep} of 11
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
                  11 steps total
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={contentContainerStyle}>
          <div style={contentCardStyle}>
            {currentStepComponent}
            
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
                ⬅️ Previous Step
              </Button>
              
              <Button
                onClick={goToNextStep}
                disabled={currentStep === 11}
                variant={currentStep === 11 ? 'default' : 'yellowToBlack'}
                size="lg"
                rightIcon={currentStep === 11 ? <CheckCircle style={{ width: '20px', height: '20px', color: '#FFDD00'}} /> : <ArrowRight style={{ width: '20px', height: '20px'}} />}
                style={currentStep === 11 ? {cursor: 'not-allowed', opacity: 0.6} : {}}
              >
                {currentStep === 11 ? '✅ Complete Workshop' : '⚡ Next Step'}
              </Button>
            </div>
          </div>
        </main>

        {/* Removed Fixed Navigation */}
      </div>
    </>
  );
};
