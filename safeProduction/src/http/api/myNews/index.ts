/*
 * @Author: liyuan
 * @Date: 2022-01-18 14:19:42
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:10:25
 * @FilePath: \swyqxt\basic\src\axios\api\login\index.ts
 */
import { Request } from '../../request';
import qs from 'qs';
// let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.102.100:8289';

class getMyNewsData {
	public static getMyNews = {
		//获取列表
		myToBeReadList(params: any) {
			return Request.get(
				`${urlConfig.url}/enterprise/send/enterpriseSend/waitRead`,
				{ params }
			);
		},
		myReadList(params: any) {
			return Request.get(
				`${urlConfig.url}/enterprise/send/enterpriseSend/alreadyRead`,
				{ params }
			);
		},

		// 查询单条获取附件
		getImage(params: Object) {
			return Request.get(
				`${urlConfig.url}/enterprise/send/enterpriseSend/selectOneHistory`,
				{ params }
			);
		},
	};
}

export { getMyNewsData };
