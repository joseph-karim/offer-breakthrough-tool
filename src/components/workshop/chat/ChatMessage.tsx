import React from 'react';
import { Card } from '../../ui/Card';
import type { AIMessage } from '../../../types/chat';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: AIMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Invalid timestamp format', error);
      return '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        marginBottom: '10px',
        alignItems: 'flex-start',
        gap: '8px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '32px',
          width: '32px',
          borderRadius: '50%',
          backgroundColor: isUser ? '#3b82f6' : '#10b981',
          color: 'white',
          flexShrink: 0
        }}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <Card
        style={{
          padding: '12px 16px',
          maxWidth: '70%',
          backgroundColor: isUser ? '#f0f9ff' : '#ffffff',
          borderColor: isUser ? '#bae6fd' : '#e5e7eb',
        }}
      >
        <div style={{ fontSize: '14px', marginBottom: '4px', color: isUser ? '#0369a1' : '#4b5563', fontWeight: 500 }}>
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div style={{ 
          fontSize: '15px', 
          lineHeight: 1.5, 
          color: '#374151',
          whiteSpace: 'pre-wrap'
        }}>
          {message.content}
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', textAlign: isUser ? 'right' : 'left' }}>
          {formatTimestamp(message.timestamp)}
        </div>
      </Card>
    </div>
  );
}; 