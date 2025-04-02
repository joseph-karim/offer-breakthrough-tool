import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';

export const Step02_MarketDemand = () => {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Understanding Market Demand"
        description="Learn what drives demand in your industry to make better decisions throughout the workshop."
      />

      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          Before diving into specific markets and problems, it's crucial to understand what drives
          demand in your industry. This foundation will help you make better decisions throughout the
          workshop.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Key Market Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-semibold text-lg mb-3">Pain Points</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Urgent problems needing solutions</li>
              <li>Frustrations with current options</li>
              <li>Gaps in the market</li>
              <li>Unmet customer needs</li>
              <li>Common complaints</li>
            </ul>
          </Card>

          <Card>
            <h4 className="font-semibold text-lg mb-3">Buying Signals</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Active search for solutions</li>
              <li>Budget allocation</li>
              <li>Timing of purchases</li>
              <li>Decision triggers</li>
              <li>Urgency indicators</li>
            </ul>
          </Card>

          <Card>
            <h4 className="font-semibold text-lg mb-3">Market Dynamics</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Industry trends</li>
              <li>Competitive landscape</li>
              <li>Market maturity</li>
              <li>Growth opportunities</li>
              <li>Regulatory factors</li>
            </ul>
          </Card>

          <Card>
            <h4 className="font-semibold text-lg mb-3">Customer Behavior</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decision-making process</li>
              <li>Information sources</li>
              <li>Purchase timing</li>
              <li>Evaluation criteria</li>
              <li>Post-purchase behavior</li>
            </ul>
          </Card>
        </div>

        <Card className="bg-secondary/50 mt-8">
          <h4 className="text-lg font-semibold mb-4">Reflection Questions</h4>
          <div className="space-y-4">
            <p>Consider these questions as you think about your market:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Problem Recognition:</strong> What problems do you consistently see in your
                industry?
              </li>
              <li>
                <strong>Current Solutions:</strong> How do customers currently solve these problems?
              </li>
              <li>
                <strong>Trigger Events:</strong> What typically causes someone to look for a solution?
              </li>
              <li>
                <strong>Timing:</strong> What makes timing critical in your market?
              </li>
              <li>
                <strong>Barriers:</strong> What prevents customers from solving their problems today?
              </li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Keep these market dynamics in mind as we move forward. They'll help inform your decisions
          about target markets and offer design.
        </p>
      </div>
    </div>
  );
}; 