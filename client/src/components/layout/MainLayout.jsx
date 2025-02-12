// // src/components/layout/MainLayout.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
// import { usePlatform } from "../../contexts/PlatformContext";
// import {
//   HomeIcon,
//   ChartBarIcon,
//   ClockIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import Footer from "./Footer";
// import { Instagram, Youtube, ChevronDown, PencilIcon, ImageIcon, MessageSquare } from "lucide-react";
// import NotificationCenter from "../notifications/NotificationCenter";
// import PlatformSwitcher from "../common/PlatformSwitcher";
// // import ComingSoon from '../common/ComingSoon';
// import logo from "../../assets/logo.png";

// const MainLayout = ({ children }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const { currentPlatform, switchPlatform, platformData } = usePlatform();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [expandedItems, setExpandedItems] = useState({});
//   const location = useLocation();

//   // Navigation items for Instagram
//   const instagramNavigation = [
//     { 
//       name: "Overview", 
//       href: "/dashboard", 
//       icon: HomeIcon,
//       platform: 'instagram' 
//     },
//     { 
//       name: "Analytics", 
//       href: "/dashboard/analytics", 
//       icon: ChartBarIcon,
//       platform: 'instagram'
//     },
//     { 
//       name: "Posting Times", 
//       href: "/dashboard/posting-times", 
//       icon: ClockIcon,
//       platform: 'instagram'
//     },
//     { 
//       name: "Instagram Connection", 
//       href: "/dashboard/instagram-connection", 
//       icon: Instagram,
//       platform: 'instagram'
//     },
//     {
//       name: "Content Creation",
//       href: "/dashboard/content-ideas",
//       icon: PencilIcon,
//       platform: 'instagram',   
//     }
//   ];

//   // Navigation items for YouTube
//   const youtubeNavigation = [
//     { 
//       name: "Overview", 
//       href: "/dashboard", 
//       icon: HomeIcon,
//       platform: 'youtube' 
//     },
//     { 
//       name: "YouTube Analytics", 
//       href: "/dashboard/youtube-analytics", 
//       icon: ChartBarIcon,
//       platform: 'youtube'
//     },
//     { 
//       name: "Best Upload Times", 
//       href: "/dashboard/youtube-posting-times", 
//       icon: ClockIcon,
//       platform: 'youtube'
//     },
//     { 
//       name: "Channel Connection", 
//       href: "/dashboard/youtube-connection", 
//       icon: Youtube,
//       platform: 'youtube'
//     },
//     {
//       name: "Content Creation",
//       icon: PencilIcon,
//       platform: 'youtube',
//       children: [
//         {
//           name: "Video Scripts",
//           href: "/dashboard/youtube-scripts",
//           icon: ImageIcon,
//         }
//       ]
//     }
//   ];

//   // Get current navigation based on platform
//   const getCurrentNavigation = () => {
//     return currentPlatform === 'instagram' ? instagramNavigation : youtubeNavigation;
//   };

//   const handlePlatformChange = (newPlatform) => {
//     switchPlatform(newPlatform);
//     // Redirect to the overview page of the selected platform
//     navigate('/dashboard');
//   };

//   const toggleExpanded = (itemName) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [itemName]: !prev[itemName]
//     }));
//   };

//   // NavItem component for rendering navigation items
//   const NavItem = ({ item }) => {
//     const isActive = location.pathname === item.href;
//     const hasChildren = item.children && item.children.length > 0;
//     const isExpanded = expandedItems[item.name];
//     const isActiveParent = hasChildren && item.children.some(
//       child => location.pathname === child.href
//     );

//     const baseClasses = `
//       group flex items-center px-2 py-2 text-sm font-medium rounded-md 
//       ${isActive || isActiveParent ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
//     `;

//     const handleClick = () => {
//       if (hasChildren) {
//         toggleExpanded(item.name);
//       } else {
//         setSidebarOpen(false); // Close sidebar on link click
//       }
//     };

