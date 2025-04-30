import React from 'react';
import { Minimize2 } from 'lucide-react';
import { SparkyMessage } from '../../../services/sparkyService';
import { MessagesContainer } from './MessagesContainer';

interface ExpandedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SparkyMessage[];
  isTyping: boolean;
  currentStep: number;
  renderMessage: (message: SparkyMessage) => React.ReactNode;
  inputContainer: React.ReactNode;
}

export const ExpandedChatModal: React.FC<ExpandedChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  isTyping,
  currentStep,
  renderMessage,
  inputContainer
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
              alt="Sparky"
              style={{ width: '42px', height: '42px', borderRadius: '50%' }}
            />
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Sparky</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Minimize2 size={18} color="#666666" />
          </button>
        </div>

        {/* Messages Container */}
        <MessagesContainer
          messages={messages}
          isTyping={isTyping}
          currentStep={currentStep}
          renderMessage={renderMessage}
        />

        {/* Input Container */}
        {inputContainer}
      </div>
    </div>
  );
};
