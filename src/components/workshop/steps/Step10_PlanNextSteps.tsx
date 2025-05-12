import React, { useCallback, useState, useEffect } from 'react';
import { useWorkshopStore } from '../../../store/workshopStore';
import type { WorkshopStore } from '../../../store/workshopStore';
import { ExternalLink } from 'lucide-react';
import { Button } from '../../ui/Button';
import * as styles from '../../../styles/stepStyles';
import { SaveIndicator } from '../../ui/SaveIndicator';

// Separate selectors to prevent unnecessary re-renders
const selectWorkshopData = (state: WorkshopStore) => state.workshopData;
const selectUpdateWorkshopData = (state: WorkshopStore) => state.updateWorkshopData;

export const Step10_PlanNextSteps: React.FC = () => {
  const workshopData = useWorkshopStore(selectWorkshopData);
  const updateWorkshopData = useWorkshopStore(selectUpdateWorkshopData);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    preSellPlan: workshopData.nextSteps?.preSellPlan || '',
    workshopReflections: workshopData.nextSteps?.workshopReflections || ''
  });

  // Initialize with data from the store
  useEffect(() => {
    setFormData({
      preSellPlan: workshopData.nextSteps?.preSellPlan || '',
      workshopReflections: workshopData.nextSteps?.workshopReflections || ''
    });
  }, [
    workshopData.nextSteps?.preSellPlan,
    workshopData.nextSteps?.workshopReflections
  ]);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaving(true);

    // Debounce saving to avoid too many updates
    const timeoutId = setTimeout(() => {
      const updatedNextSteps = {
        preSellPlan: field === 'preSellPlan' ? value : (workshopData.nextSteps?.preSellPlan || ''),
        workshopReflections: field === 'workshopReflections' ? value : (workshopData.nextSteps?.workshopReflections || '')
      };

      updateWorkshopData({
        nextSteps: updatedNextSteps
      });
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [updateWorkshopData, workshopData.nextSteps]);

  return (
    <div style={styles.stepContainerStyle} data-sb-field-path="content">
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#fcf720',
          color: 'black',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '15px',
          marginTop: '3px'
        }} data-sb-field-path="stepNumber">
          10
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: 0
        }} data-sb-field-path="title">
          Plan Next Steps
        </h2>
      </div>

      {/* Main content area */}
      <div style={styles.contentContainerStyle}>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Description */}
          <div style={styles.stepDescriptionStyle} data-sb-field-path="description">
            <p>You have a shiny new idea to explore. Now it's time to plan how you'll validate that you're on the right track—so you don't spend months building the wrong thing.</p>
          </div>

          {/* Info box */}
          <div style={styles.yellowInfoBoxStyle} data-sb-field-path="infoBox">
            💡 Pre-selling your offer is the best way to validate market demand
          </div>

          {/* Step 1: Define Pre-Sell Plan */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '0 0 16px 0'
            }} data-sb-field-path="section1Title">
              Step 1) Define Pre-Sell Plan
            </h3>

            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              margin: '0 0 16px 0'
            }} data-sb-field-path="section1Description">
              How will you validate that there is demand for your new offer?
            </p>

            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#4b5563',
              margin: '0 0 12px 0'
            }} data-sb-field-path="section1Prompt">
              Ask yourself:
            </p>

            <ul style={{
              listStyle: 'disc',
              paddingLeft: '24px',
              color: '#4b5563',
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="section1Questions">
              <li>Who are the first 3-10 people you could approach about your offer?</li>
              <li>What's the simplest version of your offer you could pre-sell?</li>
              <li>What's a reasonable timeline for delivery?</li>
              <li>What price point would make it irresistible for early adopters but still valuable to you?</li>
            </ul>

            <textarea
              value={formData.preSellPlan}
              onChange={(e) => handleInputChange('preSellPlan', e.target.value)}
              placeholder="(e.g., I will start with competitor research and do some review mining. I'll get clear on my positioning and create a messaging strategy. Then I will craft a succinct pitch for my new solution and email a few of my best clients to share the idea and invite them to a discovery call to discuss it further)"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: '#f8fafc',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Step 2: Workshop Reflections */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1e293b',
              margin: '24px 0 16px 0'
            }} data-sb-field-path="section2Title">
              Step 2) Workshop Reflections
            </h3>

            <p style={{
              fontSize: '16px',
              color: '#4b5563',
              margin: '0 0 16px 0'
            }} data-sb-field-path="section2Description">
              What are your top learnings or key insights from this workshop?
            </p>

            <textarea
              value={formData.workshopReflections}
              onChange={(e) => handleInputChange('workshopReflections', e.target.value)}
              placeholder="(e.g., I never thought about the power of targeting specific moments before. Now that I know what I want to build and feel confident that it solves a real problem, I need to figure out how to talk about it in a persuasive way.)"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: '#f8fafc',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <SaveIndicator saving={isSaving} />
            </div>
          </div>

          {/* Need messaging help? */}
          <div style={{
            padding: '24px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            color: 'white',
            marginTop: '32px'
          }} data-sb-field-path="ctaSection">
            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaTitle">
              Need messaging help?
            </h3>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaDescription">
              Now that you have a refined offer idea and validation plan, it's time to test your concept with real potential buyers before building it. The best validation is to pre-sell your offer.
            </p>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaSubDescription">
              That means you need to figure out your product positioning, messaging strategy, and craft your pitch.
            </p>

            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaProductName">
              Consider grabbing PAINKILLER, the AI-fuelled messaging system for time-crunched entrepreneurs.
            </p>

            <p style={{
              fontSize: '16px',
              margin: '0 0 16px 0'
            }} data-sb-field-path="ctaProductIntro">
              With help from Sparky, you can:
            </p>

            <ol style={{
              paddingLeft: '24px',
              fontSize: '16px',
              margin: '0 0 24px 0'
            }} data-sb-field-path="ctaFeatures">
              <li>Audit the competitive landscape</li>
              <li>Do fast-as-f*ck customer research</li>
              <li>Figure out your product positioning</li>
              <li>Design your painkiller messaging strategy</li>
              <li>Craft direct-response copy to pre-sell your offer</li>
            </ol>

            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 24px 0'
            }} data-sb-field-path="ctaTimeframe">
              All in just 3.5 days
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="yellow"
                size="lg"
                rightIcon={<ExternalLink size={16} />}
                onClick={() => window.open('https://learnwhywebuy.com/painkiller-flash-sale/', '_blank')}
                data-sb-field-path="ctaButton"
              >
                Figure out your pre-sale messaging &gt;
              </Button>
            </div>
          </div>

          {/* Testimonial */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px'
          }} data-sb-field-path="testimonialSection">
            <img
              src="../../../../../../dist/testimonial.png"
              alt="Customer testimonial"
              style={{
                maxWidth: '100%',
                borderRadius: '8px'
              }}
              data-sb-field-path="testimonialImage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
