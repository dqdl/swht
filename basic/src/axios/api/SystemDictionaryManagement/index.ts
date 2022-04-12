/**
 * @author tangjiaqaing
 * @description 通用字典管理接口文件
 */
import axios from '../../http';
import qs from 'qs';
let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:9527';

const loginHome = {
    // 获取一级
    systemList() {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/system/list`,
            {
                params: {
                    typeCode: 40
                }
            })
    },
    // 获取二级
    systemListTwo(data: any) {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/system/findListBySystem`,
            {
                params: {
                    ...data
                }
            })
    },
    // 分页查询
    listDataCheckPage(data: any ) {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/system/findByLimit`,
            {
                params: {
                    ...data
                }
            })
    },
    // 删除
    deleteCateOnlyOne(code: any) {
        return axios.delete(`${baseUrl}/uaa/sys/dict/type/system/delete/${code}`)
    },
    // 新增
    addOnecategories(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/system/add`, {
            ...data
        })
    },
    // 批量删除
    batchDelete(codeList: any) {
        let str = codeList.join();
        return axios.post(`${baseUrl}/uaa/sys/dict/type/system/batchDelete`, qs.stringify({ codeList: str }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
    },
    // 修改
    modiFyLogs(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/system/update`, {
            ...data
        })
    },
    // 修改二级类型
    modiFyName(data: any) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/system/update1`, {
            ...data
        })
    }
   
}

export default loginHome; 