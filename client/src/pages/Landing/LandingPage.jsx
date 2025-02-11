//src/pages/Landing/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Youtube,
  Target,
  BarChart,
  Clock,
  Wand2,
  MessageSquare,
  Menu,
  ChevronRight,
} from "lucide-react";
import logo from "../../assets/logo.png";
import analytics from "../../assets/analytics.png";
import postingTimes from "../../assets/posting time.png";
import contentIdeas from "../../assets/Content ideas.png";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState({});

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-all duration-300 ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={logo} alt="Orton AI Logo" className="h-8 w-8 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                  Orton AI
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </NavLink>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Floating Background Words with Glowing Effect */}
        {[
          "Content",
          "Ideas",
          "Growth",
          "Analytics",
          "Engagement",
          "Strategy",
          "Success",
          "Reach",
        ].map((word, index) => (
          <div
            key={word}
            className="absolute text-white select-none pointer-events-none animate-float-glow"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${index * 0.5}s`,
              fontSize: `${Math.random() * 0.5 + 0.8}rem`,
              opacity: 0.2,
              filter: "blur(0.5px)",
            }}
          >
            {word}
          </div>
        ))}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mt-10">
          <div className="animate-title-reveal overflow-hidden">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 drop-shadow-2xl">
              {/* Never Run Out of Content Ideas */}
              Your AI-Powered Social Media Twin
            </h1>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="animate-content-fade overflow-hidden">
              <p className="text-lg sm:text-2xl text-white opacity-90 mb-4 drop-shadow-lg">
                {/* Generate endless content tailored to your niche. Get AI-powered
                insights, optimize posting times, and grow your social media
                presence effortlessly. */}
                Produce Unlimited Content Perfectly Aligned with Your Niche: Use AI-Generated Insights to Craft Engaging Posts, Schedule at Optimal Times, and Build a Thriving Social Media Presence Without the Guesswork.
              </p>
            </div>

            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl text-white opacity-90 mb-8 animate-gradient-text">
                Designed for influencers and business owners.
              </p>
            </div>
          </div>

          <div className="animate-button-reveal">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-xl transform transition-all duration-300 animate-pulse-subtle"
            >
              Get Started Free
              <span className="ml-2 animate-bounce-subtle">→</span>
            </Link>
          </div>
        </div>

        {/* AI Neural Network Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Network Nodes */}
          {[...Array(12)].map((_, i) => (
            <div key={`node-${i}`} className="absolute">
              <div
                className="absolute rounded-full bg-white animate-node-pulse"
                style={{
                  width: "4px",
                  height: "4px",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.4,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
              {/* Connection Lines */}
              <div
                className="absolute animate-line-appear"
                style={{
                  width: `${Math.random() * 150 + 50}px`,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  transformOrigin: "left center",
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            </div>
          ))}

          {/* AI Circuit Patterns */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`circuit-${i}`}
              className="absolute animate-circuit"
              style={{
                width: "120px",
                height: "120px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                transform: `rotate(${Math.random() * 90}deg)`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              <div className="absolute w-full h-full animate-circuit-pulse">
                <div
                  className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"
                  style={{ opacity: 0.2 }}
                />
                <div
                  className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{ opacity: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes particle {
            0%, 100% { transform: translate(0, 0); opacity: 0; }
            25% { opacity: 1; }
            50% { transform: translate(100px, -100px); opacity: 0.5; }
            75% { opacity: 0.2; }
          }

          .animate-particle {
            animation: particle 10s linear infinite;
          }

          @keyframes float-glow {
            0%, 100% { transform: translateY(0) translateX(0); filter: blur(0.5px); }
            25% { transform: translateY(-15px) translateX(15px); filter: blur(1px); }
            50% { transform: translateY(0) translateX(25px); filter: blur(0.5px); }
            75% { transform: translateY(15px) translateX(15px); filter: blur(1px); }
          }

          .animate-float-glow {
            animation: float-glow 12s ease-in-out infinite;
          }

          @keyframes title-reveal {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .animate-title-reveal {
            animation: title-reveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-content-fade {
            animation: content-fade 1.5s ease-out forwards;
            animation-delay: 0.3s;
            opacity: 0;
          }

          @keyframes content-fade {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes gradient-text {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .animate-gradient-text {
            background: linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.95) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            animation: gradient-text 5s linear infinite;
          }

          .animate-button-reveal {
            animation: button-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.6s;
            opacity: 0;
          }

          @keyframes button-reveal {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes bounce-subtle {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(3px); }
          }

          .animate-bounce-subtle {
            animation: bounce-subtle 1s ease-in-out infinite;
          }

          @keyframes pulse-subtle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }

          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }

          @keyframes node-pulse {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.5); opacity: 0.8; }
          }

          .animate-node-pulse {
            animation: node-pulse 3s ease-in-out infinite;
          }

          @keyframes line-appear {
            0% { opacity: 0; transform: scaleX(0); }
            50% { opacity: 0.3; transform: scaleX(1); }
            100% { opacity: 0; transform: scaleX(0); }
          }

          .animate-line-appear {
            animation: line-appear 4s ease-in-out infinite;
          }

          @keyframes circuit {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-10px, 10px) rotate(2deg); }
            75% { transform: translate(10px, -10px) rotate(-2deg); }
          }

          .animate-circuit {
            animation: circuit 10s ease-in-out infinite;
          }

          @keyframes circuit-pulse {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }

          .animate-circuit-pulse {
            animation: circuit-pulse 4s ease-in-out infinite;
          }
        `}</style>
      </div>

        {/* New Screenshots Section with Responsive Updates */}
      <div className="py-12 sm:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              See OrtonAI in Action
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how easy it is to manage and grow your social media presence
            </p>
          </div>

          {/* Screenshot Sections */}
          <div className="space-y-12 sm:space-y-24">
            {/* Analytics Dashboard */}
            <div id="analytics-section" className="scroll-animate flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['analytics-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-600">
                  Powerful Analytics Dashboard
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
                  Get detailed insights into your content performance with our intuitive analytics dashboard. Track engagement, growth, and audience behavior all in one place.
                </p>
                <ul className="space-y-2 sm:space-y-4">
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Real-time performance metrics
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Audience engagement analysis
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Content performance tracking
                  </li>
                </ul>
              </div>
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['analytics-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                <div className="relative">
                  <img
                    src={analytics}
                    alt="Analytics Dashboard"
                    className="rounded-lg shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-indigo-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    Live Analytics
                  </div>
                </div>
              </div>
            </div>

            {/* Content Generation */}
            <div id="content-section" className="scroll-animate flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-8">
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['content-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
                <div className="relative">
                  <img
                    src={contentIdeas}
                    alt="Content Generation"
                    className="rounded-lg shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-purple-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    AI-Powered
                  </div>
                </div>
              </div>
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['content-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-purple-600">
                  AI Content Generation
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
                  Let AI do the heavy lifting. Generate engaging content ideas, captions, and hashtags tailored to your brand's voice and audience.
                </p>
                <ul className="space-y-2 sm:space-y-4">
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
                    Smart caption generation
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
                    Trending hashtag suggestions
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
                    Content ideas based on trends
                  </li>
                </ul>
              </div>
            </div>

            {/* Scheduling */}
            <div id="scheduling-section" className="scroll-animate flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['scheduling-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-indigo-600">
                  Smart Scheduling
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
                  Post at the perfect time, every time. Our AI analyzes your audience's behavior to determine the optimal posting schedule.
                </p>
                <ul className="space-y-2 sm:space-y-4">
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Best time recommendations
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Automated scheduling
                  </li>
                  <li className="flex items-center text-gray-700 text-sm sm:text-base">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2" />
                    Cross-platform posting
                  </li>
                </ul>
              </div>
              <div className={`md:w-1/2 transition-all duration-1000 ${isVisible['scheduling-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                <div className="relative">
                  <img
                    src={postingTimes}
                    alt="Smart Scheduling"
                    className="rounded-lg shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-indigo-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    Smart Calendar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      {/* Keep existing Platform Features and subsequent sections */}

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
                <h3 className="ml-3 text-xl font-bold text-gray-900">
                  Instagram Management
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Target className="h-5 w-5 text-pink-600 mt-1 mr-2" />
                  <span>
                    Optimize your content strategy with AI-powered insights
                  </span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-pink-600 mt-1 mr-2" />
                  <span>
                    Find the perfect posting times for maximum engagement
                  </span>
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
                <h3 className="ml-3 text-xl font-bold text-gray-900">
                  YouTube (Coming Soon)
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                We're working hard to bring this feature to you. Stay tuned!
              </p>
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
      <div className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
              How Orton AI Works
            </h2>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connect */}
            <div id="how-it-works-1" className="scroll-animate transform transition-all duration-700 hover:scale-105">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"/>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold mb-6 mx-auto transform group-hover:rotate-12 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Connect</h3>
                <p className="text-gray-600 text-center text-sm sm:text-base">
                  Link your Instagram and YouTube accounts to get started with
                  comprehensive analytics and insights.
                </p>
              </div>
            </div>

            {/* Analyze */}
            <div id="how-it-works-2" className="scroll-animate transform transition-all duration-700 hover:scale-105 md:translate-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"/>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold mb-6 mx-auto transform group-hover:rotate-12 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Analyze</h3>
                <p className="text-gray-600 text-center text-sm sm:text-base">
                  Get deep insights into your content performance and audience
                  behavior patterns.
                </p>
              </div>
            </div>

            {/* Grow */}
            <div id="how-it-works-3" className="scroll-animate transform transition-all duration-700 hover:scale-105">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-rose-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"/>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-2xl font-bold mb-6 mx-auto transform group-hover:rotate-12 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Grow</h3>
                <p className="text-gray-600 text-center text-sm sm:text-base">
                  Use AI-powered tools to create better content and grow your
                  social media presence.
                </p>
              </div>
            </div>

            {/* Connecting lines (visible only on md and up) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-600 to-rose-600 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Add scroll animation observer */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-16');
                  }
                });
              }, { threshold: 0.1 });

              document.querySelectorAll('.scroll-animate').forEach((el) => {
                el.classList.add('opacity-0', 'translate-y-16');
                observer.observe(el);
              });
            });
          `
        }} />
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
                Get detailed insights into your content performance and audience
                engagement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Wand2 className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
              <p className="text-gray-600">
                Generate engaging content ideas and scripts tailored to your
                audience.
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
                Orton AI helps content creators optimize their social media
                presence with AI-powered insights and tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
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
                  <a
                    href="mailto:contact@ortonai.com"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-white"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Orton AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;