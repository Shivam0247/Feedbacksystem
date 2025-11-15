import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SubmitFeedback from './pages/SubmitFeedback';
import FeedbackList from './pages/FeedbackList';
import MyFeedback from './pages/MyFeedback';
import FeedbackDetail from './pages/FeedbackDetail';
import AdminDashboard from './pages/AdminDashboard';
import CategoryManagement from './pages/CategoryManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/submit"
              element={
                <PrivateRoute>
                  <SubmitFeedback />
                </PrivateRoute>
              }
            />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route
              path="/my-feedback"
              element={
                <PrivateRoute>
                  <MyFeedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <PrivateRoute adminOnly>
                  <CategoryManagement />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

