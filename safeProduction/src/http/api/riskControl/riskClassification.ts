import { Request } from '../../request';
const baseUrl = window.urlConfig.url;
const riskClassification = {
	// 字典码取值
	getSelectOption(code: any) {
		return Request.get(
			`${baseUrl}/safety/common/sysdict/selectByTypeCode?typeCode=${code}`
		);
	},
	//获取分级管控分页查询
	getFarmData(params: any) {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/queryAny`, {
			...params,
		});
	},
};

export default riskClassification;
