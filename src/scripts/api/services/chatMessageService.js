import { get, postForm, patchForm, del } from '../apiClients';

const API_BASE_URL = '/ChatMessages';

export const getPagedChatMessages = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createChatMessage = async (message) => {
    return await postForm(`${API_BASE_URL}`, message);
};

export const updateChatMessage = async (message) => {
    return await patchForm(`${API_BASE_URL}`, message);
};

export const deleteChatMessage = async (id) => {
    return await del(`${API_BASE_URL}/${id}`);
};