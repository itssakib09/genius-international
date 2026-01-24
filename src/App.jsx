import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingWhatsApp from './components/FloatingWhatsapp';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Tracking from './pages/Tracking';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminJobList from './pages/admin/jobs/JobList';
import AddJob from './pages/admin/jobs/AddJob';
import EditJob from './pages/admin/jobs/EditJob';
import CandidateList from './pages/admin/candidates/CandidateList';
import AddCandidate from './pages/admin/candidates/AddCandidate';
import EditCandidate from './pages/admin/candidates/EditCandidate';
import TrackingList from './pages/admin/tracking/TrackingList';
import AddTracking from './pages/admin/tracking/AddTracking';
import EditTracking from './pages/admin/tracking/EditTracking';
import './styles/global.css';
import './styles/theme.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            <ProtectedRoute>
              <AdminJobList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs/add" 
          element={
            <ProtectedRoute>
              <AddJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs/edit/:id" 
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/candidates" 
          element={
            <ProtectedRoute>
              <CandidateList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/candidates/add" 
          element={
            <ProtectedRoute>
              <AddCandidate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/candidates/edit/:id" 
          element={
            <ProtectedRoute>
              <EditCandidate />
            </ProtectedRoute>
          } 
        />

        {/* Tracking Routes */}
<Route 
  path="/admin/tracking" 
  element={
    <ProtectedRoute>
      <TrackingList />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/tracking/add" 
  element={
    <ProtectedRoute>
      <AddTracking />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/tracking/edit/:id" 
  element={
    <ProtectedRoute>
      <EditTracking />
    </ProtectedRoute>
  } 
/>

        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
              <FloatingWhatsApp />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;