import axios from '../../http';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.100:8289';

const historicalDocData = {
	// 获取列表
	getHistoricalList(params: Object) {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/page`, {
			params,
		});
	},
	// 获取发文清单
	getSendList(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/send/enterpriseSend/enterpriseSendList`,
			{ params }
		);
	},
	// 查询单条获取附件
	getImage(params: Object) {
		return axios.get(
			`${baseUrl}/enterprise/send/enterpriseSend/selectOneHistory`,
			{ params }
		);
	},
};

export default historicalDocData;
