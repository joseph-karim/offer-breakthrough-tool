import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep, initializeSession, loadSession } = useWorkshopStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Check for session ID in URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session');

    if (sessionId) {
      setLoading(true);
      loadSession(sessionId)
        .then(() => {
          setLoading(false);
          console.log('Successfully loaded session in Intro page:', sessionId);
        })
        .catch((error) => {
          console.error('Error loading session in Intro page:', error);
          setLoading(false);
          // Show an error message to the user
          alert('Could not load the requested workshop session. You will be redirected to the dashboard.');
          navigate('/dashboard');
        });
    }
    // Removed the automatic session initialization to prevent duplicate sessions
  }, [location.search, navigate]);

  const handleStartWorkshop = async () => {
    if (!user) {
      // Redirect to login with a return URL to step 1
      // We'll create the session after login
      navigate('/register', { state: { from: { pathname: '/step/1' } } });
      return;
    }

    setLoading(true);
    try {
      // Check if we already have a session ID from URL
      const queryParams = new URLSearchParams(location.search);
      const sessionIdParam = queryParams.get('session');

      // If we don't have a session ID from URL or in the store, create a new one
      if (!sessionIdParam && !useWorkshopStore.getState().sessionId) {
        console.log('Creating new session for workshop start');
        await initializeSession();
      }

      // Get the current session ID (either existing or newly created)
      const currentSessionId = useWorkshopStore.getState().sessionId;

      if (currentSessionId) {
        setCurrentStep(1); // Set to step 1 (first actual step)
        navigate(`/step/1?session=${currentSessionId}`);
      } else {
        console.error('No session ID available after initialization');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error starting workshop:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workbook-container" style={{ backgroundColor: '#1E1E1E', color: 'white', padding: '20px' }} data-sb-object-id="content/workshop/steps/intro.md">
      {/* Main content grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Logo at the top */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '15px',
          marginTop: '5px',
        }}>
          <img
            src="/assets/Buyer Breakthrough Logo.png"
            alt="Buyer Breakthrough Logo"
            style={{
              maxWidth: '280px',
              height: 'auto',
            }}
          />
        </div>

        {/* Main content section */}
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          alignItems: 'center',
        }}>
          {/* Left column - Katelyn Image */}
          <div style={{
            width: '45%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/assets/katelyn graphic.png"
              alt="Katelyn with graphics"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>

          {/* Right column - From Burnout to Breakthrough */}
          <div style={{
            width: '55%',
            padding: '20px',
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }} data-sb-field-path="title">
              From Burnout to Breakthrough
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'white',
              lineHeight: '1.6'
            }} data-sb-field-path="description">
              Find profitable problems worth solving and design a scalable offer idea that "actually" sells in this live 2.5-hour workshop
            </p>
          </div>
        </div>

        {/* What you'll achieve + How it works section */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
        }}>
          {/* What you'll achieve */}
          <div style={{
            width: '50%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            color: 'black',
          }}>
            <div style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '15px',
              backgroundColor: '#fcf720',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block',
            }}>
              WHAT YOU'LL ACHIEVE
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{ marginBottom: '10px' }}>
                • Get clear on the painful, expensive problems you're uniquely qualified to solve
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Identify target buyers who will pay a premium for solutions
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Walk away with a painkilling offer idea you're ready to validate
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div style={{
            width: '50%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            color: 'black',
          }}>
            <div style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '15px',
              backgroundColor: '#fcf720',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block',
            }}>
              HOW IT WORKS
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{ marginBottom: '10px' }}>
                • Watch 9 fluff-free mini lessons
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Complete hands-on exercises that get you unstuck
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Brainstorm faster using your AI-powered Sparky bot
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Download a summary of your work at the end
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div style={{
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '20px auto',
      }}>
        <Button
          onClick={handleStartWorkshop}
          isLoading={loading}
          disabled={loading}
          style={{
            backgroundColor: '#fcf720',
            color: 'black',
            padding: '12px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            justifyContent: 'center',
            opacity: loading ? 0.7 : 1
          }}
        >
          {user ? 'START WORKSHOP >' : 'SIGN IN TO START >'}
        </Button>
      </div>
    </div>
  );
};