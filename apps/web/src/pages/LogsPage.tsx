import { api } from '../api/client';
import { Card } from '../components/ui/Card';
import { useAsyncData } from '../hooks/useAsyncData';

export function LogsPage() {
  const { data } = useAsyncData(() => api.get('/email-logs').then((response) => response.data), []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Delivery tracking</p>
          <h1>Send history and queue outcomes</h1>
        </div>
      </div>
      <Card title="Email activity">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Status</th>
                <th>Subject</th>
                <th>Attempt</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((log: any) => (
                <tr key={log.id}>
                  <td>{log.recipient}</td>
                  <td>{log.status}</td>
                  <td>{log.subject}</td>
                  <td>{log.attempt}</td>
                  <td>{log.errorMessage ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

