import React from 'react';
import StepHeader from '../../ui/StepHeader';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap, ArrowRight, Brain, Sparkles, Award, BarChart, Rocket } from 'lucide-react';

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
        <Card 
          className="bg-gradient-to-r from-white to-primary-50 border border-primary-100 shadow-lg" 
          padding="lg"
        >
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                This interactive workshop will guide you through the process of uncovering profitable problems
                and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
              </p>
            </div>
            
            <div className="pl-14 pr-4 py-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-yellow-800">
              <p className="text-sm font-medium flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-600" />
                Complete all steps to create an offer that resonates with your target market
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            className="bg-gradient-to-br from-primary-50 to-white border border-primary-100" 
            padding="lg" 
            hover={true}
          >
            <div className="flex items-center mb-5">
              <div className="bg-primary/20 p-2 rounded-lg mr-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                What You'll Achieve
              </h3>
            </div>
            <ul className="space-y-4 pl-3">
              {[
                "Identify and avoid common pitfalls in offer creation",
                "Discover trigger events that drive buying decisions",
                "Understand the jobs your customers need done",
                "Find profitable target markets",
                "Uncover high-value problems worth solving",
                "Design a scalable offer that resonates with your market"
              ].map((item, index) => (
                <li key={index} className="flex items-start group transition-all duration-200 hover:translate-x-1">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-3 group-hover:scale-110 transition-all duration-200" />
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
            <div className="flex items-center mb-5">
              <div className="bg-secondary/20 p-2 rounded-lg mr-3">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                How It Works
              </h3>
            </div>
            <ul className="space-y-4 pl-3">
              {[
                "Progress through 10 carefully designed steps",
                "Each step builds on the previous insights",
                "AI-powered bots help with brainstorming",
                "Save your progress as you go",
                "Get clear action items at each stage",
                "End with a well-defined offer concept"
              ].map((item, index) => (
                <li key={index} className="flex items-start group transition-all duration-200 hover:translate-x-1">
                  <div className="flex-shrink-0 bg-gradient-to-r from-secondary to-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card 
          className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 shadow-md" 
          padding="lg"
        >
          <div className="flex items-center mb-5">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <Brain className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Before You Begin
            </h3>
          </div>
          <div className="space-y-5">
            <p className="text-gray-700 pl-12">
              Take a moment to reflect on your current business and what you hope to achieve with your new offer. 
              The more thoughtful you are in each step, the better your results will be.
            </p>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md ml-6">
              <p className="font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Consider having these things handy:
              </p>
              <ul className="space-y-3 pl-3">
                <li className="flex items-center group transition-all duration-200 hover:translate-x-1">
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 w-2 h-2 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-gray-700">Notes about your current business challenges</span>
                </li>
                <li className="flex items-center group transition-all duration-200 hover:translate-x-1">
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 w-2 h-2 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-gray-700">Ideas or assumptions about your target market</span>
                </li>
                <li className="flex items-center group transition-all duration-200 hover:translate-x-1">
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 w-2 h-2 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></div>
                  <span className="text-gray-700">A notebook to capture additional insights</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-center pt-8">
          <Button
            variant="gradient"
            size="lg"
            icon={<Rocket className="ml-2 h-5 w-5" />}
            onClick={() => setCurrentStep(2)}
            className="px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
}; 