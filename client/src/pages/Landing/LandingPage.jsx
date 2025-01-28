//src/pages/Landing/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Youtube, 
  Target, 
  BarChart, 
  Clock, 
  Wand2,
  MessageSquare
} from 'lucide-react';
import logo from '../../assets/logo.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Orton AI Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Orton AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Never Run Out of Content Ideas
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-white opacity-90 mb-4">
              Generate endless content tailored to your niche. Get AI-powered insights, 
              optimize posting times, and grow your social media presence effortlessly.
            </p>
            <p className="text-xl sm:text-2xl text-white opacity-90 mb-8">
            {/* Your Magic Is Always There. We're the Mirror That Reflects Your Brilliance. */}
            Your Voice is Enough. We Just Amplify It.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
          >
            Get Started Free
          </Link>
        </div>
        </div>

      {/* Platform Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            One Platform, Multiple Channels
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instagram Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Instagram className="h-8 w-8 text-pink-600" />
                <h3 className="ml-3 text-xl font-bold text-gray-900">Instagram Management</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Target className="h-5 w-5 text-pink-600 mt-1 mr-2" />
                  <span>Optimize your content strategy with AI-powered insights</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-pink-600 mt-1 mr-2" />
                  <span>Find the perfect posting times for maximum engagement</span>
                </li>
                <li className="flex items-start">
                  <BarChart className="h-5 w-5 text-pink-600 mt-1 mr-2" />
                  <span>Track performance with detailed analytics</span>
                </li>
              </ul>
            </div>

            {/* YouTube Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Youtube className="h-8 w-8 text-red-600" />
                <h3 className="ml-3 text-xl font-bold text-gray-900">YouTube (Coming Soon)</h3>
              </div>
              <p className="text-gray-600 mb-4">We're working hard to bring this feature to you. Stay tuned!</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Wand2 className="h-5 w-5 text-red-600 mt-1 mr-2" />
                  <span>Generate engaging video scripts with AI</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-red-600 mt-1 mr-2" />
                  <span>Discover optimal upload times for your audience</span>
                </li>
                <li className="flex items-start">
                  <BarChart className="h-5 w-5 text-red-600 mt-1 mr-2" />
                  <span>Analyze channel performance and growth</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Orton AI Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connect */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Connect</h3>
              <p className="text-gray-600 text-center">
                Link your Instagram and YouTube accounts to get started with comprehensive analytics and insights.
              </p>
            </div>

            {/* Analyze */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Analyze</h3>
              <p className="text-gray-600 text-center">
                Get deep insights into your content performance and audience behavior patterns.
              </p>
            </div>

            {/* Grow */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Grow</h3>
              <p className="text-gray-600 text-center">
                Use AI-powered tools to create better content and grow your social media presence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <BarChart className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Analytics</h3>
              <p className="text-gray-600">
                Get detailed insights into your content performance and audience engagement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Wand2 className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
              <p className="text-gray-600">
                Generate engaging content ideas and scripts tailored to your audience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Clock className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Best Time Finder</h3>
              <p className="text-gray-600">
                Discover the optimal times to post for maximum engagement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Target className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Audience Insights</h3>
              <p className="text-gray-600">
                Understand your audience better with detailed demographic data.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <MessageSquare className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
              <p className="text-gray-600">
                Get personalized help with content creation and strategy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Target className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Growth Tracking</h3>
              <p className="text-gray-600">
                Monitor your social media growth with comprehensive metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">About</h4>
              <p className="text-gray-400">
                Orton AI helps content creators optimize their social media presence 
                with AI-powered insights and tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contact@ortonai.com" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            {/* <div>
              <h4 className="text-lg font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div> */}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Orton AI. All rights reserved.</p>
             OrtonAI LLC is a Delaware Corporation
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;