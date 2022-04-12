import { Request } from '@/http/request';
class Api1 {
	// 获取列表
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/safetyCheckSend/page`, params);
	}
	// 获取详情
	static selectById(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyCheckSend/selectOne`,
			params
		);
	}
	// 计划单条查询
	static selectTaskOne(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyCheckSend/selectTaskOne`,
			params
		);
	}
	// 修改
	static cancel(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyCheckSend/safetyCheckSendEdit`,
			params
		);
	}
}
export { Api1 };
