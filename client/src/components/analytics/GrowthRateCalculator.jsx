// frontend/src/components/analytics/GrowthRateCalculator.jsx
import React, { useMemo } from 'react';
import { Card } from '../../components/ui/card';
import { TrendingUp, Users, Heart, MessageCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const GrowthRateCalculator = ({ insights }) => {
  // Move helper functions before using them
  const calculateGrowthPercentage = (current, previous) => {
    if (!previous) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const calculateEngagementRate = (posts) => {
    if (!posts.length) return 0;
    const totalEngagement = posts.reduce((sum, post) => 
      sum + (post.likes || 0) + (post.comments || 0), 0
    );
    return (totalEngagement / posts.length).toFixed(2);
  };

  const growthMetrics = useMemo(() => {
    if (!insights?.recent_posts || !insights?.daily_engagement) {
      return null;
    }

    // Calculate time periods
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Filter posts
    const weekPosts = insights.recent_posts.filter(post => 
      new Date(post.timestamp) > oneWeekAgo
    );
    const monthPosts = insights.recent_posts.filter(post => 
      new Date(post.timestamp) > oneMonthAgo
    );

    // Calculate rates
    const weeklyEngagementRate = calculateEngagementRate(weekPosts);
    const monthlyEngagementRate = calculateEngagementRate(monthPosts);

    // Prepare trend data
    const trendData = insights.daily_engagement.map(day => ({
      date: new Date(day.date).toLocaleDateString(),
      engagement: (day.likes + day.comments),
      reach: day.reach || 0
    }));

    return {
      weeklyEngagementRate,
      monthlyEngagementRate,
      weeklyPostCount: weekPosts.length,
      monthlyPostCount: monthPosts.length,
      trendData,
      weeklyGrowth: calculateGrowthPercentage(
        weeklyEngagementRate,
        calculateEngagementRate(insights.recent_posts.slice(weekPosts.length))
      ),
      monthlyGrowth: calculateGrowthPercentage(
        monthlyEngagementRate,
        calculateEngagementRate(insights.recent_posts.slice(monthPosts.length))
      )
    };
  }, [insights]);

  if (!growthMetrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Growth Rate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Growth</p>
              <p className={`text-2xl font-bold ${
                growthMetrics.weeklyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growthMetrics.weeklyGrowth}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Growth</p>
              <p className={`text-2xl font-bold ${
                growthMetrics.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growthMetrics.monthlyGrowth}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Weekly Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {growthMetrics.weeklyEngagementRate}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Monthly Engagement</p>
              <p className="text-2xl font-bold text-gray-900">
                {growthMetrics.monthlyEngagementRate}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Trend Chart */}
      <Card className="p-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Growth Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthMetrics.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#6366F1" 
                strokeWidth={2}
                name="Engagement"
              />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="#818CF8" 
                strokeWidth={2}
                name="Reach"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default GrowthRateCalculator;