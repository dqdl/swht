import { Request } from '@/http/request';
class Api {
	// 获取列表
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/safetyKnowledge/page`, params);
	}
	// 新增
	static addList(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/safetyKnowledge/safetyKnowledgeAdd`,
			params
		);
	}
	// 查单条
	static selectById(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyKnowledge/selectOne`,
			params
		);
	}
	// 删除
	static deleteList(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/safetyKnowledge/deleteById`,
			params
		);
	}
}
export { Api };
