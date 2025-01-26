// src/pages/PrivacyPolicy/PrivacyPolicy.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Database, Share2, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-sm text-gray-500">Last Updated: January 2025</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden divide-y">
          {/* Introduction */}
          <div className="p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Your Privacy is Important</h2>
                <p className="mt-2 text-gray-600">
                  This Privacy Policy explains how Orton AI ("we," "our," or "us") collects, uses, shares, 
                  and protects your personal information when you use our social media management platform 
                  for Instagram and YouTube services.
                </p>
              </div>
            </div>
          </div>

          {/* Platform-Specific Data Collection */}
          <div className="p-6">
            <div className="flex items-start">
              <Database className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Platform-Specific Information Collection</h2>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Instagram Data</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Account insights and analytics</li>
                      <li>Post performance metrics</li>
                      <li>Audience demographics</li>
                      <li>Engagement statistics</li>
                      <li>Content data and captions</li>
                      <li>Posting schedules and timing</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">YouTube Data</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Channel statistics and analytics</li>
                      <li>Video performance metrics</li>
                      <li>Viewer demographics and behavior</li>
                      <li>Engagement rates and patterns</li>
                      <li>Video metadata and descriptions</li>
                      <li>Upload schedules and timing</li>
                      <li>Public video captions and transcriptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Permissions */}
          <div className="p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Platform Access and Permissions</h2>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Instagram Permissions</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Access to business account insights</li>
                      <li>Viewing of post analytics</li>
                      <li>Reading audience metrics</li>
                      <li>Analyzing content performance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">YouTube Permissions</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>View channel statistics</li>
                      <li>Access video analytics</li>
                      <li>Read public video data</li>
                      <li>Access viewer engagement metrics</li>
                      <li>View captions and transcriptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="p-6">
            <div className="flex items-start">
              <Database className="w-6 h-6 text-purple-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">How We Use Your Information</h2>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Generate content recommendations</li>
                  <li>• Analyze posting patterns and engagement</li>
                  <li>• Provide insights and analytics</li>
                  <li>• Optimize content scheduling</li>
                  <li>• Generate AI-powered content suggestions</li>
                  <li>• Analyze audience behavior and preferences</li>
                  <li>• Improve our services and features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div className="p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Data Storage and Security</h2>
                <p className="mt-2 text-gray-600">We implement industry-standard security measures:</p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• End-to-end encryption for data transmission</li>
                  <li>• Secure server infrastructure</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access control and authentication</li>
                  <li>• Data backup and recovery protocols</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-yellow-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Your Rights</h2>
                <p className="mt-2 text-gray-600">You have the right to:</p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Access your personal data</li>
                  <li>• Request data deletion</li>
                  <li>• Modify your information</li>
                  <li>• Revoke platform access</li>
                  <li>• Export your data</li>
                  <li>• Opt-out of data collection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6">
            <div className="flex items-start">
              <Bell className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Contact Us</h2>
                <p className="mt-2 text-gray-600">
                  For privacy-related questions or concerns, contact us at:
                </p>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">Email: contact@ortonai.com</p>
                  <p className="text-gray-700">OrtonAI LLC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Compliance */}
          <div className="p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Platform Compliance</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">
                    We comply with both Instagram and YouTube's platform policies and data protection requirements:
                  </p>
                  <div>
                    <h3 className="font-medium text-gray-900">Instagram Compliance</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Meta Platform Terms</li>
                      <li>Instagram API Terms of Use</li>
                      <li>Meta Privacy Policy</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">YouTube Compliance</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>YouTube Terms of Service</li>
                      <li>Google API Services User Data Policy</li>
                      <li>YouTube API Terms of Service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;