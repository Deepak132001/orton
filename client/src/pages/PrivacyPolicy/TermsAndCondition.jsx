// frontend/src/pages/Terms/TermsAndConditions.jsx

import { ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <Link 
              to="/dashboard"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Return to Dashboard
            </Link>
          </div>
          <p className="mt-2 text-sm text-gray-600">Last Updated: December 28, 2024</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              Welcome to Orton AI ("we," "our," or "us"). By accessing or using our social media management platform, 
              you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definitions</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>"Service"</strong> refers to the Orton AI platform and all related services.</p>
              <p><strong>"User"</strong> refers to any individual or entity using our Service.</p>
              <p><strong>"Content"</strong> refers to any text, images, or other material generated or managed through our Service.</p>
              <p><strong>"Social Media Platforms"</strong> refers to third-party platforms like Instagram that our Service integrates with.</p>
            </div>
          </section>

          {/* Account Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>3.1. You must be at least 18 years old to use this Service.</p>
              <p>3.2. You must provide accurate and complete information when creating an account.</p>
              <p>3.3. You are responsible for maintaining the security of your account credentials.</p>
              <p>3.4. You must comply with all social media platforms' terms of service.</p>
            </div>
          </section>

          {/* Service Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Usage</h2>
            <div className="space-y-3 text-gray-700">
              <p>4.1. Our Service must be used in accordance with all applicable laws and regulations.</p>
              <p>4.2. You agree not to use the Service for any illegal or unauthorized purposes.</p>
              <p>4.3. We reserve the right to modify or terminate the Service for any reason.</p>
              <p>4.4. We are not responsible for any third-party content accessed through our Service.</p>
            </div>
          </section>

          {/* Data and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data and Privacy</h2>
            <div className="space-y-3 text-gray-700">
              <p>5.1. Our use of your data is governed by our Privacy Policy.</p>
              <p>5.2. You retain ownership of all content you create or manage through our Service.</p>
              <p>5.3. We may collect and analyze usage data to improve our Service.</p>
              <p>5.4. You grant us permission to access and process your social media data as necessary to provide our Service.</p>
            </div>
          </section>

          {/* API and Integration Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. API and Integration Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>6.1. Our Service integrates with third-party APIs and services.</p>
              <p>6.2. We are not responsible for any changes or disruptions to third-party services.</p>
              <p>6.3. You must comply with all third-party API terms and conditions.</p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <div className="space-y-3 text-gray-700">
              <p>7.1. The Service is provided "as is" without any warranties.</p>
              <p>7.2. We are not liable for any damages arising from the use of our Service.</p>
              <p>7.3. We are not responsible for content generated by AI or automated systems.</p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <div className="space-y-3 text-gray-700">
              <p>8.1. We reserve the right to modify these terms at any time.</p>
              <p>8.2. Continued use of the Service after changes constitutes acceptance of new terms.</p>
              <p>8.3. Users will be notified of significant changes to these terms.</p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <div className="space-y-3 text-gray-700">
              <p>For questions about these Terms and Conditions, please contact us at:</p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>Email: support@ortonai.com</p>
                <p>Address: [Your Business Address]</p>
              </div>
            </div>
          </section>
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

export default TermsAndConditions;