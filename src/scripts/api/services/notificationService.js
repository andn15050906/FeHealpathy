import apiClient from '@/scripts/api/apiClients';

export const getNotifications = async (receiverId) => {
  try {
    const response = await apiClient.get(`/notifications`, {
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
    const response = await apiClient.patch(`/notifications`, {
      Id: notificationId,
      Status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};
