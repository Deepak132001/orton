import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { 
  Instagram, 
  Clock, 
  Wand2, 
  ArrowRight, 
  BarChart,
  MessageSquare,
  Users,
  Eye,
  Heart,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import {Link} from 'react-router-dom'
import * as instagramService from "../../services/instagram.service";

const TutorialStep = ({ number, title, description, icon: Icon, link, linkText }) => (
  <div className="relative pb-12 last:pb-0">
    <div className="absolute left-8 top-8 -bottom-4 w-0.5 bg-indigo-100 last:hidden"></div>
    
    <div className="relative flex items-start group">
      <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
        {Icon && <Icon className="w-8 h-8" />}
      </div>
      
      <div className="ml-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <div className="prose text-gray-600 mb-4">
          {description}
        </div>
        {link && (
          <Link
            to={link}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {linkText} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

const TutorialView = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        Welcome to Orton AI
      </h1>
      <p className="text-lg text-gray-600">
        Follow these steps to optimize your Instagram content
      </p>
    </div>

    <Card className="p-8">
      {/* Step 1: Instagram Connection */}
      <TutorialStep
        icon={Instagram}
        title="1. Connect Your Instagram Business Account"
        description={
          <div className="space-y-2">
            <p>First, let's connect your Instagram. You'll need:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>An Instagram Business or Creator account</li>
              <li>A Facebook Page connected to your Instagram</li>
              <li>Admin access to the Facebook Page</li>
            </ul>
          </div>
        }
        link="/dashboard/instagram-connection"
        linkText="Connect Instagram"
      />

      {/* Step 2: Best Times */}
      <TutorialStep
        icon={Clock}
        title="2. Check Your Best Posting Times"
        description={
          <div className="space-y-2">
            <p>After connecting, visit the Posting Times page to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Find when your audience is most active</li>
              <li>Get optimal posting time recommendations</li>
              <li>View engagement patterns by day and hour</li>
            </ul>
          </div>
        }
        link="/dashboard/posting-times"
        linkText="View Best Times"
      />

      {/* Step 3: Content Generation */}
      <TutorialStep
        icon={Wand2}
        title="3. Generate Engaging Content"
        description={
          <div className="space-y-2">
            <p>Create content tailored to your brand:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Go to Content Ideas</li>
              <li>Select your content type (Reel, Story, or Post)</li>
              <li>Click "Generate Ideas"</li>
              <li>Get captions and hashtags automatically</li>
            </ol>
          </div>
        }
        link="/dashboard/content-ideas"
        linkText="Create Content"
      />

      {/* Step 4: Analytics */}
      <TutorialStep
        icon={BarChart}
        title="4. Track Your Performance"
        description={
          <div className="space-y-2">
            <p>Monitor your growth and engagement:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>See follower growth trends</li>
              <li>Track engagement rates</li>
              <li>Identify your best content</li>
              <li>Analyze audience behavior</li>
            </ul>
          </div>
        }
        link="/dashboard/analytics"
        linkText="View Analytics"
      />

      {/* Step 5: Content Chat */}
      <TutorialStep
        icon={MessageSquare}
        title="5. Customize Your Content"
        description={
          <div className="space-y-2">
            <p>Use our AI chat assistant to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Get personalized content ideas</li>
              <li>Refine generated content</li>
              <li>Request specific content types</li>
              <li>Get creative inspiration</li>
            </ul>
          </div>
        }
        link="/dashboard/content-chat"
        linkText="Start Chat"
      />
    </Card>
  </div>
);


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

  // if (!profile) {
  //   return (
  //     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  //       <div className="flex">
  //         <AlertCircle className="h-5 w-5 text-yellow-400" />
  //         <p className="ml-3 text-sm text-yellow-700">
  //           Please connect your Instagram account to view insights
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }
  if (!profile) {
    return <TutorialView />;
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
