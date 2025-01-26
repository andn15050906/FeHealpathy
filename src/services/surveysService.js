import { get, post, del } from "@/api/apiCall";

const API_BASE_URL = "/Surveys";

export const getPagedSurveys = async (queryParams) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createSurvey = async (surveyData) => {
    return await post(`${API_BASE_URL}`, surveyData);
};

export const deleteSurvey = async (surveyId) => {
    return await del(`${API_BASE_URL}/${surveyId}`);
};