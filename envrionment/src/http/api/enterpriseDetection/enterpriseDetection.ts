import { Request } from '../../request';

class port {
	//获取树
	static getTree(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/waterPollution/MonitorPoint`,
			params
		);
	}
	// 更新用户信息
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/waterPollution/page`, params);
	}
}

export { port };
