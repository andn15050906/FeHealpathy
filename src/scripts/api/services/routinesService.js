import { get, post, patch, del } from  "@/scripts/api/apiClients";

const API_BASE_URL = "/routines";

export const getPagedRoutines = async (queryParams) => {
  return await get(`${API_BASE_URL}`, queryParams);
};

export const createRoutine = async (routineData) => {
  return await post(`${API_BASE_URL}`, routineData);
};

export const updateRoutine = async (routineData) => {
  return await patch(`${API_BASE_URL}`, routineData);
};

export const deleteRoutine = async (routineId) => {
  return await del(`${API_BASE_URL}/${routineId}`);
};