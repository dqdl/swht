import axios from '../../http';
// import qs from 'qs';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.123:8289';
const fileUploadUrl = window.urlConfig.fileUrl;
const car = {
	// 获取列表
	getList(params: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/searchWorkShop`,
			{ params }
		);
	},
	newAdd(params: any) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/addWorkshop?companyId=${params.companyId}`,
			params.params
		);
		// return axios({
		//     method: "post",
		//     url: `${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/addWorkshop`,
		//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
		//     data: qs.stringify(params)
		// })
	},
	edit(params: any) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/updateByName`,
			params
		);
		// axios({
		//     method: "post",
		//     url: `${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/updateByName`,
		//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
		//     data: qs.stringify(params)
		// })
	},
	// 删除
	delete(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/deleteWorkshop?workshopId=${params}`
		);
	},
	// 查询单条获取图片
	getImage(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/selectOne?id=${params}`
		);
	},
	// 导出
	exportList(params: any) {
		return axios({
			method: 'get',
			url: `${baseUrl}/enterprise/unitdoc/enterpriseWorkshop/export`,
			params,
			headers: {
				'Content-Type': 'application/json',
			},
			responseType: 'arraybuffer',
		});
	},
	// 上传
	uploadImg: `${fileUploadUrl}/file/upload`,
};

export default car;
