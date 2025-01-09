import React from 'react';
import { format } from 'date-fns';

const NotificationItem = ({ notification, onRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'PERFORMANCE':
        return '📈';
      case 'BEST_TIME':
        return '⏰';
      case 'ENGAGEMENT':
        return '👥';
      case 'MILESTONE':
        return '🎉';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`p-4 cursor-pointer transition duration-150 ease-in-out ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      } hover:bg-gray-50`}
      onClick={() => onRead(notification._id)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 text-xl">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-400">
            {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;