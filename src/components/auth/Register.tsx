import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkshopStore } from '../../store/workshopStore';
import { Button } from '../ui/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import * as styles from '../../styles/stepStyles';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { initializeSession } = useWorkshopStore();

  // Get the return URL from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to sign up with email:', email);
      const { error, data } = await signUp(email, password);

      console.log('Sign up response:', { error, data });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      // For local development, we'll show a success message and redirect to login
      if (window.location.origin.includes('localhost')) {
        setSuccessMessage('Registration successful! You can now sign in with your credentials.');
        setLoading(false);

        // Automatically redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      if (data) {
        try {
          // Create a new session
          await initializeSession();
          const currentSessionId = useWorkshopStore.getState().sessionId;

          if (currentSessionId && from === '/step/1') {
            // If we're coming from the intro page and going to step 1, navigate there
            setTimeout(() => {
              navigate(`/step/1?session=${currentSessionId}`);
            }, 500);
          } else {
            // Otherwise, go to the dashboard
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
          }
        } catch (error) {
          console.error('Error initializing session after registration:', error);
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        }
      } else {
        // If email confirmation is required
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1E1E1E',
      padding: '20px'
    }}>
      {/* Logo at the top */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '15px 0',
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
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Create a new account
        </h2>

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

        {successMessage && (
          <div style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <CheckCircle size={20} />
            <div>
              <p style={{ fontWeight: '500', marginBottom: '4px' }}>Success</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="email" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                display: 'block',
                marginBottom: '8px'
              }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputStyle}
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                display: 'block',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputStyle}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                display: 'block',
                marginBottom: '8px'
              }}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.inputStyle}
              />
            </div>

            <Button
              type="submit"
              variant="yellow"
              fullWidth
              isLoading={loading}
              disabled={loading}
              style={{
                marginTop: '10px',
                borderRadius: '15px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Sign up
            </Button>
          </form>
        )}

        <div style={{
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <Link to="/login" style={{
            color: '#333333',
            fontWeight: '500',
            fontSize: '16px',
            textDecoration: 'none'
          }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
