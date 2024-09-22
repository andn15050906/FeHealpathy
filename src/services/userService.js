import api from '@/api/apiCall';

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/Users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getClientInfo = async () => {
  try {
    const response = await api.get(`/Users/client`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client info:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUsers = async (query) => {
  try {
    const response = await api.get(`/Users`, { params: query });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMultipleUsers = async (ids) => {
  try {
    const response = await api.get(`/Users/multiple`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching multiple users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMinUsers = async (ids) => {
  try {
    const response = await api.get(`/Users/min`, { params: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error fetching minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllMinUsers = async () => {
  try {
    const response = await api.get(`/Users/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all minimal users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserAvatar = async (resourceId) => {
  try {
    const response = await api.get(`/Users/avatar/${resourceId}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user avatar:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (formData) => {
  try {
    const response = await api.patch(`/Users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// export const changePassword = async (formData) => {
//   try {
//     const response = await api.patch('/Users', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error updating password:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export const resetPassword = async (email, token, newPassword) => {
  try {
    const requestBody = {
      Email: email,
      Token: token,
      NewPassword: newPassword,
    };
    const response = await api.post('/Users/ResetPassword', requestBody);
    return response.data;
  } catch (error) {
    console.error('Reset password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const checkValidity = async (email, token) => {
  try {
    const response = await api.get(`/Users/CheckValidity`, {
      params: { email, token },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking token validity:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/Users/ForgotPassword', email);
    return response.data;
  } catch (error) {
    console.error('Forgot password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};