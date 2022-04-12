import axios from '../../http';
let baseUrl = window.urlConfig.url;
/**用地规模**/
const economics = {
    //获取列表
    getList(data: object) {
        return axios.get(`${baseUrl}/uaa/main-economic-indicators/page`, { params: data });
    },
    // 获取功能区下拉框
    getdict(data: object) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList`, { params: data });
    },
    // 获取统计周期
    getstatisticalCycle(data: object) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList`, { params: data });
    },
    // 修改
    change(data: object) {
        return axios.put(`${baseUrl}/uaa/main-economic-indicators`, data);
    },
    // /uaa/land-scale
    // 新增
    addList(data: object) {
        return axios.post(`${baseUrl}/uaa/main-economic-indicators`, data);
    },
    // 删除
    delete(data: any) {
        return axios.delete(`${baseUrl}/uaa/main-economic-indicators/${data.id}`);
    },
}

export default economics;