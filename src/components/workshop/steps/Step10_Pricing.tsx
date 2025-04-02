import React from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';
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
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={10}
        title="Pricing Strategy"
        description="Develop a pricing approach that maximizes value for both you and your customers."
      />
      
      <Card className="bg-white border border-gray-200 shadow-sm p-6">
        <p className="text-gray-700">
          This step is coming soon. We'll help you develop a pricing strategy that reflects the value of your offer.
        </p>
      </Card>
    </div>
  );
}; 