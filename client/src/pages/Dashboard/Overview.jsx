// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Users,
//   Eye,
//   Heart,
//   RefreshCw,
//   MessageCircle,
//   Calendar,
//   TrendingUp,
//   AlertCircle,
//   ArrowRight,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { usePlatform } from "../../contexts/PlatformContext";
// import * as instagramService from "../../services/instagram.service";
// import * as youtubeService from "../../services/youtube.service";
// import {
//   InstagramTutorial,
//   YouTubeTutorial,
// } from "../../components/tutorials/PlatformTutorial";

// const Overview = () => {
//   const { currentPlatform } = usePlatform();
//   const [insights, setInsights] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     checkConnectionAndFetchData();
//   }, [currentPlatform]);

//   const checkConnectionAndFetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (currentPlatform === "instagram") {
//         const profile = await instagramService.getInstagramProfile();
//         setIsConnected(!!profile);

//         if (profile) {
//           const data = await instagramService.getInstagramInsights();
//           setInsights(data);
//         }
//       } else {
//         const profile = await youtubeService.getYouTubeProfile();
//         setIsConnected(!!profile?.data?.channelId);

//         if (profile?.data?.channelId) {
//           const channelData = await youtubeService.getChannelInfo(
//             profile.data.channelId
//           );
//           setInsights(channelData);
//         }
//       }
//     } catch (error) {
//       if (error.response?.status === 400) {
//         setIsConnected(false);
//       } else {
//         setError(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => {
//     if (!num) return "0";
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   const getTimeAgo = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     const now = new Date();
//     const seconds = Math.floor((now - date) / 1000);

//     if (seconds < 60) return `${seconds}s ago`;
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//     return `${Math.floor(seconds / 86400)}d ago`;
//   };

//   const calculateMetrics = () => {
//     if (!insights?.recent_posts?.length) return { totalReach: 0, avgLikes: 0 };

//     const total = insights.recent_posts.reduce(
//       (acc, post) => ({
//         totalReach: acc.totalReach + (post.reach || 0),
//         totalLikes: acc.totalLikes + (post.likes || 0),
//       }),
//       { totalReach: 0, totalLikes: 0 }
//     );

//     return {
//       totalReach: total.totalReach,
//       avgLikes: Math.round(total.totalLikes / insights.recent_posts.length),
//     };
//   };

//   const MetricCard = ({ icon: Icon, title, value, color = "cyan" }) => (
//     <Card className="p-6 bg-white border border-gray-200 rounded-lg transform transition-all duration-300 hover:shadow-md">
//       <div className="flex items-center">
//         <div className={`h-8 w-8 text-${color}-500`}>
//           <Icon className="h-full w-full" />
//         </div>
//         <div className="ml-4">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </Card>
//   );

//   const RecentPostCard = ({ post }) => (
//     <Card className="p-4 bg-white border border-gray-200 rounded-lg transform transition-all duration-300 hover:shadow-md">
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-500">
//               {getTimeAgo(post.timestamp)}
//             </span>
//           </div>
//           <p className="mt-2 text-sm text-gray-700">
//             {post.caption || "No caption"}
//           </p>
//         </div>
//       </div>
//       <div className="mt-4 flex justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center text-sm text-gray-600">
//             <Heart className="h-4 w-4 text-pink-500 mr-1" />
//             <span>{formatNumber(post.likes)}</span>
//           </div>
//           <div className="flex items-center text-sm text-gray-600">
//             <MessageCircle className="h-4 w-4 text-blue-500 mr-1" />
//             <span>{formatNumber(post.comments)}</span>
//           </div>
//         </div>
//         <div className="flex items-center text-sm text-gray-500">
//           <Eye className="h-4 w-4 text-cyan-500 mr-1" />
//           <span>{formatNumber(post.reach || 0)} reach</span>
//         </div>
//       </div>
//     </Card>
//   );

//   const renderInstagramOverview = () => {
//     if (!insights) return null;

//     const metrics = calculateMetrics();

