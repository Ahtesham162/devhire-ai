import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Terminal, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    try {
      await api.post('/auth/resend-otp', { email });
      setResendMsg('New code sent!');
    } catch (err) {
      setResendMsg('Failed to resend');
    } finally {
      setResending(false);
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
          <h2 className="font-display font-bold text-lg mb-1">Verify your email</h2>
          <p className="text-muted text-sm mb-4">Enter the 6-digit code sent to <span className="text-accent">{email}</span></p>

          {error && <p className="text-danger text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-accent transition"
              maxLength={6}
              required
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-1.5 bg-accent text-bg font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : <>Verify <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="text-center mt-4">
            <button onClick={handleResend} disabled={resending} className="text-xs text-muted hover:text-accent transition">
              {resending ? 'Sending...' : "Didn't get a code? Resend"}
            </button>
            {resendMsg && <p className="text-xs text-success mt-1">{resendMsg}</p>}
          </div>
        </div>

        <p className="text-sm text-center mt-4 text-muted">
          <Link to="/login" className="text-accent">Back to login</Link>
        </p>
      </div>
    </div>
  );
}