import { ReactNode, useState, useEffect } from 'react';
import { useWorkshopStore } from '../../store/workshopStore';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PersistentChatInterface } from '../workshop/chat/PersistentChatInterface';

interface WorkshopLayoutProps {
  children: ReactNode;
}

export const WorkshopLayout = ({ children }: WorkshopLayoutProps) => {
  const { currentStep, setCurrentStep } = useWorkshopStore();

  const totalSteps = 10;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
              Buyer Breakthrough Workshop
            </h1>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div style={{
            marginTop: '16px',
            height: '8px',
            width: '100%',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: '#4f46e5',
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
            position: 'fixed',
            top: '120px',
            left: '20px',
            height: 'calc(100vh - 160px)',
            zIndex: 10
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

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '48px',
            maxWidth: '800px',
            margin: '48px auto 0'
          }}>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ChevronLeft size={20} />
              Previous Step
            </Button>

            <div style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginLeft: '24px',
              marginRight: '24px'
            }}>
            </div>

            <Button
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Next Step
              <ChevronRight size={20} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};