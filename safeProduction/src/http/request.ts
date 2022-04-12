import axios from './index';
import qs from 'qs';

export class Request {
	/**
	 * get方法
	 * @param {string} url 路径
	 * @param {object} params 参数
	 */
	static get = (url: string, params?: unknown, responseType?: any) => {
		return new Promise((resolve, reject) => {
			axios
				.get(url, { params: params, ...responseType })
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	static post = (url: string, params?: unknown) => {
		return new Promise((resolve, reject) => {
			axios
				.post(url, params)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	static delete = (url: string) => {
		return new Promise((resolve, reject) => {
			axios
				.delete(url)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};
}
