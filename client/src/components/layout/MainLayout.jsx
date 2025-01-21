// src/components/layout/MainLayout.jsx
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
import { Instagram, Youtube, ChevronDown, PencilIcon, ImageIcon, MessageSquare } from "lucide-react";
import NotificationCenter from "../notifications/NotificationCenter";
import PlatformSwitcher from "../common/PlatformSwitcher";
// import ComingSoon from '../common/ComingSoon';
import logo from "../../assets/logo.png";

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { currentPlatform, switchPlatform, platformData } = usePlatform();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

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

  // Get current navigation based on platform
  const getCurrentNavigation = () => {
    return currentPlatform === 'instagram' ? instagramNavigation : youtubeNavigation;
  };

  const handlePlatformChange = (newPlatform) => {
    switchPlatform(newPlatform);
    // Redirect to the overview page of the selected platform
    navigate('/dashboard');
  };

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // NavItem component for rendering navigation items
  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];
    const isActiveParent = hasChildren && item.children.some(
      child => location.pathname === child.href
    );

    const baseClasses = `
      group flex items-center px-2 py-2 text-sm font-medium rounded-md 
      ${isActive || isActiveParent ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `;

    const handleClick = () => {
      if (hasChildren) {
        toggleExpanded(item.name);
      } else {
        setSidebarOpen(false); // Close sidebar on link click
      }
    };

    if (hasChildren) {
      return (
        <div>
          <div
            className={`${baseClasses} justify-between cursor-pointer`}
            onClick={handleClick}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-6 w-6 text-gray-400" />
              {item.name}
            </div>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
          {isExpanded && (
            <div className="ml-8 space-y-1 mt-1">
              {item.children.map((child) => (
                <NavItem key={child.name} item={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        className={baseClasses}
        onClick={handleClick}
      >
        <item.icon className={`mr-3 h-6 w-6 ${
          item.name.includes('Instagram') ? 'text-pink-600' : 
          item.name.includes('YouTube') ? 'text-red-600' : 
          'text-gray-400'
        }`} />
        <span className="flex-1">{item.name}</span>
      </Link>
    );
  };
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          transition duration-300 ease-in-out transform 
          lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white
        `}
      >
        {/* Mobile sidebar content */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-semibold">Orton AI</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="px-4 py-4">
            <PlatformSwitcher 
              currentPlatform={currentPlatform}
              onPlatformChange={handlePlatformChange}
            />
          </div>
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {getCurrentNavigation().map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
              <h1 className="text-xl font-semibold">Orton AI</h1>
            </div>
            <div className="px-4 py-4 bg-white">
              <PlatformSwitcher 
                currentPlatform={currentPlatform}
                onPlatformChange={handlePlatformChange}
              />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {getCurrentNavigation().map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex items-center justify-between">
            <Link to="/dashboard">
              <img src={logo} alt="Logo" className="h-10 w-10" />
            </Link>

            <div className="flex items-center">
              <NotificationCenter />
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <ComingSoon /> */}
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