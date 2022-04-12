/*
 * @Author: your name
 * @Date: 2022-03-16 17:31:48
 * @LastEditTime: 2022-03-18 15:39:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \swyqxt\safeProduction\src\axios\chemical\index.ts
 */
import axios from '../../http';
const baseUrl = window.urlConfig.url;
const information = window.urlConfig.information;
import qs from 'qs';
// let baseUrl = 'http://10.51.100.70:8289';

const essentialInformation = {
	// 获取下拉框数据
	dictionaries(params: any) {
		return axios.get(`${baseUrl}/safety/common/sysdict/selectByTypeCode`, {
			params,
		});
	},
	// 数据列表分页查询
	tableListData(params: any) {
		return axios.get(`${baseUrl}/safety/safetyChemical/page`, { params });
	},
	//企业id 获取车间仓库
	houseRepository(params: any) {
		return axios.get(`${baseUrl}/safety/safetyDanger/getHouseRepository`, {
			params,
		});
	},
	// 保存或修改信息
	formData(params: any) {
		return axios.post(
			`${baseUrl}/safety/safetyChemical/safetyChemicalAdd`,
			params
		);
	},
	// 删除单条数据
	deleteData(id: any) {
		return axios.get(`${baseUrl}/safety/safetyChemical/deleteById?id=${id}`);
	},
	// 查看单条数据
	selectOne(params: any) {
		return axios.get(`${baseUrl}/safety/safetyChemical/selectOne`, {
			params,
		});
	},
	// 导出
	getCompanyWord(params: any) {
		return axios.get(`${baseUrl}/safety/safetyChemical/export`, {
			responseType: 'blob',
		});
	},
};

export default essentialInformation;
