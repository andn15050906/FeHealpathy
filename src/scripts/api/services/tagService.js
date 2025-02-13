import { get, post, del } from '../api/apiCall';

const API_BASE_URL = '/Tags';

export const getPagedTags = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createTag = async (tagData) => {
    return await post(`${API_BASE_URL}`, tagData);
};

export const deleteTag = async (tagId) => {
    return await del(`${API_BASE_URL}/${tagId}`);
};