import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';
import * as styles from '../../styles/stepStyles';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      // Add a small delay to ensure the session is properly set
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
          Sign in to your account
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{
              color: '#333333',
              fontSize: '14px',
              textDecoration: 'underline'
            }}>
              Forgot your password?
            </Link>
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
            Sign in
          </Button>
        </form>

        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
          </div>

          <Link to="/register" style={{
            color: '#333333',
            fontWeight: '500',
            fontSize: '16px',
            textDecoration: 'none'
          }}>
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
};
