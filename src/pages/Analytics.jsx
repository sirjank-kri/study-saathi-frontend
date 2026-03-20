import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import api from '../utils/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/');
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      if (error.response?.status === 400) {
        setAnalytics(null);
      } else {
        toast.error('Failed to load analytics');
      }
      
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Loader fullPage />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Insights from your study patterns</p>
        </div>

        <EmptyState
          title="Not Enough Data"
          message="You need at least 15 quiz sessions to generate meaningful analytics. Keep practicing to unlock personalized insights about your peak performance times!"
          actionText="Take a Quiz"
          onAction={() => navigate('/practice')}
        />
      </div>
    );
  }

  // Detect dark mode
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Chart colors based on theme
  const barColor = isDarkMode ? 'rgba(245, 245, 245, 0.9)' : 'rgba(17, 17, 17, 0.8)';
  const lineColor = isDarkMode ? '#f5f5f5' : '#111';
  const lineFillColor = isDarkMode ? 'rgba(245, 245, 245, 0.1)' : 'rgba(17, 17, 17, 0.1)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDarkMode ? '#f5f5f5' : '#111';

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%',
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  // Time of Day Chart
  const timeOfDayData = {
    labels: Object.keys(analytics.time_of_day),
    datasets: [
      {
        label: 'Accuracy',
        data: Object.values(analytics.time_of_day),
        backgroundColor: barColor,
        borderRadius: 6,
      },
    ],
  };

  // Duration Chart
  const durationData = {
    labels: Object.keys(analytics.duration),
    datasets: [
      {
        label: 'Accuracy',
        data: Object.values(analytics.duration),
        backgroundColor: barColor,
        borderRadius: 6,
      },
    ],
  };

  // Day of Week Chart
  const dayOfWeekData = {
    labels: Object.keys(analytics.day_of_week),
    datasets: [
      {
        label: 'Accuracy',
        data: Object.values(analytics.day_of_week),
        backgroundColor: barColor,
        borderRadius: 6,
      },
    ],
  };

  // Trend Chart
  const trendData = {
    labels: analytics.trend.map(t => t.date),
    datasets: [
      {
        label: 'Accuracy',
        data: analytics.trend.map(t => t.accuracy),
        borderColor: lineColor,
        backgroundColor: lineFillColor,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: lineColor,
        pointBorderColor: lineColor,
      },
    ],
  };

  const trendOptions = {
    ...chartOptions,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">
          Based on {analytics.total_sessions} quiz sessions
        </p>
      </div>

      {/* Key Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Average Accuracy</div>
          <div className="insight-value">{analytics.avg_accuracy}%</div>
        </div>
        <div className="insight-card">
          <div className="insight-label">Average Duration</div>
          <div className="insight-value">{analytics.avg_duration} min</div>
        </div>
        <div className="insight-card">
          <div className="insight-label">Best Time</div>
          <div className="insight-value-small">{analytics.best_time}</div>
        </div>
        <div className="insight-card">
          <div className="insight-label">Best Duration</div>
          <div className="insight-value-small">{analytics.best_duration}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Time of Day */}
        <div className="chart-card">
          <h3 className="chart-title">Performance by Time of Day</h3>
          <p className="chart-subtitle">When do you perform best?</p>
          <div className="chart-container">
            <Bar data={timeOfDayData} options={chartOptions} />
          </div>
        </div>

        {/* Duration */}
        <div className="chart-card">
          <h3 className="chart-title">Performance by Duration</h3>
          <p className="chart-subtitle">Your optimal study session length</p>
          <div className="chart-container">
            <Bar data={durationData} options={chartOptions} />
          </div>
        </div>

        {/* Day of Week */}
        <div className="chart-card full-width">
          <h3 className="chart-title">Performance by Day of Week</h3>
          <p className="chart-subtitle">Which days are you most productive?</p>
          <div className="chart-container">
            <Bar data={dayOfWeekData} options={chartOptions} />
          </div>
        </div>

        {/* Trend */}
        <div className="chart-card full-width">
          <h3 className="chart-title">Accuracy Trend</h3>
          <p className="chart-subtitle">Your progress over time</p>
          <div className="chart-container">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;