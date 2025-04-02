import { StepHeader } from '../../shared/StepHeader';
import { Card } from '../../shared/Card';

export const Step01_Intro = () => {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Welcome to the Offer Breakthrough Workshop"
        description="Design a scalable offer by deeply understanding your market's psychology and needs."
      />
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          This interactive workshop will guide you through the process of uncovering profitable problems
          and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">What You'll Achieve</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identify and avoid common pitfalls in offer creation</li>
              <li>Discover trigger events that drive buying decisions</li>
              <li>Understand the jobs your customers need done</li>
              <li>Find profitable target markets</li>
              <li>Uncover high-value problems worth solving</li>
              <li>Design a scalable offer that resonates with your market</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Progress through 10 carefully designed steps</li>
              <li>Each step builds on the previous insights</li>
              <li>AI-powered bots help with brainstorming</li>
              <li>Save your progress as you go</li>
              <li>Get clear action items at each stage</li>
              <li>End with a well-defined offer concept</li>
            </ul>
          </Card>
        </div>

        <Card className="bg-secondary/50 my-8">
          <h4 className="text-lg font-semibold mb-3">Before You Begin</h4>
          <div className="space-y-4">
            <p>
              Take a moment to reflect on your current business and what you hope to achieve with your new
              offer. The more thoughtful you are in each step, the better your results will be.
            </p>
            <p>
              Consider having these things handy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notes about your current business challenges</li>
              <li>Insights from past customer interactions</li>
              <li>Ideas about what you'd like to create</li>
              <li>Understanding of your available resources</li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="border-t pt-6">
        <p className="text-muted-foreground">
          Ready to get started? Click the "Next" button below to begin your journey to offer
          breakthrough.
        </p>
      </div>
    </div>
  );
}; 