import { ReactNode } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { PersistentChatInterface } from '../workshop/chat/PersistentChatInterface';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const { currentStep } = useWorkshopStore();

  const totalSteps = 10;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1E1E1E', color: 'white' }}>
      <header style={{ borderBottom: '1px solid #333333', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>
                Buyer Breakthrough Workshop
              </h1>
            </div>
            <div style={{
              fontSize: '14px',
              color: 'black',
              backgroundColor: '#FFDD00',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div style={{
            marginTop: '16px',
            height: '8px',
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
        </div>
      </header>

      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Persistent Chat - Only show from step 2 onwards */}
        {currentStep > 1 && (
          <div style={{
            width: '350px',
            position: 'absolute', // Changed from fixed to absolute so it scrolls with the page
            top: '20px',
            left: '20px',
            height: 'calc(100vh - 160px)',
            zIndex: 5
          }}>
            <PersistentChatInterface
              isFixed={false}
              isOpen={true}
            />
          </div>
        )}

        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
          width: '100%',
          marginLeft: currentStep > 1 ? '380px' : '0',
          transition: 'margin-left 0.3s ease'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};