import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, Sparkles, Copy, Check, ChevronUp, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../api/axios';

export default function Results() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLetter, setShowLetter] = useState(true);

  useEffect(() => {
    api.get(`/analyses/${id}`)
      .then((res) => {
        setAnalysis(res.data.analysis);
        if (res.data.analysis.coverLetter) {
          setCoverLetter(res.data.analysis.coverLetter);
        }
      })
      .catch(() => setError('Failed to load analysis'));
  }, [id]);

  const handleGenerateCoverLetter = async () => {
    setGeneratingLetter(true);
    try {
      const res = await api.post(`/analyses/${id}/cover-letter`);
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      alert('Failed to generate cover letter');
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('DevHire AI — Resume Analysis Report', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120);
    doc.text(`Resume: ${analysis.resumeFilename}`, margin, y);
    y += 5;
    doc.text(`Generated: ${new Date(analysis.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
    y += 12;

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`ATS Score: ${analysis.ats_score} / 100`, margin, y);
    y += 12;

    const addSection = (title, items) => {
      if (!items || items.length === 0) return;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`•  ${item}`, maxWidth);
        lines.forEach((line) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 6;
        });
      });
      y += 6;
    };

    addSection('Matched Keywords', analysis.matched_keywords);
    addSection('Missing Keywords', analysis.missing_keywords);
    addSection('Skill Gaps', analysis.skill_gaps);
    addSection('Suggestions', analysis.suggestions);

    if (coverLetter) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Cover Letter', margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const letterLines = doc.splitTextToSize(coverLetter, maxWidth);
      letterLines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      });
    }

    doc.save(`DevHireAI-Analysis-${analysis.resumeFilename.replace('.pdf', '')}.pdf`);
  };

  if (error) return <p className="max-w-2xl mx-auto px-4 py-10 text-danger">{error}</p>;
  if (!analysis) return <p className="max-w-2xl mx-auto px-4 py-10 text-muted">Loading...</p>;

  const score = analysis.ats_score;
  const colorClass = score >= 70 ? 'text-success' : score >= 40 ? 'text-accent' : 'text-danger';
  const strokeColor = score >= 70 ? '#4ADE80' : score >= 40 ? '#F5A623' : '#F87171';

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-white transition">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <button
          onClick={downloadPDF}
          className="inline-flex items-center gap-1.5 text-sm bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-accent/50 transition"
        >
          <Download size={14} /> Download PDF
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 mt-4 mb-6 flex flex-col items-center">
        <p className="text-xs uppercase tracking-widest text-muted mb-4">ATS Score</p>
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#2A2E37" strokeWidth="10" />
            <circle
              cx="80" cy="80" r={radius} fill="none"
              stroke={strokeColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono font-bold text-4xl ${colorClass}`}>{score}</span>
            <span className="text-xs text-muted">/ 100</span>
          </div>
        </div>
        <p className="text-sm text-muted mt-4 text-center max-w-xs">
          {score >= 70 ? 'Strong match for this role' : score >= 40 ? 'Moderate match — some gaps to address' : 'Significant gaps against this role'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <h2 className="text-xs uppercase tracking-widest text-success mb-3">Matched</h2>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matched_keywords?.map((kw, i) => (
              <span key={i} className="font-mono text-xs bg-success/10 text-success px-2 py-1 rounded-md">
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <h2 className="text-xs uppercase tracking-widest text-danger mb-3">Missing</h2>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing_keywords?.map((kw, i) => (
              <span key={i} className="font-mono text-xs bg-danger/10 text-danger px-2 py-1 rounded-md">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Skill Gaps</h2>
        <ul className="space-y-2.5">
          {analysis.skill_gaps?.map((gap, i) => (
            <li key={i} className="text-sm flex gap-2.5 items-start">
              <ArrowRight size={14} className="text-accent mt-0.5 flex-shrink-0" /> {gap}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 mb-4">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-3">Suggestions</h2>
        <ul className="space-y-2.5">
          {analysis.suggestions?.map((s, i) => (
            <li key={i} className="text-sm flex gap-2.5 items-start">
              <ArrowRight size={14} className="text-accent mt-0.5 flex-shrink-0" /> {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs uppercase tracking-widest text-muted">Cover Letter</h2>
          {coverLetter && (
            <div className="flex items-center gap-3">
              {showLetter && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-muted hover:text-accent transition"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
              <button
                onClick={() => setShowLetter((prev) => !prev)}
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition"
              >
                {showLetter ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showLetter ? 'Hide' : 'Show'}
              </button>
            </div>
          )}
        </div>

        {!coverLetter && (
          <button
            onClick={handleGenerateCoverLetter}
            disabled={generatingLetter}
            className="flex items-center gap-2 bg-accent text-bg font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {generatingLetter ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Generate Cover Letter
              </>
            )}
          </button>
        )}

        {coverLetter && showLetter && (
          <p className="text-sm text-muted whitespace-pre-line leading-relaxed">{coverLetter}</p>
        )}
      </div>
    </div>
  );
}