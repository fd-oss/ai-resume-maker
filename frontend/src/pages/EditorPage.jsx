import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PersonalInfoForm from '../components/editor/PersonalInfoForm';
import ExperienceForm from '../components/editor/ExperienceForm';
import EducationForm from '../components/editor/EducationForm';
import SkillsForm from '../components/editor/SkillsForm';
import ProjectsForm from '../components/editor/ProjectsForm';
import ResumePreview from '../components/ResumePreview';
import AiPanel from '../components/AiPanel';

const EMPTY_RESUME = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const SECTIONS = [
  { key: 'personal', label: 'Personal Info', component: PersonalInfoForm },
  { key: 'experience', label: 'Experience', component: ExperienceForm },
  { key: 'education', label: 'Education', component: EducationForm },
  { key: 'skills', label: 'Skills', component: SkillsForm },
  { key: 'projects', label: 'Projects', component: ProjectsForm },
];

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [resumeId, setResumeId] = useState(isNew ? null : id);
  const [title, setTitle] = useState('Untitled Resume');
  const [template, setTemplate] = useState('modern');
  const [data, setData] = useState(EMPTY_RESUME);
  const [openSection, setOpenSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [showAi, setShowAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && id) {
      api.get(`/resumes/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setTemplate(res.data.template);
          setData(res.data.data || EMPTY_RESUME);
        })
        .catch(() => { toast.error('Resume not found'); navigate('/'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const updateData = useCallback((section, value) => {
    setData(prev => ({ ...prev, [section]: value }));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { title, template, data };
      if (resumeId) {
        await api.put(`/resumes/${resumeId}`, payload);
      } else {
        const res = await api.post('/resumes', payload);
        setResumeId(res.data._id);
        navigate(`/editor/${res.data._id}`, { replace: true });
      }
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="text-sm font-semibold bg-transparent border-none outline-none text-gray-800 flex-1 min-w-0"
          placeholder="Resume title..."
        />
        <select
          value={template}
          onChange={e => setTemplate(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="minimal">Minimal</option>
        </select>
        <button
          onClick={() => setShowAi(v => !v)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${showAi ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'}`}
        >
          <Sparkles size={14} />
          AI
        </button>
        <button
          onClick={() => setShowPreview(v => !v)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          Preview
        </button>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
          <Save size={14} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form */}
        <div className="w-full max-w-sm flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          {showAi && (
            <AiPanel data={data} onUpdate={setData} />
          )}
          <div className="divide-y divide-gray-100">
            {SECTIONS.map(({ key, label, component: Comp }) => (
              <div key={key}>
                <button
                  onClick={() => setOpenSection(openSection === key ? null : key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {label}
                  {openSection === key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSection === key && (
                  <div className="px-5 pb-5">
                    <Comp
                      data={data}
                      onChange={updateData}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto">
              <ResumePreview data={data} template={template} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
