/*
 * @Author: your name
 * @Date: 2022-03-22 17:04:40
 * @LastEditTime: 2022-03-23 17:24:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \swyqxt\safeProduction\src\axios\catalogue\index.ts
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
		return axios.get(`${baseUrl}/safety/basicChemicalDetails/page`, { params });
	},
	// 保存或修改信息
	formData(params: any) {
		return axios.post(
			`${baseUrl}/safety/basicChemicalDetails/basicChemicalDetailsAdd`,
			params
		);
	},
	// 删除单条数据
	deleteData(id: any) {
		return axios.get(
			`${baseUrl}/safety/basicChemicalDetails/deleteById?id=${id}`
		);
	},
	// 查看单条数据
	selectOne(params: any) {
		return axios.get(`${baseUrl}/safety/basicChemicalDetails/selectOne`, {
			params,
		});
	},
};

export default essentialInformation;
