import { useEffect, CSSProperties, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useWorkshopStore } from '../../store/workshopStore';
import { useAuth } from '../../contexts/AuthContext';
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
import { Step10_PlanNextSteps } from './steps/Step10_PlanNextSteps';
import { Button } from '../ui/Button'; // Corrected path: ../ui/Button


export const WorkshopWizard = () => {
  const { stepNumber } = useParams<{ stepNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    loadSession,
    sessionId,
    setCurrentStep,
    setValidationErrors,
  } = useWorkshopStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert URL parameter to number
  const currentStep = parseInt(stepNumber || '1', 10);

  // Update the store when URL changes
  useEffect(() => {
    if (isInitialized && currentStep) {
      setCurrentStep(currentStep);
    }
  }, [currentStep, isInitialized, setCurrentStep]);

  // Check for session ID in URL query params and load session
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    let mounted = true;
    setIsLoading(true);

    const init = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const sessionIdParam = queryParams.get('session');

        if (sessionIdParam) {
          // Load existing session
          console.log('Loading existing session from URL param:', sessionIdParam);
          try {
            await loadSession(sessionIdParam);
            if (mounted) {
              setIsInitialized(true);
              setIsLoading(false);
            }
          } catch (loadError) {
            console.error('Failed to load session, redirecting to dashboard:', loadError);
            if (mounted) {
              setIsLoading(false);
              // Show an error message to the user
              alert('Could not load the requested workshop session. You will be redirected to the dashboard.');
              navigate('/dashboard');
            }
            return;
          }
        } else if (!sessionId) {
          // If we're on a step page but don't have a session, redirect to dashboard
          console.log('No session ID in URL and no active session, redirecting to dashboard');
          if (mounted) {
            setIsLoading(false);
            navigate('/dashboard');
          }
          return;
        } else {
          // We already have a session loaded in the store
          if (mounted) {
            setIsInitialized(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        if (mounted) {
          setIsLoading(false);
          // If there's an error, redirect to dashboard
          navigate('/dashboard');
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [user, location, loadSession, sessionId, navigate]);

  const goToPreviousStep = useCallback(() => {
    setValidationErrors(false); // Reset validation errors when going back

    // If we're on step 1, go back to intro page
    if (currentStep === 1) {
      setCurrentStep(0); // Set to intro page (step 0)
      navigate('/intro');
      return;
    }

    // Otherwise go to previous step
    const prevStep = Math.max(1, currentStep - 1);
    navigate(`/step/${prevStep}`);
  }, [currentStep, navigate, setCurrentStep, setValidationErrors]);

  const goToNextStep = useCallback(() => {
    setValidationErrors(false); // Reset validation errors when successfully moving forward
    const nextStep = Math.min(10, currentStep + 1);
    navigate(`/step/${nextStep}`);
  }, [currentStep, navigate, setValidationErrors]);

  // Don't render anything until initialization is complete
  if (!isInitialized || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        backgroundImage: 'none',
      }}>
        <div style={{
          fontSize: '20px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 24px',
          borderRadius: '12px',
          backgroundColor: '#222222',
          border: '1px solid #333333',
          borderLeft: '3px solid #fcf720', // Brand Yellow
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          <Sparkles style={{ color: '#fcf720' }} />
          ✨ Loading your workshop... ✨
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
        return <Step10_PlanNextSteps key="step10" />;
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

            {/* Show navigation buttons for all steps */}
            <div style={inlineNavStyle}>
              <Button
                onClick={goToPreviousStep}
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
                }}
              >
                {currentStep === 1 ? 'Back to Intro' : 'Back'}
              </Button>

              <Button
                onClick={goToNextStep}
                disabled={currentStep === 10}
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
                  opacity: currentStep === 10 ? 0.6 : 1,
                  cursor: currentStep === 10 ? 'not-allowed' : 'pointer'
                }}
              >
                {currentStep === 10 ? 'Complete Workshop' : 'Next Step'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};