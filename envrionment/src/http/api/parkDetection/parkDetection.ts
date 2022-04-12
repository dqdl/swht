import { Request } from '../../request';

class port {
	//获取树
	static getTree() {
		return Request.get(`${urlConfig.url}/safety/gasPollution/selectors`);
	}
	// 更新用户信息
	static getList() {
		return Request.get(`${urlConfig.url}/safety/gasPollution/page`);
	}
}

export { port };
