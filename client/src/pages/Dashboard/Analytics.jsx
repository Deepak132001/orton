import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
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
  Loader2,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Heart,
} from "lucide-react";
import GrowthRateCalculator from '../../components/analytics/GrowthRateCalculator';
import * as instagramService from "../../services/instagram.service";

const Analytics = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await instagramService.getInstagramInsights();
      // console.log("Fetched insights:", data);
      setInsights(data);
    } catch (error) {
      // console.error("Failed to fetch analytics:", error);
      setError(error.response?.data?.message || "Failed to load analytics");
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const calculateMetrics = (insights) => {
    if (!insights?.recent_posts?.length)
      return {
        reach: 0,
        engagement: 0,
        impressions: 0,
      };

    const totalReach = insights.recent_posts.reduce(
      (sum, post) => sum + (post.reach || 0),
      0
    );
    const totalEngagement = insights.recent_posts.reduce(
      (sum, post) => sum + (post.likes || 0) + (post.comments || 0),
      0
    );
    const totalImpressions = insights.recent_posts.reduce(
      (sum, post) => sum + (post.impressions || 0),
      0
    );

    return {
      reach: totalReach,
      engagement: totalEngagement,
      impressions: totalImpressions,
      engagementRate: ((totalEngagement / totalReach) * 100).toFixed(2),
    };
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Sort posts by engagement (likes + comments) and take top 4
  const topPosts = [...(insights?.recent_posts || [])]
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 4);

    const metrics = calculateMetrics(insights);

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Followers
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(insights?.account?.followers_count || 0)}
              </p>
            </div>
          </div>
        </Card>

        {/* account reach */}
        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Account Reach</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(calculateMetrics(insights).reach)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Engagement Rate
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {insights?.metrics?.engagement_rate || "0"}%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
  <div className="flex items-center">
    <MessageCircle className="h-8 w-8 text-indigo-600" />
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">Total Interactions</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">
        {formatNumber(metrics.totalLikes + metrics.totalComments)}
      </p>
      {/* <p className="mt-1 text-sm text-gray-500">
        {formatNumber(metrics.totalLikes)} likes • {formatNumber(metrics.totalComments)} comments
      </p> */}
    </div>
  </div>
</Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Performing Posts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPosts.map((post, index) => (
            <div key={post.id || index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(post.timestamp)}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 line-clamp-2">
                    {post.caption || "No caption"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-pink-500" />
                  <span>{formatNumber(post.likes || 0)}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{formatNumber(post.comments || 0)}</span>
                </div>
              </div>
            </div>
          ))}
          {topPosts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No posts data available
            </div>
          )}
        </div>
      </Card>

      {/* Engagement Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Engagement Over Time
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={insights?.daily_engagement || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#6366F1"
                name="Likes"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#818CF8"
                name="Comments"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Add Growth Rate Calculator */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Growth Analysis</h2>
        <GrowthRateCalculator insights={insights} />
      </div>
    </div>
  );
};

export default Analytics;