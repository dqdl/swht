/*
 * @Author: liyuan
 * @Date: 2022-01-18 11:15:34
 * @LastEditors: Liyuan
 * @LastEditTime: 2022-01-18 11:16:33
 * @FilePath: \swyqxt\basic\src\axios\api\user\index.ts
 */
import axios from '../../http';
let baseUrl = window.urlConfig.url;

const userManagement = {
    // 获取列表
    getList(params: Object) {
        return axios.get(`${baseUrl}/uaa/sys/user/listPage`, { params });
    },
    // 新增用户
    addUser(params: Object) {
        return axios.post(`${baseUrl}/uaa/sys/user/add`, params);
    },
    // 批量新增模板下载 --- 用户类型1-管委会用户2-企业用户
    batchFileDownload(type: number) {
        return axios({
            method: "get",
            url: `${baseUrl}/uaa/sys/user/downloadTemplate`,
            params: {
                type,
            },
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        })
        // return axios.get(`${baseUrl}/uaa/sys/user/downloadTemplate`, { params });
    },
    // 批量新增上传文件
    batchUpload(params: Object) {
        return axios({
            method: 'post',
            url: `${baseUrl}/uaa/sys/user/importExcel`,
            data: params,
        })
    },
    // 删除单个用户
    deleteOne(params: string) {
        return axios.post(`${baseUrl}/uaa/sys/user/delete/${params}`);
    },
    // 批量删除用户
    batchDelete(params: string[]) {
        return axios.post(`${baseUrl}/uaa/sys/user/batchDelete`, params);
    },
    // 编辑用户
    editUser(params: object) {
        return axios.post(`${baseUrl}/uaa/sys/user/update`, params);
    },
    // 获取用户角色列表
    getRoleList() {
        return axios.get(`${baseUrl}/uaa/sys/role/dropdownList`);
    },
    // 获取部门列表
    getDetList() {
        return axios.get(`${baseUrl}/uaa/dept/tree`);
    },
    // 导出
    exportList(params: any) {
        return axios({
            method: "get",
            url: `${baseUrl}/uaa/sys/user/acExport`,
            params,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
        })
    },
    // 授权-角色查询-该用户是否有持有该角色
    queryRole(params: object) {
        return axios.get(`${baseUrl}/uaa/sys/role/list`, { params });
    },
    // 授权-用户角色授权
    roleAuthorization(params: object) {
        return axios.post(`${baseUrl}/uaa/user-role`, params);
    }
}

export default userManagement;