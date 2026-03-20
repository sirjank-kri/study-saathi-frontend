import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';
import './LogSession.css';

const LogSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: '',
    session_type: 'manual',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    duration_minutes: 30,
    rating: 3,
    notes: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects/');
      setSubjects(response.data);
      
      if (response.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          subject_id: response.data[0].id
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject_id) {
      toast.error('Please select a subject');
      return;
    }

    if (formData.duration_minutes < 1 || formData.duration_minutes > 300) {
      toast.error('Duration must be between 1 and 300 minutes');
      return;
    }

    setSubmitting(true);

    try {
      // Combine date and time into ISO string
      const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();

      await api.post('/log-session/', {
        subject_id: formData.subject_id,
        session_type: formData.session_type,
        start_time: startTime,
        duration_minutes: parseInt(formData.duration_minutes),
        rating: parseInt(formData.rating),
        notes: formData.notes,
      });

      toast.success('Session logged successfully!');
      
      // Reset form
      setFormData({
        subject_id: subjects[0]?.id || '',
        session_type: 'manual',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        duration_minutes: 30,
        rating: 3,
        notes: '',
      });

      // Navigate to history
      setTimeout(() => {
        navigate('/history');
      }, 1000);

    } catch (error) {
      console.error('Error logging session:', error);
      toast.error('Failed to log session');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage />
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Log Session</h1>
          <p className="page-subtitle">Manually record a study session</p>
        </div>

        <div className="empty-state">
          <p>No subjects available. Please add a subject first.</p>
          <button onClick={() => navigate('/settings')} className="btn-primary">
            Add Subject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Log Session</h1>
        <p className="page-subtitle">Manually record a study session</p>
      </div>

      <div className="log-session-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject_id" className="form-label">
                Subject *
              </label>
              <select
                id="subject_id"
                name="subject_id"
                className="form-control"
                value={formData.subject_id}
                onChange={handleChange}
                required
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="session_type" className="form-label">
                Session Type
              </label>
              <select
                id="session_type"
                name="session_type"
                className="form-control"
                value={formData.session_type}
                onChange={handleChange}
              >
                <option value="manual">Manual Study</option>
                <option value="rating">Self-Rated Session</option>
                <option value="task">Task Completion</option>
                <option value="focus">Focus Timer</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration_minutes" className="form-label">
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration_minutes"
                name="duration_minutes"
                className="form-control"
                value={formData.duration_minutes}
                onChange={handleChange}
                min="1"
                max="300"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating" className="form-label">
                Self Rating (1-5)
              </label>
              <select
                id="rating"
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any notes about this study session..."
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={submitting}
          >
            {submitting ? 'Logging Session...' : 'Log Session'}
          </button>
        </form>
      </div>

      <div className="log-session-info">
        <p>
          <strong>💡 Tip:</strong> Logging manual sessions helps improve the accuracy of your analytics and personalized schedule recommendations.
        </p>
      </div>
    </div>
  );
};

export default LogSession;