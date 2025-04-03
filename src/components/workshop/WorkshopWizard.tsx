import { useEffect, CSSProperties, useState } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Zap, CheckCircle, ChevronLeft, Sparkles, Star, Layers, ArrowRight } from 'lucide-react';

// Import step components
import { Step01_Intro } from './steps/Step01_Intro';
import { Step02_MarketDemand } from './steps/Step02_MarketDemand';
import { Step03_AntiGoals } from './steps/Step03_AntiGoals';
import { Step04_TriggerEvents } from './steps/Step04_TriggerEvents';
import { Step05_Jobs } from './steps/Step05_Jobs';
import { Step06_Markets } from './steps/Step06_Markets';
import { Step10_Pricing } from './steps/Step10_Pricing';
import { Step11_Summary } from './steps/Step11_Summary';
import { Button } from '../ui/Button'; // Corrected path: ../ui/Button

export const WorkshopWizard = () => {
  const { currentStep, initializeSession, setCurrentStep } = useWorkshopStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeSession();
      setIsInitialized(true);
    };
    init();
  }, [initializeSession]);

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf2f8 100%)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Sparkles />
          Initializing workshop...
        </div>
      </div>
    );
  }

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

  // Theme colors for SaaS style
  const colors = {
    primary: '#4f46e5', // Indigo
    primaryHover: '#4338ca',
    secondary: '#a855f7', // Purple
    accent: '#ec4899', // Pink
    success: '#10b981', // Emerald
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.7)',
    text: '#111827',
    textMuted: '#6b7280',
  };

  // Base styles for the whole app
  const containerStyle: CSSProperties = {
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf2f8 100%)',
    paddingBottom: '64px', // Reduced padding bottom
    position: 'relative',
  };

  // Decoration styles
  const decorationStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
  };

  // Create ambient decorative elements
  const decorativeBlobs: CSSProperties[] = [
    {
      position: 'absolute',
      top: '80px',
      right: '10%',
      width: '350px',
      height: '350px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0) 70%)',
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
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(79, 70, 229, 0) 70%)',
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
      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)',
      filter: 'blur(40px)',
      zIndex: 0,
      animation: 'float 8s ease-in-out infinite',
    },
  ];

  // Header styles with glassmorphism
  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
    fontSize: '24px',
    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const logoIconContainerStyle: CSSProperties = {
    marginRight: '12px',
    borderRadius: '8px',
    backgroundImage: `linear-gradient(to right, ${colors.accent}, ${colors.primary})`,
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const stepIndicatorStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    backgroundImage: 'linear-gradient(to right, #eef2ff, #fdf2f8)',
    padding: '8px 16px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 600,
    color: colors.primary,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
  };

  const progressContainerStyle: CSSProperties = {
    height: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '9999px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  };

  const progressBarStyle: CSSProperties = {
    height: '100%',
    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
    borderRadius: '9999px',
    transition: 'width 0.5s ease',
    width: `${completionPercentage}%`,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
    fontWeight: 500,
    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };

  const stepCountStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: colors.primary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    padding: '32px',
    marginBottom: '0', // Removed margin bottom
  };

  // Navigation styles INLINE with content
  const inlineNavStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 0',
    marginTop: '24px', // Add space between content and nav
    borderTop: '1px solid #e5e7eb', // Add a subtle separator
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
                  <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
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
                      width: '16px', 
                      height: '16px', 
                      color: '#f59e0b',
                      fill: '#f59e0b' 
                    }} />
                  </span>
                </span>
              </h1>
              
              <div style={stepIndicatorStyle}>
                <Zap style={{ 
                  width: '18px', 
                  height: '18px', 
                  marginRight: '8px',
                  color: colors.primary
                }} />
                Step {currentStep} of 11
              </div>
            </div>
            
            <div>
              <div style={progressContainerStyle}>
                <div style={progressBarStyle}></div>
              </div>
              
              <div style={progressStatsStyle}>
                <div style={progressTextStyle}>
                  <CheckCircle style={{ 
                    width: '16px', 
                    height: '16px', 
                    marginRight: '8px',
                    color: colors.accent
                  }} />
                  {completionPercentage}% Complete
                </div>
                
                <div style={stepCountStyle}>
                  <Layers style={{ 
                    width: '16px', 
                    height: '16px', 
                    marginRight: '4px',
                    color: colors.primary
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
            {renderStep()}
            
            {/* Inline Navigation Buttons */}
            <div style={inlineNavStyle}>
              <Button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                variant={currentStep === 1 ? 'default' : 'outline'}
                size="lg"
                leftIcon={<ChevronLeft style={{ width: '20px', height: '20px'}} />}
                style={currentStep === 1 ? {cursor: 'not-allowed', opacity: 0.6} : {}}
              >
                Previous Step
              </Button>
              
              <Button
                onClick={goToNextStep}
                disabled={currentStep === 11}
                variant={currentStep === 11 ? 'default' : 'gradient'}
                size="lg"
                rightIcon={currentStep === 11 ? <CheckCircle style={{ width: '20px', height: '20px'}} /> : <ArrowRight style={{ width: '20px', height: '20px'}} />}
                style={currentStep === 11 ? {cursor: 'not-allowed', opacity: 0.6} : {}}
              >
                {currentStep === 11 ? 'Complete Workshop' : 'Next Step'}
              </Button>
            </div>
          </div>
        </main>

        {/* Removed Fixed Navigation */}
      </div>
    </>
  );
};