import React from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { ChatInterface } from '../chat/ChatInterface';
import { AIService, STEP_QUESTIONS } from '../../../services/aiService';

// Initialize AIService (consider moving to a context or singleton)
const aiService = new AIService({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

export const Step10_Pricing: React.FC = () => {
  const { workshopData, acceptSuggestion } = useWorkshopStore();
  const selectedOffer = workshopData.selectedOffer;
  const stepNumber = 10;

  // Define context for the AI, including the selected offer
  const stepContext = `
    Workshop Step: ${stepNumber} - Pricing & Positioning
    Selected Offer: ${selectedOffer ? JSON.stringify(selectedOffer, null, 2) : 'None Selected'}
    Previous Workshop Data: ${JSON.stringify({ 
      markets: workshopData.markets,
      problems: workshopData.problems,
      jobs: workshopData.jobs,
    }, null, 2)}
  `;

  const handleSuggestionAccept = () => {
    acceptSuggestion(stepNumber);
  };

  return (
    <Card>
      <StepHeader title="Step 10: Pricing & Positioning" />
      <div className="space-y-4 mb-6">
        <p>
          Now let's determine the right pricing model and positioning for your selected offer.
          We'll consider the value delivered, target market, and competitive landscape.
        </p>
        {selectedOffer ? (
          <div>
            <h3 className="font-semibold text-lg mb-2">Selected Offer Recap:</h3>
            <p><strong>Name:</strong> {selectedOffer.name}</p>
            <p><strong>Description:</strong> {selectedOffer.description}</p>
            <p><strong>Format:</strong> {selectedOffer.format}</p>
          </div>
        ) : (
          <p className="text-red-500">Please select an offer in Step 9 before proceeding.</p>
        )}
      </div>

      {selectedOffer && (
        <ChatInterface
          step={stepNumber}
          stepContext={stepContext}
          questions={STEP_QUESTIONS[stepNumber]}
          aiService={aiService} 
          onSuggestionAccept={handleSuggestionAccept}
        />
      )}
    </Card>
  );
}; 