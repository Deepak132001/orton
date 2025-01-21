// frontend/src/components/notifications/NotificationCenter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import NotificationItem from './NotificationItem';
import * as notificationService from '../../services/notification.service';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          dropdownRef.current && 
          buttonRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Remove the notification from state
      setNotifications(notifications.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Clear all notifications from state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
      >
        <Bell className="h-6 w-6" />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-[-80px] mt-2 w-80 sm:w-96 origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white"
          style={{ 
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 200px)',
            zIndex: 50,
          }}
        >
          <div className="py-2 divide-y divide-gray-100">
            {/* Header */}
            <div className="px-4 py-2 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {loading ? (
                <div className="p-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map(notification => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;