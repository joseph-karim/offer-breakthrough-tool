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
    <Card className="my-4" style={{
      backgroundColor: '#222222',
      border: '2px solid #FFDD00',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#FFDD00' }}>
            <Lightbulb className="h-5 w-5 mr-2" style={{ color: '#FFDD00' }} />
            ✨ AI Suggestion
          </h4>
          <Button
            onClick={onAccept}
            disabled={isLoading}
            variant="yellow"
            size="sm"
          >
            {isLoading ? '⏳ Processing...' : '✅ Accept & Populate'}
          </Button>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap p-3 rounded-md text-white" style={{
            backgroundColor: '#333333',
            border: '1px solid #444444',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
          }}>
            {typeof suggestion.content === 'string' 
              ? suggestion.content 
              : JSON.stringify(suggestion.content, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
};  