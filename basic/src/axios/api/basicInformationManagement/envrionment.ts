import axios from '../../http';
let baseUrl = window.urlConfig.url;

const envrionmnet = {
    // 获取列表
    getList(params: Object) {
        return axios.get(`${baseUrl}/uaa/environmental-protection/page`, { params });
    },
    // 新增
    add(params: Object) {
        return axios.post(`${baseUrl}/uaa/environmental-protection`, params);
    },
    // 删除
    rowDelete(id: string) {
        return axios.delete(`${baseUrl}/uaa/environmental-protection/${id}`);
    },
    // 修改
    rowUpdata(data: any) {
        return axios.put(`${baseUrl}/uaa/environmental-protection`, data);
    },
    // 导出
    tableExport() {
        return axios({
            method: "get",
            url: `${baseUrl}/uaa/environmental-protection/export`,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        })
    }
}

export default envrionmnet;