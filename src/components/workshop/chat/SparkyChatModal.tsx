import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { AIMessage } from '../../../types/chat';
import { SparkyMessage } from '../../../services/sparkyService';

interface SparkyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: (AIMessage | SparkyMessage)[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
}

export const SparkyChatModal: React.FC<SparkyChatModalProps> = ({
  isOpen,
  onClose,
  title,
  messages,
  isTyping,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRoot = document.getElementById('modal-root') || createModalRoot();
  const modalElement = useRef(document.createElement('div'));

  // Create modal root if it doesn't exist
  function createModalRoot() {
    const root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
    return root;
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle modal mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      modalRoot.appendChild(modalElement.current);
      document.body.style.overflow = 'hidden';
      return () => {
        modalRoot.removeChild(modalElement.current);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, modalRoot]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render message bubbles
  const renderMessage = (message: AIMessage | SparkyMessage) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginBottom: '16px',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            maxWidth: '80%',
            backgroundColor: isUser ? '#F5F5F5' : '#FFFFFF',
            borderColor: isUser ? '#EEEEEE' : '#FFDD00',
            borderWidth: '1px',
            borderLeftWidth: isUser ? '1px' : '3px',
            borderRadius: '15px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#333333',
              fontSize: '15px',
              lineHeight: 1.5
            }}
          >
            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#F9F9F9',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '800px',
          height: '90vh',
          maxHeight: '800px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #EEEEEE',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {title}
          </h2>
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
            <X size={24} color="#666666" />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            padding: '20px',
            flexGrow: 1,
            overflowY: 'auto',
            backgroundColor: '#F9F9F9'
          }}
        >
          {messages.map(renderMessage)}

          {isTyping && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '15px',
                borderLeft: '3px solid #FFDD00',
                maxWidth: '80%',
                marginBottom: '16px'
              }}
            >
              <Loader2 size={20} className="animate-spin mr-2" />
              <span style={{ color: '#666666' }}>Sparky is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #EEEEEE',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              placeholder={isTyping ? "Sparky is typing..." : "Type your message..."}
              style={{
                flexGrow: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #DDDDDD',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: isTyping ? '#F5F5F5' : '#FFFFFF',
                color: '#333333' // Ensuring text is visible
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              rightIcon={<Send size={16} />}
              variant="black"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>,
    modalElement.current
  );
};
