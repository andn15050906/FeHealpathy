import { get, post, patch } from '../apiClients';

const BASE_URL = '/api/Users';

/**
 * Lấy danh sách users
 */
export const getUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Thêm các params vào URL
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });

    const url = `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Calling API:', url); // Debug log
    
    const response = await get(url);
    return response;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

/**
 * Lấy danh sách advisors
 */
export const getAdvisors = async () => {
  try {
    const response = await getUsers({ Role: 2 });
    return response;
  } catch (error) {
    console.error('Error getting advisors:', error);
    throw error;
  }
};

/**
 * Lấy thông tin user theo ID
 */
export const getUserById = async (id) => {
  try {
    const response = await get(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin user
 */
export const updateUser = async (id, data) => {
  try {
    const response = await patch(`${BASE_URL}/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getMultipleUsers = async (ids) => {
  try {
    const response = await get(`/Users/multiple`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMinUsers = async (ids) => {
  try {
    const response = await get(`/Users/min`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllMinUsers = async () => {
  try {
    const response = await get(`/Users/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserAvatar = async (resourceId) => { //lấy avt của user
  try {
    const response = await get(`/Users/avatar/${resourceId}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user avatar:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateUserProfile = async (formData) => { //cập nhật thông tin user
  try {
    const response = await patch(`/Users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating user profile:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateRoadmap = async (roadmapId) => {
  let formData = new FormData();
  formData.append('RoadmapId', roadmapId);
  try {
    const response = await patch(`/Users`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
  catch (error) {
    console.log(error);
  }
}

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const formData = new FormData();
    formData.append("CurrentPassword", currentPassword);
    formData.append("NewPassword", newPassword);

    const response = await patch(`${BASE_URL}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, token, newPassword) => {
  try {
    const requestBody = {
      Email: email,
      Token: token,
      NewPassword: newPassword,
    };
    const response = await post('/Auth/ResetPassword', requestBody);
    return response.data;
  } catch (error) {
    console.error('Reset password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await post('/Auth/ForgotPassword', email);
    return response.data;
  } catch (error) {
    console.error('Forgot password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};