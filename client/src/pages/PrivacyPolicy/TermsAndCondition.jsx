//frontend/src/pages/Legal/TermsAndConditions.jsx
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
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden divide-y">
          {/* Agreement to Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">1. Agreement to Terms</h2>
                <p className="mt-2 text-gray-600">
                  By accessing or using Orton AI's services, you agree to be bound by these Terms and Conditions. 
                  If you disagree with any part of these terms, you may not access our service.
                </p>
              </div>
            </div>
          </div>

          {/* Account Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <User className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">2. Account Terms</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>You must:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Be at least 18 years old</li>
                    <li>Provide accurate account information</li>
                    <li>Maintain account security</li>
                    <li>Be responsible for all activity under your account</li>
                    <li>Comply with all social media platform policies</li>
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
                <h2 className="text-lg font-medium text-gray-900">3. Service Usage</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>Our services must be used:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>In compliance with all applicable laws</li>
                    <li>According to any usage limits or restrictions</li>
                    <li>Without interfering with other users</li>
                    <li>Without attempting to circumvent any limitations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-purple-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">4. Intellectual Property</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>You retain ownership of:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your social media content</li>
                    <li>Your account data</li>
                    <li>Any custom configurations</li>
                  </ul>
                  <p className="mt-4">Orton AI retains ownership of:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The platform and its features</li>
                    <li>Our algorithms and technology</li>
                    <li>Generated content templates</li>
                    <li>Analytics tools and methodologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="p-6">
            <div className="flex items-start">
              <Ban className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">5. Prohibited Activities</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>You may not:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use the service for unlawful purposes</li>
                    <li>Attempt to access unauthorized areas</li>
                    <li>Upload malicious content or code</li>
                    <li>Violate social media platform terms</li>
                    <li>Share access to your account</li>
                    <li>Scrape or collect user data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <CreditCard className="w-6 h-6 text-yellow-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">6. Payment Terms</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Subscription fees are billed in advance</li>
                    <li>No refunds for partial months</li>
                    <li>Automatic renewal unless cancelled</li>
                    <li>Price changes with 30 days notice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="p-6">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-orange-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">7. Termination</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>We may terminate or suspend your account if you:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Violate these terms</li>
                    <li>Provide false information</li>
                    <li>Engage in prohibited activities</li>
                    <li>Fail to pay fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Liability */}
          <div className="p-6">
            <div className="flex items-start">
              <Scale className="w-6 h-6 text-blue-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">8. Limitation of Liability</h2>
                <div className="mt-4 space-y-3 text-gray-600">
                  <p>We are not liable for:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Service interruptions</li>
                    <li>Data loss</li>
                    <li>Third-party actions</li>
                    <li>Content generated by AI</li>
                    <li>Social media platform changes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">9. Changes to Terms</h2>
                <p className="mt-2 text-gray-600">
                  We reserve the right to modify these terms at any time. We will notify you of any 
                  material changes via email or through the application. Your continued use of the service 
                  constitutes acceptance of the updated terms.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 bg-gray-50">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600">For questions about these terms, contact us at:</p>
                <p className="mt-2 text-gray-900">Email: legal@ortonai.com</p>
                <p className="text-gray-900">Address: [Your Business Address]</p>
              </div>

              <div className="mt-6 space-y-2">
                <Link 
                  to="/privacy-policy" 
                  className="text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  Privacy Policy <ArrowLeft className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  to="/data-deletion" 
                  className="text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  Data Deletion Policy <ArrowLeft className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;