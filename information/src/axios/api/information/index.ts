import axios from '../../http';
const baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.68:8289';
const fileUploadUrl = window.urlConfig.fileUrl;
const information = {
	// 获取列表
	getList(params: Object) {
		return axios.get(`${baseUrl}/enterprise/unitdoc/enterpriseOperate/page`, {
			params,
		});
	},
	// 新增
	newAdd(params: Object) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseOperate/enterpriseOperateAdd`,
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
			`${baseUrl}/enterprise/unitdoc/enterpriseOperate/enterpriseOperateUpdate`,
			params
		);
	},
	// 删除
	delete(params: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseOperate/deleteById?id=${params}`
		);
	},
	// 导出
	exportList(params: any) {
		return axios({
			method: 'get',
			url: `${baseUrl}/enterprise/unitdoc/enterpriseOperate/downloadExcel`,
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

export default information;
