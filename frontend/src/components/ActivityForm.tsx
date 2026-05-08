import { useState, type FormEvent } from 'react';
import { User, BookOpen, Clock, Send, Loader2 } from 'lucide-react';
import { addActivity, type ActivityPayload } from '../services/api';

interface ActivityFormProps {
  onActivityAdded: () => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

interface FormErrors {
  name?: string;
  activity?: string;
  hours?: string;
}

export default function ActivityForm({ onActivityAdded, onToast }: ActivityFormProps) {
  const [name, setName] = useState('');
  const [activity, setActivity] = useState('');
  const [hours, setHours] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Student name is required';
    if (!activity.trim()) newErrors.activity = 'Activity name is required';
    if (!hours || Number(hours) <= 0) newErrors.hours = 'Hours must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: ActivityPayload = {
        name: name.trim(),
        activity: activity.trim(),
        hours: Number(hours),
      };
      await addActivity(payload);
      onToast('Activity added successfully!', 'success');
      setName('');
      setActivity('');
      setHours('');
      setErrors({});
      onActivityAdded();
    } catch {
      onToast('Failed to add activity. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <BookOpen size={20} />
        Log New Activity
      </h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <User size={14} />
            Student Name
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g. Akshay"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="activity" className="form-label">
            <BookOpen size={14} />
            Activity Name
          </label>
          <input
            id="activity"
            type="text"
            className={`form-input ${errors.activity ? 'input-error' : ''}`}
            placeholder="e.g. Machine Learning"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            disabled={submitting}
          />
          {errors.activity && <span className="form-error">{errors.activity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="hours" className="form-label">
            <Clock size={14} />
            Hours Spent
          </label>
          <input
            id="hours"
            type="number"
            min="0.5"
            step="0.5"
            className={`form-input ${errors.hours ? 'input-error' : ''}`}
            placeholder="e.g. 5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            disabled={submitting}
          />
          {errors.hours && <span className="form-error">{errors.hours}</span>}
        </div>

        <div className="form-group form-action">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" />
                Adding...
              </>
            ) : (
              <>
                <Send size={16} />
                Add Activity
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
