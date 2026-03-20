import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const quizData = location.state;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    console.log('Quiz Data received:', quizData); // Debug log
    
    if (!quizData || !quizData.questions) {
      toast.error('No quiz data found');
      navigate('/practice');
    }
  }, [quizData, navigate]);

  // Early return if no data
  if (!quizData || !quizData.questions) {
    return null;
  }

  const { questions, subjectId, subjectName, startTime } = quizData;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error('Please select an answer');
      return;
    }

    // Save answer
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption,
    };
    setAnswers(newAnswers);

    // Reset selection
    setSelectedOption('');

    // Check if last question
    if (currentIndex === questions.length - 1) {
      // Navigate to results
      navigate('/result', {
        state: {
          questions,
          answers: newAnswers,
          subjectId,
          subjectName,
          startTime,
        }
      });
    } else {
      // Go to next question
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="page-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <span className="quiz-subject">{subjectName}</span>
          <span className="quiz-progress">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{currentQuestion.question_text}</h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`option-button ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleSelectOption(option)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
          style={{ width: '100%', marginTop: '32px' }}
        >
          {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;