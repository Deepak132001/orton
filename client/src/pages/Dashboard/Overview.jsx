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

  const MetricCard = ({ icon: Icon, title, value, color = "cyan" }) => (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg transform transition-all duration-300 hover:shadow-md">
      <div className="flex items-center">
        <div className={`h-8 w-8 text-${color}-500`}>
          <Icon className="h-full w-full" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  const RecentPostCard = ({ post }) => (
    <Card className="p-4 bg-white border border-gray-200 rounded-lg transform transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {getTimeAgo(post.timestamp)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            {post.caption || "No caption"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Heart className="h-4 w-4 text-pink-500 mr-1" />
            <span>{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MessageCircle className="h-4 w-4 text-blue-500 mr-1" />
            <span>{formatNumber(post.comments)}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Eye className="h-4 w-4 text-cyan-500 mr-1" />
          <span>{formatNumber(post.reach || 0)} reach</span>
        </div>
      </div>
    </Card>
  );

  const renderInstagramOverview = () => {
    if (!insights) return null;

    const metrics = calculateMetrics();

    return (
      <div className="space-y-6">
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            {insights.account?.profile_picture_url && (
              <img
                src={insights.account.profile_picture_url}
                alt={insights.account.username}
                className="h-16 w-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                @{insights.account.username}
              </h2>
              <p className="text-gray-500">
                {formatNumber(insights.account?.followers_count)} followers •{" "}
                {formatNumber(insights.account?.media_count)} posts
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Users}
            title="Followers"
            value={formatNumber(insights.account?.followers_count)}
          />
          <MetricCard
            icon={Eye}
            title="Total Reach"
            value={formatNumber(metrics.totalReach)}
          />
          <MetricCard
            icon={Heart}
            title="Avg. Likes"
            value={formatNumber(metrics.avgLikes)}
          />
          <MetricCard
            icon={TrendingUp}
            title="Engagement Rate"
            value={`${insights.metrics?.engagement_rate || "0"}%`}
          />
        </div>

        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.recent_posts?.slice(0, 6).map((post, index) => (
              <RecentPostCard key={post.id || index} post={post} />
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Engagement Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights?.daily_engagement || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: "#06B6D4", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  };

  const renderYouTubeOverview = () => {
    if (!insights) return null;

    return (
      <div className="space-y-6">
        <Card className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            {insights.thumbnail && (
              <img
                src={insights.thumbnail}
                alt={insights.title}
                className="h-16 w-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {insights.title}
              </h2>
              <p className="text-gray-500">
                {formatNumber(insights.subscribers)} subscribers •{" "}
                {formatNumber(insights.videos)} videos
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Users}
            title="Subscribers"
            value={formatNumber(insights.subscribers)}
            color="red"
          />
          <MetricCard
            icon={Eye}
            title="Views"
            value={formatNumber(insights.views)}
            color="red"
          />
          <MetricCard
            icon={Calendar}
            title="Videos"
            value={formatNumber(insights.videos)}
            color="red"
          />
          <MetricCard
            icon={TrendingUp}
            title="Avg. Views"
            value={formatNumber(Math.round(insights.views / insights.videos))}
            color="red"
          />
        </div>

        {insights.recentVideos && insights.recentVideos.length > 0 && (
          <Card className="p-6 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Latest Videos
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {insights.recentVideos.slice(0, 2).map((video, index) => (
                <div
                  key={video.id || index}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start space-x-4">
                      <div className="flex flex-1 space-x-4">
                        {video.thumbnail && (
                          <div className="flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-32 h-24 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/180/120";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {video.description || "No description"}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{formatNumber(video.views)} views</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart className="h-4 w-4 text-red-400 mr-1" />
                          <span>{formatNumber(video.likes)} likes</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MessageCircle className="h-4 w-4 text-blue-400 mr-1" />
                          <span>{formatNumber(video.comments)} comments</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        {(
                          ((video.likes + video.comments) / video.views) *
                          100
                        ).toFixed(1)}
                        % engagement
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <a
                href={`https://www.youtube.com/channel/${insights.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                View Channel
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-400">{error}</p>
        </div>
      </div>
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
    return currentPlatform === "instagram"
      ? renderInstagramOverview()
      : renderYouTubeOverview();
  }

  return null;
};

export default Overview;