//     return (
//       <div className="space-y-6">
//         <Card className="p-6 bg-white border border-gray-200 rounded-lg">
//           <div className="flex items-center space-x-4">
//             {insights.account?.profile_picture_url && (
//               <img
//                 src={insights.account.profile_picture_url}
//                 alt={insights.account.username}
//                 className="h-16 w-16 rounded-full"
//               />
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 @{insights.account.username}
//               </h2>
//               <p className="text-gray-500">
//                 {formatNumber(insights.account?.followers_count)} followers •{" "}
//                 {formatNumber(insights.account?.media_count)} posts
//               </p>
//             </div>
//           </div>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <MetricCard
//             icon={Users}
//             title="Followers"
//             value={formatNumber(insights.account?.followers_count)}
//           />
//           <MetricCard
//             icon={Eye}
//             title="Total Reach"
//             value={formatNumber(metrics.totalReach)}
//           />
//           <MetricCard
//             icon={Heart}
//             title="Avg. Likes"
//             value={formatNumber(metrics.avgLikes)}
//           />
//           <MetricCard
//             icon={TrendingUp}
//             title="Engagement Rate"
//             value={`${insights.metrics?.engagement_rate || "0"}%`}
//           />
//         </div>

//         <Card className="p-6 bg-white border border-gray-200 rounded-lg">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {insights.recent_posts?.slice(0, 6).map((post, index) => (
//               <RecentPostCard key={post.id || index} post={post} />
//             ))}
//           </div>
//         </Card>

//         <Card className="p-6 bg-white border border-gray-200 rounded-lg">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">
//             Engagement Over Time
//           </h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={insights?.daily_engagement || []}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                 <XAxis dataKey="date" stroke="#94A3B8" />
//                 <YAxis stroke="#94A3B8" />
//                 <Tooltip
//                   contentStyle={{
//                     background: "rgba(255, 255, 255, 0.9)",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="likes"
//                   stroke="#06B6D4"
//                   strokeWidth={2}
//                   dot={{ fill: "#06B6D4", strokeWidth: 2 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="comments"
//                   stroke="#3B82F6"
//                   strokeWidth={2}
//                   dot={{ fill: "#3B82F6", strokeWidth: 2 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </Card>
//       </div>
//     );
//   };

//   const renderYouTubeOverview = () => {
//     if (!insights) return null;

//     return (
//       <div className="space-y-6">
//         <Card className="p-6 bg-white border border-gray-200 rounded-lg">
//           <div className="flex items-center space-x-4">
//             {insights.thumbnail && (
//               <img
//                 src={insights.thumbnail}
//                 alt={insights.title}
//                 className="h-16 w-16 rounded-full"
//               />
//             )}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {insights.title}
//               </h2>
//               <p className="text-gray-500">
//                 {formatNumber(insights.subscribers)} subscribers •{" "}
//                 {formatNumber(insights.videos)} videos
//               </p>
//             </div>
//           </div>
//         </Card>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <MetricCard
//             icon={Users}
//             title="Subscribers"
//             value={formatNumber(insights.subscribers)}
//             color="red"
//           />
//           <MetricCard
//             icon={Eye}
//             title="Views"
//             value={formatNumber(insights.views)}
//             color="red"
//           />
//           <MetricCard
//             icon={Calendar}
//             title="Videos"
//             value={formatNumber(insights.videos)}
//             color="red"
//           />
//           <MetricCard
//             icon={TrendingUp}
//             title="Avg. Views"
//             value={formatNumber(Math.round(insights.views / insights.videos))}
//             color="red"
//           />
//         </div>

