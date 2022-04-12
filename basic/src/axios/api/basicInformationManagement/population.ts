/* 
 * @Author: liyuan
 * @Date: 2022-01-18 14:53:21
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-18 15:14:37
 * @FilePath: \swyqxt\basic\src\axios\api\basicInformationManagement\population.ts
 */
import axios from '../../http';
let baseUrl = window.urlConfig.url;
const Population = {
    //人口信息获取列表
    getPopulation(data:any) {
        return axios.get(`${baseUrl}/uaa/population-information/page`,{ params: data });
    },
    //人口信息新增
    addPopulation(data:any){
        return axios.post(`${baseUrl}/uaa/population-information`, data);
    },
    //人口信息修改
    updatePopulation(data:any){
        return axios.put(`${baseUrl}/uaa/population-information`, data);
    },
    //人口信息删除
    delPopulation(id:string){
        return axios.delete(`${baseUrl}/uaa/population-information/${id}`);
    },
}
export default Population;