import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const empty = () => ({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });

export default function ExperienceForm({ data, onChange }) {
  const items = data.experience || [];
  const [improving, setImproving] = useState(null);

  const update = (list) => onChange('experience', list);

  const add = () => update([...items, empty()]);

  const remove = (i) => update(items.filter((_, idx) => idx !== i));

  const change = (i, field, value) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    update(next);
  };

  const improveDesc = async (i) => {
    const item = items[i];
    if (!item.description) { toast.error('Write a description first'); return; }
    setImproving(i);
    try {
      const res = await api.post('/ai/improve-description', {
        role: item.role,
        company: item.company,
        description: item.description,
      });
      change(i, 'description', res.data.improved);
      toast.success('Description improved!');
    } catch {
      toast.error('AI failed');
    } finally {
      setImproving(null);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2.5 relative">
          <button
            onClick={() => remove(i)}
            className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Company</label>
              <input className="input text-xs mt-0.5" value={item.company} onChange={e => change(i, 'company', e.target.value)} placeholder="Google" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <input className="input text-xs mt-0.5" value={item.role} onChange={e => change(i, 'role', e.target.value)} placeholder="SDE II" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input className="input text-xs mt-0.5" value={item.startDate} onChange={e => change(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
            </div>
            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input className="input text-xs mt-0.5" value={item.endDate} onChange={e => change(i, 'endDate', e.target.value)} placeholder="Present" disabled={item.current} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" checked={item.current} onChange={e => change(i, 'current', e.target.checked)} />
            Currently working here
          </label>
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-xs text-gray-500">Description</label>
              <button
                onClick={() => improveDesc(i)}
                disabled={improving === i}
                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium"
              >
                <Wand2 size={11} />
                {improving === i ? 'Improving...' : 'AI Improve'}
              </button>
            </div>
            <textarea
              className="input text-xs resize-none"
              rows={3}
              value={item.description}
              onChange={e => change(i, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-1.5 text-xs text-sky-600 border border-dashed border-sky-300 rounded-lg py-2 hover:bg-sky-50">
        <Plus size={14} />
        Add Experience
      </button>
    </div>
  );
}
