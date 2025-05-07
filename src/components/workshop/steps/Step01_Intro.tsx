import React from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Zap, ArrowRight } from 'lucide-react';

export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div className="workbook-container" style={{ backgroundColor: '#1E1E1E', color: 'white', padding: '20px' }}>
      {/* Main content grid */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        position: 'relative',
        height: '520px'
      }}>
        {/* Left column - Image */}
        <div style={{
          backgroundColor: '#222222',
          borderRadius: '10px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0',
          width: '48%',
          height: '100%',
          position: 'relative'
        }}>
          <img
            src="./assets/BB_Main_image.png"
            alt="Buyer Breakthrough"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              position: 'absolute',
              bottom: '0',
              maxHeight: '100%',
              left: '0',
              right: '0',
              margin: '0 auto',
              display: 'block' // Ensure the image is displayed as a block element
            }}
          />
        </div>

        {/* Right column - Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '48%' }}>
          {/* From Burnout to Breakthrough */}
          <div style={{
            backgroundColor: '#222222',
            padding: '25px',
            borderRadius: '10px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '10px'
            }}>
              From Burnout to Breakthrough:
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'white',
              lineHeight: '1.5'
            }}>
              Clarify your digital product idea by finding profitable problems to solve
            </p>
          </div>

          {/* How It Works */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '10px',
            color: '#222222',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                backgroundColor: '#FFDD00',
                color: 'black',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'inline-block'
              }}>
                HOW IT WORKS
              </div>
            </div>

            <p style={{
              color: '#222222',
              marginBottom: '15px',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              If you're running a service-based business and feeling trapped in the feast-or-famine cycle,
              this workshop will help you find painful problems worth solving and design a more scalable offer.
            </p>

            <div style={{ marginTop: 'auto' }}>
              <p style={{
                fontSize: '15px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                Consider having these things handy:
              </p>
              <ul style={{
                listStyleType: 'none',
                padding: '0',
                margin: '0'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  • Our current product idea (if you have one)
                </li>
                <li style={{ marginBottom: '8px' }}>
                  • Thoughts about who might buy your product
                </li>
                <li>
                  • A notebook to capture additional insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Achieve Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '30px',
        color: '#222222'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#FFDD00',
            color: 'black',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            WHAT YOU'LL ACHIEVE
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                backgroundColor: '#FFDD00',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <img
                  src="./assets/bomb-icon.png"
                  alt="Bomb Icon"
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#222222',
                margin: 0
              }}>
                Market Clarity
              </h3>
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              color: '#444444'
            }}>
              <li style={{ marginBottom: '10px' }}>
                🔍 Understand why so many products fail
              </li>
              <li style={{ marginBottom: '10px' }}>
                ⚡ Identify trigger events that push people to buy
              </li>
              <li>
                🧠 Understand why people really buy (Jobs-to-be-Done)
              </li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                backgroundColor: '#FFDD00',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <Zap size={24} color="#000000" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#222222',
                margin: 0
              }}>
                Profitable Solutions
              </h3>
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              color: '#444444'
            }}>
              <li style={{ marginBottom: '10px' }}>
                💰 Identify target buyers who will pay premium prices
              </li>
              <li style={{ marginBottom: '10px' }}>
                ❗ Discover painful problems you're uniquely qualified to solve
              </li>
              <li>
                📊 Refine your idea into an offer that people will actually buy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Process Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '25px',
        borderRadius: '10px',
        marginBottom: '30px',
        color: '#222222'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#FFDD00',
            color: 'black',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            THE PROCESS
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              color: '#444444'
            }}>
              <li style={{ marginBottom: '10px' }}>
                ✍️ Progress through 10 designed steps
              </li>
              <li style={{ marginBottom: '10px' }}>
                🧩 Each step builds on previous insights
              </li>
              <li>
                🤖 AI-powered "Sparky" helps with brainstorming
              </li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              color: '#444444'
            }}>
              <li style={{ marginBottom: '10px' }}>
                💾 Save your progress as you go
              </li>
              <li style={{ marginBottom: '10px' }}>
                ✅ Get clear action items at each stage
              </li>
              <li>
                💡 End with a refined product idea ready to test
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        marginBottom: '30px'
      }}>
        <Button
          onClick={() => setCurrentStep(2)}
          style={{
            backgroundColor: '#FFDD00',
            color: 'black',
            padding: '12px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          START THE WORKSHOP
          <ArrowRight style={{ height: '20px', width: '20px' }} />
        </Button>
      </div>
    </div>
  );
};