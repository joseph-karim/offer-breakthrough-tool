import React from 'react';
import { Button } from '../../ui/Button';
import { useWorkshopStore } from '../../../store/workshopStore';
import { Target, Zap, ArrowRight } from 'lucide-react';

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
            src="/assets/BB_main_image.png"
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
              margin: '0 auto'
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
              Get Your Business Calls Answered, Not Ignored
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'white',
              lineHeight: '1.5'
            }}>
              Look legit on every call. Ring4 helps solo pros and small teams connect faster with branded caller ID and a unified inbox.
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

      {/* Ring4 Solutions: Use Cases Section */}
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
            RING4 SOLUTIONS: USE CASES
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1 */}
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} className="hover-lift">
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>
              📞
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#222222',
              marginBottom: '10px'
            }}>
              Fix Spam-Labeled Calls
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              Problem: Your legitimate business calls get flagged as spam.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#444444',
              marginBottom: '10px'
            }}>
              Ring4 Solution: Verified business caller ID increases answer rates by 70%.
            </p>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '60px',
                backgroundImage: 'linear-gradient(to right, #f0f0f0 0%, #f0f0f0 40%, #e0e0e0 40%, #e0e0e0 100%)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  backgroundColor: '#ffdddd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ff4444',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  SPAM
                </div>
                <div style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  backgroundColor: '#ddffdd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#44aa44',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  VERIFIED
                </div>
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '5px',
                  width: '40px',
                  height: '20px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'linear-gradient(to top right, #dddddd 0%, #dddddd 40%, #44aa44 40%, #44aa44 100%)',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} className="hover-lift">
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>
              🧘‍♂️
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#222222',
              marginBottom: '10px'
            }}>
              Separate Work & Personal
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              Problem: No boundaries between work and personal life.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#444444',
              marginBottom: '10px'
            }}>
              Ring4 Solution: Dedicated business lines with scheduled availability.
            </p>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '60px',
                backgroundColor: '#f8f8f8',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #eeeeee'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#666666'
                }}>
                  Work Mode
                  <div style={{
                    fontSize: '10px',
                    color: '#888888'
                  }}>
                    9am-5pm
                  </div>
                </div>
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: '#666666'
                }}>
                  Personal Mode
                  <div style={{
                    fontSize: '10px',
                    color: '#888888'
                  }}>
                    After Hours
                  </div>
                </div>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '20px',
                  backgroundColor: '#dddddd',
                  borderRadius: '10px',
                  padding: '2px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: '4px',
                    top: '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} className="hover-lift">
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>
              💬
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#222222',
              marginBottom: '10px'
            }}>
              Convert Site Visitors via SMS
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              Problem: Website visitors leave before connecting.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#444444',
              marginBottom: '10px'
            }}>
              Ring4 Solution: One-click texting converts browsers to buyers.
            </p>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '60px',
                backgroundColor: '#f8f8f8',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #eeeeee'
              }}>
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '10px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#4477ff',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  💬
                </div>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '10px',
                  width: '60%',
                  height: '8px',
                  backgroundColor: '#dddddd',
                  borderRadius: '4px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '24px',
                  width: '40%',
                  height: '8px',
                  backgroundColor: '#dddddd',
                  borderRadius: '4px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '38px',
                  width: '50%',
                  height: '8px',
                  backgroundColor: '#dddddd',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} className="hover-lift">
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>
              🤝
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#222222',
              marginBottom: '10px'
            }}>
              Unify Team Replies
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              Problem: Disconnected communications create customer confusion.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#444444',
              marginBottom: '10px'
            }}>
              Ring4 Solution: Shared inbox ensures consistent customer experience.
            </p>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '60px',
                backgroundColor: '#f8f8f8',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #eeeeee'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '10px',
                  width: '70%',
                  height: '10px',
                  backgroundColor: '#eeeeee',
                  borderRadius: '5px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#44aa44',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '25px',
                  width: '60%',
                  height: '10px',
                  backgroundColor: '#eeeeee',
                  borderRadius: '5px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '25px',
                  top: '25px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#4477ff',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '40px',
                  width: '50%',
                  height: '10px',
                  backgroundColor: '#eeeeee',
                  borderRadius: '5px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '40px',
                  top: '40px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#ff7744',
                  borderRadius: '50%'
                }}></div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div style={{
            backgroundColor: '#F5F5F5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }} className="hover-lift">
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>
              🌍
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#222222',
              marginBottom: '10px'
            }}>
              Expand Into New Regions
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              Problem: Breaking into new markets requires local presence.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#444444',
              marginBottom: '10px'
            }}>
              Ring4 Solution: Instant local numbers anywhere your business grows.
            </p>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '60px',
                backgroundColor: '#f8f8f8',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #eeeeee'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  height: '40px',
                  borderRadius: '4px',
                  border: '1px dashed #cccccc'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '20%',
                  top: '30%',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ff4444',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '20%',
                  bottom: '10px',
                  fontSize: '8px',
                  color: '#666666'
                }}>
                  212
                </div>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '60%',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#4477ff',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '10px',
                  fontSize: '8px',
                  color: '#666666'
                }}>
                  415
                </div>
                <div style={{
                  position: 'absolute',
                  right: '20%',
                  top: '40%',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#44aa44',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  right: '20%',
                  bottom: '10px',
                  fontSize: '8px',
                  color: '#666666'
                }}>
                  305
                </div>
              </div>
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
                <Target size={24} color="#000000" />
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