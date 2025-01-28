import { get, post, patch, del } from '../apiClients';

const API_BASE_URL = '/Conversations';

export const getPagedConversations = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createConversation = async (conversationData) => {
    return await post(`${API_BASE_URL}`, conversationData);
};

export const updateConversation = async (conversationData) => {
    return await patch(`${API_BASE_URL}`, conversationData);
};

export const deleteConversation = async (conversationId) => {
    return await del(`${API_BASE_URL}/${conversationId}`);
};