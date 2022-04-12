import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import errorHandle from './errorHandle';

const axiosInstance: AxiosInstance = axios.create({
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

// axios响应拦截
axiosInstance.interceptors.response.use(
	// 请求完成
	(response: AxiosResponse) => {
		if (response.status === 200) {
			return response.data;
		} else {
			// console.warn(response.status, errorHandle(response.status,response.message));
			return response;
		}
	},
	// 请求失败
	(error) => {
		const { response } = error;
		console.warn(
			response.status,
			errorHandle(response.status, response.message)
		);
		return Promise.reject(response);
	}
);

// axios请求拦截
axiosInstance.interceptors.request.use(
	// 请求完成
	(config: AxiosRequestConfig) => {
		const token: any = window.sessionStorage.getItem('token');
		token && (config.headers!.Authorization = `Bearer ${token}`);
		return config;
	},
	// 请求失败
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
