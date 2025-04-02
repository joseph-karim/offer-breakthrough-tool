import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap, ArrowRight, Brain } from 'lucide-react';

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
        <Card className="bg-white border border-gray-200 shadow-md" padding="lg">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              This interactive workshop will guide you through the process of uncovering profitable problems
              and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
            </p>
            
            <div className="py-2 px-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-800">
              <p className="text-sm font-medium flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                Complete all steps to create an offer that resonates with your target market
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="bg-gradient-to-br from-primary-50 to-white border border-primary-100" 
            padding="lg" 
            hover={true}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-primary-700">
              <Target className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
              What You'll Achieve
            </h3>
            <ul className="space-y-4">
              {[
                "Identify and avoid common pitfalls in offer creation",
                "Discover trigger events that drive buying decisions",
                "Understand the jobs your customers need done",
                "Find profitable target markets",
                "Uncover high-value problems worth solving",
                "Design a scalable offer that resonates with your market"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card 
            className="bg-gradient-to-br from-secondary-50 to-white border border-secondary-100" 
            padding="lg"
            hover={true}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center text-secondary-700">
              <Zap className="mr-3 h-6 w-6 text-secondary flex-shrink-0" />
              How It Works
            </h3>
            <ul className="space-y-4">
              {[
                "Progress through 10 carefully designed steps",
                "Each step builds on the previous insights",
                "AI-powered bots help with brainstorming",
                "Save your progress as you go",
                "Get clear action items at each stage",
                "End with a well-defined offer concept"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card 
          className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200" 
          padding="lg"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center text-yellow-700">
            <Brain className="mr-3 h-6 w-6 text-yellow-500 flex-shrink-0" />
            Before You Begin
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              Take a moment to reflect on your current business and what you hope to achieve with your new offer. 
              The more thoughtful you are in each step, the better your results will be.
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <p className="font-medium text-gray-800 mb-3">Consider having these things handy:</p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-yellow-200 w-2 h-2 rounded-full mr-3"></span>
                  <span className="text-gray-700">Notes about your current business challenges</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-yellow-200 w-2 h-2 rounded-full mr-3"></span>
                  <span className="text-gray-700">Ideas or assumptions about your target market</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-yellow-200 w-2 h-2 rounded-full mr-3"></span>
                  <span className="text-gray-700">A notebook to capture additional insights</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-6">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="ml-2 h-5 w-5" />}
            onClick={() => setCurrentStep(2)}
            className="px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl"
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
}; 