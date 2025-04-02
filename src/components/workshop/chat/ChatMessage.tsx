import { AIMessage } from '../../../types/chat';

interface ChatMessageProps {
  message: AIMessage;
  onSuggestionAccept?: (suggestion: any) => void;
}

export const ChatMessage = ({ message, onSuggestionAccept }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const messageClasses = isUser
    ? 'bg-blue-500 text-white ml-auto'
    : 'bg-gray-200 text-gray-800';

  const renderSuggestions = () => {
    if (!message.suggestions || message.suggestions.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {message.suggestions.map((suggestion, index) => (
          <div key={index} className="p-2 bg-white border rounded-md shadow-sm">
            <div className="text-sm">{JSON.stringify(suggestion.content)}</div>
            {onSuggestionAccept && (
              <button
                onClick={() => onSuggestionAccept(suggestion)}
                className="mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`max-w-[80%] p-3 rounded-lg ${messageClasses}`}>
      <div className="whitespace-pre-wrap">{message.content}</div>
      {renderSuggestions()}
    </div>
  );
}; 