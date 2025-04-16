import apiClient from '@/scripts/api/apiClients';
const API_BASE_URL = '/Users';

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUsers = async (query) => {
  try {
    const response = await apiClient.get(`/Users`, { params: query });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMultipleUsers = async (ids) => {
  try {
    const response = await apiClient.get(`/Users/multiple`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMinUsers = async (ids) => {
  try {
    const response = await apiClient.get(`/Users/min`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllMinUsers = async () => {
  try {
    const response = await apiClient.get(`/Users/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserAvatar = async (resourceId) => { //lấy avt của user
  try {
    const response = await apiClient.get(`/Users/avatar/${resourceId}`, {
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
    const response = await apiClient.put(`/Users`, formData, {
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
    const response = await apiClient.put(`/Users`, formData, {
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

    const response = await apiClient.put(`${API_BASE_URL}`, formData, {
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
    const response = await apiClient.post('/Auth/ResetPassword', requestBody);
    return response.data;
  } catch (error) {
    console.error('Reset password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Hàm kiểm tra email đã tồn tại trong hệ thống chưa
export const checkEmailExists = async (email) => {
  try {
    // Sử dụng Email thay vì email để match với C# model
    const response = await apiClient.get(`/Users/check-email`, {
      params: {
        Email: email  // Đổi thành PascalCase
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking email:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    // Sử dụng FormData thay vì JSON object
    const formData = new FormData();
    formData.append('Email', email);  // Đổi thành PascalCase

    const response = await apiClient.post('/Auth/ForgotPassword', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Forgot password failed:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error('Forgot password failed:', error.message);
    }
    throw error;
  }
};