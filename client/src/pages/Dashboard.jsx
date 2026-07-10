import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/analyses')
      .then((res) => setAnalyses(res.data.analyses))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">DevHire AI Dashboard</h1>
          <button onClick={logout} className="text-sm text-red-600">Log out</button>
        </div>

        <Link
          to="/upload"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded mb-6 hover:bg-blue-700"
        >
          + New Analysis
        </Link>

        {loading && <p>Loading...</p>}
        {!loading && analyses.length === 0 && (
          <p className="text-gray-500 text-center">No analyses yet. Upload a resume to get started.</p>
        )}

        <div className="space-y-3">
          {analyses.map((a) => (
            <Link
              key={a._id}
              to={`/results/${a._id}`}
              className="block bg-white p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{a.resumeFilename}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-xl font-bold text-blue-600">{a.ats_score}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}