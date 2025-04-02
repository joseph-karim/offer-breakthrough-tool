import { Card } from '../../shared/Card';
import { ChatSuggestion } from '../../../types/chat';

interface SuggestionCardProps {
  suggestion: ChatSuggestion;
  onAccept: () => void;
  isLoading?: boolean;
}

export const SuggestionCard = ({ suggestion, onAccept, isLoading }: SuggestionCardProps) => {
  return (
    <Card className="bg-secondary/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">AI Suggestion</h4>
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Accept & Populate'}
          </button>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap bg-background/50 p-3 rounded-md">
            {JSON.stringify(suggestion.content, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
}; 