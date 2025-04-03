import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap, Brain, Sparkles, Award, Rocket } from 'lucide-react';

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={1}
        title="Welcome to the Offer Breakthrough Workshop"
        description="Design a scalable offer by deeply understanding your market's psychology and needs."
      />

      <div style={{ display: 'grid', gap: '32px' }}>
        <Card 
          variant="gradient"
          borderRadius="lg"
          padding="lg"
          shadow="xl"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              marginRight: '16px',
              marginTop: '4px',
              background: 'rgba(79, 70, 229, 0.1)',
              padding: '8px',
              borderRadius: '9999px'
            }}>
              <Sparkles style={{ height: '24px', width: '24px', color: '#4f46e5' }} />
            </div>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: 1.7 }}>
              This interactive workshop will guide you through the process of uncovering profitable problems
              and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
            </p>
          </div>
          
          <div style={{
            marginLeft: '56px',
            marginRight: '16px',
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '0 8px 8px 0',
            color: '#92400e',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#d97706' }} />
              Complete all steps to create an offer that resonates with your target market
            </p>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <Card 
            variant="default"
            borderRadius="lg" 
            padding="lg" 
            hover={true}
            shadow="lg"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                background: 'rgba(79, 70, 229, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <Target style={{ height: '24px', width: '24px', color: '#4f46e5' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                What You'll Achieve
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', display: 'grid', gap: '16px' }}>
              {[
                "Identify and avoid common pitfalls in offer creation",
                "Discover trigger events that drive buying decisions",
                "Understand the jobs your customers need done",
                "Find profitable target markets",
                "Uncover high-value problems worth solving",
                "Design a scalable offer that resonates with your market"
              ].map((item, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle style={{ height: '20px', width: '20px', color: '#4f46e5', flexShrink: 0, marginTop: '2px', marginRight: '12px' }} />
                  <span style={{ color: '#374151' }}>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card 
            variant="default"
            borderRadius="lg"
            padding="lg"
            hover={true}
            shadow="lg"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                background: 'rgba(14, 165, 233, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <Zap style={{ height: '24px', width: '24px', color: '#0ea5e9' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                How It Works
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', display: 'grid', gap: '16px' }}>
              {[
                "Progress through 10 carefully designed steps",
                "Each step builds on the previous insights",
                "AI-powered bots help with brainstorming",
                "Save your progress as you go",
                "Get clear action items at each stage",
                "End with a well-defined offer concept"
              ].map((item, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #0ea5e9, #4f46e5)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    marginTop: '2px',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ color: '#374151' }}>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card 
          variant="muted"
          borderRadius="lg"
          padding="lg"
          shadow="md"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              background: '#fffbeb',
              padding: '8px',
              borderRadius: '8px',
              marginRight: '12px'
            }}>
              <Brain style={{ height: '24px', width: '24px', color: '#d97706' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Before You Begin
            </h3>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <p style={{ color: '#374151', paddingLeft: '44px' }}>
              Take a moment to reflect on your current business and what you hope to achieve with your new offer. 
              The more thoughtful you are in each step, the better your results will be.
            </p>
            <Card 
              variant="default"
              borderRadius="md"
              padding="md"
              shadow="sm"
              style={{ marginLeft: '24px' }}
            >
              <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <Award style={{ height: '20px', width: '20px', marginRight: '8px', color: '#4f46e5' }} />
                Consider having these things handy:
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: '12px', display: 'grid', gap: '12px' }}>
                {[ 
                  "Notes about your current business challenges",
                  "Ideas or assumptions about your target market",
                  "A notebook to capture additional insights"
                ].map((item, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #fde68a, #facc15)',
                      width: '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      marginRight: '12px'
                    }}></div>
                    <span style={{ color: '#374151', fontSize: '14px' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px' }}>
          <Button
            variant="gradient"
            size="xl"
            rightIcon={<Rocket style={{ marginLeft: '8px', height: '20px', width: '20px' }} />}
            onClick={() => setCurrentStep(2)}
            style={{
              fontSize: '18px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.15)',
            }}
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
}; 