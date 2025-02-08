import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlatformProvider } from "./contexts/PlatformContext";
import PrivateRoute from "./components/common/PrivateRoute";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/Landing/LandingPage";
import NotFound from "./pages/NotFound";
import useAuth from "./hooks/useAuth";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./pages/PrivacyPolicy/TermsAndCondition";
import DataDeletion from "./pages/PrivacyPolicy/DataDeletion";
import { ResponseProvider } from "./contexts/ResponseContext";
import { Helmet } from "react-helmet";

const RouteHandler = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // If there's a token or user is logged in, redirect to dashboard
  if (token || user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show landing page
  return <LandingPage />;
};

function App() {
  return (
    <>
      <Helmet>
        <title>
          Orton AI - Your Social Media Twin | AI Content Generation & Analytics
        </title>
        <meta
          name="description"
          content="Your social media twin that generates niche-specific AI content and provides deep analytics for Instagram and YouTube. Let AI create content that matches your brand voice while optimizing your social media presence."
        />
        <meta
          name="keywords"
          content="social media twin, AI content generation, niche content, Instagram content, YouTube content, social media analytics, content creator, AI writing, personalized content"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Orton AI - Your Social Media Twin" />
        <meta
          property="og:description"
          content="Your AI-powered social twin that creates niche-specific content and optimizes your social media presence."
        />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Orton AI - Your Social Media Twin"
        />
        <meta
          name="twitter:description"
          content="Your AI-powered social twin that creates niche-specific content and optimizes your social media presence."
        />
      </Helmet>

      <AuthProvider>
        <PlatformProvider>
          <ResponseProvider>
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
          </ResponseProvider>
        </PlatformProvider>
      </AuthProvider>
    </>
  );
}

export default App;
