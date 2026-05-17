import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password, mode, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-panel">
        <div className="hero-chip">Production-grade outreach control center</div>
        <h1>Launch campaigns without losing track of leads, inbox safety, or follow-ups.</h1>
        <p>
          Upload 25,000+ leads, rotate SMTP accounts, attach the right resume, and watch every send from one admin dashboard.
        </p>
        <form className="stack-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Admin name" />
          )}
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="email" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
          />
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create admin account'}
          </button>
        </form>
        <button className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

