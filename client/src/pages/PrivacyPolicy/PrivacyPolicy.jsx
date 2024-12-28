import React from 'react';
import { ChevronUp } from 'lucide-react';

const PrivacyPolicy = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">Last Updated: December 27, 2024</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700">
              Welcome to Orton AI. We are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered 
              social media assistant platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">1. Account Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Social media account credentials (through secure OAuth authentication)</li>
              <li>Basic profile information (name, email address, username)</li>
              <li>Profile pictures and avatars</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">2. Social Media Data</h3>
            <p className="text-gray-700 mb-3">When you connect your social media accounts, we collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Posts, captions, and hashtags</li>
              <li>Engagement metrics (likes, comments, saves, shares)</li>
              <li>Audience demographics and activity patterns</li>
              <li>Historical post performance data</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">1. Core Service Functionality</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Generating personalized content suggestions</li>
              <li>Analyzing engagement patterns</li>
              <li>Providing analytics and insights</li>
              <li>Offering comment reply suggestions</li>
              <li>Sending proactive notifications based on audience behavior</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
            <p className="text-gray-700 mb-3">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Secure OAuth authentication for social media connections</li>
              <li>Encryption of sensitive data</li>
              <li>Regular security audits and updates</li>
              <li>Secure cloud storage with industry-standard protection</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain data collection features</li>
              <li>Control notification preferences</li>
              <li>Disable AI-powered suggestions</li>
              <li>Revoke social media account access</li>
            </ul>
          </section>

          {/* Contact Information */}
          {/* <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 text-gray-700">
              <p>Email: [Contact Email]</p>
              <p>Address: [Physical Address]</p>
            </div>
          </section> */}
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PrivacyPolicy;