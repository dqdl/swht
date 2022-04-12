import axios from '../../http';
let baseUrl = window.urlConfig.url;

const loginLog = {
    //获取列表
    getList(data: object) {
        return axios.get(`${baseUrl}/uaa/login-info/page`, {params:data});
    },
}

export default loginLog; 