import React from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { PersistentChatInterface } from './PersistentChatInterface';

/**
 * WorkshopChatWrapper - Renders the persistent chat interface only on steps 2-10
 */
export const WorkshopChatWrapper: React.FC = () => {
  const { currentStep } = useWorkshopStore();

  // Only show the chat on steps 2-10 (not on the intro step)
  const shouldShowChat = currentStep >= 2 && currentStep <= 10;

  if (!shouldShowChat) {
    return null;
  }

  // We're using isFixed={false} because the container is already positioned correctly
  // in the WorkshopWizard component with the chatContainerStyle
  return <PersistentChatInterface isFixed={false} />;
};
