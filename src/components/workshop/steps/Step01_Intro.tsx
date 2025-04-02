import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap } from 'lucide-react';

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div className="max-w-4xl mx-auto">
      <StepHeader
        step={1}
        title="Welcome to the Offer Breakthrough Workshop"
        description="Design a scalable offer by deeply understanding your market's psychology and needs."
      />

      <div className="space-y-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <div className="space-y-6">
            <p className="text-gray-700">
              This interactive workshop will guide you through the process of uncovering profitable problems
              and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
            </p>
          </div>
        </Card>

        <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-primary-700">
            <Target className="mr-2 h-5 w-5" />
            What You'll Achieve
          </h3>
          <ul className="space-y-3">
            {[
              "Identify and avoid common pitfalls in offer creation",
              "Discover trigger events that drive buying decisions",
              "Understand the jobs your customers need done",
              "Find profitable target markets",
              "Uncover high-value problems worth solving",
              "Design a scalable offer that resonates with your market"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5 mr-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
            <Zap className="mr-2 h-5 w-5 text-secondary" />
            How It Works
          </h3>
          <ul className="space-y-3">
            {[
              "Progress through 10 carefully designed steps",
              "Each step builds on the previous insights",
              "AI-powered bots help with brainstorming",
              "Save your progress as you go",
              "Get clear action items at each stage",
              "End with a well-defined offer concept"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-0.5">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-yellow-700">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Before You Begin
          </h3>
          <p className="mb-4">
            Take a moment to reflect on your current business and what you hope to achieve with your new offer. 
            The more thoughtful you are in each step, the better your results will be.
          </p>
          <p className="font-medium">Consider having these things handy:</p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center">
              <span className="bg-yellow-200 w-2 h-2 rounded-full mr-2"></span>
              Notes about your current business challenges
            </li>
            <li className="flex items-center">
              <span className="bg-yellow-200 w-2 h-2 rounded-full mr-2"></span>
              Ideas or assumptions about your target market
            </li>
            <li className="flex items-center">
              <span className="bg-yellow-200 w-2 h-2 rounded-full mr-2"></span>
              A notebook to capture additional insights
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            withArrow={true}
            onClick={() => setCurrentStep(2)}
            className="text-base px-8 py-3"
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
}; 