import { AIMessage } from '../../../types/chat';
import Button from '../../../components/ui/Button';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: AIMessage;
  onSuggestionAccept?: (suggestion: any) => void;
}

export const ChatMessage = ({ message, onSuggestionAccept }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  // Use direct Tailwind classes
  const messageContainerClasses = isUser 
    ? 'flex flex-row-reverse'
    : 'flex';
    
  const messageClasses = isUser
    ? 'bg-gray-200 text-gray-800 max-w-[80%] rounded-lg p-3 rounded-tr-none'
    : 'bg-secondary-50 text-gray-800 max-w-[80%] rounded-lg p-3 rounded-tl-none';
    
  const avatarClasses = 'flex items-center justify-center h-8 w-8 rounded-full text-white flex-shrink-0';

  const renderSuggestions = () => {
    if (!message.suggestions || message.suggestions.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {message.suggestions.map((suggestion: any, index: number) => (
          <div key={index} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
            <div className="text-sm whitespace-pre-wrap text-gray-700">
              {typeof suggestion.content === 'string' 
                ? suggestion.content 
                : JSON.stringify(suggestion.content, null, 2)}
            </div>
            {onSuggestionAccept && (
              <Button
                onClick={() => onSuggestionAccept(suggestion)}
                variant="primary"
                size="sm"
                className="mt-2"
              >
                Accept
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${messageContainerClasses} mb-3`}>
      {!isUser && (
        <div className={`${avatarClasses} bg-secondary mr-2`}>
          <Bot size={16} />
        </div>
      )}
      <div className={messageClasses}>
        <div className="whitespace-pre-wrap">{message.content}</div>
        {renderSuggestions()}
      </div>
      {isUser && (
        <div className={`${avatarClasses} bg-primary ml-2`}>
          <User size={16} />
        </div>
      )}
    </div>
  );
}; 