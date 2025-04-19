import { get, postForm, patchForm, del } from '../apiClients';

const API_BASE_URL = '/DiaryNotes';

export const getPagedDiaryNotes = async (queryParams = {}) => {
    let response = await get(`${API_BASE_URL}`, queryParams);

    for (let note of response?.items) {
        note.creationTime = new Date(new Date(note.creationTime).getTime() + 11 * 60 * 60 * 1000).toISOString();
    }

    return response;
};

export const createDiaryNote = async (diaryNoteData) => {
    return await postForm(`${API_BASE_URL}`, diaryNoteData);
};

export const updateDiaryNote = async (diaryNoteData) => {
    return await patchForm(`${API_BASE_URL}`, diaryNoteData);
};

export const deleteDiaryNote = async (diaryNoteId) => {
    return await del(`${API_BASE_URL}/${diaryNoteId}`);
};