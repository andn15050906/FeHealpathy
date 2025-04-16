import { get, post, postForm, patchForm } from "@/scripts/api/apiClients";

const API_BASE_URL = "/Notifications";

export const getNotifications = async (queryParams = {}) => {
  return await get(`${API_BASE_URL}`, queryParams);
};

export const updateNotification = async (notification) => {
  return await patchForm(`${API_BASE_URL}`, notification);
};

export const submitAdvisorRequest = async ({ cvFile, introduction, experience, certificates }) => {
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

  return await postForm(`${API_BASE_URL}/Advisor`, formData);
};

export const submitWithdrawalRequest = async (formData) => {
  return await postForm(`${API_BASE_URL}/Withdrawal`, formData);
};

export const submitAdminMessage = async ({ title, content, recipients }) => {
  return await post(`${API_BASE_URL}/AdminMessage`, { title, content, recipients });
};

export const submitInviteMember = async ({ conversationId, userIds, message }) => {
  return await post(`${API_BASE_URL}/InviteMember`, {
    conversationId,
    userIds,
    message: message || "You have been invited to join a conversation.",
  });
};

export const submitUserReport = async ({ reportedUserId, reason }) => {
  return await post(`${API_BASE_URL}/ReportUser`, { reportedUserId, reason });
};

export const submitUserBanned = async ({ userId, message }) => {
  return await post(`${API_BASE_URL}/UserBanned`, {
    userId,
    message: message || "You have been banned due to a violation of our policies.",
  });
};

export const submitContentDisapproved = async ({ contentId, reason }) => {
  return await post(`${API_BASE_URL}/ContentDisapproved`, { contentId, reason });
};