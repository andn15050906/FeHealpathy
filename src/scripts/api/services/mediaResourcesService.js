import { get, del } from "@/api/apiCall";
import api from "@/api/apiCall";

const API_BASE_URL = "/MediaResources";

export const getPagedMediaResources = async (queryParams) => {
  return await get(`${API_BASE_URL}`, queryParams);
};

export const createMediaResource = async (formData) => {
  return await api.post(`${API_BASE_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateMediaResource = async (formData) => {
  return await api.patch(`${API_BASE_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteMediaResource = async (id) => {
  return await del(`${API_BASE_URL}/${id}`);
};
