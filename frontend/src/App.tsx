import { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import ActivityForm from './components/ActivityForm';
import ActivityTable from './components/ActivityTable';
import SummaryCards from './components/SummaryCards';
import Toast, { type ToastData } from './components/Toast';
import { getActivities, getSummary, type Activity as ActivityType, type Summary } from './services/api';

export default function App() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true);
    try {
      const data = await getActivities();
      setActivities(data);
    } catch {
      addToast('Failed to fetch activities', 'error');
    } finally {
      setActivitiesLoading(false);
    }
  }, [addToast]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await getSummary();
      setSummary(data);
    } catch {
      addToast('Failed to fetch summary', 'error');
    } finally {
      setSummaryLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchActivities();
    fetchSummary();
  }, [fetchActivities, fetchSummary]);

  const handleActivityAdded = () => {
    fetchActivities();
    fetchSummary();
  };

  return (
    <div className="app-container">
      <Toast toasts={toasts} onRemove={removeToast} />

      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="header-title">Student Activity Tracker</h1>
            <p className="header-subtitle">Track and manage student learning activities</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="section">
          <h2 className="section-title">
            <BarChart3 size={18} />
            Dashboard Overview
          </h2>
          <SummaryCards summary={summary} loading={summaryLoading} />
        </section>

        <section className="section">
          <ActivityForm onActivityAdded={handleActivityAdded} onToast={addToast} />
        </section>

        <section className="section">
          <ActivityTable activities={activities} loading={activitiesLoading} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Student Activity Tracker &mdash; Built with React + FastAPI</p>
      </footer>
    </div>
  );
}
