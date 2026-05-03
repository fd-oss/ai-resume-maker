import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Edit, Calendar } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resumes')
      .then(res => setResumes(res.data))
      .catch(() => toast.error('Failed to load resumes'))
      .finally(() => setLoading(false));
  }, []);

  const createNew = async () => {
    try {
      const res = await api.post('/resumes', {
        title: 'Untitled Resume',
        data: { personalInfo: { name: user?.name || '' }, experience: [], education: [], skills: [], projects: [], certifications: [] }
      });
      navigate(`/editor/${res.data._id}`);
    } catch {
      toast.error('Failed to create resume');
    }
  };

  const deleteResume = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(r => r.filter(x => x._id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const templateColors = { modern: 'bg-sky-100 text-sky-700', classic: 'bg-amber-100 text-amber-700', minimal: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-500 mt-1">Create and manage your AI-powered resumes</p>
        </div>
        <button onClick={createNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Resume
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="card animate-pulse h-36 bg-gray-100" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="mx-auto text-gray-300 mb-4" size={56} />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No resumes yet</h3>
          <p className="text-gray-400 mb-6">Create your first AI-powered resume in minutes</p>
          <button onClick={createNew} className="btn-primary">
            Create your first resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map(r => (
            <div
              key={r._id}
              onClick={() => navigate(`/editor/${r._id}`)}
              className="card cursor-pointer hover:shadow-md hover:border-sky-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                  <FileText className="text-sky-500" size={20} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/editor/${r._id}`}
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    <Edit size={15} />
                  </Link>
                  <button
                    onClick={e => deleteResume(r._id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 truncate">{r.title}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${templateColors[r.template] || templateColors.modern}`}>
                {r.template}
              </span>
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                <Calendar size={12} />
                Updated {new Date(r.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
