import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { Button } from '../ui/Button';
import { PlusIcon, Trash2Icon, PencilIcon, AlertCircle } from 'lucide-react';
import * as styles from '../../styles/stepStyles';
import { WorkshopSession } from '../../types/workshop';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkshopSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editSessionName, setEditSessionName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workshop_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load your workshop sessions');
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    if (!user) return;

    try {
      const sessionId = `session_${Date.now()}`;
      const name = newSessionName.trim() || 'Untitled Workshop';

      const { error } = await supabase
        .from('workshop_sessions')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          name,
          current_step: 0,
          workshop_data: {
            bigIdea: { description: '', version: 'initial' },
            underlyingGoal: { businessGoal: '' },
            triggerEvents: [],
            jobs: [],
            targetBuyers: [],
            pains: [],
            stepChats: {}
          }
        });

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
      setIsCreatingNew(false);
      setNewSessionName('');

      // Navigate directly to Step 1 with the new session
      navigate(`/step/1?session=${sessionId}`);
    } catch (err: any) {
      console.error('Error creating session:', err);
      setError('Failed to create new workshop session');
    }
  };

  const updateSessionName = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workshop_sessions')
        .update({ name: editSessionName })
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
      setEditingSession(null);
      setEditSessionName('');
    } catch (err: any) {
      console.error('Error updating session:', err);
      setError('Failed to update workshop session name');
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user || !confirm('Are you sure you want to delete this workshop session? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('workshop_sessions')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
    } catch (err: any) {
      console.error('Error deleting session:', err);
      setError('Failed to delete workshop session');
    }
  };

  const continueSession = (sessionId: string, currentStep: number) => {
    // Always navigate to at least step 1, never to intro
    const step = currentStep === 0 ? 1 : currentStep;
    navigate(`/step/${step}?session=${sessionId}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1E1E1E',
      padding: '40px 20px'
    }}>
      {/* Logo at the top */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px 0',
        maxWidth: '300px',
        margin: '0 auto 30px auto',
      }}>
        <img
          src="/assets/Buyer Breakthrough Logo.png"
          alt="Buyer Breakthrough Logo"
          style={{
            maxWidth: '200px',
            height: 'auto',
          }}
        />
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333333',
            margin: 0
          }}>
            My Workshops
          </h1>
          <Button
            variant="yellow"
            onClick={() => setIsCreatingNew(true)}
            leftIcon={<PlusIcon size={16} />}
            disabled={isCreatingNew}
            style={{
              borderRadius: '15px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            New Workshop
          </Button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={20} />
            <div>
              <p style={{ fontWeight: '500', marginBottom: '4px' }}>Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {isCreatingNew && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#F9FAFB',
            borderRadius: '15px',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '15px'
            }}>
              Create New Workshop
            </h2>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Workshop Name"
                style={{
                  ...styles.inputStyle,
                  flex: 1
                }}
              />
              <Button
                variant="yellow"
                onClick={createNewSession}
                style={{
                  borderRadius: '15px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsCreatingNew(false)}
                style={{
                  borderRadius: '15px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0'
          }}>
            <div style={{
              display: 'inline-block',
              width: '30px',
              height: '30px',
              border: '3px solid #F3F4F6',
              borderTopColor: '#FFD700',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              marginTop: '12px',
              color: '#4B5563',
              fontSize: '16px'
            }}>
              Loading your workshops...
            </p>
            <style>
              {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : sessions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            backgroundColor: '#F9FAFB',
            borderRadius: '15px',
            border: '1px solid #E5E7EB'
          }}>
            <p style={{
              color: '#4B5563',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              You don't have any workshop sessions yet.
            </p>
            <Button
              variant="yellow"
              onClick={() => setIsCreatingNew(true)}
              leftIcon={<PlusIcon size={16} />}
              style={{
                borderRadius: '15px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Create Your First Workshop
            </Button>
          </div>
        ) : (
          <div style={{
            borderRadius: '15px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <tr>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4B5563'
                  }}>
                    Workshop Name
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4B5563'
                  }}>
                    Last Updated
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4B5563'
                  }}>
                    Progress
                  </th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#4B5563'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => (
                  <tr
                    key={session.session_id}
                    style={{
                      borderBottom: index < sessions.length - 1 ? '1px solid #E5E7EB' : 'none',
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                    }}
                  >
                    <td style={{
                      padding: '16px',
                      whiteSpace: 'nowrap'
                    }}>
                      {editingSession === session.session_id ? (
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center'
                        }}>
                          <input
                            type="text"
                            value={editSessionName}
                            onChange={(e) => setEditSessionName(e.target.value)}
                            style={{
                              ...styles.inputStyle,
                              padding: '8px 12px',
                              fontSize: '14px'
                            }}
                          />
                          <Button
                            variant="yellow"
                            size="xs"
                            onClick={() => updateSessionName(session.session_id)}
                            style={{
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '14px'
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => setEditingSession(null)}
                            style={{
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div style={{
                          fontWeight: '500',
                          color: '#333333',
                          fontSize: '16px'
                        }}>
                          {session.name}
                        </div>
                      )}
                    </td>
                    <td style={{
                      padding: '16px',
                      whiteSpace: 'nowrap',
                      color: '#6B7280',
                      fontSize: '14px'
                    }}>
                      {new Date(session.updated_at).toLocaleDateString()} at {new Date(session.updated_at).toLocaleTimeString()}
                    </td>
                    <td style={{
                      padding: '16px',
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        marginBottom: '6px'
                      }}>
                        Step {session.current_step} of 10
                      </div>
                      <div style={{
                        width: '100%',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '9999px',
                        height: '8px'
                      }}>
                        <div
                          style={{
                            backgroundColor: '#FFD700',
                            height: '8px',
                            borderRadius: '9999px',
                            width: `${Math.min(100, (session.current_step / 10) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </td>
                    <td style={{
                      padding: '16px',
                      whiteSpace: 'nowrap',
                      textAlign: 'right'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                      }}>
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => {
                            setEditingSession(session.session_id);
                            setEditSessionName(session.name);
                          }}
                          leftIcon={<PencilIcon size={14} />}
                          style={{
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '14px'
                          }}
                        >
                          Rename
                        </Button>
                        <Button
                          variant="yellow"
                          size="xs"
                          onClick={() => continueSession(session.session_id, session.current_step)}
                          style={{
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '14px'
                          }}
                        >
                          Continue
                        </Button>
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => deleteSession(session.session_id)}
                          leftIcon={<Trash2Icon size={14} />}
                          style={{
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '14px'
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
