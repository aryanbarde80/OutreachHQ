import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { useAsyncData } from '../hooks/useAsyncData';

export function LeadsPage() {
  const { data, reload } = useAsyncData(() => api.get('/leads').then((response) => response.data), []);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  async function uploadCsv(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await api.post('/leads/upload', formData);
    setFile(null);
    await reload();
  }

  async function addLead(event: FormEvent) {
    event.preventDefault();
    await api.post('/leads', { name, email, company });
    setName('');
    setEmail('');
    setCompany('');
    await reload();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Lead intake</p>
          <h1>Import and segment leads</h1>
        </div>
      </div>
      <div className="split-grid">
        <Card title="CSV upload">
          <form className="stack-form" onSubmit={uploadCsv}>
            <input type="file" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <button className="primary-button" type="submit">
              Upload lead list
            </button>
          </form>
        </Card>
        <Card title="Manual lead">
          <form className="stack-form" onSubmit={addLead}>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" />
            <button className="primary-button" type="submit">
              Add lead
            </button>
          </form>
        </Card>
      </div>
      <Card title="Lead table">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((lead: any) => (
                <tr key={lead.id}>
                  <td>{lead.name ?? 'Unknown'}</td>
                  <td>{lead.email}</td>
                  <td>{lead.company ?? '-'}</td>
                  <td>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

