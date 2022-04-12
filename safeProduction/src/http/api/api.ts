import { Request } from '../request';

class api {
	public static testObj = {
		// 测试
		testApi: () => Request.get(`${urlConfig.url}/video/listVideo`),
	};
}

export { api };
