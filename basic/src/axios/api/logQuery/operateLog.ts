import axios from '../../http';
let baseUrl = window.urlConfig.url;

const operateLog = {
    //获取列表
    getList(data: object) {
        return axios.get(`${baseUrl}/uaa/operlog/page`, {params:data});
    },
    // 获取操作类型
    businesstype() {
        return axios.get(`${baseUrl}/uaa/common/business-type`);
    },
}

export default operateLog; 