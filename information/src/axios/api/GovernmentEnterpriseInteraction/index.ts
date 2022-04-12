/*
 * @Author: liyuan
 * @Date: 2022-01-18 14:19:42
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:10:25
 * @FilePath: \swyqxt\basic\src\axios\api\login\index.ts
 */
import axios from '../../http';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:8289';
// const fileUploadUrl = 'http://10.51.102.70:9030'
const fileUploadUrl = window.urlConfig.fileUrl;

export const postFile = `${fileUploadUrl}/file/upload`;

const getMyNewsData = {
	/**
	 * 管委会发文
	 */
	// 确认派发
	confirmPost(data: any) {
		return axios.post(
			`${baseUrl}/enterprise/send/enterpriseSend/enterpriseSendAdd`,
			data
		);
	},
	// 上传附件的接口
	postInterface(data: any) {
		return axios.post(`${baseUrl}9527/file/upload`);
	},
	//管委会发文对象树
	/**
	 * 获取功能区的树
	 */
	getFunctionalTree() {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/gardenTree`);
	},
	/**
	 * 工业区的树
	 */
	getIndustryTree() {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/industyTree`);
	},
	// 企业上报发文树
	enterpisePostTreeInfo() {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/tree`);
	},

	//政企通知
	// 功能树
	reportAnnounceTree() {
		return axios.get(
			`${baseUrl}/enterprise/send/enterpriseSend/platfromGovernTree`
		);
	},
	// 工业树
	industryEnterportTree() {
		return axios.get(
			`${baseUrl}/enterprise/send/enterpriseSend/industryGovernTree`
		);
	},
	// 草稿发文的信息
	/**
	 * 获取草稿的信息
	 */
	getDRaftInfo(data: any) {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/page`, {
			params: {
				...data,
			},
		});
	},
	// 草稿部分
	// 单条删除的数据接口
	deleItemOns(id: any) {
		return axios.get(
			`${baseUrl}/enterprise/send/enterpriseSend/deleteById?id=${id}`
		);
	},
	// 草稿部分 根据id查询信息
	draftCheckById(data: any) {
		return axios.get(`${baseUrl}/enterprise/send/enterpriseSend/selectOne`, {
			params: {
				...data,
			},
		});
	},
};

export default getMyNewsData;
