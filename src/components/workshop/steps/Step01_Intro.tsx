import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { CheckCircle, Target, Lightbulb, Zap, Brain, Sparkles, Award, Rocket } from 'lucide-react';

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Hero Section with Dark Background */}
      <div className="black-box mb-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to the <span className="text-brand-yellow">Offer Breakthrough Workshop</span>
          </h1>
          <p className="text-xl mb-4">Design a scalable offer by deeply understanding your market's psychology and needs.</p>
          <div className="product-tab">
            Step 1 of 11
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {/* Introduction Card */}
        <Card 
          variant="black"
          borderRadius="sm"
          padding="sm"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              backgroundColor: '#FFDD00',
              padding: '6px',
              borderRadius: '2px',
              marginTop: '2px',
            }}>
              <Sparkles style={{ height: '18px', width: '18px', color: '#222222' }} />
            </div>
            <p style={{ fontSize: '15px', color: '#FFFFFF', lineHeight: 1.4, fontWeight: 'bold' }}>
              This interactive workshop guides you through uncovering profitable problems and designing 
              <span className="highlight-yellow">scalable offers</span> using the "Why We Buy" methodology.
            </p>
          </div>
          <div style={{
            marginLeft: '34px',
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#FFDD00',
            borderRadius: '2px',
            color: '#222222',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb style={{ height: '16px', width: '16px', flexShrink: 0, color: '#222222' }} />
              Complete all steps to create an offer that resonates.
            </p>
          </div>
        </Card>

        {/* Two Column Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          <Card 
            variant="black"
            borderRadius="sm" 
            padding="sm" 
            hover={false}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                padding: '6px',
                borderRadius: '2px',
              }}>
                <Target style={{ height: '18px', width: '18px', color: '#222222' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                What You'll Achieve
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '6px', paddingRight: '6px', display: 'grid', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Identify and avoid <span className="highlight-yellow">common pitfalls</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Discover trigger events</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Understand jobs your customers need done</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Find profitable target markets</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Uncover high-value problems</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle style={{ height: '16px', width: '16px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Design a scalable offer that resonates</span>
              </li>
            </ul>
          </Card>

          <Card 
            variant="purple"
            borderRadius="sm"
            padding="sm"
            hover={false}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                padding: '6px',
                borderRadius: '2px',
              }}>
                <Zap style={{ height: '18px', width: '18px', color: '#222222' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                How It Works
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '6px', paddingRight: '6px', display: 'grid', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  1
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>Progress through <span className="highlight-yellow">10 designed steps</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  2
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>Each step builds on the previous insights</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  3
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>AI-powered bots help with brainstorming</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  4
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>Save your progress as you go</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  5
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>Get clear action items at each stage</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                }}>
                  6
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '14px', lineHeight: '1.3', fontWeight: 'bold' }}>End with a well-defined offer concept</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Before You Begin Card */}
        <Card 
          variant="yellow"
          borderRadius="sm"
          padding="sm"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
            <div style={{
              backgroundColor: '#222222',
              padding: '6px',
              borderRadius: '2px',
            }}>
              <Brain style={{ height: '18px', width: '18px', color: '#FFDD00' }} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#222222' }}>
              Before You Begin
            </h3>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={{ color: '#222222', paddingLeft: '32px', lineHeight: 1.4 }}>
              Take a moment to reflect on your current business and what you hope to 
              <span className="highlight-black">achieve</span>. 
              The more thoughtful you are in each step, the better your results.
            </p>
            <Card 
              variant="black"
              borderRadius="none"
              padding="sm"
              shadow="none"
              style={{ marginLeft: '10px' }}
            >
              <p style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award style={{ height: '16px', width: '16px', color: '#FFDD00' }} />
                Consider having these things handy:
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '4px',
                    height: '4px',
                    flexShrink: 0,
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 'bold' }}>Notes about your <span className="highlight-yellow">business challenges</span></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '4px',
                    height: '4px',
                    flexShrink: 0,
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 'bold' }}>Ideas or assumptions about your target market</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '4px',
                    height: '4px',
                    flexShrink: 0,
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 'bold' }}>A notebook to capture additional insights</span>
                </li>
              </ul>
            </Card>
          </div>
        </Card>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
          <Button
            variant="yellow"
            size="lg"
            rightIcon={<Rocket style={{ height: '16px', width: '16px' }} />}
            onClick={() => setCurrentStep(2)}
          >
            Start the Workshop
          </Button>
        </div>
      </div>
    </div>
  );
};                                                                          