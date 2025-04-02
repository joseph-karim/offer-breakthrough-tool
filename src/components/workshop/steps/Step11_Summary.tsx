import { useState } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';
import { ChatInterface } from '../chat/ChatInterface';
import { STEP_QUESTIONS } from '../../../services/aiService';

export const Step11_Summary = () => {
  const { workshopData } = useWorkshopStore();
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Find the selected market
  const selectedMarket = workshopData?.markets?.find(m => m.selected);
  
  // Find selected problems
  const selectedProblems = workshopData?.problems?.filter(p => p.selected) || [];
  
  // Find selected jobs
  const selectedJobs = workshopData?.jobs || [];

  // Get the selected offer
  const selectedOffer = workshopData?.selectedOffer;

  return (
    <div className="space-y-8">
      <StepHeader
        title="Workshop Summary & Action Plan"
        description="Review your progress and plan your next steps"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="prose prose-slate max-w-none space-y-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Workshop Results</h3>
            
            <div className="space-y-6">
              {selectedMarket && (
                <div>
                  <h4 className="font-semibold text-lg">Selected Market</h4>
                  <p className="text-lg">{selectedMarket.description}</p>
                </div>
              )}

              {selectedJobs.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Key Jobs to be Done</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {selectedJobs.map(job => (
                      <li key={job.id}>{job.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProblems.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg">Key Problems to Solve</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {selectedProblems.map(problem => (
                      <li key={problem.id}>{problem.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedOffer && (
                <div>
                  <h4 className="font-semibold text-lg">Selected Offer</h4>
                  <p className="font-medium">{selectedOffer.name}</p>
                  <p className="text-muted-foreground">{selectedOffer.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">Format: {selectedOffer.format}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-secondary/50">
            <h4 className="text-lg font-semibold mb-3">Next Steps</h4>
            <p className="mb-4">
              To move forward with your offer, consider these key validation activities:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interview 5-10 potential customers from your target market</li>
              <li>Create a simple landing page to test your messaging</li>
              <li>Design a minimum viable version of your offer</li>
              <li>Set up a waitlist or pre-sale opportunity</li>
              <li>Document your unique process and methodology</li>
            </ul>
          </Card>

          <button
            onClick={() => setShowAnalysis(true)}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Run AI Analysis
          </button>
        </div>

        <div className="space-y-8">
          <ChatInterface
            step={11}
            stepContext="reviewing workshop results and planning next steps"
            questions={STEP_QUESTIONS[11]}
            onSuggestionAccept={() => {}} // Analysis suggestions don't need to be accepted
          />
          
          <Card className="bg-primary/10 p-4">
            <h4 className="font-semibold mb-2">How the AI Assistant Can Help</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Analyze the coherence of your offer concept</li>
              <li>Identify potential strengths and weaknesses</li>
              <li>Suggest specific validation steps</li>
              <li>Help prioritize your next actions</li>
              <li>Provide implementation guidance</li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Remember: The best way to validate your offer is to start having real conversations with
          your target market while keeping your solution flexible enough to adapt based on their
          feedback.
        </p>
      </div>
    </div>
  );
}; 