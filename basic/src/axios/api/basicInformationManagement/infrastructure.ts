/**
 * 基础设施建设
 */


import axios from '../../http';
let baseUrl = window.urlConfig.url;
const Population = {
    //  //园区简介获取列表
    //  getPopulation(data:any) {
    //      return axios.get(`${baseUrl}/uaa/population-information/page`,data);
    //  },
    //  //园区简介新增
    //  addPopulation(data:any){
    //      return axios.post(`${baseUrl}/uaa/park-profile`, data);
    //  },
    //  //园区简介修改
    //  updatePopulation(data:any){
    //      return axios.put(`${baseUrl}/uaa/park-profile`, data);
    //  },
    //  //园区简介删除
    //  delPopulation(id:string){
    //      return axios.delete(`${baseUrl}/uaa/park-profile/`+id);
    //  },
    // 获取基础设施建设数据
    getInfraxtrue(body: any = {}) {
        return axios.post(`${baseUrl}/uaa/infrastructure`, {
            'extendedNewBuilt': body.user.tel,
            'id': '',
            'monthlyNewInvestmen': body.user.cycle,
            'newCommunication': body.user.quantity,
            'newPipelineNetwork': body.user.position,
            'newPowerFunction': body.user.localquantity,
            'newWaterSupply': body.user.newWaterSupply,
            'statisticalCycle': body.user.time1,
            'updateTime': '',
        })
    },
    // 获取基础设施建设数据
    setInfraxtrue(body: any = {}) {
        return axios.put(`${baseUrl}/uaa/infrastructure`, {
            'extendedNewBuilt': body.user.tel,
            'id': body.user.id,
            'monthlyNewInvestmen': body.user.cycle,
            'newCommunication': body.user.quantity,
            'newPipelineNetwork': body.user.position,
            'newPowerFunction': body.user.localquantity,
            'newWaterSupply': body.user.newWaterSupply,
            'statisticalCycle': body.user.time1,
            'updateTime': '',
        })
    },
    // 删除
    delete(data: any) {
        return axios.delete(`${baseUrl}/uaa/infrastructure/${data.id}`)
    },
    /**
     * 列表分页查询
     */
    getListData({
        current = 0,
        pageSize = 0,
        endTime="",
        startTime="",
        statisticalCycle = ""
    }) {
        return axios.get(`${baseUrl}/uaa/infrastructure/page`, {
            params: {
                current,
                pageSize,
                statisticalCycle,
                endTime,
                startTime
            }
        })
    },
    /**
     * 查询
     */
    // 投资部分
    getSearchAnw(id: any = '') {
        return axios.get(`${baseUrl}/uaa/dept/${id}`)
    },
    // 获取统计周期
    getstatisticalCycle(data: object) {
        return axios.get(`${baseUrl}/uaa/sys/dict/dropdownList`, { params: data });
    },



}
export default Population;