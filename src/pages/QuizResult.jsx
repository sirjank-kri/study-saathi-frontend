import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';
import './QuizResult.css';

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, answers, subjectId, subjectName, startTime } = location.state || {};

  const [saving, setSaving] = useState(true);
  const [results, setResults] = useState(null);
  const hasSaved = useRef(false); // Prevent double save

  useEffect(() => {
    if (!questions || !answers) {
      toast.error('No quiz data found');
      navigate('/practice');
      return;
    }

    // Prevent double save
    if (hasSaved.current) return;
    hasSaved.current = true;

    calculateAndSaveResults();
  }, []);

  const calculateAndSaveResults = async () => {
    // Calculate score
    let correct = 0;
    const reviewData = [];

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) correct++;

      reviewData.push({
        question: question.question_text,
        userAnswer: userAnswer || 'Not answered',
        correctAnswer: question.correct_answer,
        isCorrect,
      });
    });

    const total = questions.length;
    const accuracy = Math.round((correct / total) * 100);
    const endTime = new Date().toISOString();

    // Calculate duration in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = Math.max(1, Math.round((end - start) / 60000));

    setResults({
      score: correct,
      total,
      accuracy,
      duration: durationMinutes,
      review: reviewData,
    });

    // Save to Django
    try {
      await api.post('/quiz/save/', {
        subject_id: subjectId,
        score: correct,
        total_questions: total,
        accuracy,
        duration_minutes: durationMinutes,
        start_time: startTime,
        end_time: endTime,
      });
      
      toast.success('Quiz results saved!');
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
    }

    setSaving(false);
  };

  if (saving || !results) {
    return (
      <div className="page-container">
        <Loader fullPage text="Calculating results..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Quiz Complete!</h1>
        <p className="page-subtitle">{subjectName}</p>
      </div>

      <div className="result-card">
        <div className="score-display">
          <div className="score-number">{results.score}/{results.total}</div>
          <div className="score-label">Questions Correct</div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">{results.accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{results.duration} min</div>
            <div className="stat-label">Duration</div>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={() => navigate('/practice')} className="btn-primary">
            Take Another Quiz
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="review-section">
        <h2 className="section-title">REVIEW ANSWERS</h2>
        
        {results.review.map((item, index) => (
          <div key={index} className={`review-item ${item.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="review-question">
              <span className="question-number">Q{index + 1}.</span>
              {item.question}
            </div>
            <div className="review-answers">
              <div className="user-answer">
                <span className="answer-label">Your answer:</span>
                <span className={item.isCorrect ? 'correct-text' : 'incorrect-text'}>
                  {item.userAnswer}
                </span>
              </div>
              {!item.isCorrect && (
                <div className="correct-answer">
                  <span className="answer-label">Correct answer:</span>
                  <span className="correct-text">{item.correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResult;