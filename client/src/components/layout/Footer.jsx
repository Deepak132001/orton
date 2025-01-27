// frontend/src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import { 
  Mail,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              {/* Replace with your actual logo */}
              <img 
                src="/logo.png" 
                alt="Orton AI" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/32x32';
                }}
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Orton AI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
            Your Voice is Enough. We Just Amplify It.
            {/* Your Magic Is Always There. We're the Mirror That Reflects Your Brilliance. */}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/dashboard" className="text-base text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="text-base text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/dashboard/content-ideas" className="text-base text-gray-600 hover:text-gray-900">
                  Content Generation
                </Link>
              </li>
              <li>
                <Link to="/dashboard/posting-times" className="text-base text-gray-600 hover:text-gray-900">
                  Posting Times
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/data" className="text-base text-gray-600 hover:text-gray-900">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:support@ortonai.com" className="text-base text-gray-600 hover:text-gray-900">
                  contact@ortonai.com
                </a>
              </li>
              {/* <li>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/ortonai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://twitter.com/ortonai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/ortonai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-6 w-6" />
                  </a>
                </div>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-base text-gray-400">
              © {currentYear} OrtonAI. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link to="/data" className="text-sm text-gray-500 hover:text-gray-900">
                Data Deletion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;