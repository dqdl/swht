/**
 * 招商引资
 */
import axios from '../../http';
let baseUrl = window.urlConfig.url;
// let baseUrl = 'http://10.51.100.70:9527';

const envrionmnet = {
    // 获取列表
    //  getList(params: Object) {
    //      return axios.get(`${baseUrl}/uaa/enterprise-info/page`, { params });
    //  },
    /**
     * 分页查询
     */
    getListDataInfO(
        data: any = {
            current: "",
            entryTime: '',
            pageSize: "",
            startTime:"",
            endTime:""
        }
    ) {
        return axios.get(`${baseUrl}/uaa/attract-investment/page/`, {
            params: {
                ...data
            }
        })
    },
    /**
     * 修改数据
     */
    modifyData(params: any = {
        "createTime": "",
        "entryTime": "",
        "id": "",
        "introduceSeveralNew": "",
        "newNumberTen": 0,
        "newProduction": "",
        "newProjectInvestment": "",
        "newSigningNumber": 0,
        "statisticalCycle": "",
        "underNumber": 0,
        "updateTime": "",
        "valid": 0
    }) {
        return axios.put(`${baseUrl}/uaa/attract-investment/`, {
            "id": params.user.id,
            "introduceSeveralNew": params.user.cycle,
            "newNumberTen": params.user.tel,
            "newProduction": params.user.localquantity,
            "newProjectInvestment": params.user.time1,
            "newSigningNumber": params.user.position,
            "statisticalCycle": params.user.statisticalCycle,
            "underNumber": params.user.quantity,
            "updateTime": params.user.staticTime,
        })
    },
    /**
     * 删除数据
     */
    delOneData(id: any) {
        return axios.delete(`${baseUrl}/uaa/attract-investment/${id}`)
    },
    /**
     * 
     * @param params 查寻数据
     * @returns 
     */
    checkDatas(id: any) {
        return axios.get(`${baseUrl}/uaa/attract-investment/{id}`)
    },
    /**
     * 投资添加新数据
     */
    addNewItemsToList(params: any) {
        console.log(params, 'params,sdasda')
        return axios.post(
            `${baseUrl}/uaa/attract-investment/`,
            {
                "createTime": "",
                // "entryTime": params.user.enterTime+'',
                "id": "",
                "introduceSeveralNew": params.user.cycle,
                "newNumberTen": params.user.tel,
                "newProduction": params.user.localquantity,
                "newProjectInvestment": params.user.time1,
                "newSigningNumber": params.user.position,
                "statisticalCycle": params.user.statisticalCycle,
                "underNumber": params.user.quantity,
                "updateTime": params.user.staticTime,
                // "valid": 0
            }
        )
    }
}

export default envrionmnet;