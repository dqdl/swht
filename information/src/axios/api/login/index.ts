/*
 * @Author: liyuan
 * @Date: 2022-01-18 14:19:42
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:10:25
 * @FilePath: \swyqxt\basic\src\axios\api\login\index.ts
 */
import axios from '../../http';
// let baseUrl = window.urlConfig.url;
const baseUrl = 'http://121.204.146.20:9527';

const loginHome = {
	//获取列表
	login(data: any) {
		return axios.post(`${baseUrl}/auth/login`, data);
	},
	// 验证码
	getcode() {
		return axios.get(`${baseUrl}/code`);
	},
	// 登出
	logout(data: any) {
		return axios.get(`${baseUrl}/auth/logout?token=` + data.token);
	},
	//获取用户信息
	getUserInfo() {
		return axios.get(`${baseUrl}/uaa/auth/login/info`);
	},
};

export default loginHome;
