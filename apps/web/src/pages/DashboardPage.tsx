import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { useAsyncData } from '../hooks/useAsyncData';

export function DashboardPage() {
  const { data, loading } = useAsyncData(() => api.get('/dashboard/summary').then((response) => response.data), []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Admin command center</h1>
        </div>
      </div>
      <div className="stats-grid">
        <StatCard label="Campaigns" value={data?.metrics.totalCampaigns ?? '--'} />
        <StatCard label="Leads" value={data?.metrics.totalLeads ?? '--'} />
        <StatCard label="Active Accounts" value={data?.metrics.activeAccounts ?? '--'} />
        <StatCard label="Sent" value={data?.metrics.sent ?? '--'} tone="success" />
        <StatCard label="Failed" value={data?.metrics.failed ?? '--'} tone="danger" />
        <StatCard label="Pending" value={data?.metrics.pending ?? '--'} tone="warning" />
      </div>
      <Card title="Recent campaigns">
        {loading ? (
          <p>Loading summary...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {data?.campaigns?.map((campaign: any) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.status}</td>
                    <td>{campaign.sentCount}</td>
                    <td>{campaign.failedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

