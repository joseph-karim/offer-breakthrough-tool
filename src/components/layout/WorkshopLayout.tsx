import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshopStore } from '../../store/workshopStore';
import { UserProfile } from '../auth/UserProfile';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const { currentStep } = useWorkshopStore();

  // Total steps in the workshop
  const totalSteps = 10;
  // Check if current page is intro page (not a step)
  const isIntroPage = currentStep === 0;
  // Check if current page is dashboard
  const isDashboard = window.location.pathname === '/dashboard';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1E1E1E',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      <header style={{
        borderBottom: '1px solid #333333',
        position: 'relative',
        padding: '12px 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#fcf720',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                padding: '4px'
              }}>
                <img
                  src="/assets/bomb.png"
                  alt="Bomb icon"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>
                Buyer Breakthrough Workshop
              </h1>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!isIntroPage && !isDashboard && (
              <div style={{
                fontSize: '12px',
                color: 'black',
                backgroundColor: '#fcf720',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>
                Step {currentStep} of {totalSteps}
              </div>
            )}
            <UserProfile />
          </div>
        </div>
        {!isIntroPage && !isDashboard && (
          <div style={{
            marginTop: '12px',
            height: '4px',
            width: '100%',
            backgroundColor: '#333333',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: '#fcf720',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        )}
      </header>

      <div style={{
        display: 'flex',
        flexGrow: 1,
        height: 'calc(100vh - 65px)', // Header height + border
        overflow: 'hidden',
        width: '100%',
        justifyContent: 'center'
      }}>
        <main style={{
          height: '100%',
          overflow: 'auto',
          padding: 0,
          width: '100%',
          maxWidth: '1000px'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};