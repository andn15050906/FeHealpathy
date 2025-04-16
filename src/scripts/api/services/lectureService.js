import { get, postForm, patchForm, del } from '@/scripts/api/apiClients';

const API_BASE_URL = '/Lectures';

export const getLectures = async (courseId, queryParams = {}) => {
    if (!courseId) {
        throw new Error("courseId is required");
    }
    
    const params = {
        ...queryParams,
        courseId: courseId
    };
    
    return await get(`${API_BASE_URL}`, params);    
};

export const getLectureById = async (lectureId, queryParams = {}) => {
    if (!lectureId) {
        throw new Error("lectureId is required");
    }
    
    const params = {
        ...queryParams,
        Id: lectureId
    };
    
    return await get(`${API_BASE_URL}`, params);    
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

