import axios from "axios";
import { backendApiBase } from '../env';
import { clearUserAuthData } from '@/scripts/api/services/authService';

const createApiClient = (contentType) => {
    const client = axios.create({
        baseURL: backendApiBase,
        withCredentials: true,
        headers: {
            "Content-Type": contentType,
        }
    });

    client.interceptors.request.use(config => {
        return config;
    }, error => {
        return Promise.reject(error);
    });

    client.interceptors.response.use(response => {
        return response;
    }, error => {
        console.error('API response error:', error.response || error);
        return Promise.reject(error);
    });

    return client;
};

const apiClient = createApiClient("application/json");
const formApiClient = createApiClient("multipart/formdata");

const apiCall = async (client, method, url, data = null, params = null) => {
try {
	const response = await client({
		method,
		url,
		data,
		params,
	});
	return response.data;
} catch (error) {
	logError(error);
	//handleError(error);
	throw error;
}
};

const logError = error =>
{
	if (error.response) {
		if (error.response.status === 401
			&& error.response.headers['www-authenticate']?.includes('The token expired')
			&& !window.location.href.includes("/sign-in")) {
			clearUserAuthData();
			window.location.href = "/sign-in";
		}
		/*else {
			console.log('An error occurred:', error.message);
		}*/
	}
	/*else {
		console.log('Error without response:', error.message);
	}*/
}

export const get = (url, params) => apiCall(apiClient, "get", url, null, params);
export const post = (url, data) => apiCall(apiClient, "post", url, data);
export const patch = (url, data) => apiCall(apiClient, "patch", url, data);
export const del = (url) => apiCall(apiClient, "delete", url);

export const postForm = (url, data) => apiCall(formApiClient, "post", url, data);
export const patchForm = (url, data) => apiCall(formApiClient, "patch", url, data);

export default apiClient;