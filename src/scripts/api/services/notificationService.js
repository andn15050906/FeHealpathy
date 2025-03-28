import apiClient from '@/scripts/api/apiClients';

export const getNotifications = async (receiverId) => {
  try {
    const response = await apiClient.get(`/Notifications`, {
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
    const response = await apiClient.patch(`/Notifications`, {
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
    formData.append("CV.Title", cvFile.name);
    formData.append("Introduction", introduction);
    formData.append("Experience", experience);

    certificates.forEach((cert, index) => {
      if (cert instanceof File) {
        formData.append(`Certificates[${index}].File`, cert);
        formData.append(`Certificates[${index}].Title`, cert.name);
      }
    });

    const response = await apiClient.postForm("/Notifications/Advisor", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting advisor request:", error);
    throw error;
  }
};

export const submitWithdrawalRequest = async (withdrawalData) => {
  try {
    const response = await apiClient.postForm("/Notifications/Withdrawal", withdrawalData);
    return response.data;
  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    throw error;
  }
};

export const submitAdminMessage = async (adminMessageData) => {
  try {
    const response = await apiClient.post("/Notifications/AdminMessage", adminMessageData);
    return response.data;
  } catch (error) {
    console.error("Error submitting admin message:", error);
    throw error;
  }
};

export const submitInviteMember = async (invitationData) => {
  try {
    const response = await apiClient.post("/Notifications/InviteMember", invitationData);
    return response.data;
  } catch (error) {
    console.error("Error submitting invitation:", error);
    throw error;
  }
};

export const submitUserReport = async (reportData) => {
  try {
    const response = await apiClient.post("/Notifications/ReportUser", reportData);
    return response.data;
  } catch (error) {
    console.error("Error submitting user report:", error);
    throw error;
  }
};

export const submitUserBanned = async (bannedData) => {
  try {
    const response = await apiClient.post("/Notifications/UserBanned", bannedData);
    return response.data;
  } catch (error) {
    console.error("Error submitting user banned notification:", error);
    throw error;
  }
};

export const submitContentDisapproved = async (disapprovedData) => {
  try {
    const response = await apiClient.post("/Notifications/ContentDisapproved", disapprovedData);
    return response.data;
  } catch (error) {
    console.error("Error submitting content disapproved notification:", error);
    throw error;
  }
};