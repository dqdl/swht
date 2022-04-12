import { Request } from '../../request';
class Api {
	static getList(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/dangerous-operations/page`,
			params
		);
	}
	static export(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/dangerous-operations/export`,
			params,
			{ responseType: 'blob' }
		);
	}
	static addList(params: any) {
		return Request.post(`${urlConfig.url}/safety/dangerous-operations`, params);
	}
	static selectById(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/dangerous-operations/${params}`
		);
	}
	static updateList(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/dangerous-operations/update`,
			params
		);
	}
	// 删除数据
	static deleteList(params: any) {
		return Request.delete(
			`${urlConfig.url}/safety/dangerous-operations/${params}`
		);
	}
}
export { Api };
