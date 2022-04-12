/**
 * @author tangjiaqiang 
 * @description 通用字典管理接口
 */
import axios from '../../http';
let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:9527';

const loginHome = {
    //新增
    addList(params: any) {
        return axios.post(`${baseUrl}/uaa/sys/dict/add`, {
            ...params
        })
    },
    //批量删除
    batchDel(codeList: any = []) {
        return axios.post(`${baseUrl}/uaa/sys/dict/batchDelete`,
            [
                ...codeList
            ]
        )
    },
    // 根据唯一标识id删除一条记录
    deleteWithId(code: any = '') {
        return axios.delete(`${baseUrl}/uaa/sys/dict/delete/?code=${code}`)
    },
    //查看详情
    checkDetail(code: any = '') {
        return axios.get(`${baseUrl}/uaa/sys/dict/detail?code=${code}`)
    },
    // 下拉框列表
    getListInfo({
        typeNum = "",
        value = ''
    }) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList?typeNum=${typeNum}&value=${value}`)
    },
    // 分页查询
    checkListDatas(data: any = {
        code: null,
        current: null,
        data: null,
        dictCodeList: null,
        dictTypeCodeList: null,
        name: null,
        notes: null,
        size: null,
        sort: null,
        typeCode: null,
        typeName: null,
        typeNum: null,
        value: null,
        createTime: null,
        updateTime: null,
    }) {
        return axios.get(`${baseUrl}/uaa/sys/dict/listPage`, {
            params: {
                ...data
            }
        })
    },
    // 修改某一条记录
    modifyLogs(
        data: any = {
            code: null,
            data: null,
            dictCodeList: [],
            dictTypeCodeList: [],
            name: null,
            notes: null,
            sort: 0,
            typeCode: null,
            typeName: null,
            typeNum: null,
            valid: 0,
            value: null
        }
    ) {
        return axios.post(`${baseUrl}/uaa/sys/dict/update`, {
            ...data
        })
    },
    /**
     * @description 左侧下拉树的列表接口信息
     */

    //新增一条记录
    addOnecategories(
        data: any =
            {
                code: "",
                dictTypeCodeList: [],
                name: "",
                notes: "",
                num: "",
                valid: 1
            }
    ) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/add`, {
            ...data
        })
    },
    // 批量删除
    batchDelete(codeList: any = []) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/batchDelete`,
            [...codeList]
        )
    },
    // 根据唯一标识删除一条数据
    deleteCateOnlyOne(code: any = '') {
        return axios.delete(`${baseUrl}/uaa/sys/dict/type/delete/${code}`)
    },
    // 查看详情
    checkDetailLogs() {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/detail`)
    },
    // 下拉框列表   // 多级列表条件查询
    listDataXia(
        data: any = {
            code: null,
            dictTypeCodeList: null,
            name: null,
            notes: null,
            num: null,
            createTime: null,
            updateTime: null,
            valid: null
        }
    ) {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/dropdownList`, {
            params: {
                ...data
            }
        })
    },
    // 分页查询
    listDataCheckPage(data: any = {
        current: '',
        size: "",
        code: "",
        dictTypeCodeList: '',
        name: '',
        notes: "",
        num: "",
        createTime: "",
        updateTime: '',
        valid: ""
    }) {
        return axios.get(`${baseUrl}/uaa/sys/dict/type/listPage`,
            {
                params: {
                    ...data
                }
            })
    },
    // 根据唯一标识id更新一条记录
    updateOneCategory(
        data: any = {
            "code": "",
            "name": "",
            "notes": "",
            "num": ""
        }
    ) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/update`, {
            ...data
        })
    },
    // 
    //批量删除
    batchDel2(codeList: any = []) {
        return axios.post(`${baseUrl}/uaa/sys/dict/type/batchDelete`,
            [
                ...codeList
            ]
        )
    },



}

export default loginHome; 