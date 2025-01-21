// // client/src/App.jsx

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/common/PrivateRoute';
// import LoginPage from './pages/Auth/Login';
// import RegisterPage from './pages/Auth/Register';
// import Dashboard from './pages/Dashboard';
// import NotFound from './pages/NotFound';
// import useAuth from './hooks/useAuth';
// import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
// import TermsAndConditions from './pages/PrivacyPolicy/TermsAndCondition';
// import DataDeletion from './pages/PrivacyPolicy/DataDeletion';

// const RedirectBasedOnAuth = () => {
//   const { user, isNewUser } = useAuth();
  
//   if (!user) return <Navigate to="/login" />;
//   // if (isNewUser) return <Navigate to="/onboarding" />;
//   return <Navigate to="/dashboard" />;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/privacy" element={<PrivacyPolicy />} />
//           <Route path="/terms" element={<TermsAndConditions />} />
//           <Route path="/data" element={<DataDeletion />} />
//           {/* <Route path="/onboarding" element={
//             <PrivateRoute>
//               <Onboarding />
//             </PrivateRoute>
//           } /> */}
//           <Route path="/dashboard/*" element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           } />
//           <Route path="/" element={<RedirectBasedOnAuth />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlatformProvider } from './contexts/PlatformContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landing/LandingPage';
import NotFound from './pages/NotFound';
import useAuth from './hooks/useAuth';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/PrivacyPolicy/TermsAndCondition';
import DataDeletion from './pages/PrivacyPolicy/DataDeletion';

const RouteHandler = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  // If there's a token or user is logged in, redirect to dashboard
  if (token || user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show landing page
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <Router>
          <Routes>
            {/* Root route with conditional rendering */}
            <Route path="/" element={<RouteHandler />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Public routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/data" element={<DataDeletion />} />
            
            {/* Protected route */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </PlatformProvider>
    </AuthProvider>
  );
}

export default App;