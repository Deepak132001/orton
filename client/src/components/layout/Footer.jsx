// // frontend/src/components/layout/Footer.jsx

// import { Link } from 'react-router-dom';
// import { 
//   Mail,
//   FacebookIcon,
//   TwitterIcon,
//   InstagramIcon
// } from 'lucide-react';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-white border-t">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo and Description */}
//           <div className="col-span-1 md:col-span-1">
//             <Link to="/" className="flex items-center">
//               {/* Replace with your actual logo */}
//               <img 
//                 src="/logo.png" 
//                 alt="Orton AI" 
//                 className="h-8 w-auto"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/32x32';
//                 }}
//               />
//               <span className="ml-2 text-xl font-bold text-gray-900">Orton AI</span>
//             </Link>
//             <p className="mt-4 text-sm text-gray-600">
//             {/* Your Voice is Enough. We Just Amplify It. */}
//             {/* Your Magic Is Always There. We're the Mirror That Reflects Your Brilliance. */}
//             AI-powered friend that grows with you
//             </p>
//           </div>

//           {/* Product Links */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
//               Links
//             </h3>
//             <ul className="mt-4 space-y-3">
//               <li>
//                 <Link to="/dashboard" className="text-base text-gray-600 hover:text-gray-900">
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/analytics" className="text-base text-gray-600 hover:text-gray-900">
//                   Analytics
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/content-ideas" className="text-base text-gray-600 hover:text-gray-900">
//                   Content Generation
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/dashboard/posting-times" className="text-base text-gray-600 hover:text-gray-900">
//                   Posting Times
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Legal Links */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
//               Legal
//             </h3>
//             <ul className="mt-4 space-y-3">
//               <li>
//                 <Link to="/privacy" className="text-base text-gray-600 hover:text-gray-900">
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/terms" className="text-base text-gray-600 hover:text-gray-900">
//                   Terms & Conditions
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/data" className="text-base text-gray-600 hover:text-gray-900">
//                   Data Deletion
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
//               Contact
//             </h3>
//             <ul className="mt-4 space-y-3">
//               <li className="flex items-center">
//                 <Mail className="h-5 w-5 text-gray-400 mr-2" />
//                 <a href="mailto:support@ortonai.com" className="text-base text-gray-600 hover:text-gray-900">
//                   contact@ortonai.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="mt-8 pt-8 border-t border-gray-200">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-base text-gray-400">
//               © {currentYear} OrtonAI. All rights reserved.
//             </div>
//             <div className="mt-4 md:mt-0 flex space-x-6">
//               <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">
//                 Terms
//               </Link>
//               <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
//                 Privacy
//               </Link>
//               <Link to="/data" className="text-sm text-gray-500 hover:text-gray-900">
//                 Data Deletion
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from 'react-router-dom';
import { 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ArrowUpRight,
  Heart,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

const AnimatedLink = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to} 
      className="group relative flex items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center text-slate-300 transition-all duration-500 group-hover:text-white group-hover:transform group-hover:translate-x-2">
        <span className="relative z-10">
          {children}
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
        </span>
        <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      </div>
      {isHovered && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-25 blur-sm bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
        </div>
      )}
    </Link>
  );
};

const SocialIcon = ({ Icon, href, label }) => {
  return (
    <a 
      href={href}
      aria-label={label}
      className="group relative p-2 hover:scale-110 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
      <Icon className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300 relative z-10" />
    </a>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@ortonai.com');
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const parallaxOffset = Math.min(scrollPosition * 0.1, 50);

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 to-slate-900 border-t border-slate-800">
      <div 
        className="absolute inset-0 bg-grid-slate-100/[0.02]" 
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-6">
            <Link 
              to="/" 
              className="group inline-flex items-center space-x-3 transition-all duration-500"
            >
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="Orton AI" 
                  className="h-12 w-auto rounded-xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/48/48';
                  }}
                />
                <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-yellow-400 opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-500 to-purple-500 transition-all duration-500">
                Orton AI
              </span>
            </Link>
            
            <p className="text-base text-slate-300 leading-relaxed max-w-md transition-all duration-300 hover:text-white">
              AI-powered friend that grows with you, reflecting your brilliance and amplifying your voice in ways you never imagined possible.
            </p>
            
            {/* <div className="flex space-x-2">
              <SocialIcon Icon={Facebook} href="#" label="Facebook" />
              <SocialIcon Icon={Twitter} href="#" label="Twitter" />
              <SocialIcon Icon={Instagram} href="#" label="Instagram" />
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li><AnimatedLink to="/dashboard">Dashboard</AnimatedLink></li>
              <li><AnimatedLink to="/dashboard/analytics">Analytics</AnimatedLink></li>
              <li><AnimatedLink to="/dashboard/content-ideas">Content Generation</AnimatedLink></li>
              <li><AnimatedLink to="/dashboard/posting-times">Posting Times</AnimatedLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-4">
              <li><AnimatedLink to="/privacy">Privacy Policy</AnimatedLink></li>
              <li><AnimatedLink to="/terms">Terms & Conditions</AnimatedLink></li>
              <li><AnimatedLink to="/data">Data Deletion</AnimatedLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-wider uppercase">
              Get in Touch
            </h3>
            <button
              onClick={copyEmail}
              className="group relative flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
            >
              <Mail className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
              <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                contact@ortonai.com
              </span>
              <span 
                className={`absolute right-0 px-2 py-1 text-sm text-white bg-indigo-500 rounded-md transition-all duration-300 ${
                  isEmailCopied ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                }`}
              >
                Copied!
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400">
              <span>© {currentYear} OrtonAI.</span>
              <span className="hidden sm:inline">Crafted with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">for creators</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
              <AnimatedLink to="/terms">Terms</AnimatedLink>
              <AnimatedLink to="/privacy">Privacy</AnimatedLink>
              <AnimatedLink to="/data">Data Deletion</AnimatedLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;