// frontend/src/components/notifications/NotificationBadge.jsx

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;