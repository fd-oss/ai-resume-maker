import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Field = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      className="input text-sm"
      placeholder={placeholder}
      value={value || ''}
      onChange={e => onChange(name, e.target.value)}
    />
  </div>
);

export default function PersonalInfoForm({ data, onChange }) {
  const info = data.personalInfo || {};
  const [generating, setGenerating] = useState(false);

  const update = (field, value) => {
    onChange('personalInfo', { ...info, [field]: value });
  };

  const generateSummary = async () => {
    if (!info.name || !info.role) {
      toast.error('Fill in your name and target role first');
      return;
    }
    setGenerating(true);
    try {
      const res = await api.post('/ai/generate-summary', {
        name: info.name,
        role: info.role || 'Software Engineer',
        yearsExp: info.yearsExp || '2',
        skills: data.skills?.join(', ') || '',
      });
      update('summary', res.data.summary);
      toast.success('Summary generated!');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Field label="Full Name" name="name" value={info.name} onChange={update} placeholder="Rahul Sharma" />
      <Field label="Target Role" name="role" value={info.role} onChange={update} placeholder="Software Engineer" />
      <Field label="Email" name="email" value={info.email} onChange={update} type="email" placeholder="rahul@example.com" />
      <Field label="Phone" name="phone" value={info.phone} onChange={update} placeholder="+91 98765 43210" />
      <Field label="Location" name="location" value={info.location} onChange={update} placeholder="Bangalore, India" />
      <Field label="LinkedIn" name="linkedin" value={info.linkedin} onChange={update} placeholder="linkedin.com/in/rahul" />
      <Field label="GitHub" name="github" value={info.github} onChange={update} placeholder="github.com/rahul" />
      <Field label="Years of Experience" name="yearsExp" value={info.yearsExp} onChange={update} placeholder="3" />

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-gray-600">Professional Summary</label>
          <button
            onClick={generateSummary}
            disabled={generating}
            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium"
          >
            <Wand2 size={12} />
            {generating ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
        <textarea
          className="input text-sm resize-none"
          rows={4}
          placeholder="A brief professional summary..."
          value={info.summary || ''}
          onChange={e => update('summary', e.target.value)}
        />
      </div>
    </div>
  );
}
