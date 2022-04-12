import axios from '../../http';
let baseUrl = window.urlConfig.url;
// import qs from 'qs';
// let baseUrl = 'http://10.51.100.70:9527';

const userManagement = {
    // 获取列表
    getList(params: Object) {
        return axios.get(`${baseUrl}/uaa/enterprise-info/page`, { params });
    },
    // 根据行业类型数字-查询所属行业名称
    getIndustryName(params: Object) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList`, { params });
    },
    // 根据行业类型数字-查询所属行业名称
    getIndustryName1(params: Object) {
        return axios.get(`${baseUrl}/safety/common/sysdict/selectByTypeCode`, { params });
    },
    // 获取归属平台列表
    getPlatformList(params: Object) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList`, { params });
    },
    // 获取用户角色列表
    getRoleList() {
        return axios.get(`${baseUrl}/uaa/sys/role/dropdownList`);
    },
    // 新增
    add(params: Object) {
        return axios.post(`${baseUrl}/uaa/enterprise-info`, params)
    },
    // 编辑
    edit(params: Object) {
        return axios.put(`${baseUrl}/uaa/enterprise-info`, params)
    },
    // 删除
    rowDelete(id: string) {
        return axios.delete(`${baseUrl}/uaa/enterprise-info/${id}`)
    },
    // 批量删除
    rowDeleteAll(params: Object) {
        return axios.post(`${baseUrl}/uaa/enterprise-info/batch`, params)
    },
    // 导出
    exportList() {
        return axios({
            method: "get",
            url: `${baseUrl}/uaa/enterprise-info/export`,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        })
    },
    // 授权-用户角色授权
    roleAuthorization(params: object) {
        return axios.post(`${baseUrl}/uaa/user-role`, params);
    }

}

export default userManagement;