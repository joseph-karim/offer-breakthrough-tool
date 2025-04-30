import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { SparkyMessage } from '../../../services/sparkyService';
import { Button } from '../../ui/Button';

interface MessagesContainerProps {
  messages: SparkyMessage[];
  isTyping: boolean;
  currentStep: number;
  renderMessage: (message: SparkyMessage) => React.ReactNode;
}

export const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  isTyping,
  currentStep,
  renderMessage
}) => {
  const [showAllMessages, setShowAllMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter messages based on the current step
  const filteredMessages = showAllMessages
    ? messages
    : messages.filter(msg => !msg.stepContext || msg.stepContext === currentStep);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages, isTyping]);

  // Group messages by step for better visual separation
  const groupedMessages = filteredMessages.reduce<{[key: number]: SparkyMessage[]}>((groups, message) => {
    const step = message.stepContext || 0;
    if (!groups[step]) {
      groups[step] = [];
    }
    groups[step].push(message);
    return groups;
  }, {});

  // Sort steps in ascending order
  const sortedSteps = Object.keys(groupedMessages)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div
      style={{
        padding: windowWidth < 600 ? '8px' : windowWidth < 768 ? '12px' : '24px',
        overflowY: 'auto',
        flexGrow: 1,
        height: 'calc(100% - 150px)',
        backgroundColor: '#FAFAFA',
        WebkitOverflowScrolling: 'touch', // Improve scrolling on mobile devices
        fontSize: windowWidth < 600 ? '13px' : windowWidth < 768 ? '14px' : '16px', // Responsive font size
        wordBreak: 'break-word', // Prevent text overflow
        scrollbarWidth: 'thin', // Thinner scrollbars for Firefox
        msOverflowStyle: 'none' // Hide scrollbars for IE/Edge
      }}
    >
      {/* Toggle button for showing all messages or just current step */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: windowWidth < 600 ? '8px' : '16px'
      }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllMessages(!showAllMessages)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: windowWidth < 600 ? '12px' : '14px',
            color: '#666666',
            padding: windowWidth < 600 ? '4px 8px' : '8px 12px'
          }}
        >
          {showAllMessages ? (
            <>
              <ChevronUp size={windowWidth < 600 ? 14 : 16} />
              {windowWidth < 480 ? 'Current Step' : 'Show Current Step Only'}
            </>
          ) : (
            <>
              <ChevronDown size={windowWidth < 600 ? 14 : 16} />
              {windowWidth < 480 ? 'All History' : 'Show Full History'}
            </>
          )}
        </Button>
      </div>

      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666666', padding: '40px 20px' }}>
          <img
            src="https://cdn.lugc.link/45a7bdbd-0b00-4092-86c6-4225026f322f/-/preview/88x88/-/format/auto/"
            alt="Sparky"
            style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px', display: 'block' }}
          />
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            Hi! I'm Sparky, your workshop assistant. Ask me anything about the workshop or for help with the current step.
          </p>
        </div>
      ) : (
        sortedSteps.map(step => (
          <div key={`step-${step}`}>
            {/* Step separator - only show in full history mode and for non-zero steps */}
            {showAllMessages && step > 0 && (
              <div style={{
                margin: '20px 0',
                padding: '8px 12px',
                backgroundColor: '#F0F0F0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#666666',
                textAlign: 'center'
              }}>
                {step === 0 ? 'General Messages' : `Step ${step} Messages`}
              </div>
            )}

            {/* Messages for this step */}
            {groupedMessages[step].map(message => renderMessage(message))}
          </div>
        ))
      )}

      {isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666666' }}>
          <Loader2 className="animate-spin" size={16} />
          <span>Sparky is typing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
