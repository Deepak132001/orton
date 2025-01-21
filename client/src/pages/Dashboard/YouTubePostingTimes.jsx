//src/pages/Dashboard/YouTubePostingTimes.jsx
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  Clock,
  Calendar,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import * as youtubeService from '../../services/youtube.service';

const YouTubePostingTimes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostingTimes();
  }, []);

  const fetchPostingTimes = async () => {
    try {
      setLoading(true);
      const profile = await youtubeService.getYouTubeProfile();
      if (profile?.data?.channelId) {
        const timingData = await youtubeService.getUploadTiming();
        setData(timingData);
      }
    } catch (error) {
      console.error('Error fetching posting times:', error);
      setError(error.response?.data?.message || 'Failed to load posting times data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${ampm}`;
  };

  const getDayName = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
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
        <h1 className="text-2xl font-bold text-gray-900">Best Upload Times</h1>
        <p className="mt-2 text-gray-600">
          Analysis based on your viewers' engagement patterns
        </p>
      </div>

      {/* Best Times Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Best Time to Upload</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {data?.bestHours?.[0] ? formatTime(data.bestHours[0].hour) : 'N/A'}
              </p>
              {data?.bestHours?.[0] && (
                <p className="text-sm text-gray-500">
                  {data.bestHours[0].engagement}% more engagement
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Best Day</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {data?.bestDays?.[0] ? getDayName(data.bestDays[0].day) : 'N/A'}
              </p>
              {data?.bestDays?.[0] && (
                <p className="text-sm text-gray-500">
                  {data.bestDays[0].engagement}% more engagement
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Videos Analyzed</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {data?.totalVideos || 0}
              </p>
              <p className="text-sm text-gray-500">
                Last {data?.analyzedDays || 30} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Hourly Engagement Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Hourly Engagement</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.hourlyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip 
                formatter={(value) => `${value}%`}
                labelFormatter={formatTime}
              />
              <Bar 
                dataKey="engagement" 
                fill="#dc2626" 
                name="Engagement Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={getDayName} />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={getDayName}
                />
                <Bar 
                  dataKey="engagement" 
                  fill="#dc2626" 
                  name="Engagement Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Times</h2>
          <div className="space-y-4">
            {data?.bestHours?.map((time, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatTime(time.hour)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {time.uploads} videos uploaded
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {time.engagement}%
                    </p>
                    <p className="text-sm text-gray-500">
                      engagement rate
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upload Recommendations */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-red-600 mt-1" />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Best Time to Upload</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Upload your videos at {data?.bestHours?.[0] ? formatTime(data.bestHours[0].hour) : 'N/A'} on {data?.bestDays?.[0] ? getDayName(data.bestDays[0].day) : 'N/A'} for maximum engagement.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-red-600 mt-1" />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">Peak Activity</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your audience is most active during {data?.bestHours?.[0] ? formatTime(data.bestHours[0].hour) : 'N/A'} to {data?.bestHours?.[1] ? formatTime(data.bestHours[1].hour) : 'N/A'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default YouTubePostingTimes;