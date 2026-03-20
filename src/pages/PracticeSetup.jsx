import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';
import './PracticeSetup.css';

const PracticeSetup = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects/');
      setSubjects(response.data);
      if (response.data.length > 0) {
        setSelectedSubject(response.data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
      setLoading(false);
    }
  };

  // Decode HTML entities from API
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleStartQuiz = async (e) => {
  e.preventDefault();

  if (!selectedSubject) {
    toast.error('Please select a subject');
    return;
  }

  setStarting(true);

  try {
    const subject = subjects.find(s => s.id == selectedSubject);
    
    console.log('Subject:', subject); // ← ADD THIS
    
    const categoryMap = {
  'General Knowledge': 9,
  'Science': 17,
  'Mathematics': 19,
  'Computers': 18,
  'History': 23,
  'Geography': 22,
  'Sports': 21,
  'Art': 25,
  'Music': 12,
  'Film': 11,
  'Books': 10,
  'Mythology': 20,
  'Animals': 27,
  'Politics': 24,
  'Vehicles': 28,
  'Video Games': 15,
};

    const categoryId = categoryMap[subject.name] || 9;
    
    console.log('Category ID:', categoryId); // ← ADD THIS

    const triviaUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
    
    console.log('Fetching from:', triviaUrl); // ← ADD THIS

    const triviaResponse = await fetch(triviaUrl);
    const triviaData = await triviaResponse.json();

    console.log('Trivia Response:', triviaData); // ← ADD THIS

    if (triviaData.response_code !== 0) {
      toast.error('Failed to fetch questions. Try different settings.');
      setStarting(false);
      return;
    }


      // Format questions
      const questions = triviaData.results.map((q, index) => {
        const incorrectAnswers = q.incorrect_answers;
        const correctAnswer = q.correct_answer;
        
        // Shuffle answers
        const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

        return {
          id: index + 1,
          question_text: decodeHTML(q.question),
          options: allAnswers.map(a => decodeHTML(a)),
          correct_answer: decodeHTML(correctAnswer),
          difficulty: q.difficulty,
        };
      });

      // Navigate to quiz with data
      navigate('/quiz', {
        state: {
          questions,
          subjectId: subject.id,
          subjectName: subject.name,
          startTime: new Date().toISOString(),
        }
      });

    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz. Please try again.');
      setStarting(false);
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
          <h1 className="page-title">Practice</h1>
          <p className="page-subtitle">Start a quiz session</p>
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
        <h1 className="page-title">Practice</h1>
        <p className="page-subtitle">Configure your quiz session</p>
      </div>

      <div className="practice-card">
        <form onSubmit={handleStartQuiz}>
          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Select Subject
            </label>
            <select
              id="subject"
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="numQuestions" className="form-label">
              Number of Questions
            </label>
            <select
              id="numQuestions"
              className="form-control"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty" className="form-label">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="form-control"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '24px' }}
            disabled={starting}
          >
            {starting ? 'Loading Questions...' : 'Start Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PracticeSetup;