import axios from '../../http';
let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:9527';

const rule = {
    //获取角色列表
    getRuleList() {
        return axios.get(`${baseUrl}/uaa/sys/role/dropdownList`);
    },

    //获取菜单
    getMuneList() {
        return axios.get(`${baseUrl}/uaa/sys/menu/tree`);
    },
    //获取权限菜单
    getRuleMune(data: any) {
        return axios.get(`${baseUrl}/uaa/sys/role/menu/tree`, { params: data });
    },
    // 修改权限
    changeRuleMune(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/role/menu/tree`, data);
    },
    // 新增角色
    addRule(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/role/add`, data);
    },
    // 修改角色
    changeRule(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/role/update`, data);
    },
    // 删除角色
    delRule(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/role/batchDelete`, data);
    }
}

export default rule;