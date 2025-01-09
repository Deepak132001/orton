import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  HomeIcon,
  ChartBarIcon,
  ClockIcon,
  LightBulbIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Footer from "./Footer";
import { Instagram } from "lucide-react";
// import NotificationCenter from "../notifications/NotificationCenter";
import logo from "../../assets/logo.png";

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: HomeIcon },
    {
      name: "Instagram Connection",
      href: "/dashboard/instagram-connection",
      icon: Instagram,
    },
    { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
    {
      name: "Posting Times",
      href: "/dashboard/posting-times",
      icon: ClockIcon,
    },
    {
      name: "Content Ideas",
      href: "/dashboard/content-ideas",
      icon: LightBulbIcon,
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 
        transition duration-300 ease-in-out transform 
        lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        bg-white
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-semibold">Orton AI</h1>
          <button onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
              <h1 className="text-xl font-semibold">Orton AI</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link to={"/dashboard"}>
            <img src={logo} alt="Logo" className="h-10 w-10 mt-3 ml-3" />
          </Link>

          {/* Add notification center to header */}
          {/* <div className="flex-1 px-4 flex items-center justify-end">
            <div className="ml-4 flex items-center md:ml-6">
              <NotificationCenter />

              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
              >
                Logout
              </button>
            </div>
          </div> */}
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
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
