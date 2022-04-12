import { Request } from '../../request';
import qs from 'qs';

class Api {
	public static Api = {
		//获取列表
		getList(params: any) {
			return Request.get(`${urlConfig.url}/safety/monitorDevice/page`, {
				...params,
			});
		},
		// 新增
		add(params: any) {
			return Request.post(
				`${urlConfig.url}/safety/monitorDevice/monitorDeviceAdd`,
				params
			);
		},
		// 更新
		update(params: any) {
			return Request.post(
				`${urlConfig.url}/safety/monitorDevice/monitorDeviceUpdate`,
				params
			);
		},
		// 根据id查询数据
		selectById(id: any) {
			return Request.get(
				`${urlConfig.url}/safety/monitorDevice/selectOne?id=${id}`
			);
		},
		// 删除
		delete(id: any) {
			return Request.get(
				`${urlConfig.url}/safety/monitorDevice/deleteById?id=${id}`
			);
		},
	};
}

export { Api };
