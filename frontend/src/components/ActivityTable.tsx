import { User, BookOpen, Clock, Inbox, Loader2 } from 'lucide-react';
import type { Activity } from '../services/api';

interface ActivityTableProps {
  activities: Activity[];
  loading: boolean;
}

export default function ActivityTable({ activities, loading }: ActivityTableProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <Loader2 size={28} className="spin" />
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">
          <BookOpen size={20} />
          Recent Activities
        </h2>
        <div className="empty-state">
          <Inbox size={48} strokeWidth={1} />
          <p>No activities recorded yet</p>
          <span>Log your first activity using the form above</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">
        <BookOpen size={20} />
        Recent Activities
        <span className="badge">{activities.length}</span>
      </h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <User size={14} />
                Student Name
              </th>
              <th>
                <BookOpen size={14} />
                Activity
              </th>
              <th>
                <Clock size={14} />
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item, index) => (
              <tr key={item.id ?? index} className="table-row">
                <td>
                  <div className="cell-name">
                    <div className="avatar">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    {item.name}
                  </div>
                </td>
                <td>
                  <span className="activity-tag">{item.activity}</span>
                </td>
                <td>
                  <span className="hours-badge">{item.hours}h</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
