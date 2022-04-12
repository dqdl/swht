import axios from '../../http';
const baseUrl = window.urlConfig.url;
import qs from 'qs';
// let baseUrl = 'http://10.51.100.70:8289';

const essentialInformation = {
	// 获取企业信息列表
	getCompanyDataList(params: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/RedirectPageEnterpriseInfo`,
			{ params }
		);
	},
	// 获取企业信息excel
	getCompanyExcel() {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/downloadExcelTemplate`, {
			responseType: 'blob'
		});
	},
	// 企业基本详细word
	getCompanyWord(id?: string) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/EnterpriseDownloadWord?id=${id}`, {
			responseType: 'blob'
		});
	},
	// 单条删除
	rowDelete(id: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/deleteById?id=${id}`
		);
	},
	// 新增
	add(params: any) {
		return axios.post(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/enterpriseInfoAdd`,
			params
		);
	},
	// 根据id获取企业详情
	getInformationDataById(id: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/selectById?id=${id}`
		);
	},
	// 根据企业名模糊查询获取企业详情
	getInformationDataByName(params: any) {
		return axios.get(
			`${baseUrl}/enterprise/unitdoc/enterpriseInfo/selectByName`,
			{ params }
		);
	},
	// 更新企业
	updateEnterprise(params: any) {
		return axios.post(`${baseUrl}/enterprise/unitdoc/enterpriseInfo/update`, {
			...params,
		});
		// return axios({
		//     method: "post",
		//     url: `${baseUrl}/enterprise/unitdoc/enterpriseInfo/update`,
		//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
		//     data: qs.stringify(params)
		// })
	},
	// 获取下拉选项
	getSelectOption(num: string) {
		return axios.get(
			`${baseUrl}/enterprise/common/sysDict/queryValueByTypeCode?typeCode=${num}`
		);
	},
};

export default essentialInformation;
