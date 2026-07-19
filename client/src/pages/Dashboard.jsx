import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Inbox, Trash2 } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analyses')
      .then((res) => setAnalyses(res.data.analyses))
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-accent';
    return 'text-danger';
  };

  const handleDelete = async (e, analysisId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this analysis?')) return;
    try {
      await api.delete(`/analyses/${analysisId}`);
      setAnalyses((prev) => prev.filter((a) => a._id !== analysisId));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Your resume analysis history</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-1.5 bg-accent text-bg font-semibold text-sm px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          <Plus size={16} /> New Analysis
        </Link>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl px-5 py-6 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && analyses.length === 0 && (
        <div className="border border-dashed border-border rounded-xl p-16 text-center">
          <Inbox size={32} className="mx-auto text-muted mb-3" />
          <p className="text-muted">No analyses yet</p>
          <p className="text-sm text-muted/70 mt-1">Upload a resume to see how it scores against a job</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 mt-5 text-accent text-sm font-medium hover:opacity-80 transition"
          >
            <Plus size={15} /> Run your first analysis
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {analyses.map((a) => (
          <Link
            key={a._id}
            to={`/results/${a._id}`}
            className="flex justify-between items-center bg-surface border border-border rounded-xl px-5 py-4 hover:border-accent/40 hover:bg-surface/80 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-muted group-hover:text-accent transition" />
              </div>
              <div>
                <p className="font-medium text-sm">{a.resumeFilename}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(a.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`font-mono font-bold text-2xl ${scoreColor(a.ats_score)}`}>
                {a.ats_score}
              </div>
              <button
                onClick={(e) => handleDelete(e, a._id)}
                className="p-1.5 text-muted hover:text-danger transition opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}