import React from 'react';
// import { Card } from '../../ui/Card'; // Remove unused Card import
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Target, Lightbulb, Zap, Brain, Sparkles, Award, ArrowRight } from 'lucide-react'; // Remove unused CheckCircle and Rocket

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div className="workbook-container">
      {/* Hero Section with Purple Background */}
      <div className="landing-hero">
        <h1 className="landing-title">
          Welcome to the <span style={{ color: '#FFDD00' }}>Buyer Breakthrough Workshop</span> 🚀
        </h1>
        <p className="landing-subtitle">
          Design a scalable offer by deeply understanding your market's psychology and needs
        </p>
        <div className="product-tab">
          Step 1 of 11
        </div>
      </div>
      
      {/* Purple Info Section */}
      <div className="info-bubble" style={{ margin: '24px 0' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles style={{ height: '24px', width: '24px', color: '#FFDD00' }} />
          <h2 className="info-bubble-title m-0">Get <span className="explosive-highlight">explosive clarity</span> about your offer</h2>
        </div>
        <p className="info-bubble-subtitle">
          This interactive workshop guides you through uncovering profitable problems and designing 
          <span className="highlight-yellow">scalable offers</span> using the "Why We Buy" methodology.
        </p>
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#FFDD00', borderRadius: '0' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#222222' }}>
            <Lightbulb style={{ height: '20px', width: '20px', flexShrink: 0, color: '#222222' }} />
            ✨ Complete all steps to create an offer that resonates with your exact audience.
          </p>
        </div>
      </div>

      <div className="workbook-content">
        <h2 className="workbook-title" style={{ fontSize: '28px' }}>What You'll Achieve</h2>
        
        {/* Feature List in Canvas Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="landing-feature-icon">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold">Market Clarity</h3>
            </div>
            <ul className="workbook-list">
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">1.</span>
                <span className="workbook-list-content font-semibold">
                  🔍 Identify and avoid <span className="highlight-yellow">common pitfalls</span>
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">2.</span>
                <span className="workbook-list-content font-semibold">
                  ⚡ Discover trigger events that cause purchases
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">3.</span>
                <span className="workbook-list-content font-semibold">
                  🧠 Understand jobs your customers need done
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="landing-feature-icon">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold">Profitable Solutions</h3>
            </div>
            <ul className="workbook-list">
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">1.</span>
                <span className="workbook-list-content font-semibold">
                  💰 Find profitable target markets with real demand
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">2.</span>
                <span className="workbook-list-content font-semibold">
                  ❗ Uncover high-value problems worth solving
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">3.</span>
                <span className="workbook-list-content font-semibold">
                  📊 Design a scalable offer that resonates and sells
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mt-12">
          <h2 className="workbook-title" style={{ fontSize: '28px' }}>How It Works</h2>
          <div className="workbook-instruction">
            This step-by-step process guides you to product-market fit in record time
          </div>
          
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="text-yellow-500" size={20} />
                  The Process
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                    <div className="flex-1">
                      <p className="font-bold">Progress through <span className="highlight-yellow">10 designed steps</span> 🧠</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                    <div className="flex-1">
                      <p className="font-bold">Each step builds on previous insights 🧩</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                    <div className="flex-1">
                      <p className="font-bold">AI-powered bots help with brainstorming 🤖</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Your Journey
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                    <div className="flex-1">
                      <p className="font-bold">Save your progress as you go 💾</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>5</div>
                    <div className="flex-1">
                      <p className="font-bold">Get clear action items at each stage ✅</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div style={{ backgroundColor: '#FFDD00', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>6</div>
                    <div className="flex-1">
                      <p className="font-bold">End with a well-defined offer concept 💡</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Before You Begin Section */}
        <div className="info-bubble mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Brain style={{ height: '24px', width: '24px', color: '#FFDD00' }} />
            <h2 className="info-bubble-title m-0">Before You Begin 🧠</h2>
          </div>
          
          <p className="info-bubble-content mb-4">
            Take a moment to reflect on your current business and what you hope to 
            <span className="highlight-yellow">achieve</span>. 
            The more thoughtful you are in each step, the better your results.
          </p>
          
          <div style={{ backgroundColor: '#222222', padding: '16px' }}>
            <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
              <Award style={{ height: '18px', width: '18px', color: '#FFDD00' }} />
              🏆 Consider having these things handy:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-2">
                <div style={{ backgroundColor: '#FFDD00', width: '6px', height: '6px', borderRadius: '50%', marginTop: '8px' }}></div>
                <span className="text-white font-bold">📝 Notes about your <span className="highlight-yellow">business challenges</span></span>
              </li>
              <li className="flex items-start gap-2">
                <div style={{ backgroundColor: '#FFDD00', width: '6px', height: '6px', borderRadius: '50%', marginTop: '8px' }}></div>
                <span className="text-white font-bold">🎯 Ideas or assumptions about your target market</span>
              </li>
              <li className="flex items-start gap-2">
                <div style={{ backgroundColor: '#FFDD00', width: '6px', height: '6px', borderRadius: '50%', marginTop: '8px' }}></div>
                <span className="text-white font-bold">📓 A notebook to capture additional insights</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="landing-cta">
          <Button
            variant="yellow"
            size="xl"
            rightIcon={<ArrowRight style={{ height: '20px', width: '20px' }} />}
            onClick={() => setCurrentStep(2)}
          >
            Start the Workshop 🚀
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            No preparation needed. You can start immediately.
          </p>
        </div>
      </div>
    </div>
  );
};                                                                          