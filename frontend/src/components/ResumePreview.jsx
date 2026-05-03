import { useMemo } from 'react';
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-sky-700 border-b border-sky-200 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ModernTemplate({ data }) {
  const { personalInfo: p = {}, experience = [], education = [], skills = [], projects = [] } = data;

  return (
    <div className="font-sans text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{p.name || 'Your Name'}</h1>
        {p.role && <p className="text-sky-700 font-medium mb-2">{p.role}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {p.email && <span className="flex items-center gap-1"><Mail size={11} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={11} />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin size={11} />{p.location}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Linkedin size={11} />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1"><Github size={11} />{p.github}</span>}
        </div>
      </div>

      {p.summary && (
        <Section title="Summary">
          <p className="text-sm text-gray-700 leading-relaxed">{p.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{e.role}</span>
                  {e.company && <span className="text-gray-600"> · {e.company}</span>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {e.startDate}{e.startDate && (e.endDate || e.current) ? ' – ' : ''}{e.current ? 'Present' : e.endDate}
                </span>
              </div>
              {e.description && (
                <div className="mt-1.5 text-sm text-gray-700 space-y-0.5">
                  {e.description.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} className="mb-3 flex items-start justify-between">
              <div>
                <span className="font-semibold text-gray-900">{e.degree}{e.field ? ` in ${e.field}` : ''}</span>
                {e.institution && <p className="text-gray-600 text-xs">{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p>}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                {e.startDate}{e.startDate && e.endDate ? ' – ' : ''}{e.endDate}
              </span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.map(s => (
              <span key={s} className="bg-sky-50 text-sky-800 text-xs px-2.5 py-0.5 rounded-full border border-sky-200">{s}</span>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{p.name}</span>
                {p.link && <a href={`https://${p.link}`} className="text-sky-600 hover:underline"><ExternalLink size={12} /></a>}
              </div>
              {p.description && <p className="text-sm text-gray-700 mt-0.5">{p.description}</p>}
              {p.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function ClassicTemplate({ data }) {
  const { personalInfo: p = {}, experience = [], education = [], skills = [] } = data;
  return (
    <div className="font-serif text-gray-800 text-sm">
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
        <h1 className="text-3xl font-bold mb-1">{p.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 text-xs text-gray-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>
      {p.summary && <div className="mb-4"><p className="text-center italic text-gray-600">{p.summary}</p></div>}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-3">Professional Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between"><strong>{e.role}</strong><span className="text-xs">{e.startDate} – {e.current ? 'Present' : e.endDate}</span></div>
              <div className="italic text-gray-600 text-xs">{e.company}</div>
              {e.description && <div className="mt-1 text-xs text-gray-700">{e.description.split('\n').map((l, j) => <p key={j}>{l}</p>)}</div>}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b border-gray-400 mb-2">Skills</h2>
          <p className="text-xs text-gray-700">{skills.join(' · ')}</p>
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ data }) {
  const { personalInfo: p = {}, experience = [], skills = [] } = data;
  return (
    <div className="font-sans text-gray-900 text-sm space-y-4">
      <div>
        <h1 className="text-2xl font-light tracking-wide">{p.name || 'Your Name'}</h1>
        <p className="text-gray-500 text-xs mt-0.5">{[p.email, p.phone, p.location].filter(Boolean).join(' • ')}</p>
      </div>
      {p.summary && <p className="text-sm text-gray-600 leading-relaxed">{p.summary}</p>}
      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{e.role} <span className="text-gray-500">@ {e.company}</span></span>
                <span className="text-gray-400 text-xs">{e.startDate} – {e.current ? 'Now' : e.endDate}</span>
              </div>
              {e.description && <p className="text-xs text-gray-600 mt-0.5">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
          <p className="text-xs text-gray-700">{skills.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

const TEMPLATES = { modern: ModernTemplate, classic: ClassicTemplate, minimal: MinimalTemplate };

export default function ResumePreview({ data, template = 'modern' }) {
  const Template = TEMPLATES[template] || ModernTemplate;

  const handlePrint = () => {
    const el = document.getElementById('resume-preview-content');
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Resume</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        @media print { body { padding: 20px; } }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Download size={14} />
          Download / Print PDF
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-10 min-h-[1000px]" id="resume-preview-content">
        <Template data={data} />
      </div>
    </div>
  );
}
