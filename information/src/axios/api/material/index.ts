import axios from '../../http';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.68:8289';
const fileUploadUrl = window.urlConfig.fileUrl;
const material = {
	// 获取列表
	getList(params: Object) {
		return axios.get(`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/page`, {
			params,
		});
	},
	// 新增
	newAdd(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/enterpriseMaterielAdd`,
			params
		);
	},
	// 查询单条获取图片
	getImage(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/selectOne?id=${params}`
		);
	},
	// 编辑
	edit(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/enterpriseMaterielUpdate`,
			params
		);
	},
	// 删除
	delete(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseMateriel/deleteById?id=${params}`
		);
	},
	// 导出
	exportList(params: any) {
		return axios({
			method: 'get',
			url: `${baseUrl}/enterprise/unitdoc/enterpriseMateriel/downloadExcel`,
			params,
			headers: {
				'Content-Type': 'application/json',
			},
			responseType: 'arraybuffer',
		});
	},
	// 根据字典值（找后端要）获取下拉列表
	getListByCode(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/common/sysDict/queryValueByTypeCode?typeCode=${params}`
		);
	},
	// 上传
	uploadImg: `${fileUploadUrl}/file/upload`,
};

export default material;
