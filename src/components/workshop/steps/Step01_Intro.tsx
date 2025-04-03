import React from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap, Brain, Sparkles, Award, Rocket } from 'lucide-react';

// Helper component for list items
const ListItem = ({ icon: Icon, text, iconColor = '#4f46e5' }: { icon: React.ElementType, text: string, iconColor?: string }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <Icon style={{ height: '20px', width: '20px', color: iconColor, flexShrink: 0, marginTop: '2px' }} />
    <span style={{ color: '#374151' }}>{text}</span>
  </li>
);

// Helper component for numbered list items
const NumberedListItem = ({ number, text, color1 = '#0ea5e9', color2 = '#4f46e5' }: { number: number, text: string, color1?: string, color2?: string }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <div style={{
      flexShrink: 0,
      background: `linear-gradient(135deg, ${color1}, ${color2})`,
      color: 'white',
      width: '24px',
      height: '24px',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '2px',
      fontSize: '12px',
      fontWeight: 600,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }}>
      {number}
    </div>
    <span style={{ color: '#374151' }}>{text}</span>
  </li>
);

// Helper component for bullet points
const BulletPoint = ({ text }: { text: string }) => (
  <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{
      background: 'linear-gradient(135deg, #fde68a, #facc15)',
      width: '8px',
      height: '8px',
      borderRadius: '9999px',
      flexShrink: 0,
    }}></div>
    <span style={{ color: '#374151', fontSize: '14px' }}>{text}</span>
  </li>
);

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
        {/* Introduction Card */}
        <Card 
          variant="gradient"
          borderRadius="xl"
          padding="lg"
          shadow="lg"
          style={{ border: '1px solid rgba(255, 255, 255, 0.6)'}}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              background: 'rgba(79, 70, 229, 0.1)',
              padding: '8px',
              borderRadius: '9999px',
              marginTop: '4px'
            }}>
              <Sparkles style={{ height: '24px', width: '24px', color: '#4f46e5' }} />
            </div>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: 1.7 }}>
              This interactive workshop guides you through uncovering profitable problems
              and designing scalable offers using CustomerCamp's "Why We Buy" methodology.
            </p>
          </div>
          <div style={{
            marginLeft: '56px',
            marginRight: '16px',
            marginTop: '20px',
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '0 8px 8px 0',
            color: '#92400e',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb style={{ height: '20px', width: '20px', flexShrink: 0, color: '#d97706' }} />
              Complete all steps to create an offer that resonates.
            </p>
          </div>
        </Card>

        {/* Two Column Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <Card 
            variant="default"
            borderRadius="xl" 
            padding="lg" 
            hover={true}
            shadow="lg"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
              <div style={{
                background: 'rgba(79, 70, 229, 0.1)',
                padding: '8px',
                borderRadius: '8px',
              }}>
                <Target style={{ height: '24px', width: '24px', color: '#4f46e5' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                What You'll Achieve
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '16px' }}>
              <ListItem icon={CheckCircle} text="Identify and avoid common pitfalls" />
              <ListItem icon={CheckCircle} text="Discover trigger events" />
              <ListItem icon={CheckCircle} text="Understand jobs your customers need done" />
              <ListItem icon={CheckCircle} text="Find profitable target markets" />
              <ListItem icon={CheckCircle} text="Uncover high-value problems" />
              <ListItem icon={CheckCircle} text="Design a scalable offer that resonates" />
            </ul>
          </Card>

          <Card 
            variant="default"
            borderRadius="xl"
            padding="lg"
            hover={true}
            shadow="lg"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
              <div style={{
                background: 'rgba(14, 165, 233, 0.1)',
                padding: '8px',
                borderRadius: '8px',
              }}>
                <Zap style={{ height: '24px', width: '24px', color: '#0ea5e9' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                How It Works
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '16px' }}>
              <NumberedListItem number={1} text="Progress through 10 carefully designed steps" />
              <NumberedListItem number={2} text="Each step builds on the previous insights" />
              <NumberedListItem number={3} text="AI-powered bots help with brainstorming" />
              <NumberedListItem number={4} text="Save your progress as you go" />
              <NumberedListItem number={5} text="Get clear action items at each stage" />
              <NumberedListItem number={6} text="End with a well-defined offer concept" />
            </ul>
          </Card>
        </div>

        {/* Before You Begin Card */}
        <Card 
          variant="muted"
          borderRadius="xl"
          padding="lg"
          shadow="md"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
            <div style={{
              background: '#fffbeb',
              padding: '8px',
              borderRadius: '8px',
            }}>
              <Brain style={{ height: '24px', width: '24px', color: '#d97706' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Before You Begin
            </h3>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <p style={{ color: '#374151', paddingLeft: '44px', lineHeight: 1.6 }}>
              Take a moment to reflect on your current business and what you hope to achieve. 
              The more thoughtful you are in each step, the better your results.
            </p>
            <Card 
              variant="default"
              borderRadius="lg"
              padding="md"
              shadow="sm"
              style={{ marginLeft: '24px' }}
            >
              <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ height: '20px', width: '20px', color: '#4f46e5' }} />
                Consider having these things handy:
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '12px' }}>
                <BulletPoint text="Notes about your current business challenges" />
                <BulletPoint text="Ideas or assumptions about your target market" />
                <BulletPoint text="A notebook to capture additional insights" />
              </ul>
            </Card>
          </div>
        </Card>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px' }}>
          <Button
            variant="gradient"
            size="xl"
            rightIcon={<Rocket style={{ height: '20px', width: '20px' }} />}
            onClick={() => setCurrentStep(2)}
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
}; 