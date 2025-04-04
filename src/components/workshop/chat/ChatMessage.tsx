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
          height: '36px',
          width: '36px',
          borderRadius: '50%',
          backgroundColor: isUser ? '#FFFFFF' : '#FFDD00',
          color: isUser ? '#222222' : '#222222',
          border: `2px solid ${isUser ? '#EEEEEE' : '#FFDD00'}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          flexShrink: 0
        }}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      <Card
        style={{
          padding: '12px 16px',
          maxWidth: '70%',
          backgroundColor: isUser ? '#F5F5F5' : '#FFFFFF',
          borderColor: isUser ? '#EEEEEE' : isUser ? '#EEEEEE' : '#FFDD00',
          borderWidth: '1px',
          borderLeftWidth: isUser ? '1px' : '3px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ 
          fontSize: '14px', 
          marginBottom: '4px', 
          color: isUser ? '#222222' : '#222222', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isUser ? '👤 You' : '✨ AI Assistant'}
        </div>
        <div style={{ 
          fontSize: '15px', 
          lineHeight: 1.5, 
          color: '#333333',
          whiteSpace: 'pre-wrap'
        }}>
          {typeof message.content === 'string' 
            ? message.content 
            : JSON.stringify(message.content, null, 2)}
        </div>
        <div style={{ fontSize: '12px', color: '#888888', marginTop: '8px', textAlign: isUser ? 'right' : 'left' }}>
          {formatTimestamp(message.timestamp)}
        </div>
      </Card>
    </div>
  );
};        