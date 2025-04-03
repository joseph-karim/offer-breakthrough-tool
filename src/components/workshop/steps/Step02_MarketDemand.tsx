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
      border: '1px solid #d1d5db',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#1e293b',
              margin: 0
            }}>
              2A: The Demand Paradox
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              The common startup advice to "make something people want" is both true and challenging to implement. 
              While businesses often focus on their goals and features, success comes from addressing buyer desires 
              and needs.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              There's frequently a disconnect between what businesses think customers want and what actually 
              drives purchase decisions. To build a successful product or service, we need to understand the 
              deeper emotional factors behind buying choices.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#1e293b',
              margin: 0
            }}>
              2B: Understanding Purchase Motivations
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Most purchases are driven by emotional needs: feeling safe/secure, loved, important, attractive, 
              or in control. These drivers apply to business purchases too, despite the appearance of 
              rational decision-making.
            </p>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              If you want to build a massively successful new product, you need to dig deeper into the buyer's 
              experience to create a solution they want—and often wouldn't know to ask for directly.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#1e293b',
              margin: 0
            }}>
              2C: Introducing the Problem-Up Method
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              The 'Problem-Up Method' differs from traditional "niche down" approaches:
            </p>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: 500 }}>Traditional "Niche Down" Approach:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '14px' }}>Offer</span>
                <ChevronRight size={16} color="#94a3b8" />
                <span style={{ padding: '8px 12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '14px' }}>Target Buyer</span>
                <ChevronRight size={16} color="#94a3b8" />
                <span style={{ padding: '8px 12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '14px' }}>Problems</span>
              </div>
              
              <p style={{ margin: '0 0 12px 0', fontWeight: 500 }}>Problem-Up Method:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ padding: '8px 12px', backgroundColor: '#dbeafe', borderRadius: '6px', fontSize: '14px' }}>JTBD</span>
                <ChevronRight size={16} color="#94a3b8" />
                <span style={{ padding: '8px 12px', backgroundColor: '#dbeafe', borderRadius: '6px', fontSize: '14px' }}>Market Problems</span>
                <ChevronRight size={16} color="#94a3b8" />
                <span style={{ padding: '8px 12px', backgroundColor: '#dbeafe', borderRadius: '6px', fontSize: '14px' }}>Target Buyer</span>
                <ChevronRight size={16} color="#94a3b8" />
                <span style={{ padding: '8px 12px', backgroundColor: '#dbeafe', borderRadius: '6px', fontSize: '14px' }}>Offer</span>
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
              Consider Adam's story - a freelance marketer who transformed his business using the Problem-Up method. 
              Adam started as a freelance email marketer working with various clients. By applying this method, 
              he clarified his focus: "helping gym owners attract and retain new members, profitably". This allowed him 
              to design a productized service that addresses specific problems, delivers massive value, and maximizes 
              profits through scalability.
            </p>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label 
              htmlFor="marketDemandAnalysis" 
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500, 
                color: '#334155' 
              }}
            >
              Your Analysis:
            </label>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              marginBottom: '12px' 
            }}>
              Based on the concepts above, analyze your current understanding of your market's demand:
            </p>
            <Textarea
              id="marketDemandAnalysis"
              placeholder="What emotional drivers might influence your buyers? How might the Problem-Up method change your approach?"
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              rows={6}
              style={{ marginBottom: '16px' }}
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