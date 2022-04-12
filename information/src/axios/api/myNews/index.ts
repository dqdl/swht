/*
 * @Author: liyuan
 * @Date: 2022-01-18 14:19:42
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:10:25
 * @FilePath: \swyqxt\basic\src\axios\api\login\index.ts
 */
import axios from '../../http';
import qs from 'qs';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.100:8289';

const getMyNewsData = {
	//获取列表
	myToBeReadList(params: any) {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/waitRead`, {
			params,
		});
	},
	myReadList(params: any) {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/alreadyRead`, {
			params,
		});
	},
	readSure(params: any) {
		// return axios.post(`${baseUrl}/enterprise/send/enterpriseSend/enterpriseReceivechange`, params);
		axios({
			method: 'post',
			url: `${baseUrl}/enterprise/send/enterpriseSend/enterpriseReceivechange`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: qs.stringify(params),
		});
	},
	// 查询单条获取附件
	getImage(params: any) {
		return axios.get(
			`${baseUrl}/enterprise/send/enterpriseSend/selectOneHistory`,
			{ params }
		);
	},
};

export default getMyNewsData;
