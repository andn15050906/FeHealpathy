import { get, postForm, patchForm, del, getML } from '@/scripts/api/apiClients';
import apiClient from '@/scripts/api/apiClients';

const API_BASE_URL = '/Articles';
const API_ARTICAL_RECOMMENDATION = "you-may-like/articles"

export const getPagedArticles = async (params = { pageIndex: 0, pageSize: 20 }) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};


export const getAllArticles = async () => {
  let allArticles = [];
  let pageIndex = 0;
  const pageSize = 20;

  while (true) {
    const params = { pageIndex, pageSize };
    const response = await getPagedArticles(params);
    const articles = response.items || [];

    allArticles = allArticles.concat(articles);

    if (articles.length < pageSize) {
      break;
    }

    pageIndex++;
  }

  return allArticles;
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

