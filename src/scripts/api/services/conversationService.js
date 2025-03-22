import { get, postForm, patchForm, del } from '../apiClients';
import { getUsers } from './userService';

const API_BASE_URL = '/Conversations';

export const getPagedConversations = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createConversation = async (conversationData) => {
    return await postForm(`${API_BASE_URL}`, conversationData);
};

export const updateConversation = async (conversationData) => {
    return await patchForm(`${API_BASE_URL}`, conversationData);
};

export const deleteConversation = async (conversationId) => {
    return await del(`${API_BASE_URL}/${conversationId}`);
};

// Load danh sách users và conversations
export const loadUsersAndConversations = async () => {
    try {
        const usersResponse = await getUsers();
        // Chuyển đổi dữ liệu users 
        const users = usersResponse.items.map(user => ({
            userId: user.id,        
            userName: user.fullName,
            avatarUrl: user.avatarUrl
        }));

        const conversationsResponse = await getPagedConversations();
        // Chuyển đổi dữ liệu conversations
        const conversations = conversationsResponse.items.map(conv => ({
            conversationId: conv.id,     
            conversationName: conv.title 
        }));

        return {
            users,
            conversations
        };
    } catch (error) {
        //sữa lỗi
        console.error('Error loading users and conversations:', error);
        throw error;
    }
};