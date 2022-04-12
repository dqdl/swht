/*
 * @Author: liyuan
 * @Date: 2022-01-18 14:19:42
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-20 15:10:25
 * @FilePath: \swyqxt\basic\src\axios\api\login\index.ts
 */
import axios from '../../http';
let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:9527';

const api = {
    //获取列表
    getList(data: any) {
        return axios.get(`${baseUrl}/uaa/mailList/findByLimit`, { params: data });
    },
    // 新增
    addList(data: any) {
        return axios.post(`${baseUrl}/uaa/mailList/insert`, data);
    },
    // 修改
    updateList(data: any) {
        return axios.put(`${baseUrl}/uaa/mailList/update`, data);
    },
    // 删除
    deleteList(data: any){
        return axios.delete(`${baseUrl}/uaa/mailList/delete`,{params:data});
    }
}

export default api; 