import { Request } from '@/http/request';
class Api1 {
	// 政企通知对应发文下拉选
	static selectByTypeCode() {
		return Request.get(`${urlConfig.url}/safety/safetyCheckSend/noticeSend`);
	}
	// 获取本企业车间
	static getHouseRepository() {
		return Request.get(
			`${urlConfig.url}/safety/safetyDanger/getHouseRepository`
		);
	}
	// 获取巡查人员
	static getUser() {
		return Request.get(`${urlConfig.url}/safety/safetyCheckSend/users`);
	}
	// 新增计划
	static addPlan(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyCheckSend/safetyCheckSendAdd`,
			params
		);
	}
	// 修改计划(发布)
	static updatePlan(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyCheckSend/safetyCheckSendEdit`,
			params
		);
	}
	// 获取计划编号
	static numberProduct() {
		return Request.get(`${urlConfig.url}/safety/safetyCheckSend/numberProduct`);
	}
}
export { Api1 };
