import axios from "axios";
import { clearUserAuthData } from '@/scripts/api/services/authService';

var baseUrl;

export const getBaseUrl = () => {
    return baseUrl;
}

const switchGateway = () => {
    baseUrl = (baseUrl == import.meta.env.VITE_BACKEND_FALLBACK_URL)
        ? import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_FALLBACK_URL
}

switchGateway();

const createApiClient = (contentType) => {
    const client = axios.create({
        baseURL: baseUrl + "/api",
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
                await client({ method: "get", url: 'healthcheck' });
            } catch (err) {
                switchGateway();
            }
        }
	}
	else {
        try {
            await client({ method: "get", url: 'healthcheck' });
        } catch (err) {
            switchGateway();
        }
	}
}

export const get = (url, params) => apiCall(apiClient, "get", url, null, params);
export const post = (url, data) => apiCall(apiClient, "post", url, data);
export const patch = (url, data) => apiCall(apiClient, "patch", url, data);
export const del = (url) => apiCall(apiClient, "delete", url);

export const postForm = (url, data) => apiCall(formApiClient, "post", url, data);
export const patchForm = (url, data) => apiCall(formApiClient, "patch", url, data);

export const getBlob = async (url, fileName) => {
    try {
        axios({ url: baseUrl + url, withCredentials: true, method: 'GET', responseType: 'blob' })
            .then((response) => {
                const href = URL.createObjectURL(response.data);
            
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
    } catch (error) {
        await logError(error, client);
        throw error;
    }
}

export const getML = (url, params) => apiCall(mlApiClient, "get", url, null, params);
export default apiClient;