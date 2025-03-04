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

    // ✅ Gửi file PDF trực tiếp vào "Certificates" thay vì JSON
    certificates.forEach((cert) => {
      if (cert instanceof File) {
        formData.append("Certificates", cert); // Append trực tiếp file PDF
      }
    });

    // 🚀 Log dữ liệu FormData để kiểm tra trước khi gửi
    console.log("🚀 FormData Entries Before Sending:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // ✅ Không đặt 'Content-Type', để trình duyệt tự động xử lý
    const response = await apiClient.post("/Notifications/Advisor", formData);

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting advisor request:", error);
    throw error;
  }
};







