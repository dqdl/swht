import { Request } from '@/http/request';
class commonApi {
	// 获取字典值
	static selectByTypeCode(params: any) {
		return Request.get(
			`${urlConfig.url}/safety/common/sysdict/selectByTypeCode`,
			params
		);
	}
	// 获取企业名称
	static getCommon(params: any) {
		return Request.get(
			`http://121.204.146.20:9527/enterprise/unitdoc/enterpriseInfo/RedirectPageEnterpriseInfo`,
			params
		);
	}
}
export { commonApi };
