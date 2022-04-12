import axios from '../../http';
let baseUrl = window.urlConfig.url;

const safe = {
    // 获取列表
    getList(params: Object) {
        return axios.get(`${baseUrl}/uaa/security-event/page`, { params });
    },
    // 新增
    add(params: Object) {
        return axios.post(`${baseUrl}/uaa/security-event`, params)
    },
    // 导出
    exportList() {
        return axios({
            method: "get",
            url: `${baseUrl}/uaa/security-event/export`,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        })
    },
    // 编辑
    edit(params: Object) {
        return axios.put(`${baseUrl}/uaa/security-event`, params)
    },
    // 删除
    rowDelete(id: string) {
        return axios.delete(`${baseUrl}/uaa/security-event/${id}`)
    },
    // 文件上传
    fileUpload(params: any) {
        return axios({
            method: 'post',
            url: `http://10.51.100.70:9527/file/upload`,
            data: params,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}

export default safe;