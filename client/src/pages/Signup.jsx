import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, ArrowRight, Gauge, Target, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-surface border-r border-border p-10">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <Terminal size={18} className="text-accent" strokeWidth={2.5} />
          DevHire<span className="text-accent">AI</span>
        </div>

        <div>
          <h1 className="font-display font-bold text-3xl leading-tight mb-3">
            Know exactly why<br />you're getting rejected.
          </h1>
          <p className="text-muted text-sm mb-8 max-w-sm">
            Upload your resume and a job description. Get an ATS score, matched and missing keywords, and a plan to close the gap.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Gauge size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Instant ATS scoring</p>
                <p className="text-xs text-muted">See how a real screening system reads your resume</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Target size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Keyword gap analysis</p>
                <p className="text-xs text-muted">Know exactly what's missing for a specific role</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">AI-generated suggestions</p>
                <p className="text-xs text-muted">Actionable fixes, not generic advice</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted/60">Built for freshers navigating the ATS black box.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 min-h-screen">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 font-display font-bold text-lg mb-8 justify-center">
            <Terminal size={18} className="text-accent" strokeWidth={2.5} />
            DevHire<span className="text-accent">AI</span>
          </div>

          <h2 className="font-display font-bold text-xl mb-1">Create your account</h2>
          <p className="text-muted text-sm mb-6">Start analyzing your resume in seconds</p>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 bg-accent text-bg font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : <>Sign Up <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted">
            Already have an account? <Link to="/login" className="text-accent font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}