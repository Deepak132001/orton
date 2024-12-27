// client/src/pages/Dashboard/PostingTimes.jsx

import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Clock, Users, TrendingUp, Calendar } from "lucide-react";
import * as instagramService from "../../services/instagram.service";

const PostingTimes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostingTimes();
  }, []);

  const fetchPostingTimes = async () => {
    try {
      setLoading(true);
      const response = await instagramService.getBestPostingTimes();
      setData(response);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load posting times data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day];
  };

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${ampm}`;
  };

  const calculateAverageEngagement = (data) => {
    if (!data?.hourlyBreakdown?.length) return 0;
    
    const totalEngagement = data.hourlyBreakdown.reduce((sum, hour) => {
      return sum + (hour.engagement || 0);
    }, 0);
    
    return (totalEngagement / data.hourlyBreakdown.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Best Posting Times</h1>
        <p className="mt-2 text-gray-600">
          Analysis based on {data?.totalPosts || 0} posts from{" "}
          {data?.analysisStartDate
            ? new Date(data.analysisStartDate).toLocaleDateString()
            : "N/A"}{" "}
          to{" "}
          {data?.analysisEndDate
            ? new Date(data.analysisEndDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Best Time to Post
              </p>
              {data?.bestHours?.[0] && (
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {formatTime(data.bestHours[0].hour)}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {data?.bestHours?.[0]?.engagement.toFixed(2)}% engagement
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Best Day to Post
              </p>
              {data?.bestDays?.[0] && (
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {getDayName(data.bestDays[0].day)}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {data?.bestDays?.[0]?.engagement.toFixed(2)}% engagement
              </p>
            </div>
          </div>
        </Card>

        {/* averageEngagement */}
        <Card className="p-6">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-indigo-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Avg. Engagement</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {calculateAverageEngagement(data)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">across all posts</p>
          </div>
        </div>
      </Card>

        {/* <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Avg. Engagement
              </p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {data?.averageEngagement?.toFixed(2) || "0"}%
              </p>
              <p className="mt-1 text-sm text-gray-500">across all posts</p>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Hourly Engagement Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Hourly Engagement
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.hourlyBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip
                labelFormatter={formatTime}
                formatter={(value) => [
                  `${value.toFixed(2)}%`,
                  "Engagement Rate",
                ]}
              />
              <Legend />
              <Bar name="Engagement Rate" dataKey="engagement" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Best Times Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Hours */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Best Hours to Post
          </h2>
          <div className="space-y-4">
            {data?.bestHours?.map((time, index) => (
              <div
                key={time.hour}
                className={`bg-indigo-50 p-4 rounded-lg ${
                  index === 0 ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-900">
                      {formatTime(time.hour)}
                    </p>
                    <p className="text-sm text-indigo-600">
                      {time.postsAnalyzed} posts analyzed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-indigo-900">
                      {time.engagement.toFixed(2)}%
                    </p>
                    <p className="text-sm text-indigo-600">engagement rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Best Days */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Best Days to Post
          </h2>
          <div className="space-y-4">
            {data?.bestDays?.map((day, index) => (
              <div
                key={day.day}
                className={`bg-indigo-50 p-4 rounded-lg ${
                  index === 0 ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-indigo-900">
                      {getDayName(day.day)}
                    </p>
                    <p className="text-sm text-indigo-600">
                      {day.postsAnalyzed} posts analyzed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-indigo-900">
                      {day.engagement.toFixed(2)}%
                    </p>
                    <p className="text-sm text-indigo-600">engagement rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Peak Activity Times */}
      {/* <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Peak Activity Times
        </h2>
        <div className="space-y-4">
          {data?.peakActivityTimes?.map((peak, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {getDayName(peak.day)} at {formatTime(peak.hour)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on follower activity patterns
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {peak.count} posts with high engagement
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
};

export default PostingTimes;
