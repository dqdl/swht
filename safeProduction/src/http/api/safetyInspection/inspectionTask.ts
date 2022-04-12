import { Request } from '@/http/request';
class Api1 {
	// 获取列表
	static getList(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyCheckSend/taskPage`,
			params
		);
	}
	// 确认受理
	static sureAccept(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyCheckSend/sureChange`,
			params
		);
	}
	// 执行任务
	static executeTask(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyCheckSend/executeTask`,
			params
		);
	}
}
export { Api1 };
