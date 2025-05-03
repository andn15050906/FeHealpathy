import { get, post, patch, del } from '../apiClients';

const BASE_URL = '/Meetings';

export const getMeetings = async (queryParams) => {
  const params = new URLSearchParams(queryParams);
  return get(`${BASE_URL}?${params.toString()}`);
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