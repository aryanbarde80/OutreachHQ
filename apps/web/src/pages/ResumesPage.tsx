import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { useAsyncData } from '../hooks/useAsyncData';

export function ResumesPage() {
  const { data, reload } = useAsyncData(() => api.get('/resumes').then((response) => response.data), []);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState<File | null>(null);

  async function uploadResume(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('keywords', JSON.stringify(keywords.split(',').map((item) => item.trim()).filter(Boolean)));
    formData.append('file', file);
    await api.post('/resumes', formData);
    setTitle('');
    setKeywords('');
    setFile(null);
    await reload();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resume routing</p>
          <h1>Upload PDF resumes and define matching rules</h1>
        </div>
      </div>
      <div className="split-grid">
        <Card title="Upload resume">
          <form className="stack-form" onSubmit={uploadResume}>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resume title" />
            <input
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Keywords separated by commas"
            />
            <input type="file" accept=".pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <button className="primary-button" type="submit">
              Save resume
            </button>
          </form>
        </Card>
        <Card title="Resume library">
          <div className="list">
            {data?.map((resume: any) => (
              <div key={resume.id} className="list-item">
                <div>
                  <strong>{resume.title}</strong>
                  <p>{(resume.keywords ?? []).join(', ') || 'No keywords yet'}</p>
                </div>
                {resume.isDefault ? <span className="badge success">Default</span> : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

