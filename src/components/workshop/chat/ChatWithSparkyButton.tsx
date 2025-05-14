import React from 'react';
import { Button } from '../../ui/Button';

// Map of exercise keys to GPT URLs
const GPT_URLS: Record<string, string> = {
  // Exercise 3 - Triggers Bot
  "triggerBrainstorm": "https://chatgpt.com/g/g-682348e06bdc8191ba93537b8dc17581-bb-buying-triggers-bot",

  // Exercise 4 - Job Statement Bot
  "jobBrainstorm": "https://chatgpt.com/g/g-68234944b4788191aef26f2a5fa0c7c1-bb-job-statement-refiner-bot",

  // Exercise 5 - Potential Buyers Bot
  "buyerBrainstorm": "https://chatgpt.com/g/g-68234a9efe2c819188a3ddc97a9ddc59-bb-potential-buyers-brainstorm-bot",

  // Exercise 6 - Painstorming Bot
  "painstorming": "https://chatgpt.com/g/g-68234b006bfc81918b50a031dd62c48f-bb-painstorming-bot",

  // Exercise 8 - Refine Target Market Bot
  "targetMarket": "https://chatgpt.com/g/g-68234b80999c81919a404340dd12d84a-bb-refine-your-target-market-bot",

  // Exercise 9 - Rapid Offer Brainstorm Bot
  "refineIdea": "https://chatgpt.com/g/g-68234bff6acc8191999a073eccf1751b-bb-rapid-offer-ideation"
};

interface ChatWithSparkyButtonProps {
  exerciseKey: string;
  exerciseTitle: string;
  initialContext: Record<string, any>;
  systemPromptKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatWithSparkyButton: React.FC<ChatWithSparkyButtonProps> = ({
  exerciseKey,
  // These props are kept in the interface for backward compatibility
  // but are not used in the current implementation
  // exerciseTitle,
  // initialContext,
  // systemPromptKey,
  className = '',
  style = {}
}) => {
  const handleOpenGPT = () => {
    // Get the URL for this exercise key
    const url = GPT_URLS[exerciseKey] || "https://chatgpt.com";

    // Open the URL in a new tab
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleOpenGPT}
      variant="black"
      className={`flex items-center justify-center ${className}`}
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '16px',
        width: 'fit-content',
        ...style
      }}
    >
      <img
        src="/assets/Sparky.png"
        alt="Sparky"
        style={{
          width: '24px',
          height: '24px',
          marginRight: '8px'
        }}
      />
      Chat with Sparky
    </Button>
  );
};
