import { useState, useEffect } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";
// import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(user?._id, user?.role);
        const fetchedNotifications = res.data || [];
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notif) => {
    setSelectedNotification(notif);

    if (notif.isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
    );

    try {
      await markAsRead(notif._id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="flex w-full h-[80vh] bg-gray-100 rounded-xl shadow-lg overflow-hidden">
      <div className="w-1/3 overflow-y-auto border-r border-gray-300 bg-white">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
          Notifications
        </h2>
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No notifications available
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`relative p-4 cursor-pointer transition-all rounded-lg m-2 flex flex-col gap-2
                ${
                  selectedNotification?._id === notif._id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-50 bg-white"
                }
                ${
                  !notif.isRead && selectedNotification?._id !== notif._id
                    ? "border-l-4 border-blue-500"
                    : "border-l-4 border-transparent"
                }
              `}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${
                      selectedNotification?._id === notif._id
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    {/* {dayjs(notif.createdAt).format("DD MMM, YYYY hh:mm A")} */}
                  </span>
                </div>

                <p
                  className={`text-sm leading-5 truncate ${
                    !notif.isRead && selectedNotification?._id !== notif._id
                      ? "font-semibold text-gray-800"
                      : selectedNotification?._id === notif._id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                  title={notif.message}
                >
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-2/3 p-8 overflow-y-auto bg-white">
        {selectedNotification ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Notification</h3>
              <span className="text-sm text-gray-500">
                {/* {dayjs(selectedNotification.createdAt).format(
                  "DD MMM, YYYY hh:mm A"
                )} */}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {selectedNotification.message}
            </p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Select a notification to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
