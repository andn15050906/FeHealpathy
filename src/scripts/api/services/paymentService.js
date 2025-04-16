import { get, post } from '../apiClients';

const API_BASE_URL = '/Bills';

export const getBills = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const purchasePremium = async (paymentOptions) => {
    return await post(`${API_BASE_URL}/purchase/premium/${paymentOptions}`);
};

export const purchaseCourse = async (courseId) => {
    return await post(`${API_BASE_URL}/purchase/course/${courseId}`);
};