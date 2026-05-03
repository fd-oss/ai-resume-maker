import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AiPanel({ data, onUpdate }) {
  const [jobDesc, setJobDesc] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    if (!jobDesc.trim()) { toast.error('Paste a job description first'); return; }
    setGenerating(true);
    try {
      const res = await api.post('/ai/generate-full-resume', {
        jobDescription: jobDesc,
        userInfo: {
          name: data.personalInfo?.name,
          role: data.personalInfo?.role,
          experience: data.experience,
          education: data.education,
          skills: data.skills,
        },
      });
      onUpdate(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary: res.data.summary },
        skills: [...new Set([...(prev.skills || []), ...(res.data.skills || [])])],
        experience: res.data.experience?.length
          ? res.data.experience.map((ai, i) => ({
              ...(prev.experience[i] || {}),
              description: ai.description,
            }))
          : prev.experience,
      }));
      toast.success('Resume tailored to job description!');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border-b border-violet-100 bg-violet-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-violet-600" />
        <span className="text-sm font-semibold text-violet-800">AI Resume Tailor</span>
      </div>
      <p className="text-xs text-violet-600 mb-2">
        Paste a job description — Claude will tailor your summary, skills, and experience bullets to match it.
      </p>
      <textarea
        className="w-full border border-violet-200 bg-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
        rows={5}
        placeholder="Paste the job description here..."
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
      />
      <button
        onClick={generate}
        disabled={generating}
        className="mt-2 w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {generating ? 'Claude is tailoring your resume...' : 'Tailor Resume to Job'}
      </button>
    </div>
  );
}
