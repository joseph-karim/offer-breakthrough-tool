import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { ChatSuggestion } from '../../../types/chat';
import { Lightbulb } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: ChatSuggestion;
  onAccept: () => void;
  isLoading?: boolean;
}

export const SuggestionCard = ({ suggestion, onAccept, isLoading }: SuggestionCardProps) => {
  return (
    <Card className="suggestion-card bg-primary-50 border-primary-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="heading-section flex items-center text-primary-700">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI Suggestion
          </h4>
          <Button
            onClick={onAccept}
            disabled={isLoading}
            variant="primary"
            size="sm"
          >
            {isLoading ? 'Processing...' : 'Accept & Populate'}
          </Button>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap bg-white p-3 rounded-md border border-primary-100 text-gray-800">
            {typeof suggestion.content === 'string' 
              ? suggestion.content 
              : JSON.stringify(suggestion.content, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
}; 