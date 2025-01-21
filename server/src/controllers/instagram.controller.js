// server/src/controllers/instagram.controller.js
import axios from 'axios';
import { User } from '../models/user.model.js';


export const connectInstagram = async (req, res) => {
  try {
    console.log('Connect request received:', {
      userId: req.user._id,
      hasAccessToken: !!req.body.accessToken
    });

    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ 
        message: 'Access token is required',
        details: 'No access token provided in request body'
      });
    }

    // Get long-lived token
    console.log('Getting long-lived token...');
    const longLivedTokenResponse = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: accessToken
        }
      }
    );

    const longLivedToken = longLivedTokenResponse.data.access_token;
    console.log('Long-lived token received');

    // Get Facebook pages
    console.log('Getting Facebook pages...');
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v18.0/me/accounts`,
      {
        params: { access_token: longLivedToken }
      }
    );

    const pages = pagesResponse.data.data;
    console.log('Facebook pages found:', pages.length);

    if (!pages.length) {
      return res.status(400).json({
        message: 'No Facebook pages found',
        details: 'Please create a Facebook page first'
      });
    }

    // Get Instagram Business Account ID
    const pageId = pages[0].id;
    const pageAccessToken = pages[0].access_token;

    console.log('Getting Instagram business account...');
    const instagramAccountResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          fields: 'instagram_business_account',
          access_token: pageAccessToken
        }
      }
    );

    const instagramBusinessId = instagramAccountResponse.data?.instagram_business_account?.id;
    console.log('Instagram business ID:', instagramBusinessId);

    if (!instagramBusinessId) {
      return res.status(400).json({
        message: 'No Instagram Business Account found',
        details: 'Please connect an Instagram Business account to your Facebook page'
      });
    }

    // Save to database
    console.log('Updating user record...');
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        facebookAccessToken: longLivedToken,
        facebookPageId: pageId,
        instagramBusinessId: instagramBusinessId
      },
      { new: true }
    );

    console.log('User updated:', {
      userId: updatedUser._id,
      hasInstagramId: !!updatedUser.instagramBusinessId,
      hasToken: !!updatedUser.facebookAccessToken
    });

    res.json({
      message: 'Instagram account connected successfully',
      instagramBusinessId,
      success: true
    });
  } catch (error) {
    console.error('Instagram connection error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    res.status(500).json({
      message: 'Failed to connect Instagram account',
      error: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // console.log('Getting profile for user:', req.user._id);
    
    const user = await User.findById(req.user._id);
    // console.log('User data:', {
    //   hasInstagramId: !!user.instagramBusinessId,
    //   hasToken: !!user.facebookAccessToken,
    //   instagramId: user.instagramBusinessId,
    //   tokenPrefix: user.facebookAccessToken?.substring(0, 10)
    // });

    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected',
        details: {
          hasInstagramId: !!user.instagramBusinessId,
          hasToken: !!user.facebookAccessToken
        }
      });
    }

    // console.log('Fetching Instagram profile...');
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
      {
        params: {
          fields: 'id,username,profile_picture_url,followers_count,media_count',
          access_token: user.facebookAccessToken
        }
      }
    );

    // console.log('Instagram profile received:', {
    //   username: response.data.username,
    //   hasFollowers: !!response.data.followers_count
    // });

    res.json(response.data);
  } catch (error) {
    console.error('Get profile error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    res.status(error.response?.status || 500).json({
      message: 'Failed to get Instagram profile',
      error: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log('Getting insights for user:', user._id);
    
    if (!user.instagramBusinessId || !user.facebookAccessToken) {
      return res.status(400).json({
        message: 'Instagram account not connected'
      });
    }

    // Safely process API responses
    const safelyGetInsights = async (metric, metricType) => {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/insights`,
          {
            params: {
              metric: metric,
              period: 'day',
              metric_type: metricType,
              access_token: user.facebookAccessToken
            }
          }
        );
        console.log(`${metricType} insights response:`, response.data);
        return response.data?.data || [];
      } catch (error) {
        console.error(`Error fetching ${metricType} insights:`, error.response?.data);
        return [];
      }
    };

    // Get account information
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${user.instagramBusinessId}`,
      {
        params: {
          fields: 'followers_count,media_count,profile_picture_url',
          access_token: user.facebookAccessToken
        }
      }
    );

    // Get insights with proper error handling
    const timeSeriesData = await safelyGetInsights('reach,impressions', 'time_series');
    const totalValueData = await safelyGetInsights('accounts_engaged', 'total_value');

    // Get recent media
    let recentPosts = [];
    try {
      const mediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${user.instagramBusinessId}/media`,
        {
          params: {
            fields: 'id,caption,like_count,comments_count,timestamp,insights.metric(reach,impressions)',
            limit: 30,
            access_token: user.facebookAccessToken
          }
        }
      );
      
      recentPosts = (mediaResponse.data?.data || []).map(post => ({
        id: post.id,
        timestamp: post.timestamp,
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        caption: post.caption || '',
        reach: post.insights?.data?.[0]?.values?.[0]?.value || 0,
        impressions: post.insights?.data?.[1]?.values?.[0]?.value || 0
      }));
    } catch (error) {
      console.error('Error fetching media:', error.response?.data);
    }

    // Safely process metrics
    const processMetrics = (data) => {
      return data.reduce((acc, item) => {
        if (item && item.values && item.values.length > 0) {
          acc[item.name] = item.values[0].value || 0;
        } else {
          acc[item.name] = 0;
        }
        return acc;
      }, {});
    };

    const timeSeriesMetrics = processMetrics(timeSeriesData);
    const totalValueMetrics = processMetrics(totalValueData);

    // Calculate engagement metrics
    const totalEngagement = recentPosts.reduce((sum, post) => sum + (post.likes || 0) + (post.comments || 0), 0);
    const totalReach = recentPosts.reduce((sum, post) => sum + (post.reach || 0), 0);
    const engagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) : '0';

    // Process daily engagement data safely
    const dailyEngagement = recentPosts.reduce((acc, post) => {
      if (!post.timestamp) return acc;
      
      const date = new Date(post.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          likes: 0,
          comments: 0,
          reach: 0
        };
      }
      acc[date].likes += post.likes || 0;
      acc[date].comments += post.comments || 0;
      acc[date].reach += post.reach || 0;
      return acc;
    }, {});

    // Calculate best performing posts
    const bestPerformingPosts = [...recentPosts]
      .sort((a, b) => ((b.likes + b.comments) - (a.likes + a.comments)))
      .slice(0, 5);

    const response = {
      account: {
        followers_count: accountResponse.data?.followers_count || 0,
        media_count: accountResponse.data?.media_count || 0,
        profile_picture_url: accountResponse.data?.profile_picture_url || null
      },
      metrics: {
        reach: timeSeriesMetrics.reach || 0,
        impressions: timeSeriesMetrics.impressions || 0,
        accounts_engaged: totalValueMetrics.accounts_engaged || 0,
        engagement_rate: engagementRate
      },
      performance: {
        total_engagement: totalEngagement,
        average_likes: recentPosts.length > 0 ? Math.round(recentPosts.reduce((sum, post) => sum + (post.likes || 0), 0) / recentPosts.length) : 0,
        average_comments: recentPosts.length > 0 ? Math.round(recentPosts.reduce((sum, post) => sum + (post.comments || 0), 0) / recentPosts.length) : 0,
        best_performing_posts: bestPerformingPosts
      },
      recent_posts: recentPosts,
      daily_engagement: Object.values(dailyEngagement).sort((a, b) => new Date(a.date) - new Date(b.date))
    };

    console.log('Processed insights response:', {
      hasMetrics: !!response.metrics,
      hasPerformance: !!response.performance,
      dailyEngagementCount: response.daily_engagement.length,
      recentPostsCount: response.recent_posts.length
    });

    res.json(response);
  } catch (error) {
    console.error('Instagram insights error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    res.status(error.response?.status || 500).json({
      message: 'Failed to get Instagram insights',
      error: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });
  }
};

