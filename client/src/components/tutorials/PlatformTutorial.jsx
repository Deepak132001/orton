// src/components/tutorials/PlatformTutorial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Youtube,
  Clock, 
  BarChart, 
  ArrowRight,
  Image,
  FileText
} from 'lucide-react';
import { Card } from '../ui/card';

const TutorialStep = ({ number, title, description, icon: Icon, link, linkText }) => (
  <div className="relative pb-8 sm:pb-12 last:pb-0">
    <div className="hidden sm:block absolute left-8 top-8 -bottom-4 w-0.5 bg-indigo-100 last:hidden"></div>
    
    <div className="relative flex flex-col sm:flex-row items-center sm:items-start group">
      <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full 
        ${Icon === Instagram ? 'bg-pink-100 text-pink-600' : 'bg-red-100 text-red-600'} 
        group-hover:bg-opacity-75 transition-colors mb-4 sm:mb-0`}
      >
        {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8" />}
      </div>
      
      <div className="sm:ml-6 w-full text-center sm:text-left">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          {number}. {title}
        </h3>
        <div className="prose text-sm sm:text-base text-gray-600 mb-4">
          <div className="text-left">
            {description}
          </div>
        </div>
        {link && (
          <Link
            to={link}
            className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent 
              text-sm font-medium rounded-md text-white 
              ${Icon === Instagram ? 'bg-pink-600 hover:bg-pink-700' : 'bg-red-600 hover:bg-red-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {linkText} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

export const InstagramTutorial = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4">
        Get Started with Instagram Management
      </h1>
      <p className="text-base sm:text-lg text-gray-600">
        Follow these steps to optimize your Instagram content and analytics
      </p>
    </div>

    <Card className="p-4 sm:p-8">
      <div className="space-y-6 sm:space-y-8">

        {/* Video tutorial */}
        <div className="mt-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Video Tutorial</h3>
  <div className="relative aspect-video rounded-lg overflow-hidden">
    <iframe 
      className="absolute inset-0 w-full h-full"
      src="https://www.youtube.com/embed/1iqtvuWUeXw"
      title="How to Connect Instagram Business Account to Orton AI"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
  <p className="mt-3 text-sm text-gray-600">
    This video guide shows you how to:
    - Create and connect a Facebook Page to Instagram
    - Connect your Instagram account to OrtonAI
  </p>
</div>


        <TutorialStep
          icon={Instagram}
          title="Connect Your Instagram Business Account"
          description={
            <div className="space-y-2">
              <p>First, connect your Instagram account. You'll need:</p>
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

        <TutorialStep
          icon={BarChart}
          title="View Analytics & Insights"
          description={
            <div className="space-y-2">
              <p>After connecting, you can:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Track follower growth</li>
                <li>Monitor engagement rates</li>
                <li>Analyze post performance</li>
                <li>Understand your audience</li>
              </ul>
            </div>
          }
          link="/dashboard/analytics"
          linkText="View Analytics"
        />

        <TutorialStep
          icon={Clock}
          title="Find Best Posting Times"
          description={
            <div className="space-y-2">
              <p>Optimize your posting schedule:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>See when your audience is most active</li>
                <li>Get optimal time recommendations</li>
                <li>Analyze engagement patterns</li>
                <li>Schedule content strategically</li>
              </ul>
            </div>
          }
          link="/dashboard/posting-times"
          linkText="Check Times"
        />

        <TutorialStep
          icon={Image}
          title="Generate Content Ideas"
          description={
            <div className="space-y-2">
              <p>Create engaging content with AI:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Generate post ideas</li>
                <li>Get caption suggestions</li>
                <li>Find trending hashtags</li>
                <li>Create content strategies</li>
              </ul>
            </div>
          }
          link="/dashboard/content-ideas"
          linkText="Create Content"
        />

        {/* <TutorialStep
          icon={MessageSquare}
          title="Use AI Chat Assistant"
          description={
            <div className="space-y-2">
              <p>Get personalized help with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Content refinement</li>
                <li>Caption writing</li>
                <li>Hashtag research</li>
                <li>Strategy advice</li>
              </ul>
            </div>
          }
          link="/dashboard/content-chat"
          linkText="Start Chat"
        /> */}
      </div>
    </Card>
  </div>
);

export const YouTubeTutorial = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4">
        Get Started with YouTube Management
      </h1>
      <p className="text-base sm:text-lg text-gray-600">
        Follow these steps to optimize your YouTube content and analytics
      </p>
    </div>

    <Card className="p-4 sm:p-8">
      <div className="space-y-6 sm:space-y-8">
        <TutorialStep
          icon={Youtube}
          title="Connect Your YouTube Channel"
          description={
            <div className="space-y-2">
              <p>First, connect your YouTube channel. You'll need:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A YouTube channel</li>
                <li>Google account access</li>
                <li>Channel owner permissions</li>
              </ul>
            </div>
          }
          link="/dashboard/youtube-connection"
          linkText="Connect YouTube"
        />

        <TutorialStep
          icon={BarChart}
          title="Track Channel Analytics"
          description={
            <div className="space-y-2">
              <p>Monitor your channel performance:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View subscriber growth</li>
                <li>Track video performance</li>
                <li>Analyze viewer engagement</li>
                <li>Monitor watch time</li>
              </ul>
            </div>
          }
          link="/dashboard/youtube-analytics"
          linkText="View Analytics"
        />

        <TutorialStep
          icon={Clock}
          title="Optimize Upload Times"
          description={
            <div className="space-y-2">
              <p>Find the best times to upload:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Analyze viewer activity</li>
                <li>Get upload time recommendations</li>
                <li>Track engagement patterns</li>
                <li>Optimize your schedule</li>
              </ul>
            </div>
          }
          link="/dashboard/youtube-posting-times"
          linkText="Check Times"
        />

        <TutorialStep
          icon={FileText}
          title="Generate Video Scripts"
          description={
            <div className="space-y-2">
              <p>Create engaging video content:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Generate video ideas</li>
                <li>Get AI-powered scripts</li>
                <li>Optimize video length</li>
                <li>Create engaging hooks</li>
              </ul>
            </div>
          }
          link="/dashboard/youtube-scripts"
          linkText="Create Scripts"
        />
      </div>
    </Card>
  </div>
);

export default {
  InstagramTutorial,
  YouTubeTutorial
};