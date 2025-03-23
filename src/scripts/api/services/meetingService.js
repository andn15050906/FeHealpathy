import { get, post, patch, del } from '../apiClients';

const BASE_URL = '/api/Meetings';

/**
 * Lấy danh sách cuộc họp theo trang
 * @param {Object} queryParams - Các tham số truy vấn
 * @returns {Promise} Danh sách cuộc họp
 */
export const getMeetings = async (queryParams = { PageIndex: 0, PageSize: 10 }) => {
  try {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
      params.append(key, queryParams[key]);
    });
    const response = await get(`${BASE_URL}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error getting meetings:', error);
    throw error;
  }
};

/**
 * Tạo cuộc họp mới
 * @param {Object} dto - CreateMeetingDto
 * @returns {Promise} Kết quả tạo cuộc họp
 */
export const createMeeting = async (dto) => {
  try {
    const response = await post(BASE_URL, {
      title: dto.Title,
      startAfter: dto.StartAfter,
      endAfter: dto.EndAfter,
      maxParticipants: dto.MaxParticipants,
      participants: dto.Participants,
      description: dto.Description
    });
    return response;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin cuộc họp
 * @param {Object} dto - UpdateMeetingDto
 * @returns {Promise} Kết quả cập nhật
 */
export const updateMeeting = async (dto) => {
  try {
    const response = await patch(BASE_URL, dto);
    return response;
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw error;
  }
};

/**
 * Xóa cuộc họp
 * @param {string} id - ID cuộc họp
 * @returns {Promise} Kết quả xóa
 */
export const deleteMeeting = async (id) => {
  try {
    const response = await del(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

/**
 * Tham gia cuộc họp
 * @param {string} meetingId - ID cuộc họp
 * @returns {Promise} Kết quả tham gia
 */
export const joinMeeting = async (meetingId) => {
  try {
    const response = await post(`${BASE_URL}/${meetingId}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining meeting:', error);
    throw error;
  }
};

/**
 * Rời cuộc họp
 * @param {string} meetingId - ID cuộc họp
 * @returns {Promise} Kết quả rời cuộc họp
 */
export const leaveMeeting = async (meetingId) => {
  try {
    const response = await post(`${BASE_URL}/${meetingId}/leave`);
    return response.data;
  } catch (error) {
    console.error('Error leaving meeting:', error);
    throw error;
  }
}; 