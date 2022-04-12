import { Request } from '../../request';
const baseUrl = window.urlConfig.url;
const fileUploadUrl = window.urlConfig.fileUrl;
import qs from 'qs';
const riskIdentification = {
	// 字典码取值
	getSelectOption(code: any) {
		return Request.get(
			`${baseUrl}/safety/common/sysdict/selectByTypeCode?typeCode=${code}`
		);
	},
	//获取风险点辨识分页查询
	getFarmData(params: any) {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/page`, {
			...params,
		});
	},
	//  新增/更新
	add(params: any) {
		return Request.post(
			`${baseUrl}/safety/safetyPrPoint/safetyPrPointAdd`,
			params
		);
	},
	// 根据id查询数据
	selectById(id: any) {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/selectOne?id=${id}`);
	},
	// 删除
	delete(id: any) {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/deleteById?id=${id}`);
	},
	// 上传
	uploadImg: `${fileUploadUrl}/file/upload`,
	// 导出
	getCompanyWord(id?: string) {
		return Request.get(
			`${baseUrl}/safety/safetyPrPoint/safetyPrPointDownloadWord?id=${id}`,
			{},
			{
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/json; application/octet-stream',
				},
			}
		);
	},
	// 风险等级统计数据
	getRiskLevel() {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/queryENumber`);
	},
	// 风险分类易发事故
	getRiskType(choice: string) {
		return Request.get(
			`${baseUrl}/safety/safetyPrPoint/riskTypPoint?choice=${choice}`
		);
	},
};

export default riskIdentification;
