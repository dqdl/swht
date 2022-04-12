import axios from '../../http';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.100:8289';
const fileUploadUrl = window.urlConfig.fileUrl;
const facility = {
	// 获取列表
	getList(params: Object) {
		return axios.get(`${baseUrl}/enterprise/unitdoc/enterpriseSafe/page`, {
			params,
		});
	},
	// 新增
	newAdd(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseSafe/enterpriseSafeAdd`,
			params
		);
	},
	// 查询单条获取图片
	getImage(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseSafe/selectOne?id=${params}`
		);
	},
	// 编辑
	edit(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseSafe/enterpriseSafeUpdate`,
			params
		);
	},
	// 删除
	delete(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseSafe/deleteById?id=${params}`
		);
	},
	// 大类查询树
	getBigClassTree() {
		return axios.post(`${baseUrl}/enterprise/unitdoc/enterpriseSafe/getTree`);
	},
	// 导出
	exportList(params: any) {
		return axios({
			method: 'get',
			url: `${baseUrl}/enterprise/unitdoc/enterpriseSafe/downloadExcel`,
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

export default facility;
