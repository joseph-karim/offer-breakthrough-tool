import { useState } from 'react';
import { Card } from './Card';

export interface AIMessage {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  suggestions?: string[];
}

interface AIAssistantProps {
  stepContext: string;
  onSuggestionAccept?: (suggestion: string) => void;
  className?: string;
}

export const AIAssistant = ({ stepContext, onSuggestionAccept, className = '' }: AIAssistantProps) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // TODO: Replace with actual API call to ChatGPT
    // For now, simulate a response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Here are some suggestions based on your input:',
        role: 'assistant',
        suggestions: [
          'A business owner realizes their current pricing model isn\'t sustainable',
          'A freelancer struggles to manage multiple client projects efficiently',
          'A startup founder notices high customer churn rates'
        ]
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-[400px] ${className}`}>
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <h3 className="font-semibold">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-secondary/50 rounded-lg p-3 text-sm">
          <p>I'm here to help you with {stepContext}. What would you like to know?</p>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestionAccept?.(suggestion)}
                      className="block w-full text-left text-sm p-2 rounded bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 min-h-[40px] max-h-[120px] p-2 rounded-md border bg-background resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
}; 