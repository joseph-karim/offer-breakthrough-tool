import React, { useState } from 'react';
import { StepHeader } from '../../ui/StepHeader';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { ChevronRight, HelpCircle, Lightbulb } from 'lucide-react';

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
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#222222',
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

      <Card variant="default" padding="lg" shadow="md" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '0 8px 8px 0',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <Lightbulb style={{ height: '20px', width: '20px', marginRight: '8px', flexShrink: 0, color: '#0ea5e9' }} />
            Understanding market demand means focusing on what really drives your customers to make purchasing decisions.
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#222222',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: '#eef2ff', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #e0e7ff'
              }}>2A</span> 
              The Demand Paradox
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              The common startup advice to "make something people want" is both true and challenging to implement. 
              While businesses often focus on their goals and features, success comes from addressing buyer desires 
              and needs.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              There's frequently a disconnect between what businesses think customers want and what actually 
              drives purchase decisions. To build a successful product or service, we need to understand the 
              deeper emotional factors behind buying choices.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#222222',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: '#eef2ff', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #e0e7ff'
              }}>2B</span> 
              Understanding Purchase Motivations
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              Most purchases are driven by emotional needs: feeling safe/secure, loved, important, attractive, 
              or in control. These drivers apply to business purchases too, despite the appearance of 
              rational decision-making.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              If you want to build a massively successful new product, you need to dig deeper into the buyer's 
              experience to create a solution they want—and often wouldn't know to ask for directly.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#222222',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                backgroundColor: '#eef2ff', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #e0e7ff'
              }}>2C</span> 
              Introducing the Problem-Up Method
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              The 'Problem-Up Method' differs from traditional "niche down" approaches:
            </p>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#4b5563' }}>Traditional "Niche Down" Approach:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#FFDD00', color: '#222222', borderRadius: '6px', fontSize: '14px' }}>Offer</span>
                <ChevronRight size={16} color="#666666" />
                <span style={{ padding: '8px 12px', backgroundColor: '#FFDD00', color: '#222222', borderRadius: '6px', fontSize: '14px' }}>Target Buyer</span>
                <ChevronRight size={16} color="#666666" />
                <span style={{ padding: '8px 12px', backgroundColor: '#FFDD00', color: '#222222', borderRadius: '6px', fontSize: '14px' }}>Problems</span>
              </div>
              
              <p style={{ margin: '0 0 12px 0', fontWeight: 600, color: '#4b5563' }}>Problem-Up Method:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#6B46C1', color: 'white', borderRadius: '6px', fontSize: '14px' }}>JTBD</span>
                <ChevronRight size={16} color="#666666" />
                <span style={{ padding: '8px 12px', backgroundColor: '#6B46C1', color: 'white', borderRadius: '6px', fontSize: '14px' }}>Market Problems</span>
                <ChevronRight size={16} color="#666666" />
                <span style={{ padding: '8px 12px', backgroundColor: '#6B46C1', color: 'white', borderRadius: '6px', fontSize: '14px' }}>Target Buyer</span>
                <ChevronRight size={16} color="#666666" />
                <span style={{ padding: '8px 12px', backgroundColor: '#6B46C1', color: 'white', borderRadius: '6px', fontSize: '14px' }}>Offer</span>
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#374151' }}>
              Consider Adam's story - a freelance marketer who transformed his business using the Problem-Up method. 
              Adam started as a freelance email marketer working with various clients. By applying this method, 
              he clarified his focus: <span style={{ backgroundColor: '#fff7ed', color: '#9a3412', padding: '2px 6px', borderRadius: '4px' }}>"helping gym owners attract and retain new members, profitably"</span>. This allowed him 
              to design a productized service that addresses specific problems, delivers massive value, and maximizes 
              profits through scalability.
            </p>
          </div>

          <div style={{ 
            marginTop: '24px',
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <label 
              htmlFor="marketDemandAnalysis" 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px', 
                fontWeight: 700, 
                color: '#4b5563',
                fontSize: '18px'
              }}
            >
              <span style={{ 
                backgroundColor: '#eef2ff', 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #e0e7ff'
              }}>✏️</span>
              Your Analysis:
              <HelpCircle 
                size={16} 
                style={{ color: '#6b7280', marginLeft: '4px' }} 
                aria-label="Record your thoughts on market demand based on the concepts above"
              />
            </label>
            <p style={{ 
              fontSize: '15px', 
              color: '#4b5563', 
              marginBottom: '16px',
              lineHeight: 1.6
            }}>
              Based on the concepts above, analyze your current understanding of your market's demand:
            </p>
            <Textarea
              id="marketDemandAnalysis"
              placeholder="What emotional drivers might influence your buyers? How might the Problem-Up method change your approach?"
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              rows={6}
              style={{ 
                marginBottom: '20px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Button variant="primary" onClick={handleSave}>
              Save Analysis
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};          