// client/src/pages/Dashboard/index.jsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Overview from "./Overview";
import Analytics from "./Analytics";
import PostingTimes from "./PostingTimes";
import ContentIdeas from "./ContentIdeas";
import ConnectInstagram from "../../components/instagram/ConnectInstagram";
import InstagramConnection from "./InstagramConnection";
import * as instagramService from "../../services/instagram.service";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstagramProfile();
  }, []);

  const fetchInstagramProfile = async () => {
    try {
      const data = await instagramService.getInstagramProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load Instagram profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!profile && !error) {
    return (
      <MainLayout>
        <ConnectInstagram />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Overview profile={profile} />} />
        <Route path="/instagram-connection" element={<InstagramConnection />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/posting-times" element={<PostingTimes />} />
        <Route path="/content-ideas" element={<ContentIdeas />} />
      </Routes>
    </MainLayout>
  );
};

export default Dashboard;
