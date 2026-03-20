import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PracticeSetup from './pages/PracticeSetup';
import TakeQuiz from './pages/TakeQuiz';
import QuizResult from './pages/QuizResult';
import LogSession from './pages/LogSession';
import Analytics from './pages/Analytics';
import Schedule from './pages/Schedule';
import History from './pages/History';
import Settings from './pages/Settings';

// Styles
import './styles/variables.css';
import './styles/global.css';
import './styles/loader.css';

// Layout component for pages with sidebar
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <MobileHeader onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public pages - no sidebar */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected pages - with sidebar */}
      <Route path="/dashboard" element={
        <AppLayout><Dashboard /></AppLayout>
      } />
      <Route path="/practice" element={
        <AppLayout><PracticeSetup /></AppLayout>
      } />
      <Route path="/quiz" element={
        <AppLayout><TakeQuiz /></AppLayout>
      } />
      <Route path="/result" element={
        <AppLayout><QuizResult /></AppLayout>
      } />
      <Route path="/log" element={
        <AppLayout><LogSession /></AppLayout>
      } />
      <Route path="/analytics" element={
        <AppLayout><Analytics /></AppLayout>
      } />
      <Route path="/schedule" element={
        <AppLayout><Schedule /></AppLayout>
      } />
      <Route path="/history" element={
        <AppLayout><History /></AppLayout>
      } />
      <Route path="/settings" element={
        <AppLayout><Settings /></AppLayout>
      } />
    </Routes>
  );
};

export default App;