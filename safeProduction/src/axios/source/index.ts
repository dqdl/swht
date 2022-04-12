/*
 * @Author: wu
 * @Date: 2022-03-16 17:31:48
 * @LastEditTime: 2022-03-17 17:00:29
 * @LastEditors: Please set LastEditors
 * @Description:重点监管危险化工工艺接口
 * @FilePath: \swyqxt\safeProduction\src\axios\chemical\index.ts
 */
import axios from '../../http';
const baseUrl = window.urlConfig.url;
const information = window.urlConfig.information;
import qs from 'qs';
// let baseUrl = 'http://10.51.100.70:8289';

const essentialInformation = {
	// 数据列表分页查询
	dataList(params: any) {
		return axios.get(`${baseUrl}/safety/safetyTechnics/page`, { params });
	},
	// 获取下拉框数据
	dictionaries(params: any) {
		return axios.get(`${baseUrl}/safety/common/sysdict/selectByTypeCode`, {
			params,
		});
	},
};

export default essentialInformation;
