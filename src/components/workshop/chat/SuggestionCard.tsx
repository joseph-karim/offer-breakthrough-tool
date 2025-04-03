import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChatSuggestion } from '../../../types/chat';
import { Lightbulb } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: ChatSuggestion;
  onAccept: () => void;
  isLoading?: boolean;
}

export const SuggestionCard = ({ suggestion, onAccept, isLoading }: SuggestionCardProps) => {
  return (
    <Card className="bg-primary-50 border border-primary-100 my-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-primary-700 mb-3 flex items-center">
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