import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  RefreshCw,
  AlertCircle,
  Users,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import * as instagramService from "../../services/instagram.service";

const Overview = ({ profile }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await instagramService.getInstagramInsights();
      setInsights(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!profile) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <p className="ml-3 text-sm text-yellow-700">
            Please connect your Instagram account to view insights
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const calculateTotalMetrics = (posts) => {
    if (!posts || !Array.isArray(posts))
      return { totalLikes: 0, totalComments: 0 };

    return posts.reduce(
      (acc, post) => ({
        totalLikes: acc.totalLikes + (post.likes || 0),
        totalComments: acc.totalComments + (post.comments || 0),
      }),
      { totalLikes: 0, totalComments: 0 }
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          {profile?.profile_picture_url && (
            <img
              src={profile.profile_picture_url}
              alt={profile.username}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              @{profile?.username}
            </h2>
            <p className="text-gray-500">
              {formatCount(profile?.followers_count || 0)} followers •{" "}
              {formatCount(profile?.media_count || 0)} posts
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Followers</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatCount(profile?.followers_count || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Posts</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatCount(profile?.media_count || 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Likes</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatCount(
                  calculateTotalMetrics(insights?.recent_posts)?.totalLikes
                )}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
  <div className="flex items-center">
    <MessageCircle className="h-8 w-8 text-indigo-600" />
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">Total Comments</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">
        {formatCount(calculateTotalMetrics(insights?.recent_posts)?.totalComments)}
      </p>
    </div>
  </div>
</Card>
      </div>

      {/* Recent Posts */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights?.recent_posts?.slice(0, 5).map((post, index) => (
            <div key={post.id || index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(post.timestamp)}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 line-clamp-2">
                    {post.caption || "No caption"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {formatCount(post.likes)}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {formatCount(post.comments)}
                </div>
              </div>
            </div>
          ))}
          {(!insights?.recent_posts || insights.recent_posts.length === 0) && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No posts yet
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
