import apiClient from '@/scripts/api/apiClients';

export const signIn = async (identifier, password) => {
  try {
    const requestBody = {
      ...(identifier.includes('@') ? { Email: identifier } : { UserName: identifier }),
      Password: password,
    };

    const response = await apiClient.post('/Auth/SignIn', requestBody);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getGoogleOAuthPath = () => import.meta.env.VITE_BACKEND_URL + "/api/Auth/google-oauth/";

export const register = async (username, email, password) => {
  try {
    const requestBody = {
      UserName: username,
      Email: email,
      Password: password,
    };
    const response = await apiClient.post('/Users', requestBody);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const verifyEmail = async (email, token) => {
  try {
    const requestBody = {
      Email: email,
      Token: token,
    };
    const response = await apiClient.post('/users/verify', requestBody);
    return response;
  } catch (error) {
    console.error('Verification failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export const signOut = async () => {
  try {
    clearUserAuthData();
    await apiClient.post('/auth/SignOut');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};






export const setUserAuthData = (data) => {
  localStorage.setItem('token', data.accessToken);
  localStorage.setItem('refresh', data.refreshToken);
  localStorage.setItem('userProfile', JSON.stringify(data.user ?? data.User));
}

export const getUserBearerToken = () => {
  return localStorage.getItem('token');
}

export const getUserProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('userProfile'));
  }
  catch (err) {
    clearUserAuthData();
  }
}

export const setUserProfile = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

export const clearUserAuthData = () => {
  localStorage.clear();
}

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const getRole = () => {
  let token = getUserBearerToken();
  let payload = parseJwt(token);
  return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
}

export const isPremium = () => {
  let profile = getUserProfile();
  if (!profile)
    return false;
  return profile.role == 1 || profile.role == 2 || profile.isPremium;
}