import { Request } from '@/http/request';
const fileUploadUrl = window.urlConfig.fileUrl;
class Api {
	// 获取列表
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/safetyTechnics/page`, params);
	}
	//  新增/更新
	static add(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyTechnics/safetyTechnicsAddEdit`,
			params
		);
	}
	// 根据id查询数据
	static selectById(id: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyTechnics/selectOne?id=${id}`
		);
	}
	// 删除
	static delete(id: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyTechnics/deleteById?id=${id}`
		);
	}
	// 上传
	static uploadImg = `${fileUploadUrl}/file/upload`;
	// 导出
	static getCompanyWord() {
		return Request.get(
			`${urlConfig.url}/safety/safetyTechnics/export`,
			{},
			{
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/json; application/octet-stream',
				},
			}
		);
	}
}
export { Api };
