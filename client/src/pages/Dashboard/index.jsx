// src/pages/Dashboard/index.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Overview from "./Overview";
import Analytics from "./Analytics";
import PostingTimes from "./PostingTimes";
import ContentIdeas from "./ContentIdeas";
import ContentChat from "./ContentChat";
import YouTubeScripts from "./YouTubeScripts";
import InstagramConnection from "./InstagramConnection";
import YouTubeConnection from "./YouTubeConnection";
import YouTubeCallback from "./YouTubeCallback";
import YouTubeAnalytics from "./YouTubeAnalytics";
import YouTubePostingTimes from "./YouTubePostingTimes";
import { usePlatform } from "../../contexts/PlatformContext";
import SEO from "../../components/common/SEO";

const Dashboard = () => {
  const { currentPlatform, platformData, loading } = usePlatform();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  // Show connection page if neither account is connected
  if (!platformData.instagram && !platformData.youtube?.connected) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InstagramConnection />
            <YouTubeConnection />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show appropriate connection page based on current platform
  if (currentPlatform === "instagram" && !platformData.instagram) {
    return (
      <MainLayout>
        <InstagramConnection />
      </MainLayout>
    );
  }

  if (currentPlatform === "youtube" && !platformData.youtube?.connected) {
    return (
      <MainLayout>
        <YouTubeConnection />
      </MainLayout>
    );
  }

  return (
    <>
      <SEO
        title="Your Social Twin Dashboard | AI-Powered Content & Analytics"
        description="Access your social twin's command center. View analytics, generate niche-specific content, and optimize your social media presence with AI that understands your unique style."
        keywords="social media dashboard, AI content creation, analytics dashboard, content management, social twin, personalized analytics"
      />
      <MainLayout>
        <Routes>
          {/* Common routes */}
          <Route path="/" element={<Overview />} />

          {/* Instagram routes */}
          <Route
            path="/instagram-connection"
            element={<InstagramConnection />}
          />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/posting-times" element={<PostingTimes />} />
          <Route path="/content-ideas" element={<ContentIdeas />} />
          <Route path="/content-chat" element={<ContentChat />} />

          {/* YouTube routes */}
          <Route path="/youtube-connection" element={<YouTubeConnection />} />
          <Route path="/youtube-analytics" element={<YouTubeAnalytics />} />
          <Route
            path="/youtube-posting-times"
            element={<YouTubePostingTimes />}
          />
          <Route path="/youtube-scripts" element={<YouTubeScripts />} />
          <Route path="/youtube-callback" element={<YouTubeCallback />} />
        </Routes>
      </MainLayout>
    </>
  );
};

export default Dashboard;
