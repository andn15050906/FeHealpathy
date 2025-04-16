import { get, post, patch, del } from '../apiClients';

const BASE_URL = '/Meetings';

export const getMeetings = async (queryParams = { PageIndex: 0, PageSize: 10 }) => {
  try {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
      params.append(key, queryParams[key]);
    });
    const response = await get(`${BASE_URL}?${params.toString()}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createMeeting = async (dto) => {
  try {
    const response = await post(BASE_URL, {
      title: dto.title ?? '',
      startAt: dto.startAt,
      endAt: dto.endAt,
      maxParticipants: dto.maxParticipants,
      participants: dto.participants,
      description: dto.description ?? ''
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMeeting = async (dto) => {
  try {
    const response = await patch(BASE_URL, dto);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteMeeting = async (id) => {
  try {
    const response = await del(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const joinMeeting = async (meetingId) => {
  try {
    const response = await post(`${BASE_URL}/${meetingId}/join`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const leaveMeeting = async (meetingId) => {
  try {
    const response = await post(`${BASE_URL}/${meetingId}/leave`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 