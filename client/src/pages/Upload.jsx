import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileCheck } from 'lucide-react';
import api from '../api/axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and paste a job description');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { extractedText, filename } = uploadRes.data;

      if (!extractedText || extractedText.trim().length < 20) {
        setError('Could not extract text from this PDF. It may be a scanned/image-based file. Please upload a text-based PDF (exported from Word, Google Docs, etc.)');
        setLoading(false);
        return;
      }

      const analyzeRes = await api.post('/analyze', {
        resumeText: extractedText,
        jobDescription,
        resumeFilename: filename,
      });
      navigate(`/results/${analyzeRes.data.analysis._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-2xl mb-1">New Analysis</h1>
      <p className="text-muted text-sm mb-8">Upload your resume and the job you're targeting</p>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Resume</label>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl py-10 cursor-pointer hover:border-accent/50 hover:bg-surface/50 transition bg-surface">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              required
            />
            {file ? (
              <>
                <FileCheck size={22} className="text-success" />
                <span className="text-sm text-white">{file.name}</span>
              </>
            ) : (
              <>
                <UploadCloud size={22} className="text-muted" />
                <span className="text-sm text-muted">Click to upload PDF resume</span>
              </>
            )}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent text-bg font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </form>
      {loading && (
        <p className="text-xs text-muted text-center mt-3">
          This usually takes 10-20 seconds — parsing your resume and running AI analysis
        </p>
      )}
    </div>
  );
}