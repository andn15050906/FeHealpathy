import { get, postForm, patchForm, del } from '../api/apiCall';

const API_BASE_URL = '/Articles';

export const getPagedArticles = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createArticle = async (articleData) => {
    return await postForm(`${API_BASE_URL}`, articleData);
};

export const updateArticle = async (articleData) => {
    return await patchForm(`${API_BASE_URL}`, articleData);
};

export const deleteArticle = async (articleId) => {
    return await del(`${API_BASE_URL}/${articleId}`);
};




  
