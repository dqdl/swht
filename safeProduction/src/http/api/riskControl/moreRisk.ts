import { Request } from '../../request';
const baseUrl = window.urlConfig.url;
const moreRisk = {
	// 字典码取值
	getSelectOption(code: any) {
		return Request.get(
			`${baseUrl}/safety/common/sysdict/selectByTypeCode?typeCode=${code}`
		);
	},
	//获取较大风险清单分页查询
	getFarmData(params: any) {
		return Request.get(`${baseUrl}/safety/safetyPrPoint/seriousPoint`, {
			...params,
		});
	},
	// 导出
	getCompanyWord(id?: string) {
		return Request.get(
			`${baseUrl}/safety/safetyPrPoint/safetyPrPointDownloadWord?id=${id}`,
			{},
			{
				responseType: 'blob',
				headers: {
					'Content-Type': 'application/json; application/octet-stream',
				},
			}
		);
	},
};

export default moreRisk;