//     if (hasChildren) {
//       return (
//         <div>
//           <div
//             className={`${baseClasses} justify-between cursor-pointer`}
//             onClick={handleClick}
//           >
//             <div className="flex items-center">
//               <item.icon className="mr-3 h-6 w-6 text-gray-400" />
//               {item.name}
//             </div>
//             <ChevronDown
//               className={`w-5 h-5 transform transition-transform ${
//                 isExpanded ? 'rotate-180' : ''
//               }`}
//             />
//           </div>
//           {isExpanded && (
//             <div className="ml-8 space-y-1 mt-1">
//               {item.children.map((child) => (
//                 <NavItem key={child.name} item={child} />
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <Link
//         to={item.href}
//         className={baseClasses}
//         onClick={handleClick}
//       >
//         <item.icon className={`mr-3 h-6 w-6 ${
//           item.name.includes('Instagram') ? 'text-pink-600' : 
//           item.name.includes('YouTube') ? 'text-red-600' : 
//           'text-gray-400'
//         }`} />
//         <span className="flex-1">{item.name}</span>
//       </Link>
//     );
//   };
//   return (
//     <div className="h-screen flex overflow-hidden bg-gray-100">
//       {/* Mobile sidebar */}
//       <div
//         className={`
//           fixed inset-y-0 left-0 z-50 w-64 
//           transition duration-300 ease-in-out transform 
//           lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           bg-white
//         `}
//       >
//         {/* Mobile sidebar content */}
//         <div className="flex flex-col h-full">
//           <div className="flex items-center justify-between h-16 px-4 border-b">
//             <h1 className="text-xl font-semibold">Orton AI</h1>
//             <button onClick={() => setSidebarOpen(false)}>
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>
//           <div className="px-4 py-4">
//             <PlatformSwitcher 
//               currentPlatform={currentPlatform}
//               onPlatformChange={handlePlatformChange}
//             />
//           </div>
//           <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
//             {getCurrentNavigation().map((item) => (
//               <NavItem key={item.name} item={item} />
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:flex lg:flex-shrink-0">
//         <div className="flex flex-col w-64">
//           <div className="flex flex-col h-0 flex-1">
//             <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
//               <h1 className="text-xl font-semibold">Orton AI</h1>
//             </div>
//             <div className="px-4 py-4 bg-white">
//               <PlatformSwitcher 
//                 currentPlatform={currentPlatform}
//                 onPlatformChange={handlePlatformChange}
//               />
//             </div>
//             <div className="flex-1 flex flex-col overflow-y-auto bg-white">
//               <nav className="flex-1 px-2 py-4 space-y-1">
//                 {getCurrentNavigation().map((item) => (
//                   <NavItem key={item.name} item={item} />
//                 ))}
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex flex-col w-0 flex-1 overflow-hidden">
//         {/* Top navigation bar */}
//         <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b">
//           <button
//             className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Bars3Icon className="h-6 w-6" />
//           </button>

//           <div className="flex-1 px-4 flex items-center justify-between">
//             <Link to="/dashboard">
//               <img src={logo} alt="Logo" className="h-10 w-10" />
//             </Link>

