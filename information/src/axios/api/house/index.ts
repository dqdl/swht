import axios from '../../http';
const baseUrl = window.urlConfig.url;
// import qs from 'qs';
// let baseUrl = 'http://10.51.102.123:8289';
const fileUploadUrl = window.urlConfig.fileUrl;
const house = {
	// 获取列表
	getList(params: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/searchWarehouse`,
			{ params }
		);
	},
	newAdd(params: any) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/addWarehouse?companyId=${params.companyId}`,
			params.params
		);
		// axios({
		//     method: "post",
		//     url: `${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/addWarehouse`,
		//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
		//     data: qs.stringify(params)
		// })
	},
	edit(params: any) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/updateByName`,
			params
		);
		// axios({
		//     method: "post",
		//     url: `${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/updateByName`,
		//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
		//     data: qs.stringify(params)
		// })
	},
	// 删除
	delete(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/deleteWarehouse?warehouseId=${params}`
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
			url: `${baseUrl}/enterprise/unitdoc/enterpriseWarehouse/downloadExcelTemplate`,
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

export default house;
