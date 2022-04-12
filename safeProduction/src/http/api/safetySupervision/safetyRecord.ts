import { Request } from '../../request';
class Api {
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/safety-fil/page`, params);
	}
	static export(params: any) {
		return Request.get(`${urlConfig.url}/safety/safety-fil/export`, params, {
			responseType: 'blob',
		});
	}
	static addList(params: any) {
		return Request.post(`${urlConfig.url}/safety/safety-fil`, params);
	}
	static selectById(params: any) {
		return Request.get(`${urlConfig.url}/safety/safety-fil/${params}`);
	}
	static updateList(params: any) {
		return Request.post(`${urlConfig.url}/safety/safety-fil/update`, params);
	}
	// 删除数据
	static deleteList(params: any) {
		return Request.delete(`${urlConfig.url}/safety/safety-fil/${params}`);
	}
}
export { Api };
