import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Results() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/analyses/${id}`)
      .then((res) => setAnalysis(res.data.analysis))
      .catch(() => setError('Failed to load analysis'));
  }, [id]);

  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!analysis) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analysis Results</h1>
          <Link to="/" className="text-blue-600 text-sm">← Back to Dashboard</Link>
        </div>

        <div className="mb-6 text-center">
          <div className="text-5xl font-bold text-blue-600">{analysis.ats_score}</div>
          <div className="text-gray-500">ATS Score / 100</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-green-700 mb-2">Matched Keywords</h2>
            <ul className="text-sm space-y-1">
              {analysis.matched_keywords?.map((kw, i) => (
                <li key={i} className="bg-green-50 text-green-800 px-2 py-1 rounded">{kw}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-red-700 mb-2">Missing Keywords</h2>
            <ul className="text-sm space-y-1">
              {analysis.missing_keywords?.map((kw, i) => (
                <li key={i} className="bg-red-50 text-red-800 px-2 py-1 rounded">{kw}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Skill Gaps</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {analysis.skill_gaps?.map((gap, i) => <li key={i}>{gap}</li>)}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Suggestions</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {analysis.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}