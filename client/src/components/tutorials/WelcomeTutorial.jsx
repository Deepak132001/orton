// src/components/tutorials/WelcomeTutorial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Clock, 
  Wand2,
  BarChart,
  MessageSquare,
  ArrowRight 
} from 'lucide-react';
import { Card } from '../ui/card';

const TutorialStep = ({ number, title, description, icon: Icon, link, linkText }) => (
  <div className="relative pb-8 sm:pb-12 last:pb-0">
    <div className="hidden sm:block absolute left-8 top-8 -bottom-4 w-0.5 bg-indigo-100 last:hidden"></div>
    
    <div className="relative flex flex-col sm:flex-row items-center sm:items-start group">
      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors mb-4 sm:mb-0">
        {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8" />}
      </div>
      
      <div className="sm:ml-6 w-full text-center sm:text-left">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <div className="prose text-sm sm:text-base text-gray-600 mb-4">
          <div className="text-left">
            {description}
          </div>
        </div>
        {link && (
          <Link
            to={link}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {linkText} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

const WelcomeTutorial = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4">
        Welcome to Orton AI
      </h1>
      <p className="text-base sm:text-lg text-gray-600">
        Follow these steps to optimize your Instagram content
      </p>
    </div>

    <Card className="p-4 sm:p-8">
      <div className="space-y-6 sm:space-y-0">
        {/* Step 1: Instagram Connection */}
        <TutorialStep
          icon={Instagram}
          title="1. Connect Your Instagram Business Account"
          description={
            <div className="space-y-2">
              <p>First, let's connect your Instagram. You'll need:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-left">
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
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-left">
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
              <ol className="list-decimal pl-5 space-y-1 text-sm sm:text-base text-left">
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
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-left">
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
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-left">
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
      </div>
    </Card>
  </div>
);

export default WelcomeTutorial;