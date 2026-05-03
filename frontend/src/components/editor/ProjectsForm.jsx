import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

const empty = () => ({ name: '', description: '', techStack: [], link: '' });

export default function ProjectsForm({ data, onChange }) {
  const items = data.projects || [];
  const [techInputs, setTechInputs] = useState({});

  const update = (list) => onChange('projects', list);
  const add = () => update([...items, empty()]);
  const remove = (i) => update(items.filter((_, idx) => idx !== i));
  const change = (i, field, value) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    update(next);
  };

  const addTech = (i) => {
    const t = (techInputs[i] || '').trim();
    if (!t) return;
    const next = [...items];
    next[i] = { ...next[i], techStack: [...(next[i].techStack || []), t] };
    update(next);
    setTechInputs(prev => ({ ...prev, [i]: '' }));
  };

  const removeTech = (i, t) => {
    const next = [...items];
    next[i] = { ...next[i], techStack: next[i].techStack.filter(x => x !== t) };
    update(next);
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2.5 relative">
          <button onClick={() => remove(i)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400">
            <Trash2 size={14} />
          </button>
          <div>
            <label className="text-xs text-gray-500">Project Name</label>
            <input className="input text-xs mt-0.5" value={item.name} onChange={e => change(i, 'name', e.target.value)} placeholder="AI Resume Maker" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea className="input text-xs mt-0.5 resize-none" rows={2} value={item.description} onChange={e => change(i, 'description', e.target.value)} placeholder="What it does and your role..." />
          </div>
          <div>
            <label className="text-xs text-gray-500">Tech Stack</label>
            <div className="flex gap-1 mt-0.5">
              <input
                className="input text-xs flex-1"
                value={techInputs[i] || ''}
                onChange={e => setTechInputs(prev => ({ ...prev, [i]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech(i))}
                placeholder="React, Node.js..."
              />
              <button onClick={() => addTech(i)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Plus size={14} />
              </button>
            </div>
            {item.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {item.techStack.map(t => (
                  <span key={t} className="flex items-center gap-0.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                    {t}
                    <button onClick={() => removeTech(i, t)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500">Project Link</label>
            <input className="input text-xs mt-0.5" value={item.link} onChange={e => change(i, 'link', e.target.value)} placeholder="github.com/you/project" />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-1.5 text-xs text-sky-600 border border-dashed border-sky-300 rounded-lg py-2 hover:bg-sky-50">
        <Plus size={14} />
        Add Project
      </button>
    </div>
  );
}
