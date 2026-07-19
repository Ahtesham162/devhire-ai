import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Terminal, ArrowRight } from 'lucide-react';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
          {success ? (
            <p className="text-sm text-success text-center">Password reset! Redirecting to login...</p>
          ) : (
            <>
              <h2 className="font-display font-bold text-lg mb-1">Set a new password</h2>
              <p className="text-muted text-sm mb-4">Choose a new password (min 8 characters)</p>
              {error && <p className="text-danger text-sm mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition"
                  required
                  minLength={8}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 bg-accent text-bg font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : <>Reset Password <ArrowRight size={15} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}