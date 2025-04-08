import { get, postForm, patchForm, del, getML } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Articles';
const API_ARTICAL_RECOMMENDATION = "you-may-like/articles"

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

export const getBlogById = async (id) => {
  try {
    const response = await get(`${API_BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const getRecommendationArticals = async (queryParams) => {
  return await getML(`${API_ARTICAL_RECOMMENDATION}`, queryParams);
};