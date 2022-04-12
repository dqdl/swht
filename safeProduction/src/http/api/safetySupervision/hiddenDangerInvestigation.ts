import { Request } from '../../request';
class Api {
	// 获取表格数据
	static getList(params: any) {
		return Request.get(`${urlConfig.url}/safety/hidden-trouble/page`, params);
	}
	// 导出
	static export(params: any) {
		return Request.get(`${urlConfig.url}/safety/safety-fil/export`, params, {
			responseType: 'blob',
		});
	}
	// 新增提交
	static addList(params: any) {
		return Request.post(`${urlConfig.url}/safety/hidden-trouble`, params);
	}
	// 查询单条数据
	static selectById(params: any) {
		return Request.get(`${urlConfig.url}/safety/hidden-trouble/${params}`);
	}
	// 修改数据
	static updateList(params: any) {
		return Request.post(
			`${urlConfig.url}/safety/hidden-trouble/update`,
			params
		);
	}
	// 删除数据
	static deleteList(params: any) {
		return Request.delete(`${urlConfig.url}/safety/hidden-trouble/${params}`);
	}
}
export { Api };
