import { get, post, patch, del } from '../api/apiCall';

const API_BASE_URL = '/DiaryNotes';

export const getPagedDiaryNotes = async (queryParams = {}) => {
    return await get(`${API_BASE_URL}`, queryParams);
};

export const createDiaryNote = async (diaryNoteData) => {
    return await post(`${API_BASE_URL}`, diaryNoteData);
};

export const updateDiaryNote = async (diaryNoteData) => {
    return await patch(`${API_BASE_URL}`, diaryNoteData);
};

export const deleteDiaryNote = async (diaryNoteId) => {
    return await del(`${API_BASE_URL}/${diaryNoteId}`);
};