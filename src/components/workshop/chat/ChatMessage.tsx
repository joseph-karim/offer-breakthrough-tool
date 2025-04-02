import { AIMessage } from '../../../types/chat';

interface ChatMessageProps {
  message: AIMessage;
  onSuggestionAccept?: (suggestion: string) => void;
}

export const ChatMessage = ({ message, onSuggestionAccept }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
  );
}; 