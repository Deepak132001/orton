// // client/src/pages/Dashboard/index.jsx
// import { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import MainLayout from "../../components/layout/MainLayout";
// import Overview from "./Overview";
// import Analytics from "./Analytics";
// import PostingTimes from "./PostingTimes";
// import ContentIdeas from "./ContentIdeas";
// import ConnectInstagram from "../../components/instagram/ConnectInstagram";
// import InstagramConnection from "./InstagramConnection";
// import * as instagramService from "../../services/instagram.service";
// import ContentChat from "./ContentChat";
// import YouTubeConnection from "./YouTubeConnection";
// import YouTubeScripts from "./YouTubeScripts";
// import ConnectYouTube from '../../components/youtube/ConnectYouTube';
// import * as youtubeService from '../../services/youtube.service';
// import YouTubeCallback from "./YouTubeCallback";

// // const Dashboard = () => {
// //   const [profile, setProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     fetchInstagramProfile();
// //   }, []);

// //   const fetchInstagramProfile = async () => {
// //     try {
// //       const data = await instagramService.getInstagramProfile();
// //       setProfile(data);
// //     } catch (err) {
// //       setError(
// //         err.response?.data?.message || "Failed to load Instagram profile"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <MainLayout>
// //         <div className="flex items-center justify-center h-screen">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
// //         </div>
// //       </MainLayout>
// //     );
// //   }

// //   if (!profile && !error) {
// //     return (
// //       <MainLayout>
// //         <ConnectInstagram />
// //       </MainLayout>
// //     );
// //   }

// //   return (
// //     <MainLayout>
// //       <Routes>
// //         <Route path="/" element={<Overview profile={profile} />} />
// //         <Route path="/instagram-connection" element={<InstagramConnection />} />
// //         <Route path="/analytics" element={<Analytics />} />
// //         <Route path="/posting-times" element={<PostingTimes />} />
// //         <Route path="/content-ideas" element={<ContentIdeas />} />
// //         <Route path="/content-chat" element={<ContentChat />} />
// //       </Routes>
// //     </MainLayout>
// //   );
// // };

// const Dashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [youtubeProfile, setYoutubeProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const fetchProfiles = async () => {
//     try {
//       setLoading(true);
//       // Fetch Instagram profile
//       try {
//         const instagramData = await instagramService.getInstagramProfile();
//         setProfile(instagramData);
//       } catch (error) {
//         console.error('Instagram fetch error:', error);
//       }

//       // Fetch YouTube profile
//       try {
//         const youtubeData = await youtubeService.getYouTubeProfile();
//         setYoutubeProfile(youtubeData);
//       } catch (error) {
//         console.error('YouTube fetch error:', error);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load profiles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//         </div>
//       </MainLayout>
//     );
//   }

//   // Show connect pages if neither account is connected
//   if (!profile && !youtubeProfile && !error) {
//     return (
//       <MainLayout>
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InstagramConnection />
//             <ConnectYouTube />
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <Routes>
//         <Route path="/" element={<Overview profile={profile} youtubeProfile={youtubeProfile} />} />
//         <Route path="/instagram-connection" element={<InstagramConnection />} />
//         <Route path="/youtube-connection" element={<YouTubeConnection />} />
//         <Route path="/youtube-scripts" element={<YouTubeScripts />} />
//         <Route path="/analytics" element={<Analytics />} />
//         <Route path="/posting-times" element={<PostingTimes />} />
//         <Route path="/content-ideas" element={<ContentIdeas />} />
//         <Route path="/content-chat" element={<ContentChat />} />
//         <Route path="/youtube-callback" element={<YouTubeCallback />} />
//       </Routes>
//     </MainLayout>
//   );
// };

// export default Dashboard;

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
  if (currentPlatform === 'instagram' && !platformData.instagram) {
    return (
      <MainLayout>
        <InstagramConnection />
      </MainLayout>
    );
  }

  if (currentPlatform === 'youtube' && !platformData.youtube?.connected) {
    return (
      <MainLayout>
        <YouTubeConnection />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Routes>
        {/* Common routes */}
        <Route path="/" element={<Overview />} />
        
        {/* Instagram routes */}
        <Route path="/instagram-connection" element={<InstagramConnection />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/posting-times" element={<PostingTimes />} />
        <Route path="/content-ideas" element={<ContentIdeas />} />
        <Route path="/content-chat" element={<ContentChat />} />
        
        {/* YouTube routes */}
        <Route path="/youtube-connection" element={<YouTubeConnection />} />
        <Route path="/youtube-analytics" element={<YouTubeAnalytics />} />
        <Route path="/youtube-posting-times" element={<YouTubePostingTimes />} />
        <Route path="/youtube-scripts" element={<YouTubeScripts />} />
        <Route path="/youtube-callback" element={<YouTubeCallback />} />
      </Routes>
    </MainLayout>
  );
};

export default Dashboard;