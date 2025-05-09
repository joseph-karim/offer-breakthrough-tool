import React from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Button } from '../../ui/Button';

interface ChatWithSparkyButtonProps {
  exerciseKey: string;
  exerciseTitle: string;
  initialContext: Record<string, any>;
  systemPromptKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatWithSparkyButton: React.FC<ChatWithSparkyButtonProps> = ({
  exerciseKey,
  exerciseTitle,
  initialContext,
  systemPromptKey,
  className = '',
  style = {}
}) => {
  const { currentStep, openSparkyModal } = useWorkshopStore();

  const handleOpenChat = () => {
    openSparkyModal({
      stepNumber: currentStep,
      exerciseKey,
      exerciseTitle,
      initialContext,
      systemPromptKey
    });
  };

  return (
    <Button
      onClick={handleOpenChat}
      variant="black"
      className={`flex items-center justify-center ${className}`}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '16px',
        width: 'fit-content',
        ...style
      }}
    >
      <img
        src="/assets/Sparky.png"
        alt="Sparky"
        style={{
          width: '24px',
          height: '24px',
          marginRight: '8px'
        }}
      />
      Chat with Sparky
    </Button>
  );
};
