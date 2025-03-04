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

export const submitAdvisorRequest = async (cvFile, introduction, experience, certificates) => {
  try {
    const formData = new FormData();
    formData.append("CV.File", cvFile);
    formData.append("CV.Url", "");
    formData.append("CV.Title", cvFile.name);
    formData.append("Introduction", introduction);
    formData.append("Experience", experience);

    certificates.forEach((cert) => {
      formData.append("Certificates", cert);
    });

    const response = await apiClient.post("/notifications/advisor", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting advisor request:", error);
    throw error;
  }
};