export const disconnectInstagram = async (req, res) => {
  try {
    console.log('Disconnecting Instagram for user:', req.user._id);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          instagramBusinessId: "",
          facebookAccessToken: "",
          facebookPageId: ""
        }
      },
      { new: true }
    );

    console.log('Instagram disconnected successfully');
    res.json({
      message: 'Instagram account disconnected successfully',
      success: true
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      message: 'Failed to disconnect Instagram account',
      error: error.message
    });
  }
};

const calculateBestPostingTimes = (posts) => {
  // Create engagement map by hour and day
  const engagementMap = posts.reduce((acc, post) => {
    const date = new Date(post.timestamp);
    const day = date.getDay();
    const hour = date.getHours();
    const engagement = post.likes + post.comments;
    
    if (!acc[day]) acc[day] = {};
    if (!acc[day][hour]) {
      acc[day][hour] = {
        total_engagement: 0,
        count: 0
      };
    }
    
    acc[day][hour].total_engagement += engagement;
    acc[day][hour].count += 1;
    
    return acc;
  }, {});

  // Find best times
  const bestTimes = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  Object.entries(engagementMap).forEach(([day, hours]) => {
    Object.entries(hours).forEach(([hour, data]) => {
      const avgEngagement = data.total_engagement / data.count;
      bestTimes.push({
        day: days[day],
        hour: `${hour}:00`,
        engagement_rate: (avgEngagement * 100).toFixed(1)
      });
    });
  });

  // Sort by engagement rate and get top 3
  return bestTimes
    .sort((a, b) => parseFloat(b.engagement_rate) - parseFloat(a.engagement_rate))
    .slice(0, 3);
};