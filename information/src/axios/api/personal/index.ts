import axios from '../../http';
// let baseUrl = window.urlConfig.url;
const baseUrl = 'http://121.204.146.20:9527';

const personalData = {
	//获取用户数据
	getUserData() {
		return axios.get(`${baseUrl}/uaa/auth/login/info`);
	},
	// 更新用户信息
	updateUserData(data: any) {
		return axios.post(`${baseUrl}/uaa/auth/login/update`, data);
	},
};

export default personalData;
