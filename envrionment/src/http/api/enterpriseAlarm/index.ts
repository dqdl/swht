import axios from '../../index';

class port {
	//获取列表
	static getList(params: any) {
		return axios.get(`${urlConfig.url}/safety/monitorWarning/page`, {
			params,
		});
	}
	// 获取下拉框数据
	static dictionaries(params: any) {
		return axios.get(
			`${urlConfig.url}/safety/common/sysdict/selectByTypeCode`,
			{
				params,
			}
		);
	}
}

export { port };
