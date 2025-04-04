import React, { useState } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { ChevronRight } from 'lucide-react';

// Since we don't have a Textarea component, let's create a simple one
const Textarea: React.FC<{
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  style?: React.CSSProperties;
}> = ({ id, placeholder, value, onChange, rows, style }) => (
  <textarea
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    style={{
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #444444',
      backgroundColor: '#333333',
      color: 'white',
      fontSize: '16px',
      ...style
    }}
  />
);

export const Step02_MarketDemand: React.FC = () => {
  const { workshopData, updateWorkshopData } = useWorkshopStore();
  const [analysis, setAnalysis] = useState(workshopData.marketDemandAnalysis || '');

  const handleSave = () => {
    updateWorkshopData({
      marketDemandAnalysis: analysis
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <StepHeader
        stepNumber={2}
        title="Understand Market Demand"
        description="Learn how to truly understand what drives purchase decisions"
      />

      <Card variant="darkGradient" padding="lg" shadow="md" style={{ marginBottom: '32px', border: '2px solid #FFDD00' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#FFDD00',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 221, 0, 0.2)', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255, 221, 0, 0.4)'
              }}>2A</span> 
              ✨ The Demand Paradox
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ The common startup advice to "make something people want" is both true and challenging to implement. 
              While businesses often focus on their goals and features, success comes from addressing buyer desires 
              and needs.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ There's frequently a disconnect between what businesses think customers want and what actually 
              drives purchase decisions. To build a successful product or service, we need to understand the 
              deeper emotional factors behind buying choices.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#FFDD00',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 221, 0, 0.2)', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255, 221, 0, 0.4)'
              }}>2B</span> 
              🔍 Understanding Purchase Motivations
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ Most purchases are driven by emotional needs: feeling safe/secure, loved, important, attractive, 
              or in control. These drivers apply to business purchases too, despite the appearance of 
              rational decision-making.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ If you want to build a massively successful new product, you need to dig deeper into the buyer's 
              experience to create a solution they want—and often wouldn't know to ask for directly.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#FFDD00',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: 'rgba(255, 221, 0, 0.2)', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255, 221, 0, 0.4)'
              }}>2C</span> 
              🚀 Introducing the Problem-Up Method
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ The 'Problem-Up Method' differs from traditional "niche down" approaches:
            </p>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#333333', 
              borderRadius: '12px',
              border: '1px solid #444444',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
            }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#FFDD00' }}>🔄 Traditional "Niche Down" Approach:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #FFDD00' }}>Offer</span>
                <ChevronRight size={16} color="#FFDD00" />
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #FFDD00' }}>Target Buyer</span>
                <ChevronRight size={16} color="#FFDD00" />
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #FFDD00' }}>Problems</span>
              </div>
              
              <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#FFDD00' }}>✨ Problem-Up Method:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #6B46C1' }}>JTBD</span>
                <ChevronRight size={16} color="#FFDD00" />
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #6B46C1' }}>Market Problems</span>
                <ChevronRight size={16} color="#FFDD00" />
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #6B46C1' }}>Target Buyer</span>
                <ChevronRight size={16} color="#FFDD00" />
                <span style={{ padding: '8px 12px', backgroundColor: '#222222', color: '#FFDD00', borderRadius: '6px', fontSize: '14px', border: '1px solid #6B46C1' }}>Offer</span>
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#FFFFFF' }}>
              ✨ Consider Adam's story - a freelance marketer who transformed his business using the Problem-Up method. 
              Adam started as a freelance email marketer working with various clients. By applying this method, 
              he clarified his focus: <span style={{ backgroundColor: 'rgba(255, 221, 0, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>"helping gym owners attract and retain new members, profitably"</span>. This allowed him 
              to design a productized service that addresses specific problems, delivers massive value, and maximizes 
              profits through scalability.
            </p>
          </div>

          <div style={{ 
            marginTop: '24px',
            backgroundColor: 'rgba(107, 70, 193, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(107, 70, 193, 0.3)'
          }}>
            <label 
              htmlFor="marketDemandAnalysis" 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px', 
                fontWeight: 700, 
                color: '#FFDD00',
                fontSize: '18px'
              }}
            >
              <span style={{ 
                backgroundColor: 'rgba(255, 221, 0, 0.2)', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255, 221, 0, 0.4)'
              }}>✏️</span>
              Your Analysis:
            </label>
            <p style={{ 
              fontSize: '15px', 
              color: '#FFFFFF', 
              marginBottom: '16px',
              lineHeight: 1.6
            }}>
              ✨ Based on the concepts above, analyze your current understanding of your market's demand:
            </p>
            <Textarea
              id="marketDemandAnalysis"
              placeholder="✨ What emotional drivers might influence your buyers? How might the Problem-Up method change your approach?"
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              rows={6}
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Button variant="yellowToBlack" onClick={handleSave} rightIcon={<span>💾</span>}>
              Save Analysis
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};          