import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-container">
          <Link to="/" className="landing-brand">Study Saathi</Link>
          <div className="landing-nav-buttons">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Your Personal Study Performance Lab</h1>
              <p className="hero-subtitle">
                Discover your cognitive patterns through data. Practice quizzes at different times,
                analyze your performance, and get an evidence-based study schedule tailored to you.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-primary btn-lg">Start Free</Link>
                <a href="#features" className="btn-secondary btn-lg">Learn More</a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="sample-card">
                <div className="sample-title">Sample Analytics</div>
                <div className="sample-row">
                  <span>Peak Performance</span>
                  <strong>7-9 PM</strong>
                </div>
                <div className="sample-row">
                  <span>Optimal Duration</span>
                  <strong>45-60 min</strong>
                </div>
                <div className="sample-row">
                  <span>Best Day</span>
                  <strong>Tuesday</strong>
                </div>
                <div className="sample-row">
                  <span>Confidence</span>
                  <strong>⭐⭐⭐⭐⭐</strong>
                </div>
                <div className="sample-footer">
                  <div className="sample-meta">Based on 24 sessions</div>
                  <div className="sample-progress">
                    <div className="sample-progress-bar" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="landing-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to optimize your study routine</p>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3 className="feature-title">1. Practice & Log</h3>
              <p className="feature-desc">
                Take quizzes in different subjects at different times of day.
                The system automatically records your performance and timestamps.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3 className="feature-title">2. Analyze Patterns</h3>
              <p className="feature-desc">
                Our analytics engine discovers when you perform best for each subject,
                optimal session lengths, and consistency patterns.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3 className="feature-title">3. Get Your Schedule</h3>
              <p className="feature-desc">
                Receive a personalized weekly study schedule with confidence scores,
                based on your actual performance data—not generic advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="landing-container">
          <h2 className="cta-title">Start Discovering Your Patterns</h2>
          <p className="cta-subtitle">
            Free to use. No credit card required. Start optimizing your study routine today.
          </p>
          <Link to="/register" className="btn-primary btn-xl">Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div>
              <div className="footer-brand">Study Saathi</div>
              <p className="footer-tagline">Your personal study performance lab.</p>
            </div>
            <div className="footer-copyright">
              © 2025 Study Saathi. Built for students, by students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;