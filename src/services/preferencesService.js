import { get, patch } from "@/api/apiCall";

const API_BASE_URL = "/Preferences";

export const getAllPreferenceSurveys = async () => {
    return await get(`${API_BASE_URL}`);
};

export const updateUserPreference = async (data) => {
    return await patch(`${API_BASE_URL}`, data);
};