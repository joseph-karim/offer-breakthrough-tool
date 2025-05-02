import React from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { PersistentChatInterface } from './PersistentChatInterface';

/**
 * WorkshopChatWrapper - Renders the persistent chat interface only on steps 2-10
 * This component is used in the WorkshopLayout to render the chat in the sidebar
 */
export const WorkshopChatWrapper: React.FC = () => {
  const { currentStep } = useWorkshopStore();

  // Only show the chat on steps 2-10 (not on the intro step)
  const shouldShowChat = currentStep >= 2 && currentStep <= 10;

  if (!shouldShowChat) {
    return null;
  }

  // We're using isFixed={false} because the container is already positioned correctly
  // in the WorkshopLayout component
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <PersistentChatInterface isFixed={false} isOpen={true} />
    </div>
  );
};
