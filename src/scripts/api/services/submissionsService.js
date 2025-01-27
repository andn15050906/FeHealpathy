import { get, post, del } from "@/scripts/api/apiClients";

const API_BASE_URL = "/Submissions";

export const getPagedSubmissions = async (queryParams) => {
  return await get(`${API_BASE_URL}`, queryParams);
};

export const createSubmission = async (submissionData) => {
  return await post(`${API_BASE_URL}`, submissionData);
};

export const deleteSubmission = async (submissionId) => {
  return await del(`${API_BASE_URL}/${submissionId}`);
};