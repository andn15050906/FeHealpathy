import api from '@/api/apiCall';

export const signIn = async (identifier, password) => {
  try {
    const requestBody = {
      ...(identifier.includes('@') ? { Email: identifier } : { UserName: identifier }),
      Password: password,
    };

    const response = await api.post('/Auth/SignIn', requestBody);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const requestBody = {
      UserName: username,
      Email: email,
      Password: password,
    };
    const response = await api.post('/Users', requestBody);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/Users/ForgotPassword', email);
    return response.data; // Trả về link hoặc token từ server
  } catch (error) {
    // Xử lý lỗi chi tiết
    console.error('Forgot password failed:', error.response ? error.response.data : error.message);
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
    const response = await api.post('/Users/ResetPassword', requestBody);
    return response.data;
  } catch (error) {
    console.error('Reset password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const requestBody = {
      CurrentPassword: currentPassword,
      NewPassword: newPassword
    };

    
    const response = await api.patch('/Users', requestBody);
    return response.data;
  } catch (error) {
    console.error('Update password failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};