//             <div className="flex items-center">
//               <NotificationCenter />
//               <button
//                 onClick={logout}
//                 className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main content area */}
//         <main className="flex-1 relative overflow-y-auto focus:outline-none">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* <ComingSoon /> */}
//               {children}
//             </div>
//           </div>
//           <Footer />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { usePlatform } from "../../contexts/PlatformContext";
import {
  HomeIcon,
  ChartBarIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Footer from "./Footer";
import { Instagram, Youtube, ChevronDown, PencilIcon, ImageIcon, MessageSquare, Menu, X, Handshake } from "lucide-react";
import NotificationCenter from "../notifications/NotificationCenter";
import PlatformSwitcher from "../common/PlatformSwitcher";
import logo from "../../assets/logo.png";

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentPlatform, switchPlatform } = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items for Instagram
  const instagramNavigation = [
    { 
      name: "Overview", 
      href: "/dashboard", 
      icon: HomeIcon,
      platform: 'instagram' 
    },
    { 
      name: "Analytics", 
      href: "/dashboard/analytics", 
      icon: ChartBarIcon,
      platform: 'instagram'
    },
    { 
      name: "Posting Times", 
      href: "/dashboard/posting-times", 
      icon: ClockIcon,
      platform: 'instagram'
    },
    { 
      name: "Instagram Connection", 
      href: "/dashboard/instagram-connection", 
      icon: Instagram,
      platform: 'instagram'
    },
    {
      name: "Content Creation",
      href: "/dashboard/content-ideas",
      icon: PencilIcon,
      platform: 'instagram',   
    },
    {
      name: "Partner Program",
      href: "/dashboard/refer",
      icon: Handshake,
      platform: 'instagram',   
    }
  ];

  // Navigation items for YouTube
  const youtubeNavigation = [
    { 
      name: "Overview", 
      href: "/dashboard", 
      icon: HomeIcon,
      platform: 'youtube' 
    },
    { 
      name: "YouTube Analytics", 
      href: "/dashboard/youtube-analytics", 
      icon: ChartBarIcon,
      platform: 'youtube'
    },
    { 
      name: "Best Upload Times", 
      href: "/dashboard/youtube-posting-times", 
      icon: ClockIcon,
      platform: 'youtube'
    },
    { 
      name: "Channel Connection", 
      href: "/dashboard/youtube-connection", 
      icon: Youtube,
      platform: 'youtube'
    },
    {
      name: "Content Creation",
      icon: PencilIcon,
      platform: 'youtube',
      children: [
        {
          name: "Video Scripts",
          href: "/dashboard/youtube-scripts",
          icon: ImageIcon,
        }
      ]
    }
  ];

  const getCurrentNavigation = () => {
    return currentPlatform === 'instagram' ? instagramNavigation : youtubeNavigation;
  };

  const handlePlatformChange = (newPlatform) => {
    switchPlatform(newPlatform);
    navigate('/dashboard');
  };

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const LogoComponent = ({ isMobile }) => (
    <Link 
      to="/dashboard" 
      className="flex items-center space-x-2 sm:space-x-3 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors duration-200"
    >
      <img 
        src={logo} 
        alt="Logo" 
        className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} rounded-lg shadow-lg`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/api/placeholder/32/32';
        }}
      />
      <span className={`
        font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600
        ${isMobile ? 'text-lg' : 'text-xl'}
        transition-all duration-200
      `}>
        {isMobile ? 'Orton' : 'Orton AI'}
      </span>
    </Link>
  );

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];
    const isActiveParent = hasChildren && item.children.some(
      child => location.pathname === child.href
    );

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (hasChildren) {
        toggleExpanded(item.name);
      } else if (item.href) {
        navigate(item.href);
        setSidebarOpen(false);
      }
    };

    const baseClasses = `
      relative group flex items-center px-4 py-3 text-sm font-medium rounded-xl
      transition-all duration-300 ease-in-out cursor-pointer
      ${isActive || isActiveParent ? 
        'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg' : 
        'text-slate-600 hover:bg-slate-100'
      }
    `;

    const iconClasses = `mr-3 h-5 w-5 transition-colors duration-300 ${
      isActive || isActiveParent ? 'text-white' : 
      item.name.includes('Instagram') ? 'text-pink-500 group-hover:text-pink-600' : 
      item.name.includes('YouTube') ? 'text-red-500 group-hover:text-red-600' : 
      'text-slate-400 group-hover:text-slate-600'
    }`;

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <div
            className={baseClasses}
            onClick={handleClick}
          >
            <div className="flex items-center">
              <item.icon className={iconClasses} />
              {item.name}
            </div>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
          <div className={`
            ml-4 space-y-1 overflow-hidden transition-all duration-300
            ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}>
            {item.children.map((child) => (
              <NavItem key={child.name} item={child} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className={baseClasses}
        onClick={handleClick}
      >
        <item.icon className={iconClasses} />
        <span className="flex-1">{item.name}</span>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72
        transition-transform duration-300 ease-in-out transform 
        lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        bg-white shadow-2xl overflow-hidden
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b bg-white">
            <LogoComponent isMobile={true} />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-4">
              <PlatformSwitcher 
                currentPlatform={currentPlatform}
                onPlatformChange={handlePlatformChange}
              />
            </div>
            <nav className="px-3 space-y-2">
              {getCurrentNavigation().map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-72">
          <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex items-center h-16 flex-shrink-0 px-4 sm:px-6 border-b bg-white">
              <LogoComponent isMobile={false} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4">
                <PlatformSwitcher 
                  currentPlatform={currentPlatform}
                  onPlatformChange={handlePlatformChange}
                />
              </div>
              <nav className="px-3 space-y-2">
                {getCurrentNavigation().map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className={`
          relative z-20 flex h-16 bg-white
          transition-all duration-300
          ${scrolled ? 'shadow-md' : 'shadow-sm'}
        `}>
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="lg:hidden ml-2">
                <LogoComponent isMobile={true} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <div className="h-6 w-px bg-slate-200" />
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;