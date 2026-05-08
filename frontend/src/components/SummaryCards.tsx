import { BarChart3, Clock, Trophy, Loader2 } from 'lucide-react';
import type { Summary } from '../services/api';

interface SummaryCardsProps {
  summary: Summary | null;
  loading: boolean;
}

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card stat-loading">
            <Loader2 size={24} className="spin" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      icon: <BarChart3 size={24} />,
      label: 'Total Entries',
      value: summary.total_entries,
      color: 'blue',
    },
    {
      icon: <Clock size={24} />,
      label: 'Total Hours',
      value: summary.total_hours,
      color: 'emerald',
    },
    {
      icon: <Trophy size={24} />,
      label: 'Most Active User',
      value: summary.most_active_user || 'N/A',
      color: 'amber',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-${card.color}`}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-content">
            <span className="stat-label">{card.label}</span>
            <span className="stat-value">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
