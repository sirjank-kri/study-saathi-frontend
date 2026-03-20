import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalQuestions: 0,
    thisWeek: 0,
    streak: 0
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await api.get('/dashboard/stats/');
      setStats(statsResponse.data);

      // Fetch subjects
      const subjectsResponse = await api.get('/subjects/');
      setSubjects(subjectsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage text="Loading dashboard..." />
      </div>
    );
  }

  // Empty state - no subjects
  if (subjects.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your study performance and progress</p>
        </div>
        
        <EmptyState
          title="Welcome to Study Saathi"
          message="You haven't added any subjects yet. Add your first subject to start tracking your study performance and discover your peak learning hours."
          actionText="Add Subject"
          onAction={() => navigate('/settings')}
          secondaryActionText="Take a Tour"
          onSecondaryAction={() => navigate('/')}
        />
      </div>
    );
  }

  // Normal dashboard with data
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your study performance and progress</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{stats.totalSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Questions Answered</div>
          <div className="stat-value">{stats.totalQuestions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-value">{stats.thisWeek} hrs</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Streak</div>
          <div className="stat-value">{stats.streak} days</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate('/practice')} className="btn-primary">
          Start Practice
        </button>
        <button onClick={() => navigate('/log')} className="btn-secondary">
          Log Session
        </button>
      </div>

      {/* Subjects */}
      <div className="section">
        <h2 className="section-title">YOUR SUBJECTS</h2>
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div key={subject.id} className="subject-card">
              <div className="subject-name">{subject.name}</div>
              <div className="subject-meta">Sessions: {subject.session_count}</div>
              <div className="subject-meta">Avg. Accuracy: {subject.avg_accuracy}%</div>
              <div className="subject-badge">
                <span className="badge">
                  {subject.session_count === 0 ? 'No data yet' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h2 className="section-title">RECENT ACTIVITY</h2>
        {stats.totalSessions === 0 ? (
          <div className="empty-state">
            <p>No activity recorded yet. Start a practice session to see your progress here.</p>
            <button onClick={() => navigate('/practice')} className="btn-primary">
              Start Practicing
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <p>Recent activity list coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;