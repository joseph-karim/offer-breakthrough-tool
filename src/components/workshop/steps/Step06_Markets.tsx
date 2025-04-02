import { useState } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { TextArea } from '../../shared/TextArea';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';
import type { Market } from '../../../types/workshop';
import { AIService } from '../../../services/aiService';

export const Step06_Markets = () => {
  const { workshopData, updateWorkshopData } = useWorkshopStore();
  const [newMarket, setNewMarket] = useState('');
  const markets = workshopData?.markets || [];

  const aiService = new AIService({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

  const handleAddMarket = () => {
    if (!newMarket.trim()) return;
    
    const market: Market = {
      id: Date.now().toString(),
      description: newMarket.trim(),
      source: 'user'
    };

    updateWorkshopData({
      markets: [...markets, market]
    });
    setNewMarket('');
  };

  const handleRemoveMarket = (id: string) => {
    updateWorkshopData({
      markets: markets.filter(market => market.id !== id)
    });
  };

  const handleSuggestionAccept = (suggestion: any) => {
    if (Array.isArray(suggestion.markets)) {
      updateWorkshopData({
        markets: [
          ...markets,
          ...suggestion.markets
        ]
      });
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Define Target Markets"
        description="Who are the specific groups of people or businesses that need your solution?"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="prose prose-slate max-w-none space-y-8">
          <p className="text-lg">
            Target markets are specific groups of people or businesses who share common characteristics
            and needs. Identifying these markets helps you focus your offer and marketing efforts.
          </p>

          <Card>
            <div className="space-y-6">
              <TextArea
                label="Add a Target Market"
                description="Describe a specific group of people or businesses that could benefit from your solution."
                value={newMarket}
                onChange={(e) => setNewMarket(e.target.value)}
                placeholder="Example: Independent consultants who want to scale beyond trading time for money..."
              />
              <button
                onClick={handleAddMarket}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add Market
              </button>
            </div>
          </Card>

          {markets.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Target Markets</h3>
              <div className="space-y-4">
                {markets.map((market) => (
                  <Card key={market.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-lg">{market.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: {market.source === 'user' ? 'You' : 'AI Assistant'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMarket(market.id)}
                      className="ml-4 p-2 text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-secondary/50">
            <h4 className="text-lg font-semibold mb-3">Tips for Defining Markets</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be specific about who you're targeting</li>
              <li>Consider demographics and psychographics</li>
              <li>Look for common pain points and needs</li>
              <li>Think about market size and accessibility</li>
              <li>Focus on markets you can serve well</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-8">
          <ChatInterface
            step={6}
            stepContext="defining target markets that could benefit from your solution"
            questions={STEP_QUESTIONS[6]}
            aiService={aiService}
            onSuggestionAccept={handleSuggestionAccept}
          />
          
          <Card className="bg-primary/10 p-4">
            <h4 className="font-semibold mb-2">How the AI Assistant Can Help</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Identify niche market opportunities</li>
              <li>Analyze market characteristics</li>
              <li>Suggest related or adjacent markets</li>
              <li>Help evaluate market potential</li>
              <li>Provide market research insights</li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Clearly defined target markets help you create more focused and effective offers that
          resonate with specific customer groups.
        </p>
      </div>
    </div>
  );
}; 