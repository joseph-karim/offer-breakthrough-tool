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
          From Burnout to Breakthrough: Clarify your digital product idea by finding profitable problems to solve
        </p>
        <div className="product-tab">
          Step 1 of 10
        </div>
      </div>

      {/* Purple Info Section */}
      <div className="info-bubble" style={{ margin: '24px 0' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles style={{ height: '24px', width: '24px', color: '#FFDD00' }} />
          <h2 className="info-bubble-title m-0">Solve <span className="explosive-highlight">bigger problems</span>, earn bigger paychecks</h2>
        </div>
        <p className="info-bubble-subtitle">
          This interactive workshop guides you through finding painful problems people will pay
          <span className="highlight-yellow">premium prices</span> to solve using the "Problem-Up" methodology.
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
                  🔍 Understand why so many products <span className="highlight-yellow">fail</span>
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">2.</span>
                <span className="workbook-list-content font-semibold">
                  ⚡ Identify trigger events that push people to buy
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">3.</span>
                <span className="workbook-list-content font-semibold">
                  🧠 Understand why people really buy (Jobs-to-be-Done)
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
                  💰 Identify target buyers who will pay premium prices
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">2.</span>
                <span className="workbook-list-content font-semibold">
                  ❗ Discover painful problems you're uniquely qualified to solve
                </span>
              </li>
              <li className="workbook-list-item">
                <span className="workbook-list-number mr-3">3.</span>
                <span className="workbook-list-content font-semibold">
                  📊 Refine your idea into an offer that people will actually buy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-12">
          <h2 className="workbook-title" style={{ fontSize: '28px' }}>How It Works</h2>
          <div className="workbook-instruction">
            This step-by-step process helps you clarify your digital product idea in just 2 hours
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
                      <p className="font-bold">AI-powered "Sparky" helps with brainstorming 🤖</p>
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
                      <p className="font-bold">End with a refined product idea ready to test 💡</p>
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
            If you're running a service-based business and feeling trapped in the feast-or-famine cycle,
            this workshop will help you find <span className="highlight-yellow">painful problems</span> worth solving
            and design a more scalable offer.
          </p>

          <div style={{ backgroundColor: '#222222', padding: '16px' }}>
            <p style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
              <Award style={{ height: '18px', width: '18px', color: '#FFDD00' }} />
              🏆 Consider having these things handy:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-2">
                <div style={{ backgroundColor: '#FFDD00', width: '6px', height: '6px', borderRadius: '50%', marginTop: '8px' }}></div>
                <span className="text-white font-bold">📝 Your current <span className="highlight-yellow">product idea</span> (if you have one)</span>
              </li>
              <li className="flex items-start gap-2">
                <div style={{ backgroundColor: '#FFDD00', width: '6px', height: '6px', borderRadius: '50%', marginTop: '8px' }}></div>
                <span className="text-white font-bold">🎯 Thoughts about who might buy your product</span>
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