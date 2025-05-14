import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { Button } from '../ui/Button';
import { PlusIcon, Trash2Icon, PencilIcon } from 'lucide-react';
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
      
      // Navigate to the new session
      navigate(`/intro?session=${sessionId}`);
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
    const route = currentStep === 0 ? '/intro' : `/step/${currentStep}`;
    navigate(`${route}?session=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Workshops</h1>
          <Button 
            variant="primary" 
            onClick={() => setIsCreatingNew(true)}
            leftIcon={<PlusIcon size={16} />}
            disabled={isCreatingNew}
          >
            New Workshop
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCreatingNew && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-medium text-white mb-3">Create New Workshop</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Workshop Name"
                className="flex-1 rounded-md border border-gray-700 bg-gray-700 px-3 py-2 text-white placeholder-gray-400"
              />
              <Button variant="primary" onClick={createNewSession}>Create</Button>
              <Button variant="outline" onClick={() => setIsCreatingNew(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-white">Loading your workshops...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-white mb-4">You don't have any workshop sessions yet.</p>
            <Button 
              variant="primary" 
              onClick={() => setIsCreatingNew(true)}
              leftIcon={<PlusIcon size={16} />}
            >
              Create Your First Workshop
            </Button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Workshop Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {sessions.map((session) => (
                  <tr key={session.session_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingSession === session.session_id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editSessionName}
                            onChange={(e) => setEditSessionName(e.target.value)}
                            className="rounded-md border border-gray-700 bg-gray-700 px-2 py-1 text-white placeholder-gray-400 text-sm"
                          />
                          <Button 
                            variant="primary" 
                            size="xs" 
                            onClick={() => updateSessionName(session.session_id)}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="xs" 
                            onClick={() => setEditingSession(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="text-white font-medium">{session.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(session.updated_at).toLocaleDateString()} at {new Date(session.updated_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        Step {session.current_step} of 10
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (session.current_step / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="xs"
                          onClick={() => {
                            setEditingSession(session.session_id);
                            setEditSessionName(session.name);
                          }}
                          leftIcon={<PencilIcon size={14} />}
                        >
                          Rename
                        </Button>
                        <Button 
                          variant="primary" 
                          size="xs"
                          onClick={() => continueSession(session.session_id, session.current_step)}
                        >
                          Continue
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="xs"
                          onClick={() => deleteSession(session.session_id)}
                          leftIcon={<Trash2Icon size={14} />}
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
