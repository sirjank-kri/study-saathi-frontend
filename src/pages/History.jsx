import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, quiz, manual

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history/');
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeOfDay = (dateString) => {
    const hour = new Date(dateString).getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.session_type === filter;
  });

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Session History</h1>
          <p className="page-subtitle">View all your study sessions</p>
        </div>

        <EmptyState
          title="No Sessions Yet"
          message="You haven't recorded any study sessions yet. Take a quiz to start building your performance history."
          actionText="Take a Quiz"
          onAction={() => navigate('/practice')}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Session History</h1>
        <p className="page-subtitle">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'quiz' ? 'active' : ''}`}
          onClick={() => setFilter('quiz')}
        >
          Quizzes
        </button>
        <button 
          className={`filter-btn ${filter === 'manual' ? 'active' : ''}`}
          onClick={() => setFilter('manual')}
        >
          Manual
        </button>
      </div>

      {/* Sessions Table */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Time of Day</th>
              <th>Duration</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td>
                  <div className="date-cell">
                    <span className="date-primary">{formatDate(session.start_time)}</span>
                    <span className="date-secondary">{formatTime(session.start_time)}</span>
                  </div>
                </td>
                <td>
                  <span className="subject-name">{session.subject_name}</span>
                </td>
                <td>
                  <span className={`type-badge ${session.session_type}`}>
                    {session.session_type === 'quiz' ? 'Quiz' : 'Manual'}
                  </span>
                </td>
                <td>
                  <span className="time-of-day">{getTimeOfDay(session.start_time)}</span>
                </td>
                <td>
                  <span className="duration">{session.duration_minutes || 0} min</span>
                </td>
                <td>
                  {session.accuracy !== null ? (
                    <span className={`score ${session.accuracy >= 70 ? 'good' : session.accuracy >= 50 ? 'okay' : 'low'}`}>
                      {session.accuracy}%
                    </span>
                  ) : (
                    <span className="score na">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (shown on small screens) */}
      <div className="history-cards">
        {filteredSessions.map((session) => (
          <div key={session.id} className="history-card">
            <div className="card-header">
              <span className="subject-name">{session.subject_name}</span>
              <span className={`type-badge ${session.session_type}`}>
                {session.session_type === 'quiz' ? 'Quiz' : 'Manual'}
              </span>
            </div>
            <div className="card-body">
              <div className="card-row">
                <span className="card-label">Date</span>
                <span className="card-value">{formatDate(session.start_time)}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Time</span>
                <span className="card-value">{formatTime(session.start_time)} ({getTimeOfDay(session.start_time)})</span>
              </div>
              <div className="card-row">
                <span className="card-label">Duration</span>
                <span className="card-value">{session.duration_minutes || 0} min</span>
              </div>
              <div className="card-row">
                <span className="card-label">Score</span>
                <span className="card-value">
                  {session.accuracy !== null ? (
                    <span className={`score ${session.accuracy >= 70 ? 'good' : session.accuracy >= 50 ? 'okay' : 'low'}`}>
                      {session.accuracy}%
                    </span>
                  ) : '—'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;