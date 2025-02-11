// // client/src/pages/Dashboard/PostingTimes.jsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import { Clock, Users, TrendingUp, Calendar, RefreshCw } from "lucide-react";
import * as instagramService from "../../services/instagram.service";

const PostingTimes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('hourly');

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 md:w-12 md:h-12 text-indigo-600 animate-spin" />
          <p className="text-sm md:text-base text-indigo-600 animate-pulse">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-4 md:mt-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-3 md:p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm md:text-base text-red-700">Something went wrong</p>
              <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-8 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 transform transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-start md:items-center flex-row gap-4 md:gap-0">
          <div>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Best Posting Times
            </h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">
              Analysis based on {data?.totalPosts || 0} posts from{" "}
              <span className="font-medium text-gray-900">
                {data?.analysisStartDate
                  ? new Date(data.analysisStartDate).toLocaleDateString()
                  : "N/A"}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {data?.analysisEndDate
                  ? new Date(data.analysisEndDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>
          </div>
          {/* <button 
            onClick={fetchPostingTimes}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button> */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {[
          {
            icon: <Clock className="h-6 w-6 md:h-8 md:w-8" />,
            title: "Best Time to Post",
            value: data?.bestHours?.[0] ? formatTime(data.bestHours[0].hour) : "N/A",
            subvalue: `${data?.bestHours?.[0]?.engagement.toFixed(2)}% engagement`
          },
          {
            icon: <Calendar className="h-6 w-6 md:h-8 md:w-8" />,
            title: "Best Day to Post",
            value: data?.bestDays?.[0] ? getDayName(data.bestDays[0].day) : "N/A",
            subvalue: `${data?.bestDays?.[0]?.engagement.toFixed(2)}% engagement`
          },
          {
            icon: <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />,
            title: "Average Engagement",
            value: `${calculateAverageEngagement(data)}%`,
            subvalue: "across all posts"
          }
        ].map((stat, index) => (
          <Card 
            key={stat.title}
            className="p-4 md:p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer bg-white"
          >
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-lg bg-indigo-50 text-indigo-600">
                {stat.icon}
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-0.5 md:mt-1 text-lg md:text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500">{stat.subvalue}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="p-4 md:p-8 bg-white">
        <div className="flex justify-between items-center mb-4 md:mb-6 flex-col md:flex-row gap-3 md:gap-0">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Engagement Analytics</h2>
          <div className="flex space-x-2">
            {['hourly', 'daily'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg transition-all duration-200 ${
                  selectedMetric === metric
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={selectedMetric === 'hourly' ? data?.hourlyBreakdown : data?.bestDays}
              className="transition-all duration-500"
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={selectedMetric === 'hourly' ? 'hour' : 'day'}
                tickFormatter={selectedMetric === 'hourly' ? formatTime : getDayName}
                stroke="#6B7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#6B7280" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={selectedMetric === 'hourly' ? formatTime : getDayName}
                formatter={(value) => [`${value.toFixed(2)}%`, "Engagement Rate"]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                name="Engagement Rate" 
                dataKey="engagement" 
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Best Times Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Best Hours */}
        <Card className="p-4 md:p-6 bg-white">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
            Best Hours to Post
          </h2>
          <div className="space-y-3 md:space-y-4">
            {data?.bestHours?.map((time, index) => (
              <div
                key={time.hour}
                className={`transform transition-all duration-300 hover:scale-102 
                  ${index === 0 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 ring-2 ring-indigo-500' 
                    : 'bg-gray-50'} 
                  p-3 md:p-4 rounded-lg cursor-pointer hover:shadow-md`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">
                      {formatTime(time.hour)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {time.postsAnalyzed} posts analyzed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base md:text-lg font-semibold text-indigo-600">
                      {time.engagement.toFixed(2)}%
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">engagement rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Best Days */}
        <Card className="p-4 md:p-6 bg-white">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
            Best Days to Post
          </h2>
          <div className="space-y-3 md:space-y-4">
            {data?.bestDays?.map((day, index) => (
              <div
                key={day.day}
                className={`transform transition-all duration-300 hover:scale-102 
                  ${index === 0 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 ring-2 ring-indigo-500' 
                    : 'bg-gray-50'} 
                  p-3 md:p-4 rounded-lg cursor-pointer hover:shadow-md`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm md:text-base font-medium text-gray-900">
                      {getDayName(day.day)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {day.postsAnalyzed} posts analyzed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base md:text-lg font-semibold text-indigo-600">
                      {day.engagement.toFixed(2)}%
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">engagement rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostingTimes;