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
      <div className="bg-brand-black text-white py-12 px-6 mb-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the <span className="text-brand-yellow">Offer Breakthrough Workshop</span>
          </h1>
          <p className="text-xl mb-6">Design a scalable offer by deeply understanding your market's psychology and needs.</p>
          <div className="inline-block bg-brand-yellow text-brand-black font-bold px-6 py-3 rounded-md">
            Step 1 of 11
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Introduction Card */}
        <Card 
          variant="black"
          borderRadius="xl"
          padding="lg"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              backgroundColor: '#FFDD00',
              padding: '10px',
              borderRadius: '9999px',
              marginTop: '4px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              <Sparkles style={{ height: '24px', width: '24px', color: '#222222' }} />
            </div>
            <p style={{ fontSize: '18px', color: '#FFFFFF', lineHeight: 1.7, fontWeight: 'bold' }}>
              This interactive workshop guides you through uncovering profitable problems and designing 
              <span className="highlight-yellow">scalable offers</span> using the "Why We Buy" methodology.
            </p>
          </div>
          <div style={{
            marginLeft: '56px',
            marginRight: '16px',
            marginTop: '20px',
            padding: '12px 16px',
            backgroundColor: '#FFDD00',
            borderRadius: '8px',
            color: '#222222',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb style={{ height: '20px', width: '20px', flexShrink: 0, color: '#222222' }} />
              Complete all steps to create an offer that resonates.
            </p>
          </div>
        </Card>

        {/* Two Column Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <Card 
            variant="black"
            borderRadius="xl" 
            padding="lg" 
            hover={true}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Target style={{ height: '24px', width: '24px', color: '#222222' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
                What You'll Achieve
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', paddingRight: '12px', display: 'grid', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Identify and avoid <span className="highlight-yellow">common pitfalls</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Discover <span className="highlight-yellow">trigger events</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Understand jobs your customers <span className="highlight-yellow">need done</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Find <span className="highlight-yellow">profitable target markets</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Uncover <span className="highlight-yellow">high-value problems</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle style={{ height: '20px', width: '20px', color: '#FFDD00', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Design a <span className="highlight-yellow">scalable offer</span> that resonates</span>
              </li>
            </ul>
          </Card>

          <Card 
            variant="purple"
            borderRadius="xl"
            padding="lg"
            hover={true}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                padding: '10px',
                borderRadius: '8px',
              }}>
                <Zap style={{ height: '24px', width: '24px', color: '#222222' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
                How It Works
              </h3>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: '12px', paddingRight: '12px', display: 'grid', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  1
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}>Progress through <span className="highlight-yellow">10 carefully designed steps</span></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  2
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}>Each step <span className="highlight-yellow">builds on</span> the previous insights</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  3
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}><span className="highlight-yellow">AI-powered</span> bots help with brainstorming</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  4
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}>Save your <span className="highlight-yellow">progress</span> as you go</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  5
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}>Get <span className="highlight-yellow">clear action items</span> at each stage</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                <div style={{
                  flexShrink: 0,
                  backgroundColor: '#FFDD00',
                  color: '#222222',
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}>
                  6
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '16px', lineHeight: '1.5', fontWeight: 'bold' }}>End with a <span className="highlight-yellow">well-defined offer</span> concept</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Before You Begin Card */}
        <Card 
          variant="yellow"
          borderRadius="xl"
          padding="lg"
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
            <div style={{
              backgroundColor: '#222222',
              padding: '10px',
              borderRadius: '8px',
            }}>
              <Brain style={{ height: '24px', width: '24px', color: '#FFDD00' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#222222' }}>
              Before You Begin
            </h3>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            <p style={{ color: '#222222', paddingLeft: '44px', lineHeight: 1.6 }}>
              Take a moment to reflect on your current business and what you hope to 
              <span className="highlight-black">achieve</span>. 
              The more thoughtful you are in each step, the better your results.
            </p>
            <Card 
              variant="black"
              borderRadius="lg"
              padding="md"
              shadow="sm"
              style={{ marginLeft: '24px' }}
            >
              <p style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ height: '20px', width: '20px', color: '#FFDD00' }} />
                Consider having these things handy:
              </p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'grid', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>Notes about your <span className="highlight-yellow">current business challenges</span></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>Ideas or assumptions about your <span className="highlight-yellow">target market</span></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    backgroundColor: '#FFDD00',
                    width: '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}></div>
                  <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>A notebook to capture <span className="highlight-yellow">additional insights</span></span>
                </li>
              </ul>
            </Card>
          </div>
        </Card>

        {/* Start Button */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px' }}>
          <Button
            variant="yellow"
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