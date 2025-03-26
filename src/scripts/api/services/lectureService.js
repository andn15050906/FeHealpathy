import { get, postForm, patchForm, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Lectures';

export const getLectures = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);    
};

export const createLecture = async (lectureData) => {
    return await postForm(`${API_BASE_URL}`, lectureData);
};

export const updateLecture = async (lectureData) => {
    return await patchForm(`${API_BASE_URL}`, lectureData);
};

export const deleteLecture = async (lectureId) => {
    return await del(`${API_BASE_URL}/${lectureId}`);
};