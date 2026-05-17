import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { useAsyncData } from '../hooks/useAsyncData';

const defaultForm = {
  label: '',
  provider: 'gmail',
  fromName: '',
  fromEmail: '',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  username: '',
  password: '',
  dailyLimit: 100,
};

export function AccountsPage() {
  const { data, reload } = useAsyncData(() => api.get('/email-accounts').then((response) => response.data), []);
  const [form, setForm] = useState(defaultForm);

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    await api.post('/email-accounts', form);
    setForm(defaultForm);
    await reload();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">SMTP operations</p>
          <h1>Manage sender accounts</h1>
        </div>
      </div>
      <div className="split-grid">
        <Card title="Add SMTP account">
          <form className="stack-form" onSubmit={createAccount}>
            <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Account label" />
            <input value={form.fromName} onChange={(event) => setForm({ ...form, fromName: event.target.value })} placeholder="From name" />
            <input value={form.fromEmail} onChange={(event) => setForm({ ...form, fromEmail: event.target.value })} placeholder="From email" />
            <input value={form.host} onChange={(event) => setForm({ ...form, host: event.target.value })} placeholder="SMTP host" />
            <input value={form.port} onChange={(event) => setForm({ ...form, port: Number(event.target.value) })} placeholder="Port" />
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="SMTP username" />
            <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="SMTP password" />
            <button className="primary-button" type="submit">
              Save account
            </button>
          </form>
        </Card>
        <Card title="Account fleet">
          <div className="list">
            {data?.map((account: any) => (
              <div key={account.id} className="list-item">
                <div>
                  <strong>{account.label}</strong>
                  <p>
                    {account.fromEmail} • {account.provider}
                  </p>
                </div>
                <span className={account.active ? 'badge success' : 'badge'}>{account.active ? 'Active' : 'Disabled'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

