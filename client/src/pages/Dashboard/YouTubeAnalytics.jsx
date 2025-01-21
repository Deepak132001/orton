// src/pages/Dashboard/YouTubeAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Users,
  Eye,
  PlayCircle,
  Clock,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';

const YouTubeAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const profile = await youtubeService.getYouTubeProfile();
      if (profile?.data?.channelId) {
        const data = await youtubeService.getChannelInfo(profile.data.channelId);
        setAnalytics(data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Channel Analytics</h1>
        <p className="mt-2 text-gray-600">
          Performance metrics for your YouTube channel
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Subscribers</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(analytics?.subscribers)}
              </p>
              <p className="text-sm text-gray-500">
                {analytics?.subscriberChange > 0 ? '+' : ''}{formatNumber(analytics?.subscriberChange)} this month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(analytics?.views)}
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(analytics?.viewsPerMonth)} monthly
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <PlayCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Videos</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(analytics?.videos)}
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(analytics?.videosThisMonth)} this month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Watch Time</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {formatNumber(analytics?.watchTimeHours)}h
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(analytics?.avgWatchTime)}min avg
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Engagement Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <ThumbsUp className="h-6 w-6 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Like Rate</p>
              <p className="text-xl font-semibold text-gray-900">
                {analytics?.likeRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Comment Rate</p>
              <p className="text-xl font-semibold text-gray-900">
                {analytics?.commentRate}%
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">CTR</p>
              <p className="text-xl font-semibold text-gray-900">
                {analytics?.ctr}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Growth Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Channel Growth</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.growthData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="subscribers" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Subscribers"
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#818cf8" 
                strokeWidth={2}
                name="Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Top Videos */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics?.topVideos?.map((video, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{video.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatNumber(video.views)} views • {formatNumber(video.likes)} likes
                  </p>
                </div>
                <PlayCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Engagement rate: {video.engagementRate}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audience Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Audience Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Top Geographies</h3>
            <div className="space-y-2">
              {analytics?.topCountries?.map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{country.name}</span>
                  <span className="text-sm font-medium text-gray-900">{country.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Age Demographics</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.ageData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YouTubeAnalytics;