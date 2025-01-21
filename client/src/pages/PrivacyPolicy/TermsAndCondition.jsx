// src/pages/PrivacyPolicy/TermsAndCondition.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  User, 
  AlertTriangle, 
  Scale,
  Key,
  Ban,
  Clock,
  CreditCard
} from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
            </div>
            <p className="text-sm text-gray-500">Last Updated: January 2024</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden divide-y">
          {/* Agreement to Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">1. Agreement to Terms</h2>
                <p className="mt-2 text-gray-600">
                  By accessing or using Orton AI's services for Instagram and YouTube management, you agree 
                  to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
                  you may not access our service.
                </p>
              </div>
            </div>
          </div>

          {/* Platform-Specific Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <Key className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">2. Platform-Specific Terms</h2>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900">Instagram Integration</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Must have a valid Instagram Business or Creator account</li>
                      <li>Must comply with Meta Platform Terms</li>
                      <li>Must maintain necessary permissions and access</li>
                      <li>Must follow Instagram's community guidelines</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">YouTube Integration</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Must have a valid YouTube channel</li>
                      <li>Must comply with YouTube Terms of Service</li>
                      <li>Must follow YouTube's Community Guidelines</li>
                      <li>Must maintain required API access and permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <User className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">3. Account Requirements</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>You must:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Be at least 18 years old</li>
                    <li>Provide accurate account information</li>
                    <li>Maintain account security</li>
                    <li>Be responsible for all activity under your account</li>
                    <li>Have necessary permissions for connected social media accounts</li>
                    <li>Comply with all platform-specific requirements</li>
                    <li>Keep access credentials secure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Service Usage */}
          <div className="p-6">
            <div className="flex items-start">
              <Key className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">4. Service Usage</h2>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">General Usage Terms</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Use services in compliance with all applicable laws</li>
                      <li>Respect platform-specific usage limits</li>
                      <li>Do not interfere with other users</li>
                      <li>Do not attempt to circumvent limitations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">API Usage Limits</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Instagram API quotas and limits apply</li>
                      <li>YouTube API quotas and limits apply</li>
                      <li>Fair usage policies must be followed</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">Content Guidelines</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Respect intellectual property rights</li>
                      <li>Comply with content policies of each platform</li>
                      <li>No illegal or harmful content</li>
                      <li>No spam or automated abuse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data and Privacy */}
          <div className="p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-purple-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">5. Data and Privacy</h2>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600">Your use of our services is also governed by our:</p>
                  <div className="space-y-2">
                    <Link 
                      to="/privacy" 
                      className="text-indigo-600 hover:text-indigo-500 block"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/data" 
                      className="text-indigo-600 hover:text-indigo-500 block"
                    >
                      Data Deletion Policy
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mt-4">Platform Data Handling</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Instagram data is handled according to Meta's data policies</li>
                      <li>YouTube data is handled according to Google's API Services User Data Policy</li>
                      <li>User data is protected and secured</li>
                      <li>Data retention policies are followed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payments and Subscriptions */}
          <div className="p-6">
            <div className="flex items-start">
              <CreditCard className="w-6 h-6 text-yellow-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">6. Payments and Subscriptions</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Subscription fees are billed in advance</li>
                    <li>No refunds for partial months</li>
                    <li>Automatic renewal unless cancelled</li>
                    <li>Price changes with 30 days notice</li>
                    <li>Platform-specific features may have separate pricing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="p-6">
            <div className="flex items-start">
              <Ban className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">7. Termination</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>We may terminate or suspend your account if you:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Violate these terms</li>
                    <li>Violate platform-specific terms</li>
                    <li>Provide false information</li>
                    <li>Engage in prohibited activities</li>
                    <li>Fail to maintain platform connections</li>
                    <li>Fail to pay fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-orange-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">8. Changes to Terms</h2>
                <p className="mt-2 text-gray-600">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. 
                  Your continued use of our service constitutes acceptance of modified terms.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6">
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">For questions about these terms, contact us at:</p>
                  <p className="mt-2 text-gray-900">Email: contact@ortonai.com</p>
                  {/* <p className="text-gray-900">Address: [Your Business Address]</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
};

export default TermsAndConditions;