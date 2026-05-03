import { X, Plus, Wand2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SkillsForm({ data, onChange }) {
  const skills = data.skills || [];
  const [input, setInput] = useState('');
  const [suggesting, setSuggesting] = useState(false);

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) { setInput(''); return; }
    onChange('skills', [...skills, trimmed]);
    setInput('');
  };

  const remove = (s) => onChange('skills', skills.filter(x => x !== s));

  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } };

  const suggest = async () => {
    const role = data.personalInfo?.role;
    if (!role) { toast.error('Add your target role in Personal Info first'); return; }
    setSuggesting(true);
    try {
      const res = await api.post('/ai/suggest-skills', { role, currentSkills: skills });
      const newSkills = res.data.skills.filter(s => !skills.includes(s));
      onChange('skills', [...skills, ...newSkills]);
      toast.success(`Added ${newSkills.length} skill suggestions!`);
    } catch {
      toast.error('AI suggestion failed');
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="input text-sm flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type a skill and press Enter"
        />
        <button onClick={add} className="p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={suggest}
        disabled={suggesting}
        className="w-full flex items-center justify-center gap-2 text-xs text-violet-600 border border-dashed border-violet-300 rounded-lg py-2 hover:bg-violet-50 font-medium"
      >
        <Wand2 size={13} />
        {suggesting ? 'Fetching AI suggestions...' : 'AI Suggest Skills for my role'}
      </button>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map(s => (
            <span key={s} className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full border border-sky-200">
              {s}
              <button onClick={() => remove(s)} className="hover:text-red-500">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
