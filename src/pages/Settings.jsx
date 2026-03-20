import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';
import './Settings.css';

const AVAILABLE_SUBJECTS = [
  { name: 'General Knowledge', categoryId: 9, icon: '🧠' },
  { name: 'Science & Nature', categoryId: 17, icon: '🔬' },
  { name: 'Mathematics', categoryId: 19, icon: '🔢' },
  { name: 'Computers', categoryId: 18, icon: '💻' },
  { name: 'History', categoryId: 23, icon: '📜' },
  { name: 'Geography', categoryId: 22, icon: '🌍' },
  { name: 'Sports', categoryId: 21, icon: '⚽' },
  { name: 'Art', categoryId: 25, icon: '🎨' },
  { name: 'Music', categoryId: 12, icon: '🎵' },
  { name: 'Film', categoryId: 11, icon: '🎬' },
  { name: 'Books', categoryId: 10, icon: '📚' },
  { name: 'Mythology', categoryId: 20, icon: '⚡' },
  { name: 'Animals', categoryId: 27, icon: '🐾' },
  { name: 'Politics', categoryId: 24, icon: '🏛️' },
  { name: 'Vehicles', categoryId: 28, icon: '🚗' },
  { name: 'Video Games', categoryId: 15, icon: '🎮' },
];

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSubjects, setUserSubjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileResponse = await api.get('/auth/profile/');
      setUser(profileResponse.data);

      const subjectsResponse = await api.get('/subjects/');
      setUserSubjects(subjectsResponse.data.map(s => s.name));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load settings');
      setLoading(false);
    }
  };

  const isSubjectAdded = (subjectName) => {
    return userSubjects.includes(subjectName);
  };

  const handleToggleSubject = async (subject) => {
    setSaving(true);

    try {
      if (isSubjectAdded(subject.name)) {
        const subjectsResponse = await api.get('/subjects/');
        const subjectToRemove = subjectsResponse.data.find(s => s.name === subject.name);
        
        if (subjectToRemove) {
          await api.delete(`/subjects/${subjectToRemove.id}/`);
          setUserSubjects(userSubjects.filter(s => s !== subject.name));
          toast.success(`${subject.name} removed`);
        }
      } else {
        await api.post('/subjects/', {
          name: subject.name,
          weekly_goal_hours: 5,
        });
        setUserSubjects([...userSubjects, subject.name]);
        toast.success(`${subject.name} added`);
      }
    } catch (error) {
      console.error('Error toggling subject:', error);
      toast.error('Failed to update subject');
    }

    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and subjects</p>
      </div>

      {/* Profile Section */}
      <div className="settings-section">
        <h2 className="section-title">PROFILE</h2>
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <div className="profile-name">
                {user?.first_name || user?.username}
              </div>
              <div className="profile-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="settings-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">YOUR SUBJECTS</h2>
            <p className="section-description">
              Select subjects you want to practice
            </p>
          </div>
          {userSubjects.length > 0 && (
            <button 
              onClick={() => navigate('/practice')} 
              className="btn-primary"
            >
              Start Practicing →
            </button>
          )}
        </div>

        <div className="subjects-list">
          {AVAILABLE_SUBJECTS.map((subject) => {
            const isAdded = isSubjectAdded(subject.name);
            return (
              <button
                key={subject.name}
                className={`subject-item ${isAdded ? 'active' : ''}`}
                onClick={() => handleToggleSubject(subject)}
                disabled={saving}
              >
                <div className="subject-item-left">
                  <span className="subject-icon">{subject.icon}</span>
                  <span className="subject-name">{subject.name}</span>
                </div>
                <div className="subject-item-right">
                  {isAdded && (
                    <span className="subject-check">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="subjects-footer">
          <p className="subjects-count">
            {userSubjects.length} subject{userSubjects.length !== 1 ? 's' : ''} selected
          </p>
          {userSubjects.length === 0 && (
            <p className="subjects-hint">
              Select at least one subject to start practicing
            </p>
          )}
        </div>
      </div>

      {/* Study Goals Section */}
      <div className="settings-section">
        <h2 className="section-title">STUDY PREFERENCES</h2>
        <div className="card">
          <p className="text-muted" style={{ margin: 0 }}>
            Weekly study goals and availability settings coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;