import { get, postForm, patchForm, del } from "@/scripts/api/apiClients";

const API_BASE_URL = "/MediaResources";

export const getPagedMediaResources = async (queryParams) => {
  return await get(`${API_BASE_URL}`, queryParams);
};

export const createMediaResource = async (formData) => {
  return await postForm(`${API_BASE_URL}`, formData);
};

export const updateMediaResource = async (formData) => {
  return await patchForm(`${API_BASE_URL}`, formData);
};

export const deleteMediaResource = async (id) => {
  return await del(`${API_BASE_URL}/${id}`);
};