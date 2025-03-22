import { get, post, patch, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Roadmaps';

export const getRoadmaps = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);    
};

export const createRoadmap = async (roadmapData) => {
    return await post(`${API_BASE_URL}`, roadmapData);
};

export const updateRoadmap = async (roadmapData) => {
    return await patch(`${API_BASE_URL}`, roadmapData);
};

export const deleteRoadmap = async (roadmapId) => {
    return await del(`${API_BASE_URL}/${roadmapId}`);
};

export const getProgress = async () => {
  return await get(`/RoadmapProgress`);
}