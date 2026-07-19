import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 font-display font-bold text-lg mb-8 justify-center">
          <Terminal size={18} className="text-accent" strokeWidth={2.5} />
          DevHire<span className="text-accent">AI</span>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          {sent ? (
            <div className="text-center">
              <p className="text-sm">If an account exists for <span className="text-accent">{email}</span>, a reset link has been sent.</p>
              <p className="text-xs text-muted mt-2">Check your inbox (and spam folder).</p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-bold text-lg mb-1">Reset your password</h2>
              <p className="text-muted text-sm mb-4">Enter your email and we'll send a reset link</p>
              {error && <p className="text-danger text-sm mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 bg-accent text-bg font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={15} /></>}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-sm text-center mt-4 text-muted">
          <Link to="/login" className="text-accent">Back to login</Link>
        </p>
      </div>
    </div>
  );
}