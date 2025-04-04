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
          backgroundColor: isUser ? '#222222' : '#FFDD00',
          color: isUser ? '#FFDD00' : '#222222',
          border: `2px solid ${isUser ? '#FFDD00' : '#222222'}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          flexShrink: 0
        }}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      <Card
        style={{
          padding: '12px 16px',
          maxWidth: '70%',
          backgroundColor: isUser ? '#333333' : '#222222',
          borderColor: isUser ? '#FFDD00' : '#444444',
          borderWidth: isUser ? '2px' : '1px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ 
          fontSize: '14px', 
          marginBottom: '4px', 
          color: isUser ? '#FFDD00' : '#FFDD00', 
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
          color: '#FFFFFF',
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