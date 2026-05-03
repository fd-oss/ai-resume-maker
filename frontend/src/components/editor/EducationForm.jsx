import { Plus, Trash2 } from 'lucide-react';

const empty = () => ({ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' });

export default function EducationForm({ data, onChange }) {
  const items = data.education || [];
  const update = (list) => onChange('education', list);
  const add = () => update([...items, empty()]);
  const remove = (i) => update(items.filter((_, idx) => idx !== i));
  const change = (i, field, value) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
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
            <label className="text-xs text-gray-500">Institution</label>
            <input className="input text-xs mt-0.5" value={item.institution} onChange={e => change(i, 'institution', e.target.value)} placeholder="IIT Bombay" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Degree</label>
              <input className="input text-xs mt-0.5" value={item.degree} onChange={e => change(i, 'degree', e.target.value)} placeholder="B.Tech" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Field</label>
              <input className="input text-xs mt-0.5" value={item.field} onChange={e => change(i, 'field', e.target.value)} placeholder="Computer Science" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Start</label>
              <input className="input text-xs mt-0.5" value={item.startDate} onChange={e => change(i, 'startDate', e.target.value)} placeholder="2018" />
            </div>
            <div>
              <label className="text-xs text-gray-500">End</label>
              <input className="input text-xs mt-0.5" value={item.endDate} onChange={e => change(i, 'endDate', e.target.value)} placeholder="2022" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">GPA / Percentage</label>
            <input className="input text-xs mt-0.5" value={item.gpa} onChange={e => change(i, 'gpa', e.target.value)} placeholder="8.5 / 10" />
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-1.5 text-xs text-sky-600 border border-dashed border-sky-300 rounded-lg py-2 hover:bg-sky-50">
        <Plus size={14} />
        Add Education
      </button>
    </div>
  );
}
