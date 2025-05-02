import { ReactNode } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { WorkshopChatWrapper } from '../workshop/chat/WorkshopChatWrapper';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const { currentStep } = useWorkshopStore();

  const totalSteps = 10;

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              backgroundColor: '#FFDD00',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              padding: '6px'
            }}>
              <img
                src="/assets/bomb-icon.png"
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
          <div style={{
            fontSize: '12px',
            color: 'black',
            backgroundColor: '#FFDD00',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Step {currentStep} of {totalSteps}
          </div>
        </div>
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
              backgroundColor: '#FFDD00',
              borderRadius: '9999px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </header>

      <div style={{
        display: 'flex',
        flexGrow: 1,
        height: 'calc(100vh - 65px)', // Header height + border
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Persistent Chat - Only show from step 2 onwards */}
        {currentStep > 1 && (
          <div style={{
            width: '40%',
            minWidth: '400px',
            maxWidth: '600px',
            borderRight: '1px solid #333333',
            height: '100%',
            overflow: 'hidden'
          }}>
            <WorkshopChatWrapper />
          </div>
        )}

        <main style={{
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
          padding: 0,
          width: currentStep > 1 ? '60%' : '100%'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};