import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import './Schedule.css';

const Schedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/schedule/');
      setSchedule(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      
      if (error.response?.status === 400) {
        setSchedule(null);
      } else {
        toast.error('Failed to load schedule');
      }
      
      setLoading(false);
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const renderStars = (confidence) => {
    return '⭐'.repeat(Math.min(confidence, 5));
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Weekly Schedule</h1>
          <p className="page-subtitle">Your personalized study timetable</p>
        </div>

        <EmptyState
          title="Schedule Not Ready"
          message="We need at least 10 quiz sessions to generate your personalized study schedule. Keep practicing to unlock this feature!"
          actionText="Start Practicing"
          onAction={() => navigate('/practice')}
          secondaryActionText="View Analytics"
          onSecondaryAction={() => navigate('/analytics')}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Weekly Schedule</h1>
        <p className="page-subtitle">
          Based on {schedule.data_quality.total_sessions} sessions analyzing {schedule.data_quality.hours_analyzed} different hours
        </p>
      </div>

      {/* Recommendations */}
      <div className="recommendations-card">
        <h3 className="recommendations-title">Key Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-item">
            <div className="recommendation-label">Best Study Time</div>
            <div className="recommendation-value">{schedule.recommendations.best_time}</div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-label">Peak Performance</div>
            <div className="recommendation-value">{schedule.recommendations.best_accuracy}%</div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-label">Optimal Duration</div>
            <div className="recommendation-value">{schedule.recommendations.optimal_duration}</div>
          </div>
          <div className="recommendation-item">
            <div className="recommendation-label">Weekly Goal</div>
            <div className="recommendation-value">{Math.round(schedule.recommendations.total_study_hours)} hrs</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="schedule-grid">
        {Object.entries(schedule.schedule).map(([day, slots]) => (
          <div key={day} className="day-card">
            <h3 className="day-name">{day}</h3>
            
            {slots.length === 0 ? (
              <div className="no-sessions">
                <p>No data for this day yet</p>
              </div>
            ) : (
              <div className="time-slots">
                {slots.map((slot, index) => (
                  <div key={index} className="time-slot">
                    <div className="time-slot-header">
                      <span className="time-slot-time">{formatHour(slot.hour)}</span>
                      <span className="time-slot-confidence" title={`${slot.confidence}/5 confidence`}>
                        {renderStars(slot.confidence)}
                      </span>
                    </div>
                    <div className="time-slot-subject">{slot.subject}</div>
                    <div className="time-slot-meta">
                      <span>{slot.duration} min</span>
                      <span>•</span>
                      <span>{slot.expected_accuracy}% avg</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="schedule-info">
        <p>
          <strong>💡 Tip:</strong> This schedule is generated based on your past performance. 
          Times with more stars (⭐) have higher confidence based on more data points.
        </p>
      </div>
    </div>
  );
};

export default Schedule;