//         {insights.recentVideos && insights.recentVideos.length > 0 && (
//           <Card className="p-6 bg-white border border-gray-200 rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Latest Videos
//             </h3>
//             <div className="grid grid-cols-1 gap-6">
//               {insights.recentVideos.slice(0, 2).map((video, index) => (
//                 <div
//                   key={video.id || index}
//                   className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="p-4">
//                     <div className="flex justify-between items-start space-x-4">
//                       <div className="flex flex-1 space-x-4">
//                         {video.thumbnail && (
//                           <div className="flex-shrink-0">
//                             <img
//                               src={video.thumbnail}
//                               alt={video.title}
//                               className="w-32 h-24 object-cover rounded-md"
//                               onError={(e) => {
//                                 e.target.src = "/api/placeholder/180/120";
//                               }}
//                             />
//                           </div>
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
//                             {video.title}
//                           </h4>
//                           <p className="text-sm text-gray-500 line-clamp-2">
//                             {video.description || "No description"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex-shrink-0 flex flex-col items-end space-y-2">
//                         <div className="flex items-center text-sm text-gray-500">
//                           <Eye className="h-4 w-4 text-gray-400 mr-1" />
//                           <span>{formatNumber(video.views)} views</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-500">
//                           <Heart className="h-4 w-4 text-red-400 mr-1" />
//                           <span>{formatNumber(video.likes)} likes</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-500">
//                           <MessageCircle className="h-4 w-4 text-blue-400 mr-1" />
//                           <span>{formatNumber(video.comments)} comments</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
//                       <div>
//                         <Calendar className="h-4 w-4 inline mr-1" />
//                         {new Date(video.publishedAt).toLocaleDateString()}
//                       </div>
//                       <div className="flex items-center">
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                         {(
//                           ((video.likes + video.comments) / video.views) *
//                           100
//                         ).toFixed(1)}
//                         % engagement
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-4 text-center">
//               <a
//                 href={`https://www.youtube.com/channel/${insights.channelId}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
//               >
//                 View Channel
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </a>
//             </div>
//           </Card>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <RefreshCw className="w-12 h-12 animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="flex">
//           <AlertCircle className="h-5 w-5 text-red-400" />
//           <p className="ml-3 text-sm text-red-400">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isConnected) {
//     return currentPlatform === "instagram" ? (
//       <InstagramTutorial />
//     ) : (
//       <YouTubeTutorial />
//     );
//   }

//   if (insights) {
//     return currentPlatform === "instagram"
//       ? renderInstagramOverview()
//       : renderYouTubeOverview();
//   }

//   return null;
// };

// export default Overview;

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Eye,
  Heart,
  RefreshCw,
  MessageCircle,
  Calendar,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePlatform } from "../../contexts/PlatformContext";
import * as instagramService from "../../services/instagram.service";
import * as youtubeService from "../../services/youtube.service";
import {
  InstagramTutorial,
  YouTubeTutorial,
} from "../../components/tutorials/PlatformTutorial";

const Overview = () => {
  const { currentPlatform } = usePlatform();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnectionAndFetchData();
  }, [currentPlatform]);

  const checkConnectionAndFetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (currentPlatform === "instagram") {
        const profile = await instagramService.getInstagramProfile();
        setIsConnected(!!profile);

        if (profile) {
          const data = await instagramService.getInstagramInsights();
          setInsights(data);
        }
      } else {
        const profile = await youtubeService.getYouTubeProfile();
        setIsConnected(!!profile?.data?.channelId);

        if (profile?.data?.channelId) {
          const channelData = await youtubeService.getChannelInfo(
            profile.data.channelId
          );
          setInsights(channelData);
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setIsConnected(false);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const calculateMetrics = () => {
    if (!insights?.recent_posts?.length) return { totalReach: 0, avgLikes: 0 };

    const total = insights.recent_posts.reduce(
      (acc, post) => ({
        totalReach: acc.totalReach + (post.reach || 0),
        totalLikes: acc.totalLikes + (post.likes || 0),
      }),
      { totalReach: 0, totalLikes: 0 }
    );

    return {
      totalReach: total.totalReach,
      avgLikes: Math.round(total.totalLikes / insights.recent_posts.length),
    };
  };

  const MetricCard = ({ icon: Icon, title, value, color = "indigo" }) => (
    <Card className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-${color}-50`}>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-500`} />
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <h3 className="text-xs sm:text-sm font-medium text-slate-600">{title}</h3>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  const RecentPostCard = ({ post }) => (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                {getTimeAgo(post.timestamp)}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 line-clamp-2">
              {post.caption || "No caption"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium">
              <Heart className="h-4 w-4 text-pink-500 mr-1.5" />
              <span className="text-slate-700">{formatNumber(post.likes)}</span>
            </div>
            <div className="flex items-center text-sm font-medium">
              <MessageCircle className="h-4 w-4 text-blue-500 mr-1.5" />
              <span className="text-slate-700">{formatNumber(post.comments)}</span>
            </div>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Eye className="h-4 w-4 text-indigo-500 mr-1.5" />
            <span className="text-slate-700">{formatNumber(post.reach || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );

  const VideoCard = ({ video }) => (
    <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex space-x-6">
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-40 h-28 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/api/placeholder/180/120";
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
              {video.title}
            </h4>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {video.description || "No description"}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm font-medium text-slate-700">
                <Eye className="h-4 w-4 text-slate-400 mr-1.5" />
                {formatNumber(video.views)}
              </div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                <Heart className="h-4 w-4 text-slate-400 mr-1.5" />
                {formatNumber(video.likes)}
              </div>
              <div className="flex items-center text-sm font-medium text-slate-700">
                <MessageCircle className="h-4 w-4 text-slate-400 mr-1.5" />
                {formatNumber(video.comments)}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <Calendar className="h-4 w-4 mr-1.5" />
              {new Date(video.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-12 h-12 animate-spin text-slate-400" />
        <p className="text-slate-600 font-medium">Loading insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      </Card>
    );
  }

  if (!isConnected) {
    return currentPlatform === "instagram" ? (
      <InstagramTutorial />
    ) : (
      <YouTubeTutorial />
    );
  }

  if (insights) {
    return currentPlatform === "instagram" ? (
      <div className="space-y-8 animate-fadeIn">
        {/* Profile Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
  <div className="p-4 sm:p-6">
    <div className="flex items-center space-x-3">
      {insights.account?.profile_picture_url && (
        <div className="relative">
          <img
            src={insights.account.profile_picture_url}
            alt={insights.account.username}
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full ring-4 ring-white shadow-md"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20" />
        </div>
      )}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            @{insights.account.username}
          </h2>
          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
        </div>
        <p className="mt-1 text-sm sm:text-base text-slate-600 font-medium">
          {formatNumber(insights.account?.followers_count)} followers • {formatNumber(insights.account?.media_count)} posts
        </p>
      </div>
    </div>
  </div>
</Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
  <MetricCard
    icon={Users}
    title="Followers"
    value={formatNumber(insights.account?.followers_count)}
  />
  <MetricCard
    icon={Eye}
    title="Total Reach"
    value={formatNumber(calculateMetrics().totalReach)}
  />
  <MetricCard
    icon={Heart}
    title="Avg. Likes"
    value={formatNumber(calculateMetrics().avgLikes)}
  />
  <MetricCard
    icon={TrendingUp}
    title="Engagement Rate"
    value={`${insights.metrics?.engagement_rate || "0"}%`}
  />
</div>

        {/* Recent Posts */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Recent Posts</h3>
              <button className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.recent_posts?.slice(0, 6).map((post, index) => (
                <RecentPostCard key={post.id || index} post={post} />
              ))}
            </div>
          </div>
        </Card>

        {/* Engagement Chart */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Engagement Trends</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2" />
                  <span className="text-sm text-slate-600">Likes</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                  <span className="text-sm text-slate-600">Comments</span>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights?.daily_engagement || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    ) : (
      // YouTube Overview
      <div className="space-y-8 animate-fadeIn">
        {/* Channel Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {insights.thumbnail && (
                <div className="relative">
                  <img
                    src={insights.thumbnail}
                    alt={insights.title}
                    className="h-20 w-20 rounded-full ring-4 ring-white shadow-md"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-slate-900">{insights.title}</h2>
                  <a
                    href={`https://www.youtube.com/channel/${insights.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <p className="mt-1 text-slate-600 font-medium">
                  {formatNumber(insights.subscribers)} subscribers • {formatNumber(insights.videos)} videos
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Users}
            title="Subscribers"
            value={formatNumber(insights.subscribers)}
            color="red"
            trend={5.2}
          />
          <MetricCard
            icon={Eye}
            title="Total Views"
            value={formatNumber(insights.views)}
            color="red"
            trend={3.8}
          />
          <MetricCard
            icon={Calendar}
            title="Videos"
            value={formatNumber(insights.videos)}
            color="red"
            trend={1.5}
          />
          <MetricCard
            icon={TrendingUp}
            title="Avg. Views"
            value={formatNumber(Math.round(insights.views / insights.videos))}
            color="red"
            trend={2.1}
          />
        </div>

        {/* Latest Videos */}
        {insights.recentVideos && insights.recentVideos.length > 0 && (
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Latest Videos</h3>
                <a
                  href={`https://www.youtube.com/channel/${insights.channelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  View Channel
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {insights.recentVideos.slice(0, 2).map((video, index) => (
                  <VideoCard key={video.id || index} video={video} />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Performance Chart */}
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Channel Performance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                  <span className="text-sm text-slate-600">Views</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-orange-500 mr-2" />
                  <span className="text-sm text-slate-600">Subscribers</span>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights?.performance_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default Overview;