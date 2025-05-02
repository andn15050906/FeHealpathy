import axios from "axios";
import { clearUserAuthData } from '@/scripts/api/services/authService';

var baseUrl;

const switchGateway = () => {
    baseUrl = (baseUrl == import.meta.env.VITE_BACKEND_FALLBACK_URL + "/api")
        ? import.meta.env.VITE_BACKEND_URL + "/api"
        : import.meta.env.VITE_BACKEND_FALLBACK_URL + "/api"
}

switchGateway();

const createApiClient = (contentType) => {
    const client = axios.create({
        baseURL: baseUrl,
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

const createMLApiClient = (contentType) => {
    const client = axios.create({
        baseURL: import.meta.env.VITE_ML_URL + "/api",
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
const mlApiClient = createMLApiClient("application/json");

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
	await logError(error, client);
	throw error;
}
};

const logError = async (error, client) =>
{
	if (error.response) {
		if (error.response.status === 401
			//&& error.response.headers['www-authenticate']?.includes('The token expired')
			&& !window.location.href.includes("/sign-in")) {
			clearUserAuthData();
			window.location.href = "/sign-in";
		}
        else if (error.response.status == 403) {
            try {
                const response = await client({ method: "get", url: 'healthcheck' });
            } catch (err) {
                switchGateway();
            }
        }
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

export const getML = (url, params) => apiCall(mlApiClient, "get", url, null, params);
export default apiClient;