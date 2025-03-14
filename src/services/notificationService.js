import axiosInstance from "../api/axiosInstance";

export const sendNotification = async (payload) => {
  return axiosInstance.post("/api/notifications/", payload);
};

export const getNotifications = async (userId, role) => {
  return axiosInstance.get(`/api/notifications/${userId}/${role}`);
};

export const markAsRead = async (notificationId) => {
  return await axiosInstance.put(`/api/notifications/${notificationId}/read`);
};

export const getUnreadNotificationCount = async (userId, role) => {
  try {
    const res = await axiosInstance.get(
      `/api/notifications/count/${userId}/${role}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    throw error;
  }
};
