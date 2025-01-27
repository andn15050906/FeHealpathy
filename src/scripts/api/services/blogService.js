import { get, post, patch, del } from '../apiClients';

const API_BASE_URL = '/Articles';

export const getPagedArticles = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createArticle = async (articleData) => {
    return await post(`${API_BASE_URL}`, articleData);
};

export const updateArticle = async (articleData) => {
    return await patch(`${API_BASE_URL}`, articleData);
};

export const deleteArticle = async (articleId) => {
    return await del(`${API_BASE_URL}/${articleId}`);
};
