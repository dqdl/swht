import { Request } from '../../request';
// let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://121.204.146.20:9527';

class personalData {
	public static personal = {
		//获取用户数据
		getUserData() {
			return Request.get(`${urlConfig.url}/uaa/auth/login/info`);
		},
		// 更新用户信息
		updateUserData(data: any) {
			return Request.post(`${urlConfig.url}/uaa/auth/login/update`, data);
		},
	};
}

export { personalData };
