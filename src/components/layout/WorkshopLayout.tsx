import { ReactNode } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { SparkyChatModal } from '../workshop/chat/SparkyChatModal';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const {
    currentStep,
    isSparkyModalOpen,
    sparkyModalConfig,
    currentModalChatMessages,
    isAiLoading,
    closeSparkyModal,
    sendSparkyModalMessage
  } = useWorkshopStore();

  // Total steps reduced by 1 since intro is not counted as a step
  const totalSteps = 10;
  // Check if current page is intro page
  const isIntroPage = currentStep === 1;

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
          {!isIntroPage && (
            <div style={{
              fontSize: '12px',
              color: 'black',
              backgroundColor: '#fcf720',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              Step {currentStep - 1} of {totalSteps}
            </div>
          )}
        </div>
        {!isIntroPage && (
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
                width: `${((currentStep - 1) / totalSteps) * 100}%`,
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

      {/* Sparky Chat Modal */}
      {isSparkyModalOpen && sparkyModalConfig && (
        <SparkyChatModal
          isOpen={isSparkyModalOpen}
          onClose={closeSparkyModal}
          title={sparkyModalConfig.exerciseTitle || 'Chat with Sparky'}
          messages={currentModalChatMessages}
          isTyping={isAiLoading}
          onSendMessage={sendSparkyModalMessage}
        />
      )}
    </div>
  );
};