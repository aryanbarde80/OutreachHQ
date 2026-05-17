import { FormEvent, useMemo, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { useAsyncData } from '../hooks/useAsyncData';

export function CampaignsPage() {
  const campaigns = useAsyncData(() => api.get('/campaigns').then((response) => response.data), []);
  const leads = useAsyncData(() => api.get('/leads').then((response) => response.data), []);
  const accounts = useAsyncData(() => api.get('/email-accounts').then((response) => response.data), []);
  const resumes = useAsyncData(() => api.get('/resumes').then((response) => response.data), []);
  const [form, setForm] = useState({
    name: '',
    subject: '',
    htmlTemplate: '<p>Hello {{name}},</p><p>I would love to explore opportunities at {{company}}.</p>',
    leadIds: [] as string[],
    senderAccountIds: [] as string[],
    resumeKeywords: [] as string[],
    delayMs: 120000,
    scheduledAt: '',
    followUpEnabled: true,
    followUpDelayHours: 72,
    maxFollowUps: 1,
  });

  const resumeKeywordOptions = useMemo(
    () =>
      Array.from(
        new Set<string>(
          (resumes.data ?? []).flatMap((resume: any) => ((resume.keywords ?? []) as string[]).filter(Boolean)),
        ),
      ),
    [resumes.data],
  );

  async function createCampaign(event: FormEvent) {
    event.preventDefault();
    await api.post('/campaigns', {
      ...form,
      scheduledAt: form.scheduledAt || undefined,
    });
    setForm({
      ...form,
      name: '',
      subject: '',
      leadIds: [],
      senderAccountIds: [],
      resumeKeywords: [],
      scheduledAt: '',
    });
    await campaigns.reload();
  }

  function toggleValue(key: 'leadIds' | 'senderAccountIds' | 'resumeKeywords', value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Campaign builder</p>
          <h1>Design, schedule, and queue outreach</h1>
        </div>
      </div>
      <div className="split-grid campaign-grid">
        <Card title="Create campaign">
          <form className="stack-form" onSubmit={createCampaign}>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Campaign name" />
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Email subject" />
            <textarea
              value={form.htmlTemplate}
              onChange={(event) => setForm({ ...form, htmlTemplate: event.target.value })}
              rows={8}
              placeholder="HTML email template"
            />
            <input
              value={form.scheduledAt}
              onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
              type="datetime-local"
            />
            <input
              value={form.delayMs}
              onChange={(event) => setForm({ ...form, delayMs: Number(event.target.value) })}
              type="number"
              placeholder="Delay in milliseconds"
            />
            <input
              value={form.followUpDelayHours}
              onChange={(event) => setForm({ ...form, followUpDelayHours: Number(event.target.value) })}
              type="number"
              placeholder="Follow-up delay hours"
            />
            <div className="choice-group">
              <strong>Leads</strong>
              <div className="choice-list">
                {leads.data?.slice(0, 20).map((lead: any) => (
                  <label key={lead.id} className="checkbox-line">
                    <input type="checkbox" checked={form.leadIds.includes(lead.id)} onChange={() => toggleValue('leadIds', lead.id)} />
                    {lead.email}
                  </label>
                ))}
              </div>
            </div>
            <div className="choice-group">
              <strong>Sender accounts</strong>
              <div className="choice-list">
                {accounts.data?.map((account: any) => (
                  <label key={account.id} className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={form.senderAccountIds.includes(account.id)}
                      onChange={() => toggleValue('senderAccountIds', account.id)}
                    />
                    {account.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="choice-group">
              <strong>Resume rules</strong>
              <div className="choice-list">
                {resumeKeywordOptions.map((keyword) => (
                  <label key={keyword} className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={form.resumeKeywords.includes(keyword)}
                      onChange={() => toggleValue('resumeKeywords', keyword)}
                    />
                    {keyword}
                  </label>
                ))}
              </div>
            </div>
            <button className="primary-button" type="submit">
              Queue campaign
            </button>
          </form>
        </Card>
        <Card title="Live campaign list">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Leads</th>
                  <th>Sent</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.data?.map((campaign: any) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.status}</td>
                    <td>{campaign.totalLeads}</td>
                    <td>{campaign.sentCount}</td>
                    <td>{campaign.failedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
