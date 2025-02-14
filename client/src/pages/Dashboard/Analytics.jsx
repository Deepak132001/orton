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
  Area,
  AreaChart,
} from "recharts";
import {
  Loader2,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import GrowthRateCalculator from "../../components/analytics/GrowthRateCalculator";
import * as instagramService from "../../services/instagram.service";
import SEO from "../../components/common/SEO";

const Analytics = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d");
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    setIsVisible(true);

    // Add scroll animation for elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await instagramService.getInstagramInsights();
      setInsights(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Please connect your Instagram account"
      );
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
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
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
    const engagementRate = (
      (totalEngagement / (insights.recent_posts.length * insights.account.followers_count)) *
      100
    ).toFixed(2);

    return {
      reach: totalReach,
      engagement: totalEngagement,
      impressions: totalImpressions,
      engagementRate,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="relative p-8 rounded-2xl backdrop-blur-lg bg-white/30">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse" />
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-indigo-600 font-medium animate-pulse">
            Loading insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transform transition-all duration-500 ease-out hover:scale-[1.02] bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const topPosts = [...(insights?.recent_posts || [])]
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 4);

  const metrics = calculateMetrics(insights);

  return (
    <>
      <SEO
        title="Social Media Analytics & AI Content Insights | Orton AI"
        description="Your social twin analyzes your performance and generates niche-specific content recommendations. Get deep insights and AI-powered content suggestions that resonate with your audience."
        keywords="social media analytics, content insights, AI recommendations, niche analysis, audience engagement, content performance"
      />
      <div
        className={`space-y-8 p-3 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen ${
          isVisible ? "opacity-100" : "opacity-0"
        } transition-all duration-700`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-on-scroll">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Analytics Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Track your social media performance and growth
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Users className="h-8 w-8" />,
              title: "Total Followers",
              value: formatNumber(insights?.account?.followers_count || 0),
              positive: true,
            },
            {
              icon: <Eye className="h-8 w-8" />,
              title: "Account Reach",
              value: formatNumber(calculateMetrics(insights).reach),
              positive: true,
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "Engagement Rate",
              value: `${insights?.metrics?.engagement_rate || "0"}%`,
              positive: true,
            },
            {
              icon: <MessageCircle className="h-8 w-8" />,
              title: "Total Interactions",
              value: formatNumber(metrics.engagement),
              positive: true,
            },
          ].map((metric, index) => (
            <Card
              key={metric.title}
              className={`p-6 group transition-all duration-500 ease-out transform hover:-translate-y-1 bg-white/80 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 ${
                activeMetric === index
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveMetric(index)}
              onMouseLeave={() => setActiveMetric(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    {metric.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      {metric.title}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center ${
                    metric.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="ml-1 text-sm font-medium">
                    {metric.change}
                  </span>
                </div>
              </div>

              <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={insights?.daily_engagement?.slice(-7) || []}>
                    <defs>
                      <linearGradient
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={metric.positive ? "#4F46E5" : "#DC2626"}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor={metric.positive ? "#4F46E5" : "#DC2626"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="likes"
                      stroke={metric.positive ? "#4F46E5" : "#DC2626"}
                      fill={`url(#gradient-${index})`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-white/80 border border-indigo-100 animate-on-scroll">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Top Performing Posts
              </h3>
              {/* <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </button> */}
            </div>
            <div className="grid gap-6">
              {topPosts.map((post, index) => (
                <div
                  key={post.id || index}
                  className={`transform transition-all duration-300 hover:scale-[1.02] border rounded-xl p-6 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm hover:shadow-md ${
                    hoveredPost === index
                      ? "border-indigo-300"
                      : "border-gray-100"
                  }`}
                  onMouseEnter={() => setHoveredPost(index)}
                  onMouseLeave={() => setHoveredPost(null)}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <p className="text-sm text-indigo-500 font-medium">
                          {formatDate(post.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {post.caption || "No caption"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Heart
                          className={`h-5 w-5 transition-colors duration-300 ${
                            hoveredPost === index
                              ? "text-pink-500"
                              : "text-pink-400"
                          }`}
                        />
                        <span className="font-medium">
                          {formatNumber(post.likes || 0)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle
                          className={`h-5 w-5 transition-colors duration-300 ${
                            hoveredPost === index
                              ? "text-blue-500"
                              : "text-blue-400"
                          }`}
                        />
                        <span className="font-medium">
                          {formatNumber(post.comments || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                      {/* <span className="text-sm font-medium text-indigo-600">
                      {((post.likes + post.comments) / insights.account.followers_count * 100).toFixed(1)}% Engagement
                    </span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Engagement Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={insights?.daily_engagement || []}
                  margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
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
        </div>

        <div className="mt-8 animate-on-scroll">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Growth Analysis
            </h2>
          </div>
          <Card className="p-3 bg-white/80 border border-indigo-100 hover:shadow-xl transition-all duration-300">
            <GrowthRateCalculator insights={insights} />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Analytics;
