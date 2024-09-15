import api from '@/api/apiCall';

export const getNotifications = async (receiverId) => {
  try {
    const response = await api.get(`/notifications`, {
      params: { ReceiverId: receiverId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const updateNotification = async (notificationId, status) => {
  try {
    const response = await api.patch(`/notifications`, {
      Id: notificationId,
      Status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};
