/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import store from '../store/index'
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */

const errorHandle = (status: number, other?: any) => {
    console.log(window.$message, other)
    // 状态码
    switch (status) {

        // 401： 未登录状态，跳转登录页
        case 401:

            break;
        // 403 token过期
        // 清除token并跳转登录页
        case 403:

            break;
        // 404请求不存在
        case 404:

            // tip('请求的资源不存在');
            break;
        default:

            console.log(other);
    }
}

// 创建axios实例
var instance = axios.create({
    timeout: 1000 * 12
})
// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.post['Content-Type'] = 'application/json';
/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    (config: any) => {
        const token: any = window.sessionStorage.getItem('token');
        token && (config.headers.Authorization = `Bearer ${token}`)
        return config;
    },
    (error) => {
        Promise.resolve(error);
    }
)
const errorCode = ((res: any) => {
    return new Promise((resolve, reject) => {
        if (res.code === 401) {
            window.$message.error(res.msg, { duration: 3000 });
            sessionStorage.removeItem("token");
            store.commit("user/UPDATE_LOGIN", false);
            window.location.href = '/#/login';
        } else if (res.code === 403) {
            window.$message.error(res.msg, { duration: 3000 })
        } 
        // else if (res.code === 500) {
        //     window.$message.error(res.msg, { duration: 3000 })
        //     sessionStorage.removeItem("token");
        //     store.commit("user/UPDATE_LOGIN", false);
        //     window.location.href = '/#/login';
        // }
        resolve(res)
    })
})
// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    res => res.status === 200 ? errorCode(res.data) : Promise.reject(res),
    // 请求失败
    error => {
        const {
            response
        } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            if (!window.navigator.onLine) {
                // store.commit('changeNetwork', false);
            } else {
                return Promise.reject(error);
            }
        }
    });

export default instance;