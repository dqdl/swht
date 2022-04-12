import { Request } from '@/http/request';
class Api {
	// 获取列表
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/safetyDanger/page`, params);
	}
	// 新增
	static addList(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyDanger/safetyDangerAddEdit`,
			params
		);
	}
	// 获取本企业车间
	static getHouseRepository() {
		return Request.get(
			`${urlConfig.url}/safety/safetyDanger/getHouseRepository`
		);
	}
	// 查单条
	static selectById(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyDanger/selectOne`,
			params
		);
	}
	// 删除
	static deleteList(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyDanger/deleteById`,
			params
		);
	}
	// 导出
	static export(params: any) {
		return Request.get(`${urlConfig.url}/safety/safetyDanger/export`, params, {
			responseType: 'blob',
		});
	}
}
export { Api };
