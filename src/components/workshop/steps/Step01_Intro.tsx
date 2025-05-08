import React from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';


export const Step01_Intro: React.FC = () => {
  const { setCurrentStep } = useWorkshopStore();

  return (
    <div className="workbook-container" style={{ backgroundColor: '#1E1E1E', color: 'white', padding: '20px' }}>
      {/* Main content grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '20px',
      }}>
        {/* Top section with image and headline */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
        }}>
          {/* Left column - Image */}
          <div style={{
            width: '50%',
            backgroundColor: '#222222',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/assets/BB_Main_image.png"
              alt="Buyer Breakthrough"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>

          {/* Right column - From Burnout to Breakthrough */}
          <div style={{
            width: '50%',
            backgroundColor: '#222222',
            padding: '25px',
            borderRadius: '10px',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '15px'
            }}>
              From Burnout to Breakthrough
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'white',
              lineHeight: '1.5'
            }}>
              Find profitable problems worth solving and design a scalable offer idea that "actually" sells in this live 2.5-hour workshop
            </p>
          </div>
        </div>

        {/* What you'll achieve + How it works section */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
        }}>
          {/* What you'll achieve */}
          <div style={{
            width: '50%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            color: 'black',
          }}>
            <div style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '15px',
              backgroundColor: '#fcf720',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block',
            }}>
              WHAT YOU'LL ACHIEVE
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{ marginBottom: '10px' }}>
                • Get clear on the painful, expensive problems you're uniquely qualified to solve
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Identify target buyers who will pay a premium for solutions
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Walk away with a painkilling offer idea you're ready to validate
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div style={{
            width: '50%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            color: 'black',
          }}>
            <div style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '15px',
              backgroundColor: '#fcf720',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'inline-block',
            }}>
              HOW IT WORKS
            </div>
            <ul style={{
              listStyleType: 'none',
              padding: '0',
              margin: '0'
            }}>
              <li style={{ marginBottom: '10px' }}>
                • Watch 9 fluff-free mini lessons
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Complete hands-on exercises that get you unstuck
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Brainstorm faster using your AI-powered Sparky bot
              </li>
              <li style={{ marginBottom: '10px' }}>
                • Download a summary of your work at the end
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        marginBottom: '20px',
      }}>
        <Button
          onClick={() => setCurrentStep(2)}
          style={{
            backgroundColor: '#fcf720',
            color: 'black',
            padding: '12px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          START WORKSHOP &gt;
        </Button>
      </div>
    </div>
  );
};