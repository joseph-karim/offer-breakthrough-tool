import { useState } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS, AIService } from '../../../services/aiService';

export const Step11_Summary = () => {
  const { workshopData, acceptSuggestion } = useWorkshopStore();
  const [runAnalysis, setRunAnalysis] = useState(false);
  const stepNumber = 11;
  
  // Initialize AI service
  const aiService = new AIService({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

  const selectedMarket = workshopData.markets.find(m => m.selected);
  const selectedProblems = workshopData.problems.filter(p => p.selected);
  const selectedJobs = workshopData.jobs; // All jobs are considered selected
  const selectedOffer = workshopData.selectedOffer;

  // Define context for the AI to include all the workshop results
  const stepContext = `
    Workshop Step: ${stepNumber} - Summary & Action Plan
    
    Anti-Goals:
    ${JSON.stringify(workshopData.antiGoals, null, 2)}
    
    Trigger Events:
    ${JSON.stringify(workshopData.triggerEvents, null, 2)}
    
    Jobs to be Done:
    ${JSON.stringify(workshopData.jobs, null, 2)}
    
    Selected Market:
    ${selectedMarket ? JSON.stringify(selectedMarket, null, 2) : 'None Selected'}
    
    Key Problems:
    ${JSON.stringify(selectedProblems, null, 2)}
    
    Selected Offer:
    ${selectedOffer ? JSON.stringify(selectedOffer, null, 2) : 'None Selected'}
  `;

  const handleSuggestionAccept = () => {
    acceptSuggestion(stepNumber);
  };

  return (
    <Card>
      <StepHeader title="Step 11: Summary & Action Plan" />
      
      <div className="space-y-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Workshop Results</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Selected Market:</h4>
              <p>{selectedMarket?.description || 'None selected'}</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Key Jobs to be Done:</h4>
              {selectedJobs.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedJobs.map(job => (
                    <li key={job.id}>{job.description}</li>
                  ))}
                </ul>
              ) : (
                <p>None selected</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold">Key Problems to Solve:</h4>
              {selectedProblems.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedProblems.map(problem => (
                    <li key={problem.id}>{problem.description}</li>
                  ))}
                </ul>
              ) : (
                <p>None selected</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold">Selected Offer:</h4>
              {selectedOffer ? (
                <div>
                  <p><strong>Name:</strong> {selectedOffer.name}</p>
                  <p><strong>Description:</strong> {selectedOffer.description}</p>
                  <p><strong>Format:</strong> {selectedOffer.format}</p>
                </div>
              ) : (
                <p>None selected</p>
              )}
            </div>
          </div>
        </div>
        
        {!runAnalysis && (
          <button
            onClick={() => setRunAnalysis(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Run AI Analysis
          </button>
        )}
        
        {runAnalysis && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
            <p className="mb-4">
              Based on your workshop results, here are some suggested next steps to validate and refine your offer:
            </p>
            
            <ChatInterface
              step={stepNumber}
              stepContext={stepContext}
              questions={STEP_QUESTIONS[stepNumber]}
              aiService={aiService}
              onSuggestionAccept={handleSuggestionAccept}
            />
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Remember that the best validation comes from real conversations with your target market. 
                Use these suggestions as a starting point, but always prioritize getting direct feedback from potential customers.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}; 