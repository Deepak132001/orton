//frontend/src/pages/Legal/PrivacyPolicy.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Database, Share2, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-sm text-gray-500">Last Updated: January 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                  and protects your personal information when you use our social media management platform.
                </p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="p-6">
            <div className="flex items-start">
              <Database className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Information We Collect</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Account Information</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Email address and password</li>
                      <li>Profile information</li>
                      <li>Social media account connections</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Social Media Data</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Account insights and analytics</li>
                      <li>Post performance metrics</li>
                      <li>Audience demographics</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Usage Information</h3>
                    <ul className="mt-2 list-disc pl-5 text-gray-600">
                      <li>Device information</li>
                      <li>Log data and analytics</li>
                      <li>Feature usage patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-green-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">How We Use Your Information</h2>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p>• To provide and improve our services</p>
                  <p>• To generate content and analytics</p>
                  <p>• To communicate with you about our services</p>
                  <p>• To ensure platform security</p>
                  <p>• To comply with legal obligations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="p-6">
            <div className="flex items-start">
              <Share2 className="w-6 h-6 text-purple-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Information Sharing</h2>
                <p className="mt-2 text-gray-600">We share your information with:</p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Social media platforms (as authorized by you)</li>
                  <li>• Service providers who assist our operations</li>
                  <li>• Law enforcement when required by law</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  We never sell your personal information to third parties.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="p-6">
            <div className="flex items-start">
              <Lock className="w-6 h-6 text-red-500 mt-1" />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Data Security</h2>
                <p className="mt-2 text-gray-600">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Encryption in transit and at rest</li>
                  <li>• Regular security audits</li>
                  <li>• Access controls and monitoring</li>
                  <li>• Secure data centers</li>
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
                  <li>• Correct inaccurate data</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                  <li>• Opt-out of certain data collection</li>
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
                  <p className="text-gray-700">Email: privacy@ortonai.com</p>
                  <p className="text-gray-700">Address: [Your Business Address]</p>
                </div>
              </div>

</div>
</div>

{/* Updates to Privacy Policy */}
<div className="p-6">
<div className="flex items-start">
  <Bell className="w-6 h-6 text-orange-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">Updates to This Policy</h2>
    <p className="mt-2 text-gray-600">
      We may update this Privacy Policy periodically. We will notify you of any material changes by:
    </p>
    <ul className="mt-2 space-y-2 text-gray-600">
      <li>• Sending an email to the address associated with your account</li>
      <li>• Displaying a notice in our application</li>
      <li>• Updating the "Last Updated" date at the top of this policy</li>
    </ul>
  </div>
</div>
</div>

{/* Social Media Integration */}
<div className="p-6">
<div className="flex items-start">
  <Share2 className="w-6 h-6 text-blue-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">Social Media Integration</h2>
    <p className="mt-2 text-gray-600">
      When you connect your social media accounts:
    </p>
    <ul className="mt-2 space-y-2 text-gray-600">
      <li>• We access only the permissions you explicitly grant</li>
      <li>• We follow each platform's terms of service and data policies</li>
      <li>• You can revoke access at any time through our platform or the social media platform</li>
    </ul>
  </div>
</div>
</div>

{/* Data Retention */}
<div className="p-6">
<div className="flex items-start">
  <Database className="w-6 h-6 text-purple-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">Data Retention</h2>
    <p className="mt-2 text-gray-600">
      We retain your information for as long as:
    </p>
    <ul className="mt-2 space-y-2 text-gray-600">
      <li>• Your account is active</li>
      <li>• Needed to provide our services</li>
      <li>• Required by law</li>
      <li>• Essential for legitimate business purposes</li>
    </ul>
    <p className="mt-4 text-gray-600">
      After account deletion, we may retain certain data for up to 90 days in our backups.
    </p>
  </div>
</div>
</div>

{/* Children's Privacy */}
<div className="p-6">
<div className="flex items-start">
  <Shield className="w-6 h-6 text-red-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">Children's Privacy</h2>
    <p className="mt-2 text-gray-600">
      Our services are not intended for users under 18 years of age. We do not knowingly collect 
      or maintain information from persons under 18 years of age.
    </p>
  </div>
</div>
</div>

{/* International Data Transfers */}
<div className="p-6">
<div className="flex items-start">
  <Share2 className="w-6 h-6 text-green-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">International Data Transfers</h2>
    <p className="mt-2 text-gray-600">
      Your information may be transferred to and processed in countries other than your own. 
      We ensure appropriate safeguards are in place to protect your data in compliance with 
      applicable laws.
    </p>
  </div>
</div>
</div>

{/* Cookie Policy */}
<div className="p-6">
<div className="flex items-start">
  <Database className="w-6 h-6 text-yellow-500 mt-1" />
  <div className="ml-4">
    <h2 className="text-lg font-medium text-gray-900">Cookie Policy</h2>
    <p className="mt-2 text-gray-600">
      We use cookies and similar technologies to:
    </p>
    <ul className="mt-2 space-y-2 text-gray-600">
      <li>• Keep you logged in</li>
      <li>• Remember your preferences</li>
      <li>• Analyze platform usage</li>
      <li>• Improve our services</li>
    </ul>
  </div>
</div>
</div>

{/* Additional Information */}
<div className="p-6 bg-gray-50">
<div className="space-y-4">
  <h2 className="text-lg font-medium text-gray-900">Additional Resources</h2>
  <div className="space-y-2">
    <Link 
      to="/terms" 
      className="text-indigo-600 hover:text-indigo-500 flex items-center"
    >
      Terms of Service <ArrowLeft className="w-4 h-4 ml-2" />
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

export default PrivacyPolicy;